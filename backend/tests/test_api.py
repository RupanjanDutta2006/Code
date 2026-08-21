import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.database.seed import seed_database

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_db():
    seed_database()

def test_root_endpoint():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_auth_login_teacher():
    response = client.post("/api/auth/login", json={
        "username_or_email": "prof_sharma",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" == "access_token" in data
    assert data["user"]["role"] == "TEACHER"

def test_auth_login_student():
    response = client.post("/api/auth/login", json={
        "username_or_email": "asha_r",
        "password": "password123"
    })
    assert response.status_code == 200
    data = response.json()
    assert data["user"]["role"] == "USER"

def test_list_programs():
    response = client.get("/api/programs")
    assert response.status_code == 200
    programs = response.json()
    assert len(programs) >= 4
    titles = [p["title"] for p in programs]
    assert "Binary Search" in titles

def test_execute_python_code():
    code = "print('Hello from CodeVault!')"
    response = client.post("/api/programs/execute", json={
        "language": "python",
        "source_code": code,
        "custom_input": ""
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "Hello from CodeVault!" in data["output"]

def test_execute_sql_code():
    code = """CREATE TABLE t (id INT, val TEXT);
INSERT INTO t VALUES (1, 'Alpha'), (2, 'Beta');
SELECT * FROM t;"""
    response = client.post("/api/programs/execute", json={
        "language": "sql",
        "source_code": code
    })
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert "Alpha" in data["output"]
    assert "Beta" in data["output"]

def test_judge_submission_passes():
    # Submit Binary Search code
    login_resp = client.post("/api/auth/login", json={
        "username_or_email": "asha_r",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]

    programs = client.get("/api/programs").json()
    bin_search = next(p for p in programs if p["title"] == "Binary Search")

    code = """import sys
def binary_search(arr, target):
    l, r = 0, len(arr) - 1
    while l <= r:
        m = (l + r) // 2
        if arr[m] == target: return m
        elif arr[m] < target: l = m + 1
        else: r = m - 1
    return -1

input_data = sys.stdin.read().split()
if input_data:
    n = int(input_data[0])
    arr = [int(x) for x in input_data[1:n+1]]
    t = int(input_data[n+1])
    res = binary_search(arr, t)
    print(f"Element found at index {res}" if res != -1 else "Element not found")
"""
    response = client.post(
        f"/api/programs/{bin_search['id']}/submit",
        json={"program_id": bin_search["id"], "source_code": code, "language": "python"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["passed_count"] == data["total_count"]
    assert data["verdict"] == "Accepted"

def test_classroom_leaderboard():
    login_resp = client.post("/api/auth/login", json={
        "username_or_email": "prof_sharma",
        "password": "password123"
    })
    token = login_resp.json()["access_token"]

    classes = client.get("/api/classrooms", headers={"Authorization": f"Bearer {token}"}).json()
    assert len(classes) >= 1
    class_id = classes[0]["id"]

    leaderboard = client.get(f"/api/classrooms/{class_id}/leaderboard", headers={"Authorization": f"Bearer {token}"}).json()
    assert len(leaderboard) >= 2
    student_names = [e["student_username"] for e in leaderboard]
    assert "asha_r" in student_names
