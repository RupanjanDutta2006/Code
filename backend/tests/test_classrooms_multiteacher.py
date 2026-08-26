import pytest
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)

def get_auth_token(username: str = "teacher_test", role: str = "TEACHER") -> tuple[str, int]:
    email = f"{username}@test.edu"
    password = "password123"
    # Try login first, or register
    login_res = client.post("/api/auth/login", json={"username_or_email": username, "password": password})
    if login_res.status_code == 200:
        data = login_res.json()
        return data["access_token"], data["user"]["id"]
    
    reg_res = client.post("/api/auth/register", json={
        "username": username,
        "email": email,
        "password": password,
        "full_name": f"User {username}",
        "role": role
    })
    data = reg_res.json()
    return data["access_token"], data["user"]["id"]

def test_multiteacher_classroom_lifecycle():
    # 1. Teacher A creates Class A
    teacher_a_token, teacher_a_id = get_auth_token("prof_souvik", "TEACHER")
    create_res = client.post(
        "/api/classrooms",
        json={
            "name": "Data Structures & Algorithms",
            "subject": "DSA",
            "description": "Comprehensive DSA classroom",
            "section": "Sec-A",
            "academic_level": "Undergraduate"
        },
        headers={"Authorization": f"Bearer {teacher_a_token}"}
    )
    assert create_res.status_code == 201
    class_a = create_res.json()
    class_a_id = class_a["id"]
    invite_key_a = class_a["invite_code"]
    assert invite_key_a.startswith("DSA")
    assert class_a["is_teacher"] is True

    # 2. Teacher B creates Class B (Multi-Teacher)
    teacher_b_token, teacher_b_id = get_auth_token("prof_rupanjan", "TEACHER")
    create_res_b = client.post(
        "/api/classrooms",
        json={
            "name": "Advanced Python & AI",
            "subject": "PYTHON",
            "description": "Python scripts and deep learning foundations"
        },
        headers={"Authorization": f"Bearer {teacher_b_token}"}
    )
    assert create_res_b.status_code == 201
    class_b = create_res_b.json()
    class_b_id = class_b["id"]
    invite_key_b = class_b["invite_code"]
    assert invite_key_b.startswith("PY")

    # 3. Student joins Class A with correct key
    student_token, student_id = get_auth_token("student_rohit", "USER")
    join_res = client.post(
        "/api/classrooms/join",
        json={"invite_code": invite_key_a},
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert join_res.status_code == 200
    assert join_res.json()["id"] == class_a_id

    # 4. Student joins Class B (Multi-Class Membership)
    join_res_b = client.post(
        "/api/classrooms/join",
        json={"invite_code": invite_key_b},
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert join_res_b.status_code == 200
    assert join_res_b.json()["id"] == class_b_id

    # 5. Persistent Membership check (Student lists classrooms)
    list_res = client.get("/api/classrooms", headers={"Authorization": f"Bearer {student_token}"})
    assert list_res.status_code == 200
    student_classes = list_res.json()
    student_class_ids = [c["id"] for c in student_classes]
    assert class_a_id in student_class_ids
    assert class_b_id in student_class_ids

    # 6. Duplicate Join Check (Idempotent)
    dup_join = client.post(
        "/api/classrooms/join",
        json={"invite_code": invite_key_a},
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert dup_join.status_code == 200
    assert dup_join.json()["id"] == class_a_id

    # 7. Invalid Access Key
    bad_key_res = client.post(
        "/api/classrooms/join",
        json={"invite_code": "INVALID-9999"},
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert bad_key_res.status_code == 404

    # 8. Teacher A uploads Notes and Code Resources
    note_res = client.post(
        f"/api/classrooms/{class_a_id}/resources",
        json={
            "resource_type": "note",
            "title": "Trees and Binary Search Trees",
            "description": "Properties and AVL balance factors",
            "category": "Lecture Notes",
            "file_url": "https://mega.nz/folder/example-dsa-notes"
        },
        headers={"Authorization": f"Bearer {teacher_a_token}"}
    )
    assert note_res.status_code == 201
    note_id = note_res.json()["id"]

    code_res = client.post(
        f"/api/classrooms/{class_a_id}/resources",
        json={
            "resource_type": "code",
            "title": "BST Insertion & Inorder Traversal",
            "description": "Clean C++ implementation",
            "category": "Sample Code",
            "language": "cpp",
            "source_code": "#include <iostream>\nint main() { std::cout << \"BST\"; return 0; }"
        },
        headers={"Authorization": f"Bearer {teacher_a_token}"}
    )
    assert code_res.status_code == 201
    code_resource_id = code_res.json()["id"]

    # 9. Enrolled student can access Class A resources
    stu_res_list = client.get(
        f"/api/classrooms/{class_a_id}/resources",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert stu_res_list.status_code == 200
    assert len(stu_res_list.json()) >= 2

    # 10. Non-member access is rejected (IDOR test)
    unauthorized_token, _ = get_auth_token("outsider_user", "USER")
    unauth_res = client.get(
        f"/api/classrooms/{class_a_id}/resources",
        headers={"Authorization": f"Bearer {unauthorized_token}"}
    )
    assert unauth_res.status_code == 403

    # 11. Teacher posts Announcement
    ann_res = client.post(
        f"/api/classrooms/{class_a_id}/announcements",
        json={
            "title": "Midterm Lab Quiz Announcement",
            "content": "DSA Lab quiz will be conducted tomorrow at 10 AM.",
            "is_pinned": True
        },
        headers={"Authorization": f"Bearer {teacher_a_token}"}
    )
    assert ann_res.status_code == 201

    # 12. Student views announcements
    ann_list = client.get(
        f"/api/classrooms/{class_a_id}/announcements",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert ann_list.status_code == 200
    assert len(ann_list.json()) >= 1
    assert ann_list.json()[0]["is_pinned"] is True

    # 13. Teacher creates Assignment
    assign_res = client.post(
        f"/api/classrooms/{class_a_id}/assign",
        json={
            "title": "Implement Dijkstra Shortest Path",
            "description": "Find shortest path from source vertex.",
            "instructions": "Use priority queue in C++ or heapq in Python.",
            "starter_language": "cpp",
            "starter_code": "// starter code\n#include <iostream>\n",
            "max_score": 100
        },
        headers={"Authorization": f"Bearer {teacher_a_token}"}
    )
    assert assign_res.status_code == 200
    assignment_id = assign_res.json()["id"]

    # 14. Student submits assignment solution
    submit_res = client.post(
        f"/api/classrooms/{class_a_id}/assignments/{assignment_id}/submit",
        json={
            "source_code": "#include <iostream>\nint main(){ return 0; }",
            "language": "cpp",
            "notes": "Solved using adjacency list."
        },
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert submit_res.status_code == 201

    # 15. Key Rotation: Teacher A rotates access key
    rotate_res = client.post(
        f"/api/classrooms/{class_a_id}/key/regenerate",
        headers={"Authorization": f"Bearer {teacher_a_token}"}
    )
    assert rotate_res.status_code == 200
    new_key_a = rotate_res.json()["invite_code"]
    assert new_key_a != invite_key_a

    # Old key is rejected for new joiners
    new_student_token, _ = get_auth_token("new_student_priya", "USER")
    old_join_fail = client.post(
        "/api/classrooms/join",
        json={"invite_code": invite_key_a},
        headers={"Authorization": f"Bearer {new_student_token}"}
    )
    assert old_join_fail.status_code == 404

    # New key succeeds for new joiner
    new_join_ok = client.post(
        "/api/classrooms/join",
        json={"invite_code": new_key_a},
        headers={"Authorization": f"Bearer {new_student_token}"}
    )
    assert new_join_ok.status_code == 200

    # Existing student B still has full access (not removed by key rotation)
    check_access = client.get(
        f"/api/classrooms/{class_a_id}",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert check_access.status_code == 200

    # 16. Member Management: Teacher views roster and removes a student
    members_res = client.get(
        f"/api/classrooms/{class_a_id}/members",
        headers={"Authorization": f"Bearer {teacher_a_token}"}
    )
    assert members_res.status_code == 200
    assert len(members_res.json()) >= 2

    remove_res = client.delete(
        f"/api/classrooms/{class_a_id}/members/{student_id}",
        headers={"Authorization": f"Bearer {teacher_a_token}"}
    )
    assert remove_res.status_code == 200

    # Removed student immediately loses access
    revoked_access = client.get(
        f"/api/classrooms/{class_a_id}/resources",
        headers={"Authorization": f"Bearer {student_token}"}
    )
    assert revoked_access.status_code == 403
