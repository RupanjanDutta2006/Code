from typing import List, Optional, Any, Dict
from pydantic import BaseModel, EmailStr, Field, ConfigDict
from datetime import datetime
from backend.models import UserRole

# Auth
class UserRegister(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None
    role: Optional[UserRole] = UserRole.USER

class UserLogin(BaseModel):
    username_or_email: str
    password: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str
    email: str
    role: UserRole
    full_name: Optional[str]
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# Folders
class FolderCreate(BaseModel):
    name: str
    parent_id: Optional[int] = None

class FolderResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    parent_id: Optional[int]
    user_id: int
    created_at: datetime

# Test Cases
class TestCaseCreate(BaseModel):
    input_data: str = ""
    expected_output: str = ""
    is_sample: bool = True
    order_index: int = 0

class TestCaseResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    program_id: int
    input_data: str
    expected_output: str
    is_sample: bool
    order_index: int

# Versions
class VersionResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    program_id: int
    version_number: int
    source_code: str
    content_hash: str
    commit_message: Optional[str]
    created_at: datetime
    created_by: Optional[int]

class DiffResponse(BaseModel):
    from_version: int
    to_version: int
    diff_text: str
    old_code: str
    new_code: str

# Programs
class ProgramCreate(BaseModel):
    title: str
    description: Optional[str] = None
    language: str
    category: Optional[str] = "General"
    folder_id: Optional[int] = None
    is_public: bool = True
    source_code: str
    test_cases: Optional[List[TestCaseCreate]] = None

class ProgramUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    language: Optional[str] = None
    category: Optional[str] = None
    folder_id: Optional[int] = None
    is_public: Optional[bool] = None
    source_code: Optional[str] = None
    commit_message: Optional[str] = "Update program"

class ProgramListResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: Optional[str]
    language: str
    category: str
    folder_id: Optional[int]
    user_id: int
    author_username: Optional[str] = None
    is_public: bool
    created_at: datetime
    updated_at: datetime
    version_count: Optional[int] = 1
    test_case_count: Optional[int] = 0

class ProgramDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    title: str
    description: Optional[str]
    language: str
    category: str
    folder_id: Optional[int]
    user_id: int
    author_username: Optional[str] = None
    is_public: bool
    source_code: str
    content_hash: Optional[str]
    created_at: datetime
    updated_at: datetime
    versions: List[VersionResponse] = []
    test_cases: List[TestCaseResponse] = []

# Execution
class ExecuteRequest(BaseModel):
    language: str
    source_code: str
    custom_input: Optional[str] = ""
    program_id: Optional[int] = None

class ExecuteResponse(BaseModel):
    status: str # 'success', 'error', 'timeout'
    output: str
    error: Optional[str] = None
    execution_time_ms: float
    cached: bool = False

# Judge / Submissions
class JudgeCaseResult(BaseModel):
    case_index: int
    is_sample: bool
    input_data: str
    expected_output: str
    actual_output: str
    status: str # 'Passed', 'Failed', 'Time Limit Exceeded', 'Runtime Error'
    execution_time_ms: float
    error_message: Optional[str] = None

class JudgeSubmitRequest(BaseModel):
    program_id: int
    source_code: str
    language: Optional[str] = None
    classroom_id: Optional[int] = None

class JudgeSubmitResponse(BaseModel):
    submission_id: Optional[int] = None
    program_id: int
    passed_count: int
    total_count: int
    verdict: str # 'Accepted', 'Wrong Answer', 'Time Limit Exceeded', 'Runtime Error'
    results: List[JudgeCaseResult]
    created_at: datetime

# Classrooms
class ClassroomCreate(BaseModel):
    name: str
    description: Optional[str] = None

class ClassroomResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    name: str
    description: Optional[str]
    teacher_id: int
    teacher_name: Optional[str] = None
    invite_code: str
    created_at: datetime
    member_count: Optional[int] = 0
    assignment_count: Optional[int] = 0

class ClassroomJoin(BaseModel):
    invite_code: str

class ClassroomAssign(BaseModel):
    program_id: int
    due_date: Optional[datetime] = None

class AssignmentResponse(BaseModel):
    id: int
    classroom_id: int
    program_id: int
    program_title: str
    program_language: str
    due_date: Optional[datetime]
    assigned_at: datetime
    my_submission_status: Optional[str] = "Not started"
    passed_count: Optional[int] = 0
    total_count: Optional[int] = 0

class LeaderboardEntry(BaseModel):
    student_id: int
    student_name: str
    student_username: str
    passed_count: int
    total_count: int
    attempts: int
    verdict: str
    last_submitted: Optional[datetime]

# Playground
class PlaygroundCreate(BaseModel):
    source_program_id: Optional[int] = None
    source_code: Optional[str] = ""
    language: Optional[str] = "python"
    title: Optional[str] = "Collaborative Session"

class PlaygroundResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: str
    title: str
    source_code: str
    language: str
    custom_input: str
    share_url: Optional[str] = None
    created_at: datetime
    expires_at: Optional[datetime]

# Analytics
class AnalyticsResponse(BaseModel):
    program_id: int
    title: str
    views: int
    runs: int
    copies: int
    last_run_at: Optional[datetime]
    trend_30_days: List[Dict[str, Any]]

# AI Assist
class AIExplainRequest(BaseModel):
    source_code: str
    language: str
    context: Optional[str] = None

class AISuggestFixRequest(BaseModel):
    source_code: str
    language: str
    error_message: Optional[str] = None
    input_data: Optional[str] = None
    expected_output: Optional[str] = None
    actual_output: Optional[str] = None

class AIResponse(BaseModel):
    provider: str
    explanation: Optional[str] = None
    suggested_code: Optional[str] = None
    diff_text: Optional[str] = None
    disclaimer: str = "AI-generated content. May be inaccurate. Always verify before relying on it."

# Importer
class ImportResult(BaseModel):
    imported_count: int
    folders_created: int
    skipped_count: int
    programs: List[ProgramListResponse]
