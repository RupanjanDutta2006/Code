import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from backend.config import ALLOWED_ORIGINS
from backend.database.database import engine, Base, sync_schema_columns
from backend.database.seed import seed_database
from backend.api import (
    auth, programs, import_folder, execution, versions, judge,
    classrooms, analytics, playground, ai_assist, github_auth, activity
)
from backend.websockets import execution_ws, playground_ws

# Initialize Tables & migrate columns
Base.metadata.create_all(bind=engine)
sync_schema_columns()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: seed database
    sync_schema_columns()
    seed_database()
    yield
    # Shutdown logic if any

app = FastAPI(
    title="CodeVault Pro API",
    description="Full-stack student code library, compiler, judge, and classroom platform",
    version="2.0.0",
    lifespan=lifespan
)

# CORS: Allow Vercel, Render, Localhost, and custom domains
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.onrender\.com|http://localhost:\d+|http://127\.0\.0\.1:\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def normalize_vercel_api_paths(request, call_next):
    # Check headers for original requested path
    headers = request.headers
    candidates = [
        headers.get("x-matched-path"),
        headers.get("x-vercel-matched-path"),
        headers.get("x-forwarded-uri"),
        headers.get("x-original-url"),
        headers.get("x-rewrite-url"),
    ]
    
    matched = next((c for c in candidates if c and c.startswith("/api")), None)
    if matched:
        clean_path = matched.split("?")[0]
        request.scope["path"] = clean_path
    else:
        match_param = request.query_params.get("match") or request.query_params.get("0") or request.query_params.get("1")
        if match_param is not None:
            clean_match = str(match_param).strip().lstrip("/")
            request.scope["path"] = f"/api/{clean_match}" if clean_match else "/api"
        else:
            raw_path = request.scope.get("path", "")
            for prefix in ["/api/index.py", "/index.py", "/api/index"]:
                if raw_path.startswith(prefix) and len(raw_path) > len(prefix):
                    new_path = raw_path[len(prefix):]
                    if not new_path.startswith("/"):
                        new_path = "/" + new_path
                    if not new_path.startswith("/api") and new_path != "/":
                        new_path = "/api" + new_path
                    request.scope["path"] = new_path
                    break
            
    return await call_next(request)

@app.api_route("/api/debug-diag", methods=["GET", "POST"])
def debug_diag(request: Request):
    return {
        "scope_path": request.scope.get("path"),
        "raw_path": request.scope.get("raw_path", b"").decode("utf-8", errors="ignore"),
        "query_string": request.scope.get("query_string", b"").decode("utf-8", errors="ignore"),
        "query_params": dict(request.query_params),
        "headers": dict(request.headers),
    }

# Include REST Routers
app.include_router(auth.router)
app.include_router(programs.router)
app.include_router(import_folder.router)
app.include_router(execution.router)
app.include_router(versions.router)
app.include_router(judge.router)
app.include_router(classrooms.router)
app.include_router(analytics.router)
app.include_router(playground.router)
app.include_router(ai_assist.router)
app.include_router(github_auth.router)
app.include_router(activity.router)
app.include_router(activity.admin_router)

# Include WebSocket Routers
app.include_router(execution_ws.router)
app.include_router(playground_ws.router)

from pathlib import Path
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

# Resolve frontend build output directory
_BASE_DIR = Path(__file__).resolve().parent.parent
_DIST_DIR = _BASE_DIR / "dist"
if not _DIST_DIR.exists():
    _DIST_DIR = _BASE_DIR / "frontend" / "dist"

if _DIST_DIR.exists() and (_DIST_DIR / "assets").exists():
    app.mount("/assets", StaticFiles(directory=str(_DIST_DIR / "assets")), name="assets")

@app.get("/api", tags=["System"])
@app.get("/api/health", tags=["System"])
@app.get("/api/status", tags=["System"])
def api_health():
    return {
        "app": "CodeVault Pro API",
        "status": "online",
        "version": "2.0.0"
    }

@app.api_route("/{full_path:path}", methods=["GET", "HEAD"], include_in_schema=False)
def catch_all_spa_fallback(request: Request, full_path: str):
    """
    Fallback handler for single-page application routing.
    Serves static assets or index.html for all non-API paths.
    """
    accept = request.headers.get("accept", "")
    if full_path in ("", "api", "api/") and "application/json" in accept and "text/html" not in accept:
        return {
            "app": "CodeVault Pro API",
            "status": "online",
            "version": "2.0.0"
        }

    if _DIST_DIR.exists():
        target = _DIST_DIR / full_path
        if full_path and target.is_file():
            return FileResponse(str(target))
        
        index_file = _DIST_DIR / "index.html"
        if index_file.is_file():
            return FileResponse(str(index_file))

    return {
        "app": "CodeVault Pro API",
        "status": "online",
        "version": "2.0.0"
    }
