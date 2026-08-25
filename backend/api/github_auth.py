from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import RedirectResponse
from pydantic import BaseModel
from typing import Optional, Dict, Any
from backend.services.github_service import GitHubService
from backend.config import FRONTEND_DEV_URL

router = APIRouter(prefix="/api/github", tags=["Developer GitHub Authorization"])

class SelectRepoRequest(BaseModel):
    role: str
    repo_full_name: str

class DisconnectRequest(BaseModel):
    role: str

@router.get("/status")
def get_github_status():
    """Returns safe connection state for Main and Contributor repositories."""
    return GitHubService.get_status()

@router.get("/auth-url")
def get_auth_url(role: str = Query("main", pattern="^(main|contributor)$")):
    """Generates official GitHub OAuth authorization URL with CSRF protection."""
    try:
        return GitHubService.create_auth_url(role=role)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/callback")
async def github_callback(code: Optional[str] = None, state: Optional[str] = None, error: Optional[str] = None, error_description: Optional[str] = None):
    """Handles GitHub official redirect callback, exchanges code, and redirects to developer page."""
    if error:
        return RedirectResponse(
            url=f"{FRONTEND_DEV_URL}?status=error&message={error_description or error}",
            status_code=302
        )
    
    if not code or not state:
        return RedirectResponse(
            url=f"{FRONTEND_DEV_URL}?status=error&message=Missing+code+or+state+parameter",
            status_code=302
        )

    try:
        result = await GitHubService.handle_callback(code=code, state=state)
        return RedirectResponse(url=result["redirect_url"], status_code=302)
    except Exception as e:
        return RedirectResponse(
            url=f"{FRONTEND_DEV_URL}?status=error&message={str(e).replace(' ', '+')}",
            status_code=302
        )

@router.post("/select-repo")
def select_repository(req: SelectRepoRequest):
    """Sets the chosen repository for Main or Contributor role."""
    try:
        return GitHubService.select_repo(role=req.role, repo_full_name=req.repo_full_name)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/disconnect")
def disconnect_repository(req: DisconnectRequest):
    """Disconnects either Main or Contributor repository session."""
    return GitHubService.disconnect(role=req.role)

@router.get("/test-connection")
async def test_connection(role: str = Query("main", pattern="^(main|contributor)$")):
    """Validates server-side GitHub API communication for the selected repository."""
    return await GitHubService.test_connection(role=role)
