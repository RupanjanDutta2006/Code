import json
from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.models import TestCase, Submission, Program
from backend.executor.execution_service import execution_service
from backend.schemas import JudgeCaseResult, JudgeSubmitResponse

def normalize_output(text: str) -> str:
    """Normalizes line endings and removes trailing whitespace per line for fair comparisons."""
    if not text:
        return ""
    lines = [line.rstrip() for line in text.replace("\r\n", "\n").replace("\r", "\n").split("\n")]
    # Strip empty trailing lines
    while lines and not lines[-1]:
        lines.pop()
    return "\n".join(lines)

class JudgeService:
    @staticmethod
    def evaluate_submission(
        db: Session,
        program_id: int,
        source_code: str,
        student_id: int,
        classroom_id: Optional[int] = None,
        language: Optional[str] = None
    ) -> JudgeSubmitResponse:
        program = db.query(Program).filter(Program.id == program_id).first()
        if not program:
            raise ValueError(f"Program #{program_id} not found.")

        target_lang = language or program.language
        test_cases = db.query(TestCase).filter(
            TestCase.program_id == program_id
        ).order_by(TestCase.order_index).all()

        if not test_cases:
            # If no test cases exist, create one default test case
            default_tc = TestCase(
                program_id=program_id,
                input_data="",
                expected_output="",
                is_sample=True,
                order_index=0
            )
            db.add(default_tc)
            db.commit()
            db.refresh(default_tc)
            test_cases = [default_tc]

        case_results: List[JudgeCaseResult] = []
        passed_count = 0
        overall_verdict = "Accepted"

        for idx, tc in enumerate(test_cases, 1):
            run_res = execution_service.execute(
                language=target_lang,
                source_code=source_code,
                custom_input=tc.input_data or "",
                db=db,
                timeout=5,
                use_cache=False
            )

            actual_norm = normalize_output(run_res.output)
            expected_norm = normalize_output(tc.expected_output or "")

            case_status = "Passed"
            error_msg = None

            if run_res.status == "timeout":
                case_status = "Time Limit Exceeded"
                error_msg = "Execution exceeded 5.0 seconds."
                if overall_verdict == "Accepted":
                    overall_verdict = "Time Limit Exceeded"
            elif run_res.status == "error":
                case_status = "Runtime Error"
                error_msg = run_res.error or "Process exited with error."
                if overall_verdict == "Accepted":
                    overall_verdict = "Runtime Error"
            elif actual_norm != expected_norm:
                case_status = "Failed"
                if overall_verdict == "Accepted":
                    overall_verdict = "Wrong Answer"
            else:
                passed_count += 1

            # Mask input/output for hidden test cases if requested
            is_sample = bool(tc.is_sample)
            display_input = tc.input_data if is_sample else "[Hidden Test Case]"
            display_expected = tc.expected_output if is_sample else "[Hidden Test Case]"
            display_actual = run_res.output if is_sample else ("[Output Hidden]" if case_status != "Passed" else run_res.output)

            case_results.append(JudgeCaseResult(
                case_index=idx,
                is_sample=is_sample,
                input_data=display_input,
                expected_output=display_expected,
                actual_output=display_actual,
                status=case_status,
                execution_time_ms=run_res.execution_time_ms,
                error_message=error_msg
            ))

        total_count = len(test_cases)
        if passed_count == total_count:
            overall_verdict = "Accepted"

        # Record submission in DB
        submission = Submission(
            program_id=program_id,
            student_id=student_id,
            classroom_id=classroom_id,
            source_code=source_code,
            language=target_lang,
            passed_count=passed_count,
            total_count=total_count,
            verdict=overall_verdict,
            details_json=json.dumps([c.model_dump() for c in case_results]),
            created_at=datetime.utcnow()
        )
        db.add(submission)
        db.commit()
        db.refresh(submission)

        return JudgeSubmitResponse(
            submission_id=submission.id,
            program_id=program_id,
            passed_count=passed_count,
            total_count=total_count,
            verdict=overall_verdict,
            results=case_results,
            created_at=submission.created_at
        )

judge_service = JudgeService()
