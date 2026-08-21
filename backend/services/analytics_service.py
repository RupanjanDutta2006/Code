from datetime import datetime, timedelta
from typing import Dict, Any, List
from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.models import ProgramEvent, Program

def record_program_event(db: Session, program_id: int, event_type: str):
    """Logs view, run, or copy event for program analytics."""
    event = ProgramEvent(
        program_id=program_id,
        event_type=event_type,
        created_at=datetime.utcnow()
    )
    db.add(event)
    db.commit()

def get_program_analytics(db: Session, program_id: int) -> Dict[str, Any]:
    """Aggregates program statistics including total views, runs, copies, and 30-day activity trend."""
    program = db.query(Program).filter(Program.id == program_id).first()
    if not program:
        return None

    # Count total events
    views = db.query(ProgramEvent).filter(ProgramEvent.program_id == program_id, ProgramEvent.event_type == "view").count()
    runs = db.query(ProgramEvent).filter(ProgramEvent.program_id == program_id, ProgramEvent.event_type == "run").count()
    copies = db.query(ProgramEvent).filter(ProgramEvent.program_id == program_id, ProgramEvent.event_type == "copy").count()

    # Get last run time
    last_run_event = db.query(ProgramEvent).filter(
        ProgramEvent.program_id == program_id,
        ProgramEvent.event_type == "run"
    ).order_by(ProgramEvent.created_at.desc()).first()
    
    last_run_at = last_run_event.created_at if last_run_event else None

    # Compute 30-day trend
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    events_30 = db.query(
        func.date(ProgramEvent.created_at).label("day"),
        ProgramEvent.event_type,
        func.count(ProgramEvent.id).label("count")
    ).filter(
        ProgramEvent.program_id == program_id,
        ProgramEvent.created_at >= thirty_days_ago
    ).group_by(
        func.date(ProgramEvent.created_at),
        ProgramEvent.event_type
    ).all()

    # Organize days
    trend_dict = {}
    for i in range(30):
        day_date = (thirty_days_ago + timedelta(days=i+1)).strftime("%Y-%m-%d")
        trend_dict[day_date] = {"date": day_date, "views": 0, "runs": 0, "copies": 0}

    for row in events_30:
        day_str = str(row.day)
        if day_str in trend_dict:
            if row.event_type == "view":
                trend_dict[day_str]["views"] = row.count
            elif row.event_type == "run":
                trend_dict[day_str]["runs"] = row.count
            elif row.event_type == "copy":
                trend_dict[day_str]["copies"] = row.count

    trend_30_days = list(trend_dict.values())

    return {
        "program_id": program.id,
        "title": program.title,
        "views": views,
        "runs": runs,
        "copies": copies,
        "last_run_at": last_run_at,
        "trend_30_days": trend_30_days
    }
