# pyrefly: ignore [missing-import]
from sqlalchemy import create_engine, text
# pyrefly: ignore [missing-import]
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.config import DATABASE_URL

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def sync_schema_columns():
    """Ensure newly added columns exist in existing SQLite database tables."""
    if "sqlite" not in DATABASE_URL:
        return
    with engine.connect() as conn:
        # Check and add columns for classrooms
        try:
            res = conn.execute(text("PRAGMA table_info(classrooms)")).fetchall()
            existing_cols = {row[1] for row in res}
            if existing_cols:
                if "subject" not in existing_cols:
                    conn.execute(text("ALTER TABLE classrooms ADD COLUMN subject VARCHAR(120)"))
                if "section" not in existing_cols:
                    conn.execute(text("ALTER TABLE classrooms ADD COLUMN section VARCHAR(64)"))
                if "academic_level" not in existing_cols:
                    conn.execute(text("ALTER TABLE classrooms ADD COLUMN academic_level VARCHAR(64)"))
                if "access_key_hash" not in existing_cols:
                    conn.execute(text("ALTER TABLE classrooms ADD COLUMN access_key_hash VARCHAR(64)"))
                if "joining_enabled" not in existing_cols:
                    conn.execute(text("ALTER TABLE classrooms ADD COLUMN joining_enabled BOOLEAN DEFAULT 1"))
                if "is_archived" not in existing_cols:
                    conn.execute(text("ALTER TABLE classrooms ADD COLUMN is_archived BOOLEAN DEFAULT 0"))
                if "updated_at" not in existing_cols:
                    conn.execute(text("ALTER TABLE classrooms ADD COLUMN updated_at DATETIME"))
        except Exception:
            pass

        # Check and add columns for classroom_members
        try:
            res = conn.execute(text("PRAGMA table_info(classroom_members)")).fetchall()
            existing_cols = {row[1] for row in res}
            if existing_cols and "role" not in existing_cols:
                conn.execute(text("ALTER TABLE classroom_members ADD COLUMN role VARCHAR(32) DEFAULT 'student'"))
        except Exception:
            pass

        # Check and add columns for classroom_assignments
        try:
            res = conn.execute(text("PRAGMA table_info(classroom_assignments)")).fetchall()
            existing_cols = {row[1] for row in res}
            if existing_cols:
                if "title" not in existing_cols:
                    conn.execute(text("ALTER TABLE classroom_assignments ADD COLUMN title VARCHAR(200)"))
                if "description" not in existing_cols:
                    conn.execute(text("ALTER TABLE classroom_assignments ADD COLUMN description TEXT"))
                if "instructions" not in existing_cols:
                    conn.execute(text("ALTER TABLE classroom_assignments ADD COLUMN instructions TEXT"))
                if "starter_code" not in existing_cols:
                    conn.execute(text("ALTER TABLE classroom_assignments ADD COLUMN starter_code TEXT"))
                if "starter_language" not in existing_cols:
                    conn.execute(text("ALTER TABLE classroom_assignments ADD COLUMN starter_language VARCHAR(32)"))
                if "max_score" not in existing_cols:
                    conn.execute(text("ALTER TABLE classroom_assignments ADD COLUMN max_score INTEGER DEFAULT 100"))
        except Exception:
            pass

        # Check and add columns for submissions
        try:
            res = conn.execute(text("PRAGMA table_info(submissions)")).fetchall()
            existing_cols = {row[1] for row in res}
            if existing_cols:
                if "assignment_id" not in existing_cols:
                    conn.execute(text("ALTER TABLE submissions ADD COLUMN assignment_id INTEGER"))
                if "score" not in existing_cols:
                    conn.execute(text("ALTER TABLE submissions ADD COLUMN score INTEGER DEFAULT 0"))
        except Exception:
            pass

        conn.commit()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

