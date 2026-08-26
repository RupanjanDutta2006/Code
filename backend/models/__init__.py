from datetime import datetime
import enum
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float, Enum as SQLEnum, UniqueConstraint
)
from sqlalchemy.orm import relationship
from backend.database.database import Base

class UserRole(str, enum.Enum):
    USER = "USER"
    CREATOR = "CREATOR"
    TEACHER = "TEACHER"
    ADMIN = "ADMIN"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(64), unique=True, index=True, nullable=False)
    email = Column(String(120), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), default=UserRole.USER, nullable=False)
    full_name = Column(String(120), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    folders = relationship("Folder", back_populates="user", cascade="all, delete-orphan")
    programs = relationship("Program", back_populates="user", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="student")
    taught_classrooms = relationship("Classroom", back_populates="teacher", foreign_keys="Classroom.teacher_id")
    enrollments = relationship("ClassroomMember", back_populates="student")
    authored_resources = relationship("ClassResource", back_populates="author")
    authored_announcements = relationship("ClassAnnouncement", back_populates="author")

class Folder(Base):
    __tablename__ = "folders"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    parent_id = Column(Integer, ForeignKey("folders.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="folders")
    parent = relationship("Folder", remote_side=[id], backref="children")
    programs = relationship("Program", back_populates="folder")

class Program(Base):
    __tablename__ = "programs"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), index=True, nullable=False)
    description = Column(Text, nullable=True)
    language = Column(String(32), index=True, nullable=False)
    category = Column(String(64), index=True, default="General")
    folder_id = Column(Integer, ForeignKey("folders.id"), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    is_public = Column(Boolean, default=True)
    source_code = Column(Text, nullable=False)
    content_hash = Column(String(64), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="programs")
    folder = relationship("Folder", back_populates="programs")
    versions = relationship("ProgramVersion", back_populates="program", cascade="all, delete-orphan", order_by="desc(ProgramVersion.version_number)")
    test_cases = relationship("TestCase", back_populates="program", cascade="all, delete-orphan", order_by="TestCase.order_index")
    events = relationship("ProgramEvent", back_populates="program", cascade="all, delete-orphan")
    submissions = relationship("Submission", back_populates="program", cascade="all, delete-orphan")
    assignments = relationship("ClassroomAssignment", back_populates="program", cascade="all, delete-orphan")

class ProgramVersion(Base):
    __tablename__ = "program_versions"

    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    version_number = Column(Integer, nullable=False)
    source_code = Column(Text, nullable=False)
    content_hash = Column(String(64), nullable=False)
    commit_message = Column(String(255), default="Update program")
    created_by = Column(Integer, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    program = relationship("Program", back_populates="versions")

class ProgramEvent(Base):
    __tablename__ = "program_events"

    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    event_type = Column(String(32), nullable=False) # 'view', 'run', 'copy'
    created_at = Column(DateTime, default=datetime.utcnow)

    program = relationship("Program", back_populates="events")

class TestCase(Base):
    __tablename__ = "test_cases"

    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=False)
    input_data = Column(Text, default="")
    expected_output = Column(Text, default="")
    is_sample = Column(Boolean, default=True) # Sample (visible) vs Hidden
    order_index = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    program = relationship("Program", back_populates="test_cases")

class Classroom(Base):
    __tablename__ = "classrooms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    subject = Column(String(120), nullable=True)
    description = Column(Text, nullable=True)
    section = Column(String(64), nullable=True)
    academic_level = Column(String(64), nullable=True)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    invite_code = Column(String(32), unique=True, index=True, nullable=False) # Access key e.g. DSA-7K4P
    access_key_hash = Column(String(64), nullable=True)
    joining_enabled = Column(Boolean, default=True)
    is_archived = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    teacher = relationship("User", back_populates="taught_classrooms", foreign_keys=[teacher_id])
    members = relationship("ClassroomMember", back_populates="classroom", cascade="all, delete-orphan")
    resources = relationship("ClassResource", back_populates="classroom", cascade="all, delete-orphan", order_by="desc(ClassResource.created_at)")
    announcements = relationship("ClassAnnouncement", back_populates="classroom", cascade="all, delete-orphan", order_by="desc(ClassAnnouncement.created_at)")
    assignments = relationship("ClassroomAssignment", back_populates="classroom", cascade="all, delete-orphan", order_by="desc(ClassroomAssignment.assigned_at)")
    submissions = relationship("Submission", back_populates="classroom")

class ClassroomMember(Base):
    __tablename__ = "classroom_members"
    __table_args__ = (
        UniqueConstraint("classroom_id", "student_id", name="uq_classroom_student"),
    )

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    role = Column(String(32), default="student") # "student", "co_teacher", "assistant"
    joined_at = Column(DateTime, default=datetime.utcnow)

    classroom = relationship("Classroom", back_populates="members")
    student = relationship("User", back_populates="enrollments")

class ClassResource(Base):
    __tablename__ = "class_resources"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    resource_type = Column(String(32), default="note") # "note", "code", "document", "link"
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(64), default="General") # "Lecture Notes", "Cheatsheet", "Practice Problem", "Sample Code"
    language = Column(String(32), nullable=True) # for code resources (e.g. 'c', 'cpp', 'python')
    source_code = Column(Text, nullable=True) # for code resources
    file_url = Column(String(500), nullable=True) # URL, Mega link, or storage path
    file_name = Column(String(255), nullable=True)
    file_size_bytes = Column(Integer, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    classroom = relationship("Classroom", back_populates="resources")
    author = relationship("User", back_populates="authored_resources")

class ClassAnnouncement(Base):
    __tablename__ = "class_announcements"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    content = Column(Text, nullable=False)
    is_pinned = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    classroom = relationship("Classroom", back_populates="announcements")
    author = relationship("User", back_populates="authored_announcements")

class ClassroomAssignment(Base):
    __tablename__ = "classroom_assignments"

    id = Column(Integer, primary_key=True, index=True)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=True)
    title = Column(String(200), nullable=True)
    description = Column(Text, nullable=True)
    instructions = Column(Text, nullable=True)
    starter_code = Column(Text, nullable=True)
    starter_language = Column(String(32), nullable=True)
    max_score = Column(Integer, default=100)
    due_date = Column(DateTime, nullable=True)
    assigned_at = Column(DateTime, default=datetime.utcnow)

    classroom = relationship("Classroom", back_populates="assignments")
    program = relationship("Program", back_populates="assignments")

class Submission(Base):
    __tablename__ = "submissions"

    id = Column(Integer, primary_key=True, index=True)
    program_id = Column(Integer, ForeignKey("programs.id"), nullable=True)
    student_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    classroom_id = Column(Integer, ForeignKey("classrooms.id"), nullable=True)
    assignment_id = Column(Integer, ForeignKey("classroom_assignments.id"), nullable=True)
    source_code = Column(Text, nullable=False)
    language = Column(String(32), nullable=False)
    passed_count = Column(Integer, default=0)
    total_count = Column(Integer, default=0)
    verdict = Column(String(32), default="Pending") # "Accepted", "Submitted", "Wrong Answer", "Graded"
    score = Column(Integer, default=0)
    details_json = Column(Text, default="[]") # JSON list of per-testcase results or teacher feedback
    created_at = Column(DateTime, default=datetime.utcnow)

    program = relationship("Program", back_populates="submissions")
    student = relationship("User", back_populates="submissions")
    classroom = relationship("Classroom", back_populates="submissions")

class PlaygroundSession(Base):
    __tablename__ = "playground_sessions"

    id = Column(String(36), primary_key=True, index=True) # UUID
    source_program_id = Column(Integer, ForeignKey("programs.id"), nullable=True)
    title = Column(String(150), default="Collaborative Playground")
    source_code = Column(Text, default="")
    language = Column(String(32), default="python")
    custom_input = Column(Text, default="")
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

class ExecutionCache(Base):
    __tablename__ = "execution_cache"

    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String(64), unique=True, index=True, nullable=False)
    language = Column(String(32), nullable=False)
    source_hash = Column(String(64), nullable=False)
    status = Column(String(32), nullable=False) # 'success', 'error', 'timeout'
    output = Column(Text, default="")
    execution_time_ms = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(64), unique=True, index=True, nullable=False)
    actor_uid = Column(String(128), index=True, nullable=False)
    actor_email = Column(String(120), nullable=True)
    actor_name = Column(String(120), nullable=True)
    action = Column(String(64), index=True, nullable=False)
    category = Column(String(32), index=True, nullable=False)
    resource_type = Column(String(32), nullable=True)
    resource_id = Column(String(64), nullable=True)
    classroom_id = Column(String(64), nullable=True)
    outcome = Column(String(16), default="success", nullable=False)  # success, failure, denied
    source = Column(String(32), default="server", nullable=False)  # server, verified-client-event, system
    trust_level = Column(String(32), default="server-verified", nullable=False)  # server-verified, client-reported
    request_id = Column(String(64), nullable=True)
    metadata_json = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

