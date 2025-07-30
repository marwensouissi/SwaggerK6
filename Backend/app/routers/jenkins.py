from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.responses import JSONResponse
import requests
import asyncio
import logging
import json
import subprocess
import re
import time

router = APIRouter(prefix="/jenkins", tags=["jenkins"])

TRIGGER_TOKEN = "cluster-builder"
TRIGGER_TOKEN_CHECK = "check"
TRIGGER_TOKEN_DESTROY = "cluster-destroyer"
JENKINS_JOB_PATH_CHECK = "/job/DevOps/job/K6/job/cluster-checker"
JENKINS_JOB_PATH_DESTROY = "/job/DevOps/job/K6/job/cluster-destroyer"
JENKINS_JOB_PATH = "/job/DevOps/job/K6/job/cluster-builder-k6"
USERNAME = "Marouan"
API_TOKEN = "11f95e13898dfdb25940bd7ca41eba689b"
JENKINS_URL = "http://localhost:8090"

logger = logging.getLogger("jenkins_ws")
logging.basicConfig(level=logging.INFO)

# Cache for cluster check result (shared across requests)
cluster_status_cache = {
    "cluster_exists": None,
    "job_number": None,
    "note": "Not checked yet"
}

async def fetch_build_status(session, auth, build_number):
    build_info_url = f"{JENKINS_URL}{JENKINS_JOB_PATH}/{build_number}/api/json"
    try:
        resp = session.get(build_info_url, auth=auth)
        if resp.status_code != 200:
            return None
        info = resp.json()
        if info.get("building", False):
            return "RUNNING"
        return info.get("result", "PENDING")
    except Exception as e:
        logger.error(f"Error fetching status: {e}")
        return None


def get_load_balancer_ips() -> list[str]:
    try:
        output = subprocess.check_output(
            ["kubectl", "get", "svc", "-A", "-o", "json"],
            stderr=subprocess.STDOUT
        )
        logger.info("✅ Raw kubectl output received")
        svc_data = json.loads(output)
        lb_ips = []
        for item in svc_data["items"]:
            if item.get("spec", {}).get("type") == "LoadBalancer":
                ingress = item.get("status", {}).get("loadBalancer", {}).get("ingress", [])
                for entry in ingress:
                    ip = entry.get("ip") or entry.get("hostname")
                    if ip:
                        lb_ips.append(ip)
        logger.info(f"🔍 Found LoadBalancer IPs: {lb_ips}")
        return lb_ips
    except subprocess.CalledProcessError as e:
        logger.error(f"❌ Error fetching services: {e.output.decode()}")
        return []
    except Exception as e:
        logger.error(f"❌ Unexpected error parsing services: {e}")
        return []

def extract_ips_from_logs(log_text: str) -> dict:
    result = {}

    argocd_match = re.search(r"✅ ArgoCD server IP:\s*([\d.]+)", log_text)
    if argocd_match:
        result["argocd_ip"] = argocd_match.group(1)

    loki_match = re.search(r"\+ LOKI_SERVER=([\d.]+)", log_text)
    if loki_match:
        result["loki_ip"] = loki_match.group(1)

    return result

cluster_status_cache = {}

async def fetch_build_status(session, auth, build_number):
    status_url = f"{JENKINS_URL}{JENKINS_JOB_PATH}/{build_number}/api/json"
    try:
        resp = session.get(status_url, auth=auth)
        if resp.ok:
            return resp.json().get("result") or "RUNNING"
    except Exception:
        pass
    return "UNKNOWN"


@router.websocket("/ws-run-k6-test")
async def run_k6_test_websocket(websocket: WebSocket):
    await websocket.accept()
    logger.info("🔌 WebSocket connected")

    try:
        data = json.loads(await websocket.receive_text())
        params = {
            "token": TRIGGER_TOKEN,
            "REGION": data.get("region", "nyc3"),
            "CLUSTER_NAME": data.get("cluster_name", "my-k6-cluster"),
            "NODE_SIZE": data.get("node_size", "s-2vcpu-4gb"),
            "FILENAME": data.get("filename", "test.js"),
        }
    except Exception as e:
        await websocket.send_text(f"❌ Invalid payload: {e}")
        return await websocket.close()

    session = requests.Session()
    auth = (USERNAME, API_TOKEN)

    # Trigger Jenkins job
    resp = session.post(f"{JENKINS_URL}{JENKINS_JOB_PATH}/buildWithParameters", params=params, auth=auth, allow_redirects=False)
    if resp.status_code != 201:
        await websocket.send_text("❌ Failed to trigger Jenkins job")
        return await websocket.close()

    queue_url = resp.headers.get("Location")
    if not queue_url:
        await websocket.send_text("❌ Jenkins queue location missing")
        return await websocket.close()

    # Poll queue to get build number
    build_number = None
    for _ in range(15):
        r = session.get(f"{queue_url}api/json", auth=auth)
        if r.ok and r.json().get("executable"):
            build_number = r.json()["executable"]["number"]
            break
        await asyncio.sleep(1)

    if not build_number:
        await websocket.send_text("❌ Timeout waiting for build number")
        return await websocket.close()

    build_url = f"{JENKINS_URL}{JENKINS_JOB_PATH}/{build_number}"
    console_offset = 0
    found_argocd_ip = None
    found_loki_ip = None
    sent_pod_names = set()

    try:
        # ✅ One-time initial log fetch (from start=0)
        initial_resp = session.get(f"{build_url}/logText/progressiveText?start=0", auth=auth)
        if initial_resp.status_code == 200:
            initial_log = initial_resp.text
            pod_matches = re.findall(r"POD_NAME=\s*([^\s]+)", initial_log)
            for pod_name in pod_matches:
                if pod_name not in sent_pod_names:
                    await websocket.send_text(f"POD_NAME= {pod_name}")
                    sent_pod_names.add(pod_name)

        # Begin streaming from 0 or latest known offset
        while True:
            status = await fetch_build_status(session, auth, build_number)

            # Fetch Jenkins log chunk from current offset
            log_resp = session.get(f"{build_url}/logText/progressiveText?start={console_offset}", auth=auth)
            if log_resp.status_code == 200:
                log_text = log_resp.text
                console_offset = int(log_resp.headers.get("X-Text-Size", console_offset))

                # Detect ArgoCD IP
                if not found_argocd_ip:
                    argocd_match = re.search(r"✅ ArgoCD server IP:\s*([\d.]+)", log_text)
                    if argocd_match:
                        found_argocd_ip = argocd_match.group(1)
                        await websocket.send_text(f"✅ ArgoCD IP: {found_argocd_ip}")

                # Detect Loki IP
                if not found_loki_ip:
                    loki_match = re.search(r"LOKI_SERVER=([\d.]+)", log_text)
                    if loki_match:
                        found_loki_ip = loki_match.group(1)
                        await websocket.send_text(f"📊 Loki IP: {found_loki_ip}")

                # Detect new pod names
                pod_matches = re.findall(r"POD_NAME=\s*([^\s]+)", log_text)
                for pod_name in pod_matches:
                    if pod_name not in sent_pod_names:
                        await websocket.send_text(f"POD_NAME= {pod_name}")
                        sent_pod_names.add(pod_name)

            # Break if build completed
            if status in ("SUCCESS", "FAILURE", "ABORTED"):
                break

            await websocket.send_text("⏳ Running...")
            await asyncio.sleep(2)

        # Final result
        if status == "SUCCESS":
            await websocket.send_text("✅ SUCCESS")

            # 🔍 Get LoadBalancer IPs
            lb_ips = get_load_balancer_ips()
            if lb_ips:
                for ip in lb_ips:
                    await websocket.send_text(f"🌐 LoadBalancer EXTERNAL-IP: {ip}")
            else:
                await websocket.send_text("⚠️ No LoadBalancer EXTERNAL-IP found.")

            # Update cache
            cluster_status_cache.update({
                "cluster_exists": True,
                "job_number": build_number,
                "note": "Cluster deployed via WebSocket"
            })
        else:
            await websocket.send_text(f"❌ {status}")

    except WebSocketDisconnect:
        logger.info("WebSocket disconnected by client.")
    except Exception as e:
        await websocket.send_text(f"❌ Error: {e}")
    finally:
        await websocket.close()
        logger.info("🔌 WebSocket closed")


def perform_cluster_check_once():
    """Runs once at startup and caches the cluster existence status."""
    auth = (USERNAME, API_TOKEN)
    trigger_url = f"{JENKINS_URL}{JENKINS_JOB_PATH_CHECK}/build?token={TRIGGER_TOKEN_CHECK}"

    try:
        resp = requests.post(trigger_url, auth=auth, allow_redirects=False)
        if resp.status_code != 201:
            cluster_status_cache.update({
                "cluster_exists": None,
                "job_number": None,
                "note": f"Failed to trigger job: {resp.status_code}"
            })
            return

        queue_url = resp.headers.get("Location")
        if not queue_url:
            cluster_status_cache.update({
                "cluster_exists": None,
                "job_number": None,
                "note": "No queue URL returned"
            })
            return

        build_number = None
        for _ in range(120):
            queue_data = requests.get(f"{queue_url}api/json", auth=auth).json()
            if "executable" in queue_data:
                build_number = queue_data["executable"]["number"]
                break
            time.sleep(1)

        if not build_number:
            cluster_status_cache.update({
                "cluster_exists": None,
                "job_number": None,
                "note": "Timed out waiting for build"
            })
            return

        build_status_url = f"{JENKINS_URL}{JENKINS_JOB_PATH_CHECK}/{build_number}/api/json"
        for _ in range(60):
            build_data = requests.get(build_status_url, auth=auth).json()
            if not build_data.get("building", True):
                break
            time.sleep(2)

        console_text_url = f"{JENKINS_URL}{JENKINS_JOB_PATH_CHECK}/{build_number}/consoleText"
        output = requests.get(console_text_url, auth=auth).text.lower()
        
        if "proceeding with terraform plan and apply" in output:
            cluster_status_cache.update({
                "cluster_exists": False,
                "job_number": build_number,
                "note": "No cluster found"
            })
        else:
            cluster_status_cache.update({
                "cluster_exists": None,
                "job_number": build_number,
                "note": "Cluster already exists"
            })

    except Exception as e:
        cluster_status_cache.update({
            "cluster_exists": None,
            "job_number": None,
            "note": f"Exception during cluster check: {str(e)}"
        })


@router.get("/check")
def get_or_trigger_cluster():
    # Step 1: Perform initial check if never checked
    if cluster_status_cache["cluster_exists"] is None:
        perform_cluster_check_once()

    # Step 2: If no cluster found, trigger creation
    if cluster_status_cache["cluster_exists"] is False:
        auth = (USERNAME, API_TOKEN)
        trigger_url = f"{JENKINS_URL}{JENKINS_JOB_PATH}/buildWithParameters"
        params = {
            "token": TRIGGER_TOKEN,
            "REGION": "fra1",  # Or dynamic based on app config
            "CLUSTER_NAME": "my-k6-cluster",
            "NODE_SIZE": "s-2vcpu-4gb"
        }

        try:
            resp = requests.post(trigger_url, params=params, auth=auth, allow_redirects=False)
            if resp.status_code != 201:
                return JSONResponse(
                    content={"status": "error", "message": f"Failed to trigger cluster build: {resp.status_code}"}
                )

            cluster_status_cache.update({
                "cluster_exists": True,  # Optimistically assume creation started
                "job_number": None,
                "note": "Cluster creation triggered"
            })

            return JSONResponse(content={"status": "triggered", "message": "Cluster creation pipeline started"})

        except Exception as e:
            return JSONResponse(content={"status": "error", "message": str(e)})

    # Step 3: If already exists or pending
    return JSONResponse(content={
        "status": "exists",
        "cluster_exists": cluster_status_cache["cluster_exists"],
        "note": cluster_status_cache["note"]
    })

@router.post("/destroy")
async def destroy_cluster():
    """
    Triggers the Jenkins job to destroy the existing cluster.
    """
    auth = (USERNAME, API_TOKEN)
    trigger_url = f"{JENKINS_URL}{JENKINS_JOB_PATH_DESTROY}/build?token={TRIGGER_TOKEN_DESTROY}"

    try:
        resp = requests.post(trigger_url, auth=auth, allow_redirects=False)

        if resp.status_code != 201:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": f"Failed to trigger destroy job: {resp.status_code}"}
            )

        queue_url = resp.headers.get("Location")
        if not queue_url:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "Missing Jenkins queue URL"}
            )

        # Poll the queue to get the build number
        build_number = None
        for _ in range(30):
            q_data = requests.get(f"{queue_url}api/json", auth=auth).json()
            if "executable" in q_data:
                build_number = q_data["executable"]["number"]
                break
            time.sleep(1)

        if not build_number:
            return JSONResponse(
                status_code=500,
                content={"status": "error", "message": "Timeout while waiting for Jenkins build number"}
            )

        # Wait until the destroy job completes
        for _ in range(60):
            build_info_url = f"{JENKINS_URL}{JENKINS_JOB_PATH_DESTROY}/{build_number}/api/json"
            build_data = requests.get(build_info_url, auth=auth).json()
            if not build_data.get("building", True):
                result = build_data.get("result", "UNKNOWN")
                break
            time.sleep(2)
        else:
            result = "TIMEOUT"

        # Update cluster cache if destroy succeeded
        if result == "SUCCESS":
            cluster_status_cache.update({
                "cluster_exists": False,
                "job_number": build_number,
                "note": "Cluster destroyed successfully"
            })

        return JSONResponse(content={
            "status": "success" if result == "SUCCESS" else "error",
            "job_number": build_number,
            "result": result
        })
    
    

    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "error", "message": f"Exception occurred: {str(e)}"}
        )

