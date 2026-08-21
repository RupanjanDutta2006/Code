from typing import List
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.models import Program, ProgramVersion
from backend.schemas import VersionResponse, DiffResponse
from backend.services.diff_service import generate_unified_diff

router = APIRouter(prefix="/api/programs", tags=["Versions"])

@router.get("/{program_id}/versions", response_model=List[VersionResponse])
def get_program_versions(
    program_id: int,
    db: Session = Depends(get_db)
):
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found.")

    versions = db.query(ProgramVersion).filter(
        ProgramVersion.program_id == program_id
    ).order_by(ProgramVersion.version_number.desc()).all()

    return [VersionResponse.model_validate(v) for v in versions]

@router.get("/{program_id}/versions/{version_id}/diff", response_model=DiffResponse)
def compare_versions(
    program_id: int,
    version_id: int,
    compare_to: int = Query(..., description="Version ID to compare against"),
    db: Session = Depends(get_db)
):
    v1 = db.query(ProgramVersion).filter(
        ProgramVersion.program_id == program_id,
        ProgramVersion.id == version_id
    ).first()
    v2 = db.query(ProgramVersion).filter(
        ProgramVersion.program_id == program_id,
        ProgramVersion.id == compare_to
    ).first()

    if not v1 or not v2:
        raise HTTPException(status_code=404, detail="One or both versions not found.")

    # Ensure chronological diff (older -> newer)
    if v1.version_number > v2.version_number:
        older_v, newer_v = v2, v1
    else:
        older_v, newer_v = v1, v2

    diff_text = generate_unified_diff(
        older_v.source_code,
        newer_v.source_code,
        f"Version {older_v.version_number}",
        f"Version {newer_v.version_number}"
    )

    return DiffResponse(
        from_version=older_v.version_number,
        to_version=newer_v.version_number,
        diff_text=diff_text,
        old_code=older_v.source_code,
        new_code=newer_v.source_code
    )
