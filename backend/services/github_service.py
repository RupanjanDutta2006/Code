import os
import json
import secrets
import time
import httpx
from typing import Dict, Any, Optional, List
from pathlib import Path
from backend.config import (
    GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET,
    GITHUB_CALLBACK_URL,
    FRONTEND_DEV_URL,
    DATA_DIR
)

CONNECTIONS_FILE = DATA_DIR / "github_connections.json"
TOKENS_FILE = DATA_DIR / "github_tokens.json"

# In-memory store for CSRF state nonces (nonce -> {role, created_at})
_OAUTH_STATES: Dict[str, Dict[str, Any]] = {}

def _cleanup_expired_states():
    now = time.time()
    expired = [s for s, data in _OAUTH_STATES.items() if now - data.get("created_at", 0) > 600]
    for s in expired:
        _OAUTH_STATES.pop(s, None)

def _load_connections() -> Dict[str, Any]:
    if not CONNECTIONS_FILE.exists():
        return {
            "main": {"connected": False, "role": "main"},
            "contributor": {"connected": False, "role": "contributor"}
        }
    try:
        with open(CONNECTIONS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {
            "main": {"connected": False, "role": "main"},
            "contributor": {"connected": False, "role": "contributor"}
        }

def _save_connections(data: Dict[str, Any]):
    with open(CONNECTIONS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

def _load_tokens() -> Dict[str, str]:
    if not TOKENS_FILE.exists():
        return {}
    try:
        with open(TOKENS_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {}

def _save_tokens(tokens: Dict[str, str]):
    with open(TOKENS_FILE, "w", encoding="utf-8") as f:
        json.dump(tokens, f, indent=2)

class GitHubService:
    @staticmethod
    def get_status() -> Dict[str, Any]:
        """Returns safe connection state for both repositories (No secret tokens exposed)."""
        connections = _load_connections()
        is_configured = bool(GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET)
        
        return {
            "configured": is_configured,
            "client_id_configured": bool(GITHUB_CLIENT_ID),
            "callback_url": GITHUB_CALLBACK_URL,
            "main": connections.get("main", {"connected": False, "role": "main"}),
            "contributor": connections.get("contributor", {"connected": False, "role": "contributor"}),
            "permissions_requested": [
                "Contents: Read & Write (code inspection, PRs, diff fixes)",
                "Pull Requests: Read & Write (collaborative contributor flow)",
                "User: Read (identify account & verify repo ownership)"
            ]
        }

    @staticmethod
    def create_auth_url(role: str) -> Dict[str, str]:
        """Generates secure official GitHub OAuth / App install URL with CSRF state."""
        if not GITHUB_CLIENT_ID:
            raise ValueError("GITHUB_CLIENT_ID is not configured in server environment.")
        
        _cleanup_expired_states()
        state_nonce = secrets.token_urlsafe(32)
        _OAUTH_STATES[state_nonce] = {
            "role": "contributor" if role == "contributor" else "main",
            "created_at": time.time()
        }

        # Request official GitHub authorization with minimum practical scope: repo + read:user
        # The user authenticates directly on official github.com
        scope = "repo read:user"
        auth_url = (
            f"https://github.com/login/oauth/authorize"
            f"?client_id={GITHUB_CLIENT_ID}"
            f"&redirect_uri={GITHUB_CALLBACK_URL}"
            f"&scope={scope}"
            f"&state={state_nonce}"
            f"&allow_signup=false"
        )
        return {"url": auth_url, "state": state_nonce, "role": role}

    @staticmethod
    async def handle_callback(code: str, state: str) -> Dict[str, Any]:
        """Exchanges authorization code for access token and fetches selected repo metadata."""
        _cleanup_expired_states()
        state_data = _OAUTH_STATES.pop(state, None)
        if not state_data:
            raise ValueError("Invalid or expired OAuth state nonce. Please retry authorization.")
        
        role = state_data.get("role", "main")

        # 1. Exchange code for access token via official GitHub OAuth endpoint
        async with httpx.AsyncClient(timeout=20.0) as client:
            token_resp = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                data={
                    "client_id": GITHUB_CLIENT_ID,
                    "client_secret": GITHUB_CLIENT_SECRET,
                    "code": code,
                    "redirect_uri": GITHUB_CALLBACK_URL,
                }
            )

            if token_resp.status_code != 200:
                raise ValueError("Failed to retrieve access token from GitHub.")

            token_json = token_resp.json()
            access_token = token_json.get("access_token")
            if not access_token:
                err_desc = token_json.get("error_description", "Unknown error from GitHub OAuth")
                raise ValueError(f"GitHub OAuth error: {err_desc}")

            # 2. Fetch authenticated user profile
            user_resp = await client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json"
                }
            )
            if user_resp.status_code != 200:
                raise ValueError("Failed to retrieve user profile from GitHub API.")
            
            user_data = user_resp.json()
            username = user_data.get("login", "")

            # 3. Fetch user repositories (to identify CodeVault repo)
            repos_resp = await client.get(
                "https://api.github.com/user/repos?sort=updated&per_page=30",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github+json"
                }
            )
            repos = repos_resp.json() if repos_resp.status_code == 200 else []

            # Match repository with name 'Code' or 'CodeVault' or pick top repo
            selected_repo = None
            for r in repos:
                r_name = r.get("name", "").lower()
                if r_name in ["code", "codevault", "codevault-pro", "code_vault_pro"]:
                    selected_repo = r
                    break
            
            if not selected_repo and repos:
                selected_repo = repos[0]

            repo_full_name = selected_repo.get("full_name") if selected_repo else f"{username}/Code"
            repo_id = selected_repo.get("id") if selected_repo else 0
            default_branch = selected_repo.get("default_branch", "main") if selected_repo else "main"
            permissions = selected_repo.get("permissions", {"push": True, "pull": True, "admin": False}) if selected_repo else {"push": True, "pull": True}

            # 4. Save tokens server-side only
            tokens = _load_tokens()
            tokens[role] = access_token
            _save_tokens(tokens)

            # 5. Save safe connection metadata
            connections = _load_connections()
            connections[role] = {
                "connected": True,
                "role": role,
                "username": username,
                "avatar_url": user_data.get("avatar_url", ""),
                "full_name": repo_full_name,
                "repository_name": selected_repo.get("name", "Code") if selected_repo else "Code",
                "repository_id": repo_id,
                "default_branch": default_branch,
                "permissions": {
                    "push": permissions.get("push", True),
                    "pull": permissions.get("pull", True),
                    "admin": permissions.get("admin", False)
                },
                "connected_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
                "available_repos": [
                    {"id": r.get("id"), "full_name": r.get("full_name"), "name": r.get("name"), "private": r.get("private")}
                    for r in repos[:15]
                ]
            }
            _save_connections(connections)

            return {
                "role": role,
                "username": username,
                "repository": repo_full_name,
                "redirect_url": f"{FRONTEND_DEV_URL}?status=connected&role={role}&repo={repo_full_name}"
            }

    @staticmethod
    def select_repo(role: str, repo_full_name: str) -> Dict[str, Any]:
        """Allows selecting a specific repository from the authorized account."""
        connections = _load_connections()
        target = connections.get(role)
        if not target or not target.get("connected"):
            raise ValueError(f"No active connection found for {role} repository.")

        target["full_name"] = repo_full_name
        target["repository_name"] = repo_full_name.split("/")[-1] if "/" in repo_full_name else repo_full_name
        _save_connections(connections)
        return target

    @staticmethod
    def disconnect(role: str) -> Dict[str, Any]:
        """Revokes local server-side session and clears connection metadata."""
        tokens = _load_tokens()
        tokens.pop(role, None)
        _save_tokens(tokens)

        connections = _load_connections()
        connections[role] = {
            "connected": False,
            "role": role
        }
        _save_connections(connections)
        return {"status": "disconnected", "role": role}

    @staticmethod
    async def test_connection(role: str) -> Dict[str, Any]:
        """Verifies API access to the selected repository using server-side token."""
        tokens = _load_tokens()
        token = tokens.get(role)
        if not token:
            return {"valid": False, "message": "No server-side token configured."}

        connections = _load_connections()
        repo = connections.get(role, {}).get("full_name", "")
        if not repo:
            return {"valid": False, "message": "No repository selected."}

        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.get(
                f"https://api.github.com/repos/{repo}",
                headers={
                    "Authorization": f"Bearer {token}",
                    "Accept": "application/vnd.github+json"
                }
            )
            if resp.status_code == 200:
                data = resp.json()
                return {
                    "valid": True,
                    "repository": data.get("full_name"),
                    "private": data.get("private"),
                    "default_branch": data.get("default_branch"),
                    "open_issues_count": data.get("open_issues_count"),
                    "permissions": data.get("permissions")
                }
            else:
                return {
                    "valid": False,
                    "status_code": resp.status_code,
                    "message": "GitHub API rejected token or repository not accessible."
                }
