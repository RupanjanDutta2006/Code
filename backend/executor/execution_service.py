import os
import shutil
import tempfile
import uuid
from pathlib import Path
from typing import Optional, AsyncGenerator
from sqlalchemy.orm import Session
from backend.config import DATA_DIR, EXECUTION_TIMEOUT_SECONDS, EXECUTION_MAX_MEMORY_MB, EXECUTION_MAX_OUTPUT_BYTES
from backend.executor.registry import runner_registry
from backend.executor.runner_interface import RunResult, ResourceLimits
from backend.services.hash_service import compute_cache_key, compute_content_hash
from backend.models import ExecutionCache

SANDBOX_ROOT = DATA_DIR / "sandboxes"
SANDBOX_ROOT.mkdir(exist_ok=True)

class ExecutionService:
    @staticmethod
    def execute(
        language: str,
        source_code: str,
        custom_input: str = "",
        db: Optional[Session] = None,
        timeout: Optional[int] = None,
        use_cache: bool = True
    ) -> RunResult:
        runner = runner_registry.get(language)
        if not runner:
            return RunResult(
                status="error",
                output="",
                error=f"Unsupported language '{language}'. Supported: {', '.join(runner_registry.supported_languages())}"
            )

        # Check Cache
        cache_key = compute_cache_key(language, source_code, custom_input)
        if use_cache and db:
            cached_entry = db.query(ExecutionCache).filter(ExecutionCache.cache_key == cache_key).first()
            if cached_entry:
                return RunResult(
                    status=cached_entry.status,
                    output=cached_entry.output,
                    execution_time_ms=cached_entry.execution_time_ms
                )

        run_id = str(uuid.uuid4())
        work_dir = SANDBOX_ROOT / run_id
        work_dir.mkdir(parents=True, exist_ok=True)

        limits = ResourceLimits(
            timeout_seconds=timeout or EXECUTION_TIMEOUT_SECONDS,
            max_memory_mb=EXECUTION_MAX_MEMORY_MB,
            max_output_bytes=EXECUTION_MAX_OUTPUT_BYTES
        )

        try:
            target = source_code
            if runner.is_compiled():
                compile_res = runner.compile(source_code, work_dir)
                if not compile_res or not compile_res.success:
                    return RunResult(
                        status="error",
                        output="",
                        error=compile_res.output if compile_res else "Compilation failed."
                    )
                target = compile_res.artifact_path

            result = runner.run(target, custom_input, work_dir, limits)

            # Store in cache if successful
            if use_cache and db and result.status == "success":
                try:
                    source_hash = compute_content_hash(source_code)
                    new_cache = ExecutionCache(
                        cache_key=cache_key,
                        language=language.lower(),
                        source_hash=source_hash,
                        status=result.status,
                        output=result.output,
                        execution_time_ms=result.execution_time_ms
                    )
                    db.add(new_cache)
                    db.commit()
                except Exception:
                    db.rollback()

            return result

        finally:
            # Clean up sandbox
            try:
                if work_dir.exists():
                    shutil.rmtree(work_dir, ignore_errors=True)
            except Exception:
                pass

execution_service = ExecutionService()
