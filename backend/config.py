import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
ROOT_DIR = BASE_DIR.parent
DATA_DIR = ROOT_DIR / "data"
DATA_DIR.mkdir(exist_ok=True)
CACHE_DIR = DATA_DIR / "execution_cache"
CACHE_DIR.mkdir(exist_ok=True)

# Database
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{DATA_DIR / 'codevault.db'}")

# Security
SECRET_KEY = os.getenv("SECRET_KEY", "codevault-pro-super-secure-production-key-2026-xyz-88392")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

# Execution Sandbox Defaults
EXECUTION_TIMEOUT_SECONDS = int(os.getenv("EXECUTION_TIMEOUT_SECONDS", "5"))
EXECUTION_MAX_OUTPUT_BYTES = int(os.getenv("EXECUTION_MAX_OUTPUT_BYTES", "1048576")) # 1 MB
EXECUTION_MAX_MEMORY_MB = int(os.getenv("EXECUTION_MAX_MEMORY_MB", "256"))

# AI Assist
AI_PROVIDER = os.getenv("AI_PROVIDER", "nvidia")
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "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")
NVIDIA_BASE_URL = os.getenv("NVIDIA_BASE_URL", "https://integrate.api.nvidia.com/v1")
NVIDIA_MODEL = os.getenv("NVIDIA_MODEL", "nvidia/nemotron-3.5-lightning-30b-a3b")
NVIDIA_REASONING_BUDGET = int(os.getenv("NVIDIA_REASONING_BUDGET", "16384"))
NVIDIA_ENABLE_THINKING = os.getenv("NVIDIA_ENABLE_THINKING", "true").lower() == "true"
NVIDIA_TEMPERATURE = float(os.getenv("NVIDIA_TEMPERATURE", "0.7"))
NVIDIA_TOP_P = float(os.getenv("NVIDIA_TOP_P", "0.95"))
NVIDIA_MAX_TOKENS = int(os.getenv("NVIDIA_MAX_TOKENS", "16384"))
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

# CORS
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "*"
]
