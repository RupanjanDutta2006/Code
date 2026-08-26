import time
from collections import defaultdict
from datetime import datetime
from typing import List, Optional, Dict
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from sqlalchemy import desc

from backend.database.database import get_db
from backend.models import (
    Classroom, ClassroomMember, ClassResource, ClassAnnouncement,
    ClassroomAssignment, Submission, Program, User, UserRole
)
from backend.schemas import (
    ClassroomCreate, ClassroomUpdate, ClassroomResponse, ClassroomJoin,
    ClassResourceCreate, ClassResourceResponse, ClassAnnouncementCreate, ClassAnnouncementResponse,
    ClassroomMemberResponse, ClassroomAssign, AssignmentResponse, AssignmentSubmitRequest,
    AccessKeyRegenerateResponse, LeaderboardEntry
)
from backend.utils.security import (
    get_current_user, require_teacher, generate_secure_access_key, hash_access_key
)
from backend.services.audit_service import log_audit_event

router = APIRouter(prefix="/api/classrooms", tags=["Classrooms"])

# In-memory sliding window rate limiter for join attempts (max 10 attempts per minute per user/IP)
_join_attempts: Dict[str, List[float]] = defaultdict(list)
RATE_LIMIT_WINDOW_SECONDS = 60.0
RATE_LIMIT_MAX_ATTEMPTS = 10

def _check_join_rate_limit(client_id: str):
    now = time.time()
    attempts = [t for t in _join_attempts[client_id] if now - t < RATE_LIMIT_WINDOW_SECONDS]
    if len(attempts) >= RATE_LIMIT_MAX_ATTEMPTS:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Too many join attempts. Please wait a minute before trying again."
        )
    attempts.append(now)
    _join_attempts[client_id] = attempts

def _verify_classroom_access(c: Classroom, user: User, db: Session, require_owner: bool = False) -> bool:
    """Verify if user is the teacher/owner or an enrolled member of the classroom."""
    is_owner = c.teacher_id == user.id
    if require_owner:
        if not is_owner:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the classroom instructor can perform this action.")
        return True
    
    if is_owner:
        return True
    
    is_member = db.query(ClassroomMember).filter(
        ClassroomMember.classroom_id == c.id,
        ClassroomMember.student_id == user.id
    ).first() is not None

    if not is_member:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have access to this classroom.")
    return True

def _build_classroom_response(c: Classroom, user: User) -> ClassroomResponse:
    cr = ClassroomResponse.model_validate(c)
    cr.teacher_name = c.teacher.full_name or c.teacher.username if c.teacher else "Instructor"
    cr.is_teacher = c.teacher_id == user.id
    cr.is_member = any(m.student_id == user.id for m in c.members) or cr.is_teacher
    cr.member_count = len(c.members)
    cr.resource_count = len(c.resources)
    cr.assignment_count = len(c.assignments)
    cr.announcement_count = len(c.announcements)
    return cr

# ---------------------------------------------------------
# CLASSROOM CRUD
# ---------------------------------------------------------

@router.post("", response_model=ClassroomResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=ClassroomResponse, status_code=status.HTTP_201_CREATED, include_in_schema=False)
def create_classroom(
    req: ClassroomCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new classroom and generate a secure unique access key."""
    prefix = req.subject or req.name
    while True:
        key = generate_secure_access_key(prefix)
        key_hash = hash_access_key(key)
        # Check uniqueness
        if not db.query(Classroom).filter((Classroom.invite_code == key) | (Classroom.access_key_hash == key_hash)).first():
            break

    classroom = Classroom(
        name=req.name.strip(),
        subject=req.subject.strip() if req.subject else None,
        description=req.description.strip() if req.description else None,
        section=req.section.strip() if req.section else None,
        academic_level=req.academic_level.strip() if req.academic_level else None,
        teacher_id=current_user.id,
        invite_code=key,
        access_key_hash=key_hash,
        joining_enabled=True,
        is_archived=False,
    )
    db.add(classroom)
    db.commit()
    db.refresh(classroom)

    log_audit_event(
        actor_uid=current_user.email or f"user_{current_user.id}",
        action="classroom.created",
        actor_email=current_user.email,
        actor_name=current_user.full_name or current_user.username,
        category="classroom",
        resource_type="classroom",
        resource_id=str(classroom.id),
        classroom_id=str(classroom.id),
        outcome="success",
        source="server",
        trust_level="server-verified",
        metadata={"name": classroom.name, "subject": classroom.subject},
        db=db
    )

    return _build_classroom_response(classroom, current_user)

@router.get("", response_model=List[ClassroomResponse])
@router.get("/", response_model=List[ClassroomResponse], include_in_schema=False)
def list_classrooms(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List all classrooms where the user is either the teacher or an enrolled student."""
    taught = db.query(Classroom).filter(
        Classroom.teacher_id == current_user.id,
        Classroom.is_archived == False
    ).order_by(desc(Classroom.created_at)).all()

    memberships = db.query(ClassroomMember).filter(ClassroomMember.student_id == current_user.id).all()
    enrolled_ids = [m.classroom_id for m in memberships]
    enrolled = db.query(Classroom).filter(
        Classroom.id.in_(enrolled_ids),
        Classroom.teacher_id != current_user.id,
        Classroom.is_archived == False
    ).order_by(desc(Classroom.created_at)).all() if enrolled_ids else []

    all_classes = taught + enrolled
    return [_build_classroom_response(c, current_user) for c in all_classes]

@router.get("/{classroom_id}", response_model=ClassroomResponse)
def get_classroom_detail(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db)
    return _build_classroom_response(c, current_user)

@router.patch("/{classroom_id}", response_model=ClassroomResponse)
def update_classroom(
    classroom_id: int,
    req: ClassroomUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db, require_owner=True)

    if req.name is not None:
        c.name = req.name.strip()
    if req.subject is not None:
        c.subject = req.subject.strip()
    if req.description is not None:
        c.description = req.description.strip()
    if req.section is not None:
        c.section = req.section.strip()
    if req.academic_level is not None:
        c.academic_level = req.academic_level.strip()
    if req.joining_enabled is not None:
        c.joining_enabled = req.joining_enabled

    c.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(c)
    return _build_classroom_response(c, current_user)

@router.delete("/{classroom_id}", status_code=status.HTTP_200_OK)
def delete_classroom(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db, require_owner=True)

    # Delete classroom and cascades
    db.delete(c)
    db.commit()
    return {"status": "ok", "message": f"Classroom '{c.name}' has been deleted."}

# ---------------------------------------------------------
# ACCESS KEY JOIN & ROTATION
# ---------------------------------------------------------

@router.post("/join", response_model=ClassroomResponse)
def join_classroom(
    req: ClassroomJoin,
    request: Request,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Validate submitted access key against hash, prevent duplicates, and grant persistent membership."""
    client_key = f"{current_user.id}:{request.client.host if request.client else 'local'}"
    _check_join_rate_limit(client_key)

    raw_key = req.invite_code.strip().upper()
    if not raw_key:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Please provide a valid classroom access key.")

    key_hash = hash_access_key(raw_key)

    # Match either by computed hash or exact invite_code
    c = db.query(Classroom).filter(
        (Classroom.invite_code == raw_key) | (Classroom.access_key_hash == key_hash),
        Classroom.is_archived == False
    ).first()

    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invalid classroom access key. Please verify with your instructor.")

    if not c.joining_enabled:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Joining is currently disabled for this classroom.")

    if c.teacher_id == current_user.id:
        return _build_classroom_response(c, current_user)

    existing_member = db.query(ClassroomMember).filter(
        ClassroomMember.classroom_id == c.id,
        ClassroomMember.student_id == current_user.id
    ).first()

    if not existing_member:
        new_member = ClassroomMember(
            classroom_id=c.id,
            student_id=current_user.id,
            role="student"
        )
        db.add(new_member)
        db.commit()
        db.refresh(c)

        log_audit_event(
            actor_uid=current_user.email or f"user_{current_user.id}",
            action="classroom.joined",
            actor_email=current_user.email,
            actor_name=current_user.full_name or current_user.username,
            category="classroom",
            resource_type="classroom",
            resource_id=str(c.id),
            classroom_id=str(c.id),
            outcome="success",
            source="server",
            trust_level="server-verified",
            metadata={"classroom_name": c.name},
            db=db
        )

    return _build_classroom_response(c, current_user)

@router.post("/{classroom_id}/key/regenerate", response_model=AccessKeyRegenerateResponse)
def regenerate_access_key(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate a new access key; old key becomes invalid immediately, existing members remain enrolled."""
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db, require_owner=True)

    prefix = c.subject or c.name
    while True:
        new_key = generate_secure_access_key(prefix)
        new_hash = hash_access_key(new_key)
        if not db.query(Classroom).filter((Classroom.invite_code == new_key) | (Classroom.access_key_hash == new_hash)).first():
            break

    c.invite_code = new_key
    c.access_key_hash = new_hash
    c.updated_at = datetime.utcnow()
    db.commit()

    log_audit_event(
        actor_uid=current_user.email or f"user_{current_user.id}",
        action="classroom.key_regenerated",
        actor_email=current_user.email,
        actor_name=current_user.full_name or current_user.username,
        category="classroom",
        resource_type="classroom",
        resource_id=str(c.id),
        classroom_id=str(c.id),
        outcome="success",
        source="server",
        trust_level="server-verified",
        metadata={"classroom_name": c.name},
        db=db
    )

    return AccessKeyRegenerateResponse(
        classroom_id=c.id,
        invite_code=new_key,
        message="Classroom access key rotated successfully. Previous keys are now revoked."
    )

@router.post("/{classroom_id}/leave", status_code=status.HTTP_200_OK)
def leave_classroom(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    if c.teacher_id == current_user.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Instructors cannot leave their own classroom. You may delete the class instead.")

    member = db.query(ClassroomMember).filter(
        ClassroomMember.classroom_id == classroom_id,
        ClassroomMember.student_id == current_user.id
    ).first()

    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="You are not enrolled in this classroom.")

    db.delete(member)
    db.commit()

    log_audit_event(
        actor_uid=current_user.email or f"user_{current_user.id}",
        action="classroom.left",
        actor_email=current_user.email,
        actor_name=current_user.full_name or current_user.username,
        category="classroom",
        resource_type="classroom",
        resource_id=str(c.id),
        classroom_id=str(c.id),
        outcome="success",
        source="server",
        trust_level="server-verified",
        metadata={"classroom_name": c.name},
        db=db
    )

    return {"status": "ok", "message": f"Successfully left '{c.name}'."}

# ---------------------------------------------------------
# CLASS MEMBERS ROSTER
# ---------------------------------------------------------

@router.get("/{classroom_id}/members", response_model=List[ClassroomMemberResponse])
def list_members(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db)

    members = db.query(ClassroomMember).filter(ClassroomMember.classroom_id == classroom_id).all()
    results = []
    for m in members:
        if m.student:
            results.append(ClassroomMemberResponse(
                id=m.id,
                classroom_id=classroom_id,
                student_id=m.student.id,
                student_name=m.student.full_name or m.student.username,
                student_username=m.student.username,
                student_email=m.student.email,
                role=m.role or "student",
                joined_at=m.joined_at
            ))
    return results

@router.delete("/{classroom_id}/members/{student_id}", status_code=status.HTTP_200_OK)
def remove_student_member(
    classroom_id: int,
    student_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove student from classroom (teacher only). Access is revoked immediately."""
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db, require_owner=True)

    member = db.query(ClassroomMember).filter(
        ClassroomMember.classroom_id == classroom_id,
        ClassroomMember.student_id == student_id
    ).first()

    if not member:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Student is not a member of this classroom.")

    db.delete(member)
    db.commit()

    log_audit_event(
        actor_uid=current_user.email or f"user_{current_user.id}",
        action="classroom.member_removed",
        actor_email=current_user.email,
        actor_name=current_user.full_name or current_user.username,
        category="classroom",
        resource_type="member",
        resource_id=str(student_id),
        classroom_id=str(classroom_id),
        outcome="success",
        source="server",
        trust_level="server-verified",
        db=db
    )

    return {"status": "ok", "message": "Student has been removed from the classroom."}

# ---------------------------------------------------------
# CLASSROOM RESOURCES (NOTES & CODE)
# ---------------------------------------------------------

@router.get("/{classroom_id}/resources", response_model=List[ClassResourceResponse])
def list_resources(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db)

    resources = db.query(ClassResource).filter(
        ClassResource.classroom_id == classroom_id
    ).order_by(desc(ClassResource.created_at)).all()

    res_list = []
    for r in resources:
        res = ClassResourceResponse.model_validate(r)
        res.author_name = r.author.full_name or r.author.username if r.author else "Instructor"
        res_list.append(res)
    return res_list

@router.post("/{classroom_id}/resources", response_model=ClassResourceResponse, status_code=status.HTTP_201_CREATED)
def create_resource(
    classroom_id: int,
    req: ClassResourceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Publish teacher lecture notes, PDFs, or runnable code references."""
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db, require_owner=True)

    res = ClassResource(
        classroom_id=classroom_id,
        created_by=current_user.id,
        resource_type=req.resource_type,
        title=req.title.strip(),
        description=req.description.strip() if req.description else None,
        category=req.category or "General",
        language=req.language,
        source_code=req.source_code,
        file_url=req.file_url,
        file_name=req.file_name,
        file_size_bytes=req.file_size_bytes,
    )
    db.add(res)
    db.commit()
    db.refresh(res)

    log_audit_event(
        actor_uid=current_user.email or f"user_{current_user.id}",
        action="resource.upload_completed",
        actor_email=current_user.email,
        actor_name=current_user.full_name or current_user.username,
        category="resource",
        resource_type=res.resource_type,
        resource_id=str(res.id),
        classroom_id=str(classroom_id),
        outcome="success",
        source="server",
        trust_level="server-verified",
        metadata={"title": res.title, "resource_type": res.resource_type},
        db=db
    )

    out = ClassResourceResponse.model_validate(res)
    out.author_name = current_user.full_name or current_user.username
    return out

@router.delete("/{classroom_id}/resources/{resource_id}", status_code=status.HTTP_200_OK)
def delete_resource(
    classroom_id: int,
    resource_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """IDOR-protected resource deletion (teacher only)."""
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db, require_owner=True)

    res = db.query(ClassResource).filter(
        ClassResource.id == resource_id,
        ClassResource.classroom_id == classroom_id
    ).first()

    if not res:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Resource not found in this classroom.")

    db.delete(res)
    db.commit()

    log_audit_event(
        actor_uid=current_user.email or f"user_{current_user.id}",
        action="resource.deleted",
        actor_email=current_user.email,
        actor_name=current_user.full_name or current_user.username,
        category="resource",
        resource_type="resource",
        resource_id=str(resource_id),
        classroom_id=str(classroom_id),
        outcome="success",
        source="server",
        trust_level="server-verified",
        db=db
    )

    return {"status": "ok", "message": "Resource deleted successfully."}

# ---------------------------------------------------------
# ANNOUNCEMENTS
# ---------------------------------------------------------

@router.get("/{classroom_id}/announcements", response_model=List[ClassAnnouncementResponse])
def list_announcements(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db)

    announcements = db.query(ClassAnnouncement).filter(
        ClassAnnouncement.classroom_id == classroom_id
    ).order_by(desc(ClassAnnouncement.is_pinned), desc(ClassAnnouncement.created_at)).all()

    out = []
    for a in announcements:
        item = ClassAnnouncementResponse.model_validate(a)
        item.author_name = a.author.full_name or a.author.username if a.author else "Instructor"
        out.append(item)
    return out

@router.post("/{classroom_id}/announcements", response_model=ClassAnnouncementResponse, status_code=status.HTTP_201_CREATED)
def create_announcement(
    classroom_id: int,
    req: ClassAnnouncementCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db, require_owner=True)

    ann = ClassAnnouncement(
        classroom_id=classroom_id,
        teacher_id=current_user.id,
        title=req.title.strip(),
        content=req.content.strip(),
        is_pinned=req.is_pinned or False,
    )
    db.add(ann)
    db.commit()
    db.refresh(ann)

    item = ClassAnnouncementResponse.model_validate(ann)
    item.author_name = current_user.full_name or current_user.username
    return item

@router.delete("/{classroom_id}/announcements/{announcement_id}", status_code=status.HTTP_200_OK)
def delete_announcement(
    classroom_id: int,
    announcement_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db, require_owner=True)

    ann = db.query(ClassAnnouncement).filter(
        ClassAnnouncement.id == announcement_id,
        ClassAnnouncement.classroom_id == classroom_id
    ).first()

    if not ann:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Announcement not found.")

    db.delete(ann)
    db.commit()
    return {"status": "ok", "message": "Announcement deleted."}

# ---------------------------------------------------------
# ASSIGNMENTS & SUBMISSIONS
# ---------------------------------------------------------

@router.post("/{classroom_id}/assign", response_model=AssignmentResponse)
def assign_problem(
    classroom_id: int,
    req: ClassroomAssign,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db, require_owner=True)

    prog = None
    if req.program_id:
        prog = db.query(Program).filter(Program.id == req.program_id).first()
    else:
        # Create an associated Program for this assignment so it integrates with compiler and judge
        prog = Program(
            title=req.title or "Classroom Assignment",
            description=req.description or req.instructions or "Assignment problem",
            language=req.starter_language or "python",
            category="Assignment",
            user_id=current_user.id,
            is_public=False,
            source_code=req.starter_code or "# Write your solution below\n",
        )
        db.add(prog)
        db.commit()
        db.refresh(prog)

    title = req.title or (prog.title if prog else "Classroom Assignment")

    assignment = ClassroomAssignment(
        classroom_id=classroom_id,
        program_id=prog.id if prog else None,
        title=title,
        description=req.description,
        instructions=req.instructions,
        starter_code=req.starter_code or (prog.source_code if prog else None),
        starter_language=req.starter_language or (prog.language if prog else "python"),
        max_score=req.max_score or 100,
        due_date=req.due_date,
    )
    db.add(assignment)
    db.commit()
    db.refresh(assignment)

    log_audit_event(
        actor_uid=current_user.email or f"user_{current_user.id}",
        action="assignment.created",
        actor_email=current_user.email,
        actor_name=current_user.full_name or current_user.username,
        category="assignment",
        resource_type="assignment",
        resource_id=str(assignment.id),
        classroom_id=str(classroom_id),
        outcome="success",
        source="server",
        trust_level="server-verified",
        metadata={"title": assignment.title},
        db=db
    )

    return AssignmentResponse(
        id=assignment.id,
        classroom_id=classroom_id,
        program_id=assignment.program_id,
        title=assignment.title or "Assignment",
        description=assignment.description,
        instructions=assignment.instructions,
        starter_code=assignment.starter_code,
        starter_language=assignment.starter_language,
        max_score=assignment.max_score,
        program_title=prog.title if prog else None,
        program_language=prog.language if prog else assignment.starter_language,
        due_date=assignment.due_date,
        assigned_at=assignment.assigned_at,
        my_submission_status="Not started",
        my_score=0,
        passed_count=0,
        total_count=len(prog.test_cases) if prog else 0
    )

@router.get("/{classroom_id}/assignments", response_model=List[AssignmentResponse])
def list_assignments(
    classroom_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db)

    assignments = db.query(ClassroomAssignment).filter(
        ClassroomAssignment.classroom_id == classroom_id
    ).order_by(desc(ClassroomAssignment.assigned_at)).all()

    result = []
    for a in assignments:
        prog = a.program
        
        # Check student's submission status
        sub = db.query(Submission).filter(
            Submission.classroom_id == classroom_id,
            (Submission.assignment_id == a.id) | (Submission.program_id == a.program_id if a.program_id else False),
            Submission.student_id == current_user.id
        ).order_by(desc(Submission.created_at)).first()

        status_text = "Not started"
        passed_c = 0
        total_c = len(prog.test_cases) if prog else 0
        score = 0

        if sub:
            passed_c = sub.passed_count
            total_c = sub.total_count
            score = sub.score or 0
            if sub.verdict == "Accepted" or (sub.passed_count == sub.total_count and sub.total_count > 0):
                status_text = f"{sub.passed_count}/{sub.total_count} Passed ✓"
            elif sub.verdict == "Submitted":
                status_text = "Submitted for Review"
            else:
                status_text = f"{sub.passed_count}/{sub.total_count} Passed"

        result.append(AssignmentResponse(
            id=a.id,
            classroom_id=classroom_id,
            program_id=a.program_id,
            title=a.title or (prog.title if prog else "Assignment"),
            description=a.description,
            instructions=a.instructions,
            starter_code=a.starter_code,
            starter_language=a.starter_language or (prog.language if prog else "python"),
            max_score=a.max_score or 100,
            program_title=prog.title if prog else a.title,
            program_language=prog.language if prog else a.starter_language,
            due_date=a.due_date,
            assigned_at=a.assigned_at,
            my_submission_status=status_text,
            my_score=score,
            passed_count=passed_c,
            total_count=total_c
        ))
    return result

@router.post("/{classroom_id}/assignments/{assignment_id}/submit", status_code=status.HTTP_201_CREATED)
def submit_assignment(
    classroom_id: int,
    assignment_id: int,
    req: AssignmentSubmitRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db)

    assignment = db.query(ClassroomAssignment).filter(
        ClassroomAssignment.id == assignment_id,
        ClassroomAssignment.classroom_id == classroom_id
    ).first()

    if not assignment:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Assignment not found.")

    sub = Submission(
        classroom_id=classroom_id,
        assignment_id=assignment_id,
        program_id=assignment.program_id,
        student_id=current_user.id,
        source_code=req.source_code,
        language=req.language,
        verdict="Submitted",
        passed_count=1,
        total_count=1,
        score=assignment.max_score,
        details_json=req.notes or "[]"
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)

    log_audit_event(
        actor_uid=current_user.email or f"user_{current_user.id}",
        action="assignment.submission_created",
        actor_email=current_user.email,
        actor_name=current_user.full_name or current_user.username,
        category="assignment",
        resource_type="submission",
        resource_id=str(sub.id),
        classroom_id=str(classroom_id),
        outcome="success",
        source="server",
        trust_level="server-verified",
        metadata={"assignment_id": str(assignment_id), "language": req.language},
        db=db
    )

    return {"status": "ok", "submission_id": sub.id, "message": "Assignment solution submitted successfully."}

@router.get("/{classroom_id}/leaderboard", response_model=List[LeaderboardEntry])
def get_classroom_leaderboard(
    classroom_id: int,
    program_id: Optional[int] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    c = db.query(Classroom).filter(Classroom.id == classroom_id).first()
    if not c or c.is_archived:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Classroom not found.")

    _verify_classroom_access(c, current_user, db, require_owner=True)

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
                score=best_sub.score or 0,
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
                score=0,
                last_submitted=None
            ))

    entries.sort(key=lambda x: (-x.passed_count, x.attempts if x.attempts > 0 else 999))
    return entries
