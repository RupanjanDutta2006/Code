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
        # Check query string for :match param e.g. ?match=classrooms or ?0=classrooms
        match_param = request.query_params.get("match") or request.query_params.get("0") or request.query_params.get("1")
        if match_param:
            clean_match = match_param.lstrip("/")
            request.scope["path"] = f"/api/{clean_match}"
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

@app.get("/")
def root():
    return {
        "app": "CodeVault Pro API",
        "status": "online",
        "version": "2.0.0",
        "docs": "/docs"
    }
