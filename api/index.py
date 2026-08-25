"""
CodeVault Pro - Vercel Serverless Python / FastAPI Entrypoint
Exports the primary FastAPI application from backend.main for Vercel deployment.
"""
import sys
import os

# Ensure project root is in sys.path for serverless execution
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.dirname(CURRENT_DIR)
if PROJECT_ROOT not in sys.path:
    sys.path.insert(0, PROJECT_ROOT)

from backend.main import app  # noqa: E402

# Export FastAPI instance for Vercel ASGI runtime
app = app
