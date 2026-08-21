import random
import string
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import desc
from backend.database.database import get_db
from backend.models import (
    Classroom, ClassroomMember, ClassroomAssignment, Submission, Program, User, UserRole
)
from backend.schemas import (
    ClassroomCreate, ClassroomResponse, ClassroomJoin, ClassroomAssign,
    AssignmentResponse, LeaderboardEntry
)
from backend.utils.security import get_current_user, require_teacher

router = APIRouter(prefix="/api/classrooms", tags=["Classrooms"])

def generate_invite_code() -> str:
    prefix = "".join(random.choices(string.ascii_uppercase, k=3))
    suffix = "".join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"{prefix}-{suffix}"

@router.post("", response_model=ClassroomResponse, status_code=status.HTTP_201_CREATED)
def create_classroom(
    req: ClassroomCreate,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    # Generate unique invite code
    while True:
        code = generate_invite_code()
        if not db.query(Classroom).filter(Classroom.invite_code == code).first():
            break

    classroom = Classroom(
        name=req.name,
        description=req.description,
        teacher_id=current_user.id,
        invite_code=code
    )
    db.add(classroom)
    db.commit()
    db.refresh(classroom)

    res = ClassroomResponse.model_validate(classroom)
    res.teacher_name = current_user.full_name or current_user.username
    res.member_count = 0
    res.assignment_count = 0
    return res

@router.get("", response_model=List[ClassroomResponse])
def list_classrooms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if current_user.role == UserRole.TEACHER:
        classes = db.query(Classroom).filter(Classroom.teacher_id == current_user.id).order_by(desc(Classroom.created_at)).all()
    else:
        # Enrolled classrooms for students
        memberships = db.query(ClassroomMember).filter(ClassroomMember.student_id == current_user.id).all()
        class_ids = [m.classroom_id for m in memberships]
        classes = db.query(Classroom).filter(Classroom.id.in_(class_ids)).order_by(desc(Classroom.created_at)).all()

    result = []
    for c in classes:
        cr = ClassroomResponse.model_validate(c)
        cr.teacher_name = c.teacher.full_name or c.teacher.username if c.teacher else "Instructor"
        cr.member_count = len(c.members)
        cr.assignment_count = len(c.assignments)
        result.append(cr)
    return result

@router.get("/{classroom_id}", response_model=ClassroomResponse)
def get_classroom_detail(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Classroom not found.")

    # Check permission
    is_teacher = c.teacher_id == current_user.id
    is_member = db.query(ClassroomMember).filter(
        ClassroomMember.classroom_id == classroom_id,
        ClassroomMember.student_id == current_user.id
    ).first() is not None

    if not is_teacher and not is_member:
        raise HTTPException(status_code=403, detail="You are not enrolled in this classroom.")

    cr = ClassroomResponse.model_validate(c)
    cr.teacher_name = c.teacher.full_name or c.teacher.username if c.teacher else "Instructor"
    cr.member_count = len(c.members)
    cr.assignment_count = len(c.assignments)
    return cr

@router.post("/join", response_model=ClassroomResponse)
def join_classroom(
    req: ClassroomJoin,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    code = req.invite_code.strip().upper()
    c = db.query(Classroom).filter(Classroom.invite_code == code).first()
    if not c:
        raise HTTPException(status_code=404, detail="Invalid classroom invite code.")

    if c.teacher_id == current_user.id:
        raise HTTPException(status_code=400, detail="You are the teacher of this classroom.")

    existing_member = db.query(ClassroomMember).filter(
        ClassroomMember.classroom_id == c.id,
        ClassroomMember.student_id == current_user.id
    ).first()

    if not existing_member:
        new_member = ClassroomMember(
            classroom_id=c.id,
            student_id=current_user.id
        )
        db.add(new_member)
        db.commit()

    cr = ClassroomResponse.model_validate(c)
    cr.teacher_name = c.teacher.full_name or c.teacher.username if c.teacher else "Instructor"
    cr.member_count = len(c.members)
    cr.assignment_count = len(c.assignments)
    return cr

@router.post("/{classroom_id}/assign", response_model=AssignmentResponse)
def assign_problem(
    classroom_id: int,
    req: ClassroomAssign,
    current_user: User = Depends(require_teacher),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Only the classroom teacher can assign problems.")

    program = db.query(Program).filter(Program.id == req.program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found.")

    existing = db.query(ClassroomAssignment).filter(
        ClassroomAssignment.classroom_id == classroom_id,
        ClassroomAssignment.program_id == req.program_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="This problem is already assigned to the classroom.")

    assignment = ClassroomAssignment(
        classroom_id=classroom_id,
        program_id=req.program_id,
        due_date=req.due_date
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    return AssignmentResponse(
        id=assignment.id,
        classroom_id=classroom_id,
        program_id=program.id,
        program_title=program.title,
        program_language=program.language,
        due_date=assignment.due_date,
        assigned_at=assignment.assigned_at,
        my_submission_status="Not started",
        passed_count=0,
        total_count=len(program.test_cases)
    )

@router.get("/{classroom_id}/assignments", response_model=List[AssignmentResponse])
def list_assignments(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Classroom not found.")

    assignments = db.query(ClassroomAssignment).filter(
        ClassroomAssignment.classroom_id == classroom_id
    ).order_by(desc(ClassroomAssignment.assigned_at)).all()

    result = []
    for a in assignments:
        prog = a.program
        
        # Check student's submission status
        sub = db.query(Submission).filter(
            Submission.classroom_id == classroom_id,
            Submission.program_id == a.program_id,
            Submission.student_id == current_user.id
        ).order_by(desc(Submission.created_at)).first()

        status_text = "Not started"
        passed_c = 0
        total_c = len(prog.test_cases) if prog else 0

        if sub:
            passed_c = sub.passed_count
            total_c = sub.total_count
            if sub.passed_count == sub.total_count and sub.total_count > 0:
                status_text = f"{sub.passed_count}/{sub.total_count} Passed ✓"
            else:
                status_text = f"{sub.passed_count}/{sub.total_count} Passed"

        result.append(AssignmentResponse(
            id=a.id,
            classroom_id=classroom_id,
            program_id=a.program_id,
            program_title=prog.title if prog else "Untitled",
            program_language=prog.language if prog else "unknown",
            due_date=a.due_date,
            assigned_at=a.assigned_at,
            my_submission_status=status_text,
            passed_count=passed_c,
            total_count=total_c
        ))
    return result

@router.get("/{classroom_id}/leaderboard", response_model=List[LeaderboardEntry])
def get_classroom_leaderboard(
    classroom_id: int,
    program_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Classroom not found.")

    if c.teacher_id != current_user.id:
        raise HTTPException(status_code=403, detail="Leaderboard is visible only to the classroom teacher.")

    members = db.query(ClassroomMember).filter(ClassroomMember.classroom_id == classroom_id).all()
    
    entries = []
    for member in members:
        student = member.student
        if not student:
            continue

        q = db.query(Submission).filter(
            Submission.classroom_id == classroom_id,
            Submission.student_id == student.id
        )
        if program_id:
            q = q.filter(Submission.program_id == program_id)

        subs = q.order_by(desc(Submission.created_at)).all()
        attempts = len(subs)

        if subs:
            best_sub = max(subs, key=lambda s: s.passed_count)
            entries.append(LeaderboardEntry(
                student_id=student.id,
                student_name=student.full_name or student.username,
                student_username=student.username,
                passed_count=best_sub.passed_count,
                total_count=best_sub.total_count,
                attempts=attempts,
                verdict=best_sub.verdict,
                last_submitted=subs[0].created_at
            ))
        else:
            entries.append(LeaderboardEntry(
                student_id=student.id,
                student_name=student.full_name or student.username,
                student_username=student.username,
                passed_count=0,
                total_count=0,
                attempts=0,
                verdict="Not started",
                last_submitted=None
            ))

    # Sort: highest pass count, then fewer attempts
    entries.sort(key=lambda x: (-x.passed_count, x.attempts if x.attempts > 0 else 999))
    return entries
