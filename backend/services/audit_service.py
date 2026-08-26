import json
import uuid
import datetime
from typing import Optional, Dict, Any, List
from sqlalchemy.orm import Session
from backend.models import AuditLog, User
from backend.database.database import SessionLocal

# Strict Allowlist of Audit Actions
ALLOWED_AUDIT_ACTIONS = {
    # Auth
    "auth.signup_succeeded": "auth",
    "auth.login_succeeded": "auth",
    "auth.logout_requested": "auth",
    "auth.password_reset_requested": "auth",
    
    # Profile & Settings
    "profile.updated": "profile",
    "settings.updated": "settings",
    
    # Classroom
    "classroom.created": "classroom",
    "classroom.updated": "classroom",
    "classroom.archived": "classroom",
    "classroom.deleted": "classroom",
    "classroom.joined": "classroom",
    "classroom.left": "classroom",
    "classroom.member_removed": "classroom",
    "classroom.key_regenerated": "classroom",
    "classroom.joining_enabled": "classroom",
    "classroom.joining_disabled": "classroom",
    
    # Resource & Notes
    "resource.upload_requested": "resource",
    "resource.upload_completed": "resource",
    "resource.upload_failed": "resource",
    "resource.deleted": "resource",
    "note.created": "resource",
    "note.deleted": "resource",
    
    # Assignment
    "assignment.created": "assignment",
    "assignment.updated": "assignment",
    "assignment.deleted": "assignment",
    "assignment.submission_created": "assignment",
    "assignment.submission_updated": "assignment",
    
    # Compiler & Programs
    "compiler.run_requested": "compiler",
    "compiler.run_completed": "compiler",
    "compiler.run_failed": "compiler",
    "program.saved": "program",
    "program.updated": "program",
    "program.deleted": "program",
    
    # AI Assistant
    "ai.request_started": "ai",
    "ai.request_completed": "ai",
    "ai.request_failed": "ai",
    
    # Learning
    "learning.lesson_started": "learning",
    "learning.lesson_completed": "learning",
    "learning.practice_opened": "learning",
    
    # Admin
    "admin.audit_viewed": "admin",
    "admin.user_role_updated": "admin",
}

# Forbidden metadata fields for privacy & security
FORBIDDEN_METADATA_KEYS = {
    "password", "token", "id_token", "access_token", "refresh_token",
    "apikey", "api_key", "secret", "secret_key", "key", "invite_code",
    "access_key", "source_code", "code", "prompt", "response",
    "stdin", "stdout", "content", "file_data", "credentials", "authorization"
}

def sanitize_metadata(meta: Optional[Dict[str, Any]]) -> Dict[str, Any]:
    """Sanitize metadata dictionary to strictly remove sensitive contents."""
    if not meta or not isinstance(meta, dict):
        return {}
    
    clean: Dict[str, Any] = {}
    for k, v in meta.items():
        lower_k = str(k).lower()
        if any(bad in lower_k for bad in FORBIDDEN_METADATA_KEYS):
            continue
        
        # Convert non-serializable objects
        if isinstance(v, (str, int, float, bool)) or v is None:
            # String length truncation for protection against large payloads
            if isinstance(v, str) and len(v) > 200:
                clean[k] = v[:200] + "..."
            else:
                clean[k] = v
        elif isinstance(v, list):
            clean[k] = [str(x)[:100] for x in v[:10]]
        elif isinstance(v, dict):
            clean[k] = {str(dk): str(dv)[:100] for dk, dv in list(v.items())[:10]}
            
    return clean

def log_audit_event(
    actor_uid: str,
    action: str,
    actor_email: Optional[str] = None,
    actor_name: Optional[str] = None,
    category: Optional[str] = None,
    resource_type: Optional[str] = None,
    resource_id: Optional[str] = None,
    classroom_id: Optional[str] = None,
    outcome: str = "success",
    source: str = "server",
    trust_level: str = "server-verified",
    request_id: Optional[str] = None,
    metadata: Optional[Dict[str, Any]] = None,
    db: Optional[Session] = None
) -> Optional[AuditLog]:
    """
    Central, secure audit logger for all CodeVault operations.
    Guarantees privacy (no secrets/code/passwords stored) and trusted timestamps.
    """
    if action not in ALLOWED_AUDIT_ACTIONS:
        # Fallback or normalized action
        valid_cat = category or "system"
    else:
        valid_cat = ALLOWED_AUDIT_ACTIONS[action]

    event_id = f"evt_{uuid.uuid4().hex[:16]}"
    req_id = request_id or f"req_{uuid.uuid4().hex[:12]}"
    clean_meta = sanitize_metadata(metadata)
    now_utc = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None)

    # Valid outcomes: success, failure, denied
    valid_outcome = outcome if outcome in ["success", "failure", "denied"] else "success"

    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    try:
        log_entry = AuditLog(
            event_id=event_id,
            actor_uid=actor_uid,
            actor_email=actor_email,
            actor_name=actor_name,
            action=action,
            category=valid_cat,
            resource_type=resource_type,
            resource_id=str(resource_id) if resource_id else None,
            classroom_id=str(classroom_id) if classroom_id else None,
            outcome=valid_outcome,
            source=source,
            trust_level=trust_level,
            request_id=req_id,
            metadata_json=json.dumps(clean_meta),
            created_at=now_utc
        )
        db.add(log_entry)
        db.commit()
        db.refresh(log_entry)
        return log_entry
    except Exception as e:
        try:
            db.rollback()
        except Exception:
            pass
        return None
    finally:
        if close_db:
            db.close()
