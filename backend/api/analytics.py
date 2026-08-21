from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.models import Program, User
from backend.schemas import AnalyticsResponse
from backend.utils.security import get_current_user
from backend.services.analytics_service import get_program_analytics

router = APIRouter(prefix="/api/programs", tags=["Analytics"])

@router.get("/{program_id}/stats", response_model=AnalyticsResponse)
def get_program_stats(
    program_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found.")

    if program.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Analytics are only visible to the program author.")

    stats = get_program_analytics(db, program_id)
    if not stats:
        raise HTTPException(status_code=404, detail="Stats unavailable.")

    return AnalyticsResponse(**stats)
