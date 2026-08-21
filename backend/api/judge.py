from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.models import TestCase, Program, User
from backend.schemas import TestCaseCreate, TestCaseResponse, JudgeSubmitRequest, JudgeSubmitResponse
from backend.utils.security import get_current_user, get_current_user_optional, require_creator_or_teacher
from backend.services.judge_service import judge_service

router = APIRouter(prefix="/api/programs", tags=["Competitive Judge / Practice"])

@router.get("/{program_id}/test-cases", response_model=List[TestCaseResponse])
def get_test_cases(
    program_id: int,
    db: Session = Depends(get_db)
):
    cases = db.query(TestCase).filter(
        TestCase.program_id == program_id
    ).order_by(TestCase.order_index).all()
    return [TestCaseResponse.model_validate(c) for c in cases]

@router.post("/{program_id}/test-cases", response_model=List[TestCaseResponse])
def update_test_cases(
    program_id: int,
    test_cases: List[TestCaseCreate],
    current_user: User = Depends(require_creator_or_teacher),
    db: Session = Depends(get_db)
):
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found.")

    if program.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit test cases on your own programs.")

    # Replace existing test cases
    db.query(TestCase).filter(TestCase.program_id == program_id).delete()
    
    created_cases = []
    for idx, tc_in in enumerate(test_cases):
        tc = TestCase(
            program_id=program_id,
            input_data=tc_in.input_data,
            expected_output=tc_in.expected_output,
            is_sample=tc_in.is_sample,
            order_index=idx
        )
        db.add(tc)
        created_cases.append(tc)

    db.commit()
    return [TestCaseResponse.model_validate(c) for c in created_cases]

@router.post("/{program_id}/submit", response_model=JudgeSubmitResponse)
def submit_solution(
    program_id: int,
    req: JudgeSubmitRequest,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    # Anonymous student or authenticated student
    student_id = current_user.id if current_user else 1

    try:
        response = judge_service.evaluate_submission(
            db=db,
            program_id=program_id,
            source_code=req.source_code,
            student_id=student_id,
            classroom_id=req.classroom_id,
            language=req.language
        )
        return response
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Judge evaluation failed: {e}")
