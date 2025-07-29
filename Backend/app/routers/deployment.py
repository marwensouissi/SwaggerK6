import os, uuid, subprocess
from fastapi import APIRouter, HTTPException
from jinja2 import Environment, FileSystemLoader
from pathlib import Path
from fastapi.responses import StreamingResponse
import httpx
import asyncio
import json
import time  # Add this at top

router = APIRouter(prefix="/deployment", tags=["depl"])


@router.get("/stream-logs")
async def stream_logs(loki_ip: str, pod_name: str):
    return StreamingResponse(
        log_stream_generator(loki_ip, pod_name),
        media_type="text/event-stream"
    )


async def log_stream_generator(loki_ip: str, pod_name: str):
    import time
    loki_url = f"http://{loki_ip}:3100/loki/api/v1/query_range"
    query = f'{{instance="{pod_name}"}}'

    seen_logs = set()

    while True:
        now = int(time.time() * 1e9)
        start = now - int(60 * 1e9)

        params = {
            "query": query,
            "start": start,
            "end": now,
            "limit": 100,
            "step": 1
        }

        async with httpx.AsyncClient() as client:
            try:
                res = await client.get(loki_url, params=params)
                res.raise_for_status()
                data = res.json()

                results = data.get("data", {}).get("result", [])
                for result in results:
                    for value in result.get("values", []):
                        timestamp, log_line = value
                        if (timestamp, log_line) not in seen_logs:
                            seen_logs.add((timestamp, log_line))
                            await asyncio.sleep(0.01)

            except Exception as e:
                yield f"data: Error fetching logs: {e}\n\n"

        await asyncio.sleep(2)
