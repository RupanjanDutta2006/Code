import pytest
from fastapi.testclient import TestClient
from backend.main import app
from backend.services.github_service import GitHubService

client = TestClient(app)

def test_github_status():
    response = client.get("/api/github/status")
    assert response.status_code == 200
    data = response.json()
    assert "main" in data
    assert "contributor" in data
    assert "permissions_requested" in data
    assert "configured" in data
    assert data["main"]["role"] == "main"
    assert data["contributor"]["role"] == "contributor"

def test_github_auth_url_validation():
    # If GITHUB_CLIENT_ID is not configured, it returns 400 safely without crashing
    response = client.get("/api/github/auth-url?role=main")
    if not GitHubService.get_status()["client_id_configured"]:
        assert response.status_code == 400
        assert "GITHUB_CLIENT_ID" in response.json()["detail"]
    else:
        assert response.status_code == 200
        assert "url" in response.json()
        assert "github.com/login/oauth/authorize" in response.json()["url"]

def test_github_disconnect():
    response = client.post("/api/github/disconnect", json={"role": "contributor"})
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "disconnected"
    assert data["role"] == "contributor"
