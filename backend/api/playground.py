import uuid
from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.models import PlaygroundSession, Program
from backend.schemas import PlaygroundCreate, PlaygroundResponse

router = APIRouter(prefix="/api/playground", tags=["Playground"])

@router.post("", response_model=PlaygroundResponse, status_code=status.HTTP_201_CREATED)
def create_playground_session(
    req: PlaygroundCreate,
    db: Session = Depends(get_db)
):
    session_id = str(uuid.uuid4())
    
    code = req.source_code or ""
    lang = req.language or "python"
    title = req.title or "Collaborative Playground"

    if req.source_program_id:
        prog = db.query(Program).filter(Program.id == req.source_program_id).first()
        if prog:
            code = prog.source_code
            lang = prog.language
            title = f"Playground: {prog.title}"

    session = PlaygroundSession(
        id=session_id,
        source_program_id=req.source_program_id,
        title=title,
        source_code=code,
        language=lang,
        custom_input="",
        expires_at=datetime.utcnow() + timedelta(hours=2)
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    res = PlaygroundResponse.model_validate(session)
    res.share_url = f"/playground/{session_id}"
    return res

@router.get("/{session_id}", response_model=PlaygroundResponse)
def get_playground_session(
    session_id: str,
    db: Session = Depends(get_db)
):
    session = db.query(PlaygroundSession).filter(PlaygroundSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="Playground session not found or expired.")

    res = PlaygroundResponse.model_validate(session)
    res.share_url = f"/playground/{session_id}"
    return res
