import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent

# Check if running in serverless environment (e.g. Vercel)
IS_VERCEL = os.getenv("VERCEL", "0") == "1" or os.getenv("AWS_LAMBDA_FUNCTION_NAME") is not None
if IS_VERCEL:
    DATA_DIR = Path("/tmp") / "codevault_data"
else:
    DATA_DIR = ROOT_DIR / "data"

try:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_DIR = DATA_DIR / "execution_cache"
    CACHE_DIR.mkdir(parents=True, exist_ok=True)
except Exception:
    DATA_DIR = Path("/tmp") / "codevault_data"
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    CACHE_DIR = DATA_DIR / "execution_cache"
    CACHE_DIR.mkdir(parents=True, exist_ok=True)

def _get_int(key: str, default: int) -> int:
    val = os.getenv(key)
    if val is None or str(val).strip() == "":
        return default
    try:
        return int(val)
    except (ValueError, TypeError):
        return default

def _get_float(key: str, default: float) -> float:
    val = os.getenv(key)
    if val is None or str(val).strip() == "":
        return default
    try:
        return float(val)
    except (ValueError, TypeError):
        return default

def _get_str(key: str, default: str) -> str:
    val = os.getenv(key)
    if val is None or str(val).strip() == "":
        return default
    return str(val)

# Database
DATABASE_URL = _get_str("DATABASE_URL", f"sqlite:///{DATA_DIR / 'codevault.db'}")

# Security
SECRET_KEY = _get_str("SECRET_KEY", "codevault-pro-super-secure-production-key-2026-xyz-88392")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Execution Sandbox Defaults
EXECUTION_TIMEOUT_SECONDS = _get_int("EXECUTION_TIMEOUT_SECONDS", 5)
EXECUTION_MAX_OUTPUT_BYTES = _get_int("EXECUTION_MAX_OUTPUT_BYTES", 1048576) # 1 MB
EXECUTION_MAX_MEMORY_MB = _get_int("EXECUTION_MAX_MEMORY_MB", 256)

# AI Assist & Online NVIDIA Nemotron
AI_PROVIDER = _get_str("AI_PROVIDER", "nvidia")
NVIDIA_API_KEY = _get_str("NVIDIA_API_KEY", "")
NVIDIA_BASE_URL = _get_str("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
NVIDIA_MODEL = _get_str("NVIDIA_MODEL", "nvidia/llama-3.1-nemotron-70b-instruct")
NVIDIA_REASONING_BUDGET = _get_int("NVIDIA_REASONING_BUDGET", 16384)
NVIDIA_ENABLE_THINKING = _get_str("NVIDIA_ENABLE_THINKING", "true").lower() in ("true", "1", "yes")
NVIDIA_TEMPERATURE = _get_float("NVIDIA_TEMPERATURE", 0.7)
NVIDIA_TOP_P = _get_float("NVIDIA_TOP_P", 0.95)
NVIDIA_MAX_TOKENS = _get_int("NVIDIA_MAX_TOKENS", 16384)

GEMINI_API_KEY = _get_str("GEMINI_API_KEY", "")
OPENAI_API_KEY = _get_str("OPENAI_API_KEY", "")

# GitHub Official Authorization & App Connector (Server-Side ONLY)
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID", "")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET", "")
GITHUB_CALLBACK_URL = os.getenv("GITHUB_CALLBACK_URL", "http://localhost:8000/api/github/callback")
GITHUB_APP_NAME = os.getenv("GITHUB_APP_NAME", "CodeVault-Pro-Dev-Connector")
FRONTEND_DEV_URL = os.getenv("FRONTEND_DEV_URL", "http://localhost:5173/developer/github-connect")

# CORS
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]
