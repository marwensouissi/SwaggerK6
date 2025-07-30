from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile, Body, Request
from pathlib import Path
from typing import Optional, List
from sqlalchemy.orm import Session
from jinja2 import Environment, FileSystemLoader
from app.auth import get_current_user
from app.database import get_db
from app.models.models import User
from app.store.scenario_crud import create_scenario
from app.classes.scenario_schemas import GenerateRequest, ScenarioCreate
from fastapi.responses import StreamingResponse
import re
import json
import uuid
import logging
import json
import subprocess
import base64
import tarfile
import shutil
from typing import List
import shutil
import logging
from datetime import datetime
from sse_starlette.sse import EventSourceResponse
import httpx
import asyncio
import time
from typing import Optional

router = APIRouter(prefix="/generate", tags=["generator"])
logger = logging.getLogger(__name__)

# Set your local Bitbucket repo path here
BITBUCKET_REPO_PATH =  Path(__file__).resolve().parent.parent.parent  # <-- Update this to your actual local clone path
GENERATED_DIR = Path(__file__).resolve().parent.parent / "generated"
# Helper functions

def regex_replace(s, pattern, replacement):
    return re.sub(pattern, replacement, s)

def extract_base_url(swagger_data):
    if "openapi" in swagger_data and "servers" in swagger_data:
        return swagger_data["servers"][0]["url"].rstrip("/")
    elif "swagger" in swagger_data:
        scheme = swagger_data.get("schemes", ["http"])[0]
        host = swagger_data.get("host", "")
        base_path = swagger_data.get("basePath", "")
        return f"{scheme}://{host}{base_path}".rstrip("/")
    return ""

# Main route

@router.post("/from-config")
def generate_test_file(
    request: GenerateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        # Locate Swagger JSON file
        swagger_dir = Path(__file__).resolve().parents[3] / "UI" / "dev-helpers"
        swagger_path = swagger_dir / request.swagger_filename
 
        if not swagger_path.exists():
            existing_files = [f.name for f in swagger_dir.glob("*.json")]
            logger.error(f"Swagger file '{request.swagger_filename}' not found. Available files: {existing_files}")
            raise HTTPException(
                status_code=404,
                detail=f"Swagger file '{request.swagger_filename}' not found. Available: {existing_files}"
            )
 
        # Load Swagger file content
        with swagger_path.open("r", encoding="utf-8") as f:
            swagger_data = json.load(f)
 
        base_url = extract_base_url(swagger_data)
 
        # Detect test execution mode: iterations+vus OR stages with duration+target
        use_iterations = False
        vus = None
        iterations = None
        stages = []
 
        if request.stages:
            first_stage = request.stages[0]
            if first_stage.iterations is not None and first_stage.vus is not None:
                # iterations mode
                use_iterations = True
                vus = first_stage.vus
                iterations = first_stage.iterations
            else:
                # stages mode
                stages = request.stages
 
        # Setup Jinja2 environment
        template_dir = Path(__file__).resolve().parent.parent / "templates"
        template_name = "template.j2"
        env = Environment(
            loader=FileSystemLoader(template_dir),
            trim_blocks=True,
            lstrip_blocks=True
        )
        env.filters["regex_replace"] = regex_replace
        template = env.get_template(template_name)
 
        # Render the test script from template
        rendered = template.render(
            tests=request.test_cases,
            stages=stages,
            vus=vus,
            iterations=iterations,
            base_url=base_url,
            use_iterations=use_iterations
        )
 
        # Save rendered test script
        generated_dir = Path(__file__).resolve().parent.parent / "generated"
        generated_dir.mkdir(parents=True, exist_ok=True)
        unique_id = uuid.uuid4().hex[:8]

        stem = Path(request.swagger_filename).stem.replace("_", "-")
        output_filename = f"{stem}-{unique_id}-test.js"

        output_path = generated_dir / output_filename
 
        with output_path.open("w", encoding="utf-8") as f:
            f.write(rendered)
 
        # Save scenario record in DB
        scenario = ScenarioCreate(name=output_filename, content=rendered)
        saved = create_scenario(db=db, user_id=current_user.id, scenario=scenario)
 
        return {
            "filename": output_filename,
            "scenario_id": saved.id,
        } 
    except Exception as e:
        logger.exception("Error during test generation")
        raise HTTPException(status_code=500, detail=f"Error generating test: {str(e)}")
    



def k6_archive(js_file_path: Path, output_dir: Path) -> Path:
    # Step 1: Run archive command (creates archive.tar)
    cmd = ["k6", "archive", str(js_file_path)]
    result = subprocess.run(cmd, cwd=output_dir, capture_output=True)

    if result.returncode != 0:
        raise RuntimeError(f"k6 archive failed: {result.stderr.decode()}")

    # Step 2: Rename archive.tar to match test filename
    default_tar = output_dir / "archive.tar"
    if not default_tar.exists():
        raise FileNotFoundError("Expected 'archive.tar' not found after k6 archive")

    renamed_tar = output_dir / f"{js_file_path.stem}.tar"
    
    # 🧹 Clean up if target tar already exists
    if renamed_tar.exists():
        renamed_tar.unlink()  # or use renamed_tar.unlink(missing_ok=True) in Python 3.8+

    default_tar.rename(renamed_tar)

    return renamed_tar, renamed_tar.parent  


def generate_configmap_yaml(tar_file_path: Path, namespace: str = "default") -> str:
    name = tar_file_path.stem
    encoded_content = base64.b64encode(tar_file_path.read_bytes()).decode()

    return f"""
apiVersion: v1
kind: ConfigMap
metadata:
  name: {name}
  namespace: {namespace}
binaryData:
  {name}.tar: {encoded_content}
""".strip()


# def generate_testrun_yaml(name: str, namespace: str = "default") -> str:
#     return f"""
# apiVersion: k6.io/v1alpha1
# kind: TestRun
# metadata:
#   name: {name}
#   namespace: {namespace}
#   labels:
#     test-name: {name}
# spec:
#   parallelism: 1
#   script:
#     configMap:
#       name: {name}
#       file: {name}.tar
#   runner:
#     env:
#       - name: K6_WEB_DASHBOARD
#         value: "true"
# """.strip()


def generate_testrun_yaml(name: str, namespace: str = "default") -> str:
    return f"""
apiVersion: k6.io/v1alpha1
kind: TestRun
metadata:
  name: {name}
  namespace: {namespace}
  labels:
    test-name: {name}
spec:
  parallelism: 1
  script:
    configMap:
      name: {name}
      file: {name}.tar
  runner:
    env:
      - name: K6_WEB_DASHBOARD
        value: "true"
    ports:
      - containerPort: 5665
        name: dashboard

---
apiVersion: v1
kind: Service
metadata:
  name: {name}-service
spec:
  type: LoadBalancer
  selector:
    job-name: {name}-1
  ports:
    - port: 5665
      targetPort: 5665
""".strip()


# def generate_service_yaml(name: str, namespace: str = "default", service_type: str = "LoadBalancer") -> str:
#     return f"""
# apiVersion: v1
# kind: Service
# metadata:
#   name: {name}-svc
#   namespace: {namespace}
# spec:
#   type: {service_type}
#   selector:
#     k6-test-run: {name}
#   ports:
#     - protocol: TCP
#       port: 80
#       targetPort: 5665
#       name: dashboard
# """.strip()



def git_push(path: Path, message: str):
    # Add all changes
    subprocess.run(["git", "add", "."], cwd=path, check=True)

    # Commit with message
    subprocess.run(["git", "commit", "-m", message], cwd=path, check=True)

    # Set remote with credentials (only needed once, or ensure it's already done)
    remote_url = "https://***REMOVED_API_KEY***4@bitbucket.org/ndammak/itona-k6.git"
    subprocess.run(["git", "remote", "set-url", "origin", remote_url], cwd=path, check=True)

    # Push to origin (main or master depending on your branch)
    subprocess.run(["git", "push", "origin", "main"], cwd=path, check=True)


def list_cloud_folders(cloud_dir: Path) -> List[str]:
    return [f.name for f in cloud_dir.iterdir() if f.is_dir()]

def move_selected_folders_to_history(cloud_dir: Path, selected_folders: List[str]):
    history_dir = cloud_dir.parent / "history"
    history_dir.mkdir(exist_ok=True)

    for folder_name in selected_folders:
        source = cloud_dir / folder_name
        dest = history_dir / folder_name
        if source.exists() and source.is_dir():
            if dest.exists():
                shutil.rmtree(dest)
            shutil.move(str(source), str(dest))
        else:
            raise ValueError(f"Folder '{folder_name}' does not exist in cloud directory.")


# --- ROUTES ---

@router.get("/folders", response_model=List[str])
def get_cloud_folders():
    """List folders currently in the cloud directory."""
    cloud_dir = GENERATED_DIR / "cloud"
    try:
        cloud_dir.mkdir(exist_ok=True)
        return list_cloud_folders(cloud_dir)
    except Exception as e:
        logger.exception("Failed to list cloud folders")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/move-to-history")
def destroy_cloud_folders(folders: List[str] = Body(...)):
    """
    Move selected cloud folders to the history folder.
    """
    cloud_dir = GENERATED_DIR / "cloud"
    try:
        move_selected_folders_to_history(cloud_dir, folders)
        return {"status": "success", "moved": folders}
    except Exception as e:
        logger.exception("Failed to move folders to history")
        raise HTTPException(status_code=500, detail=str(e)) 
@router.post("/archive-and-push")
def archive_and_push_test(
    filename: str = Query(..., description="Generated test filename")
):
    try:
        js_file_path = GENERATED_DIR / filename
        if not js_file_path.exists():
            raise HTTPException(status_code=404, detail=f"Test file {filename} not found")

        # Prepare the cloud directory inside generated
        cloud_dir = GENERATED_DIR / "cloud"
        cloud_dir.mkdir(exist_ok=True)

        # move_cloud_folders_to_history(cloud_dir)

        # 1. Archive the K6 script (output will be in GENERATED_DIR)
        tar_path, archive_dir = k6_archive(js_file_path, GENERATED_DIR)

        test_name = tar_path.stem  # without extension

        # Create test-specific folder inside cloud
        test_cloud_dir = cloud_dir / test_name
        if test_cloud_dir.exists():
            shutil.rmtree(test_cloud_dir)
        test_cloud_dir.mkdir(parents=True, exist_ok=True)

        # Move the .tar file inside cloud/test_name folder
        shutil.move(str(tar_path), test_cloud_dir / tar_path.name)

        # 2. Generate Kubernetes YAMLs inside cloud/test_name folder
        # 2. Generate Kubernetes YAMLs with custom filenames
        configmap_filename = f"{test_name}-configmap.yaml"
        testrun_filename = f"{test_name}-testrun.yaml"

        (test_cloud_dir / configmap_filename).write_text(
            generate_configmap_yaml(test_cloud_dir / tar_path.name)
        )
        (test_cloud_dir / testrun_filename).write_text(
            generate_testrun_yaml(test_name)
        )
        # (test_cloud_dir / f"{test_name}-service.yaml").write_text(
        #     generate_service_yaml(test_name)
        # )


        # 3. Copy cloud/test_name folder to Bitbucket repo under k6-tests/test_name
        dest_dir = BITBUCKET_REPO_PATH / "k6-tests" / test_name
        if dest_dir.exists():
            shutil.rmtree(dest_dir)  # Ensure no conflict
        shutil.copytree(test_cloud_dir, dest_dir)

        # 4. Commit and push
        git_push(BITBUCKET_REPO_PATH, f"Add test {test_name}")

        return {
            "status": "success",
            "pushed": True,
            "test_name": test_name,
            "configmap_file": configmap_filename,
            "testrun_file": testrun_filename,
        }

    except Exception as e:
        logger.exception("Failed to archive and push test")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")

# ROUTE: List available Swagger JSON files
@router.get("/swagger-files", response_model=List[str])
def list_swagger_files():
    swagger_dir = Path(__file__).resolve().parents[3] / "UI" / "dev-helpers"
    return [f.name for f in swagger_dir.glob("*.json")]

# ROUTE: Optional - Get k6 Test Pod Logs (if ArgoCD + k6-operator used)
# @router.get("/logs/{testrun_name}")
# def get_k6_logs(testrun_name: str):
#     try:
#         logs = subprocess.check_output(["kubectl", "logs", f"job/{testrun_name}"], stderr=subprocess.STDOUT)
#         return {"logs": logs.decode()}
#     except subprocess.CalledProcessError as e:
#         raise HTTPException(status_code=500, detail=f"Failed to get logs: {e.output.decode()}") 
@router.get("/logs/stream")
async def stream_logs(request: Request, loki_url: str, pod_name: str):
    async def log_generator():
        query = f'{{pod="{pod_name}"}}'
        url = f"http://{loki_url}/loki/api/v1/query_range"
        params = {
            "query": query,
            "start": "0",  # adjust time range if needed
            "limit": 100,
            "direction": "forward"
        }
        last_ts = None

        while True:
            async with httpx.AsyncClient() as client:
                if await request.is_disconnected():
                    break

                response = await client.get(url, params=params)
                if response.status_code == 200:
                    result = response.json()["data"]["result"]
                    for stream in result:
                        for log in stream["values"]:
                            ts, msg = log
                            if ts != last_ts:
                                last_ts = ts
                                yield f"data: {msg}\n\n"

            await asyncio.sleep(2)  # Polling interval

    return StreamingResponse(log_generator(), media_type="text/event-stream")