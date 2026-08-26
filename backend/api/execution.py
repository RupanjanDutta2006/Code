from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import Dict, Any
from backend.database.database import get_db
from backend.schemas import ExecuteRequest, ExecuteResponse
from backend.executor.execution_service import execution_service
from backend.services.analytics_service import record_program_event

router = APIRouter(tags=["Execution"])

def handle_execution(req: ExecuteRequest, db: Session) -> ExecuteResponse:
    code = req.get_code()
    if not code.strip():
        raise HTTPException(status_code=400, detail="Source code cannot be empty.")

    stdin_data = req.get_input()

    result = execution_service.execute(
        language=req.language,
        source_code=code,
        custom_input=stdin_data,
        db=db,
        use_cache=False if req.execution_id else True,
        execution_id=req.execution_id
    )

    if req.program_id:
        try:
            record_program_event(db, req.program_id, "run")
        except Exception:
            pass

    return ExecuteResponse(
        status=result.status,
        stdout=result.stdout or result.output,
        stderr=result.stderr or (result.error or ""),
        output=result.output or result.stdout,
        error=result.error or result.stderr,
        executionTime=result.execution_time,
        execution_time_ms=result.execution_time_ms,
        memory=result.memory_kb,
        exitCode=result.exit_code,
        exit_code=result.exit_code,
        error_type=result.error_type,
        cached=False
    )

@router.post("/api/execute", response_model=ExecuteResponse)
@router.post("/api/execute/", response_model=ExecuteResponse, include_in_schema=False)
@router.post("/api/run", response_model=ExecuteResponse)
@router.post("/api/run/", response_model=ExecuteResponse, include_in_schema=False)
@router.post("/api/execution/run", response_model=ExecuteResponse)
@router.post("/api/execution/run/", response_model=ExecuteResponse, include_in_schema=False)
@router.post("/api/programs/execute", response_model=ExecuteResponse)
@router.post("/api/programs/execute/", response_model=ExecuteResponse, include_in_schema=False)
def execute_code_endpoint(
    req: ExecuteRequest,
    db: Session = Depends(get_db)
):
    return handle_execution(req, db)

@router.post("/api/execute/stop")
@router.post("/api/programs/execute/stop")
def stop_execution(payload: Dict[str, Any] = Body(...)):
    execution_id = payload.get("execution_id") or payload.get("executionId")
    if not execution_id:
        raise HTTPException(status_code=400, detail="execution_id is required.")
    
    stopped = execution_service.stop_execution(execution_id)
    return {"status": "stopped" if stopped else "not_found", "execution_id": execution_id}
