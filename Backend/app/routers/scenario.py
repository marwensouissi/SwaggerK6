# routers/scenario.py

from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from pathlib import Path
from io import BytesIO
import json
import os
from fastapi.responses import PlainTextResponse
from app.auth import get_current_user
from app.database import get_db
from sqlalchemy.orm import Session
from app.models.models import User
from app.store.crud import get_user_scenarios
from app.models.models import Scenario
from app.classes.scenario_schemas import ScenarioRead

router = APIRouter(prefix="/scenarios", tags=["scenarios"])
GENERATED_DIR = Path(__file__).resolve().parent.parent / "generated"

@router.post("/upload-json")
async def upload_json(file: UploadFile = File(...)):
    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Only JSON files are accepted.")

    try:
        # Read and load the file content
        content_bytes = await file.read()
        data = json.loads(content_bytes.decode("utf-8"))

        # Locate schemas
        schemas = (
            data.get("components", {}).get("schemas")
            or data.get("definitions")
        )

        if not isinstance(schemas, dict):
            raise ValueError("No valid schemas found in Swagger JSON.")

        # Filter properties to keep only required ones
        for schema in schemas.values():
            if schema.get("type") != "object":
                continue
            required = schema.get("required", [])
            properties = schema.get("properties", {})
            schema["properties"] = {
                key: properties[key] for key in required if key in properties
            }

        # Save modified JSON to UI/dev-helpers/
        dest_folder = Path("../UI/dev-helpers/")
        dest_folder.mkdir(parents=True, exist_ok=True)
        dest_path = dest_folder / file.filename

        with dest_path.open("w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        return {"message": f"Filtered Swagger saved to {dest_path}"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing Swagger: {str(e)}")

@router.get("/my", response_model=list[ScenarioRead])
def get_my_scenarios(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Return all scenarios created by the currently authenticated user.
    """
    scenarios = get_user_scenarios(db, current_user.id)
    return [ScenarioRead.model_validate(s) for s in scenarios]

@router.get("/{filename}", response_class=PlainTextResponse)
def read_file(filename: str):
    """
    Reads a file from the current directory (or subdirectories)
    and returns its raw content as plain text.
    """
    # Ensure filename is safe
    safe_filename = os.path.basename(filename)
    file_path = os.path.join(GENERATED_DIR, safe_filename)

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail=f"File '{filename}' not found.")

    try:
        with open(file_path, "r", encoding="utf-8") as file:
            content = file.read()
        return content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))