from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from backend.database.database import get_db
from backend.models import Program, ProgramVersion, TestCase, User, Folder
from backend.schemas import (
    ProgramCreate, ProgramUpdate, ProgramListResponse, ProgramDetailResponse,
    VersionResponse, TestCaseResponse
)
from backend.utils.security import (
    get_current_user,
    get_current_user_optional,
    require_creator_or_teacher
)
from backend.services.hash_service import compute_content_hash
from backend.services.analytics_service import record_program_event

router = APIRouter(prefix="/api/programs", tags=["Programs"])

@router.get("", response_model=List[ProgramListResponse])
def list_programs(
    query: Optional[str] = None,
    language: Optional[str] = None,
    category: Optional[str] = None,
    folder_id: Optional[int] = None,
    only_mine: bool = False,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    q = db.query(Program)

    if only_mine:
        if not current_user:
            raise HTTPException(status_code=401, detail="Log in to view your programs.")
        q = q.filter(Program.user_id == current_user.id)
    else:
        # Public or owned by current user
        if current_user:
            q = q.filter(or_(Program.is_public == True, Program.user_id == current_user.id))
        else:
            q = q.filter(Program.is_public == True)

    if query:
        search = f"%{query}%"
        q = q.filter(or_(Program.title.ilike(search), Program.description.ilike(search)))

    if language:
        q = q.filter(Program.language.ilike(language))

    if category:
        q = q.filter(Program.category.ilike(category))

    if folder_id is not None:
        q = q.filter(Program.folder_id == folder_id)

    programs = q.order_by(desc(Program.updated_at)).all()

    # Enrich with counts and author
    res = []
    for p in programs:
        p_dict = ProgramListResponse.model_validate(p)
        p_dict.author_username = p.user.username if p.user else "Anonymous"
        p_dict.version_count = len(p.versions)
        p_dict.test_case_count = len(p.test_cases)
        res.append(p_dict)
    return res

@router.get("/{program_id}", response_model=ProgramDetailResponse)
def get_program(
    program_id: int,
    current_user: Optional[User] = Depends(get_current_user_optional),
    db: Session = Depends(get_db)
):
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found.")

    if not program.is_public and (not current_user or program.user_id != current_user.id):
        raise HTTPException(status_code=403, detail="This program is private.")

    # Record view event asynchronously/in background
    try:
        record_program_event(db, program_id, "view")
    except Exception:
        pass

    detail = ProgramDetailResponse.model_validate(program)
    detail.author_username = program.user.username if program.user else "Anonymous"
    detail.versions = [VersionResponse.model_validate(v) for v in program.versions]
    detail.test_cases = [TestCaseResponse.model_validate(tc) for tc in program.test_cases]
    return detail

@router.post("", response_model=ProgramDetailResponse, status_code=status.HTTP_201_CREATED)
def create_program(
    req: ProgramCreate,
    current_user: User = Depends(require_creator_or_teacher),
    db: Session = Depends(get_db)
):
    content_hash = compute_content_hash(req.source_code)
    program = Program(
        title=req.title,
        description=req.description,
        language=req.language.lower(),
        category=req.category or "General",
        folder_id=req.folder_id,
        user_id=current_user.id,
        is_public=req.is_public,
        source_code=req.source_code,
        content_hash=content_hash
    )
    db.add(program)
    db.commit()
    db.refresh(program)

    # Create initial version 1
    v1 = ProgramVersion(
        program_id=program.id,
        version_number=1,
        source_code=req.source_code,
        content_hash=content_hash,
        commit_message="Initial version",
        created_by=current_user.id
    )
    db.add(v1)

    # Attach initial test cases if supplied
    if req.test_cases:
        for idx, tc_in in enumerate(req.test_cases):
            tc = TestCase(
                program_id=program.id,
                input_data=tc_in.input_data,
                expected_output=tc_in.expected_output,
                is_sample=tc_in.is_sample,
                order_index=idx
            )
            db.add(tc)

    db.commit()
    db.refresh(program)

    detail = ProgramDetailResponse.model_validate(program)
    detail.author_username = current_user.username
    detail.versions = [VersionResponse.model_validate(v) for v in program.versions]
    detail.test_cases = [TestCaseResponse.model_validate(tc) for tc in program.test_cases]
    return detail

@router.put("/{program_id}", response_model=ProgramDetailResponse)
def update_program(
    program_id: int,
    req: ProgramUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found.")

    if program.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only edit your own programs.")

    if req.title is not None:
        program.title = req.title
    if req.description is not None:
        program.description = req.description
    if req.language is not None:
        program.language = req.language.lower()
    if req.category is not None:
        program.category = req.category
    if req.folder_id is not None:
        program.folder_id = req.folder_id
    if req.is_public is not None:
        program.is_public = req.is_public

    if req.source_code is not None:
        new_hash = compute_content_hash(req.source_code)
        if new_hash != program.content_hash:
            program.source_code = req.source_code
            program.content_hash = new_hash
            
            # Create new revision version
            ver_num = len(program.versions) + 1
            new_v = ProgramVersion(
                program_id=program.id,
                version_number=ver_num,
                source_code=req.source_code,
                content_hash=new_hash,
                commit_message=req.commit_message or "Update program",
                created_by=current_user.id
            )
            db.add(new_v)

    db.commit()
    db.refresh(program)

    detail = ProgramDetailResponse.model_validate(program)
    detail.author_username = current_user.username
    detail.versions = [VersionResponse.model_validate(v) for v in program.versions]
    detail.test_cases = [TestCaseResponse.model_validate(tc) for tc in program.test_cases]
    return detail

@router.delete("/{program_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_program(
    program_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        raise HTTPException(status_code=404, detail="Program not found.")

    if program.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only delete your own programs.")

    db.delete(program)
    db.commit()
    return None
