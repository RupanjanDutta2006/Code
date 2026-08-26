import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from backend.database.database import Base, get_db
from backend.models import User, UserRole, AuditLog
from backend.services.audit_service import log_audit_event, sanitize_metadata
from backend.utils.security import get_password_hash, create_access_token
from backend.main import app

# Test database
SQLALCHEMY_DATABASE_URL = "sqlite:///./test_audit.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_audit_test_environment():
    app.dependency_overrides[get_db] = override_get_db
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    db.query(AuditLog).delete()
    db.query(User).delete()
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)
    app.dependency_overrides.pop(get_db, None)

def create_test_user(db, username, email, role=UserRole.USER):
    user = User(
        username=username,
        email=email,
        hashed_password=get_password_hash("testpassword123"),
        full_name=f"Full {username}",
        role=role
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def test_metadata_sanitization():
    raw_metadata = {
        "password": "secret_password_123",
        "id_token": "eyJhbGciOi...",
        "access_token": "token_abc",
        "source_code": "print('hello')",
        "prompt": "explain this code",
        "language": "python",
        "duration_ms": 120,
        "score": 100
    }
    clean = sanitize_metadata(raw_metadata)
    assert "password" not in clean
    assert "id_token" not in clean
    assert "access_token" not in clean
    assert "source_code" not in clean
    assert "prompt" not in clean
    assert clean["language"] == "python"
    assert clean["duration_ms"] == 120
    assert clean["score"] == 100

def test_user_activity_isolation():
    db = TestingSessionLocal()
    user1 = create_test_user(db, "alice", "alice@example.com", UserRole.USER)
    user2 = create_test_user(db, "bob", "bob@example.com", UserRole.USER)

    # Log events for both users
    log_audit_event(
        actor_uid=user1.email,
        action="compiler.run_completed",
        actor_email=user1.email,
        actor_name=user1.full_name,
        category="compiler",
        metadata={"language": "python"},
        db=db
    )
    log_audit_event(
        actor_uid=user2.email,
        action="compiler.run_completed",
        actor_email=user2.email,
        actor_name=user2.full_name,
        category="compiler",
        metadata={"language": "cpp"},
        db=db
    )
    db.close()

    # User 1 fetches activity
    token1 = create_access_token({"sub": "alice", "email": "alice@example.com"})
    res1 = client.get("/api/activity", headers={"Authorization": f"Bearer {token1}"})
    assert res1.status_code == 200
    data1 = res1.json()
    assert data1["total_count"] == 1
    assert data1["events"][0]["actor_email"] == "alice@example.com"
    assert data1["events"][0]["metadata"]["language"] == "python"

    # User 2 fetches activity
    token2 = create_access_token({"sub": "bob", "email": "bob@example.com"})
    res2 = client.get("/api/activity", headers={"Authorization": f"Bearer {token2}"})
    assert res2.status_code == 200
    data2 = res2.json()
    assert data2["total_count"] == 1
    assert data2["events"][0]["actor_email"] == "bob@example.com"
    assert data2["events"][0]["metadata"]["language"] == "cpp"

def test_client_activity_logging_endpoint():
    db = TestingSessionLocal()
    user = create_test_user(db, "charlie", "charlie@example.com", UserRole.USER)
    db.close()

    token = create_access_token({"sub": "charlie", "email": "charlie@example.com"})
    payload = {
        "action": "learning.lesson_started",
        "category": "learning",
        "metadata": {
            "lesson_slug": "c-basics",
            "password": "attempted_leak"  # Should be sanitized
        }
    }
    res = client.post("/api/activity/log", json=payload, headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 201
    data = res.json()
    assert data["actor_uid"] == "charlie@example.com"
    assert data["action"] == "learning.lesson_started"
    assert data["category"] == "learning"
    assert "password" not in data["metadata"]
    assert data["metadata"]["lesson_slug"] == "c-basics"

def test_admin_access_control():
    db = TestingSessionLocal()
    user = create_test_user(db, "normal_user", "normal@example.com", UserRole.USER)
    admin = create_test_user(db, "admin_user", "admin@example.com", UserRole.ADMIN)

    log_audit_event(
        actor_uid=user.email,
        action="auth.login_succeeded",
        actor_email=user.email,
        category="auth",
        db=db
    )
    db.close()

    # Normal user should receive 403 Forbidden
    normal_token = create_access_token({"sub": "normal_user", "email": "normal@example.com", "role": "USER"})
    res_forbidden = client.get("/api/admin/activity", headers={"Authorization": f"Bearer {normal_token}"})
    assert res_forbidden.status_code == 403

    # Admin user should receive 200 OK and global activity
    admin_token = create_access_token({"sub": "admin_user", "email": "admin@example.com", "role": "ADMIN"})
    res_admin = client.get("/api/admin/activity", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_admin.status_code == 200
    admin_data = res_admin.json()
    assert admin_data["total_count"] >= 1

    # Admin stats endpoint
    res_stats = client.get("/api/admin/activity/stats", headers={"Authorization": f"Bearer {admin_token}"})
    assert res_stats.status_code == 200
    stats_data = res_stats.json()
    assert stats_data["total_events"] >= 1
    assert "success_rate_percent" in stats_data
