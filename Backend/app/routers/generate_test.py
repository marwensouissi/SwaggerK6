from fastapi import APIRouter, HTTPException, Depends, Query, UploadFile
from pathlib import Path
from typing import Optional, List
from sqlalchemy.orm import Session
from jinja2 import Environment, FileSystemLoader
from app.auth import get_current_user
from app.database import get_db
from app.models.models import User
from app.store.scenario_crud import create_scenario
from app.classes.scenario_schemas import GenerateRequest, ScenarioCreate
import re
import json
import uuid
import logging
import json
import subprocess
import tarfile
import shutil
from datetime import datetime

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
        output_filename = f"{Path(request.swagger_filename).stem}_{unique_id}_test.js"
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


def generate_configmap_yaml(name: str, namespace: str = "default") -> str:
    return f"""
apiVersion: v1
kind: ConfigMap
metadata:
  name: {name}-configmap
  namespace: {namespace}
data:
  main.js: |
    # k6 test will be loaded by initContainer from this ConfigMap
    (will be mounted via tar)
""".strip()


def generate_testrun_yaml(name: str) -> str:
    return f"""
apiVersion: k6.io/v1alpha1
kind: TestRun
metadata:
  name: {name}
spec:
  script:
    configMap:
      name: {name}-configmap
      file: main.js
  parallelism: 1
""".strip()

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


@router.post("/archive-and-push")
def archive_and_push_test(
    filename: str = Query(..., description="Generated test filename")
):
    try:
        js_file_path = GENERATED_DIR / filename
        if not js_file_path.exists():
            raise HTTPException(status_code=404, detail=f"Test file {filename} not found")

        # 1. Archive the K6 script
        tar_path, archive_dir = k6_archive(js_file_path, GENERATED_DIR)
        test_name = archive_dir.name

        # 2. Generate Kubernetes YAMLs
        (archive_dir / "configmap.yaml").write_text(generate_configmap_yaml(test_name))
        (archive_dir / "testrun.yaml").write_text(generate_testrun_yaml(test_name))

        # 3. Copy archive to Bitbucket repo
        dest_dir = BITBUCKET_REPO_PATH / "k6-tests" / test_name
        if dest_dir.exists():
            shutil.rmtree(dest_dir)  # Ensure no conflict
        shutil.copytree(archive_dir, dest_dir)

        # 4. Commit and push
        git_push(BITBUCKET_REPO_PATH, f"Add test {test_name}")

        return {"status": "success", "pushed": True, "test_name": test_name}

    except Exception as e:
        logger.exception("Failed to archive and push test")
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")


# ROUTE: List available Swagger JSON files
@router.get("/swagger-files", response_model=List[str])
def list_swagger_files():
    swagger_dir = Path(__file__).resolve().parents[3] / "UI" / "dev-helpers"
    return [f.name for f in swagger_dir.glob("*.json")]

# ROUTE: Optional - Get k6 Test Pod Logs (if ArgoCD + k6-operator used)
@router.get("/logs/{testrun_name}")
def get_k6_logs(testrun_name: str):
    try:
        logs = subprocess.check_output(["kubectl", "logs", f"job/{testrun_name}"], stderr=subprocess.STDOUT)
        return {"logs": logs.decode()}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Failed to get logs: {e.output.decode()}") 