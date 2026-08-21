import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.config import ALLOWED_ORIGINS
from backend.database.database import engine, Base
from backend.database.seed import seed_database
from backend.api import (
    auth, programs, import_folder, execution, versions, judge,
    classrooms, analytics, playground, ai_assist
)
from backend.websockets import execution_ws, playground_ws

# Initialize Tables
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: seed database
    seed_database()
    yield
    # Shutdown logic if any

app = FastAPI(
    title="CodeVault Pro API",
    description="Full-stack student code library, compiler, judge, and classroom platform",
    version="2.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
