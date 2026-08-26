import json
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import desc, asc, or_, and_, func

from backend.database.database import get_db
from backend.models import AuditLog, User, UserRole
from backend.schemas import (
    AuditLogResponse, ClientActivityLogRequest,
    ActivityPaginationResponse, AdminActivityStatsResponse
)
from backend.utils.security import get_current_user, require_admin
from backend.services.audit_service import log_audit_event, sanitize_metadata

router = APIRouter(prefix="/api/activity", tags=["Activity"])
admin_router = APIRouter(prefix="/api/admin/activity", tags=["Admin Activity"])

def _to_audit_response(log: AuditLog) -> AuditLogResponse:
    meta = {}
    if log.metadata_json:
        try:
            meta = json.loads(log.metadata_json)
        except Exception:
            meta = {}

    return AuditLogResponse(
        id=log.id,
        event_id=log.event_id,
        actor_uid=log.actor_uid,
        actor_email=log.actor_email,
        actor_name=log.actor_name,
        action=log.action,
        category=log.category,
        resource_type=log.resource_type,
        resource_id=log.resource_id,
        classroom_id=log.classroom_id,
        outcome=log.outcome,
        source=log.source,
        trust_level=log.trust_level,
        request_id=log.request_id,
        metadata=meta,
        created_at=log.created_at
    )

# ------------------------------------------------------------------
# USER ACTIVITY ENDPOINTS (Self-Only Access)
# ------------------------------------------------------------------

@router.get("", response_model=ActivityPaginationResponse)
@router.get("/", response_model=ActivityPaginationResponse, include_in_schema=False)
def get_user_activity(
    category: Optional[str] = Query(None, description="Filter by category"),
    action: Optional[str] = Query(None, description="Filter by action name"),
    outcome: Optional[str] = Query(None, description="Filter by outcome (success/failure/denied)"),
    time_range: Optional[str] = Query("all", description="today, 7d, 30d, all"),
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    page_size: int = Query(25, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Retrieve sanitized activity history strictly for the authenticated user.
    Never exposes other users' actions or sensitive payload data.
    """
    # Strict filter: user can ONLY see their own events
    user_identifiers = [
        current_user.email,
        str(current_user.id),
        f"user_{current_user.id}",
        current_user.username
    ]
    
    query = db.query(AuditLog).filter(
        or_(
            AuditLog.actor_uid.in_(user_identifiers),
            AuditLog.actor_email == current_user.email
        )
    )

    if category and category.lower() != "all":
        query = query.filter(AuditLog.category == category.lower())
        
    if action:
        query = query.filter(AuditLog.action == action)
        
    if outcome and outcome.lower() != "all":
        query = query.filter(AuditLog.outcome == outcome.lower())

    now = datetime.now(timezone.utc).replace(tzinfo=None)
    if time_range == "today":
        start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)
        query = query.filter(AuditLog.created_at >= start_of_day)
    elif time_range == "7d":
        query = query.filter(AuditLog.created_at >= now - timedelta(days=7))
    elif time_range == "30d":
        query = query.filter(AuditLog.created_at >= now - timedelta(days=30))

    total_count = query.count()
    total_pages = max(1, (total_count + page_size - 1) // page_size)
    offset = (page - 1) * page_size

    logs = query.order_by(desc(AuditLog.created_at)).offset(offset).limit(page_size).all()
    events = [_to_audit_response(l) for l in logs]

    return ActivityPaginationResponse(
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=page < total_pages,
        events=events
    )

@router.post("/log", response_model=AuditLogResponse, status_code=status.HTTP_201_CREATED)
def log_client_activity(
    req: ClientActivityLogRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Record safe client-reported actions (e.g. login, compiler run, AI assist interaction).
    UID is bound to verified token session and cannot be forged.
    """
    log_entry = log_audit_event(
        actor_uid=current_user.email or f"user_{current_user.id}",
        action=req.action,
        actor_email=current_user.email,
        actor_name=current_user.full_name or current_user.username,
        category=req.category,
        resource_type=req.resource_type,
        resource_id=req.resource_id,
        classroom_id=req.classroom_id,
        outcome=req.outcome or "success",
        source="verified-client-event",
        trust_level="client-reported",
        metadata=req.metadata,
        db=db
    )

    if not log_entry:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not record audit event."
        )

    return _to_audit_response(log_entry)

# ------------------------------------------------------------------
# ADMIN AUDIT DASHBOARD ENDPOINTS (Admin-Only Access)
# ------------------------------------------------------------------

@admin_router.get("", response_model=ActivityPaginationResponse)
@admin_router.get("/", response_model=ActivityPaginationResponse, include_in_schema=False)
def get_admin_activity(
    search: Optional[str] = Query(None, description="Search query by actor, email, action, resource"),
    actor_uid: Optional[str] = Query(None, description="Filter by specific Actor UID"),
    category: Optional[str] = Query(None, description="Filter by category"),
    action: Optional[str] = Query(None, description="Filter by action"),
    outcome: Optional[str] = Query(None, description="Filter by outcome (success/failure/denied)"),
    sort_order: str = Query("desc", description="desc or asc"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(25, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """
    Admin-only activity investigation interface with global search and filtering.
    Requires server-verified Administrator privileges.
    """
    query = db.query(AuditLog)

    if search:
        search_pattern = f"%{search.strip()}%"
        query = query.filter(
            or_(
                AuditLog.actor_name.ilike(search_pattern),
                AuditLog.actor_email.ilike(search_pattern),
                AuditLog.actor_uid.ilike(search_pattern),
                AuditLog.action.ilike(search_pattern),
                AuditLog.resource_id.ilike(search_pattern),
                AuditLog.classroom_id.ilike(search_pattern),
                AuditLog.request_id.ilike(search_pattern)
            )
        )

    if actor_uid:
        query = query.filter(AuditLog.actor_uid == actor_uid)

    if category and category.lower() != "all":
        query = query.filter(AuditLog.category == category.lower())

    if action:
        query = query.filter(AuditLog.action == action)

    if outcome and outcome.lower() != "all":
        query = query.filter(AuditLog.outcome == outcome.lower())

    total_count = query.count()
    total_pages = max(1, (total_count + page_size - 1) // page_size)
    offset = (page - 1) * page_size

    order_col = desc(AuditLog.created_at) if sort_order.lower() == "desc" else asc(AuditLog.created_at)
    logs = query.order_by(order_col).offset(offset).limit(page_size).all()
    events = [_to_audit_response(l) for l in logs]

    # Log admin inspection event
    log_audit_event(
        actor_uid=current_user.email or f"user_{current_user.id}",
        action="admin.audit_viewed",
        actor_email=current_user.email,
        actor_name=current_user.full_name or current_user.username,
        category="admin",
        outcome="success",
        source="server",
        trust_level="server-verified",
        metadata={"queried_page": page, "search": search},
        db=db
    )

    return ActivityPaginationResponse(
        total_count=total_count,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        has_next=page < total_pages,
        events=events
    )

@admin_router.get("/stats", response_model=AdminActivityStatsResponse)
def get_admin_activity_stats(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Get high-level audit and activity metrics for admin dashboard."""
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    start_of_day = now.replace(hour=0, minute=0, second=0, microsecond=0)

    total_events = db.query(AuditLog).count()
    events_today = db.query(AuditLog).filter(AuditLog.created_at >= start_of_day).count()
    
    unique_users = db.query(func.count(func.distinct(AuditLog.actor_uid))).scalar() or 0
    success_count = db.query(AuditLog).filter(AuditLog.outcome == "success").count()
    success_rate = (success_count / total_events * 100.0) if total_events > 0 else 100.0

    # Category counts
    cat_counts_raw = db.query(AuditLog.category, func.count(AuditLog.id)).group_by(AuditLog.category).all()
    category_counts = {cat: count for cat, count in cat_counts_raw}

    return AdminActivityStatsResponse(
        total_events=total_events,
        events_today=events_today,
        total_users_active=unique_users,
        success_rate_percent=round(success_rate, 1),
        category_counts=category_counts
    )
