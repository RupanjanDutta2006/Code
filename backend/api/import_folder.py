from typing import List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Body
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.models import User
from backend.schemas import ImportResult, ProgramListResponse
from backend.utils.security import require_creator_or_teacher
from backend.services.importer import import_files_data, process_zip_upload

router = APIRouter(prefix="/api/import", tags=["Folder Importer"])

@router.post("/files", response_model=ImportResult)
def import_files_json(
    files: List[Dict[str, Any]] = Body(...),
    current_user: User = Depends(require_creator_or_teacher),
    db: Session = Depends(get_db)
):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided for import.")
    
    result = import_files_data(db, current_user.id, files)
    
    program_list = []
    for p in result["programs"]:
        pl = ProgramListResponse.model_validate(p)
        pl.author_username = current_user.username
        program_list.append(pl)

    return ImportResult(
        imported_count=result["imported_count"],
        folders_created=result["folders_created"],
        skipped_count=result["skipped_count"],
        programs=program_list
    )

@router.post("/zip", response_model=ImportResult)
async def import_zip_file(
    file: UploadFile = File(...),
    current_user: User = Depends(require_creator_or_teacher),
    db: Session = Depends(get_db)
):
    if not file.filename.endswith(".zip"):
        raise HTTPException(status_code=400, detail="Uploaded file must be a .zip archive.")

    content = await file.read()
    try:
        result = process_zip_upload(db, current_user.id, content)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to process zip file: {e}")

    program_list = []
    for p in result["programs"]:
        pl = ProgramListResponse.model_validate(p)
        pl.author_username = current_user.username
        program_list.append(pl)

    return ImportResult(
        imported_count=result["imported_count"],
        folders_created=result["folders_created"],
        skipped_count=result["skipped_count"],
        programs=program_list
    )
