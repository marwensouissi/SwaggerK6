import os, uuid, subprocess
from fastapi import APIRouter, HTTPException
from jinja2 import Environment, FileSystemLoader
from classes.scenario_schemas import ClusterRequest  # Make sure this import path is correct
from pathlib import Path
from fastapi.responses import StreamingResponse
import httpx
import asyncio
import json
router = APIRouter(prefix="/deployment", tags=["depl"])

# Use absolute paths based on current file's location
BASE_DIR = Path(__file__).resolve().parent.parent  # /app
TEMPLATE_DIR = BASE_DIR / "infra" / "templates"   # /app/infra/templates
DEPLOY_DIR = BASE_DIR / "deployment"              # /app/deployment

@router.post("/cluster/create")
async def create_cluster(req: ClusterRequest):
    cid = str(uuid.uuid4())
    workspace = DEPLOY_DIR / cid
    os.makedirs(workspace, exist_ok=True)

    # Render the Terraform template
    env = Environment(loader=FileSystemLoader(str(TEMPLATE_DIR)))
    tpl = env.get_template("do_k8s.tf.j2")
    tf = tpl.render(
        token=req.token,
        name=req.name,
        region=req.region,
        size=req.size,
        count=req.count,
    )
    with open(workspace / "main.tf", "w") as f:
        f.write(tf)

    try:
        subprocess.run(["terraform", "init"], cwd=workspace, check=True)
        subprocess.run(["terraform", "apply", "-auto-approve"], cwd=workspace, check=True)
        return {"status": "created", "cluster_id": cid}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Terraform error: {e}")

@router.post("/cluster/destroy/{cluster_id}")
async def destroy_cluster(cluster_id: str):
    workspace = DEPLOY_DIR / cluster_id
    if not workspace.is_dir():
        raise HTTPException(status_code=404, detail="Cluster workspace not found")

    try:
        subprocess.run(["terraform", "destroy", "-auto-approve"], cwd=workspace, check=True)
        return {"status": "destroyed", "cluster_id": cluster_id}
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Terraform destroy error: {e}")


async def log_stream_generator(loki_ip: str, pod_name: str):
    loki_url = f"http://{loki_ip}:3100/loki/api/v1/query"
    query = f'{{instance="{pod_name}"}}'

    seen_logs = set()

    while True:
        async with httpx.AsyncClient() as client:
            try:
                res = await client.get(loki_url, params={"query": query})
                res.raise_for_status()
                data = res.json()

                results = data.get("data", {}).get("result", [])
                for result in results:
                    for value in result.get("values", []):
                        timestamp, log_line = value
                        if (timestamp, log_line) not in seen_logs:
                            seen_logs.add((timestamp, log_line))
                            yield f"data: {log_line}\n\n"

            except Exception as e:
                yield f"data: Error fetching logs: {e}\n\n"

        await asyncio.sleep(2)  # poll every 2 seconds

@router.get("/stream-logs")
async def stream_logs(loki_ip: str, pod_name: str):
    return StreamingResponse(
        log_stream_generator(loki_ip, pod_name),
        media_type="text/event-stream"
    )