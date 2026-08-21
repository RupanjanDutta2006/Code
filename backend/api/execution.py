from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.schemas import ExecuteRequest, ExecuteResponse
from backend.executor.execution_service import execution_service
from backend.services.analytics_service import record_program_event

router = APIRouter(prefix="/api/programs", tags=["Execution"])

@router.post("/execute", response_model=ExecuteResponse)
def execute_code(
    req: ExecuteRequest,
    db: Session = Depends(get_db)
):
    if not req.source_code.strip():
        raise HTTPException(status_code=400, detail="Source code cannot be empty.")

    result = execution_service.execute(
        language=req.language,
        source_code=req.source_code,
        custom_input=req.custom_input or "",
        db=db,
        use_cache=True
    )

    if req.program_id:
        try:
            record_program_event(db, req.program_id, "run")
        except Exception:
            pass

    return ExecuteResponse(
        status=result.status,
        output=result.output,
        error=result.error,
        execution_time_ms=result.execution_time_ms,
        cached=False
    )
