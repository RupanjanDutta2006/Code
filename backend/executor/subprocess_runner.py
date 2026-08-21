import subprocess
import time
import os
import signal
from typing import List, Optional
from backend.executor.runner_interface import RunResult, ResourceLimits

def run_subprocess(
    cmd: List[str],
    cwd: str,
    stdin_data: str = "",
    limits: Optional[ResourceLimits] = None
) -> RunResult:
    """Executes a command securely with timeout, memory considerations, and output truncating."""
    if limits is None:
        limits = ResourceLimits()

    start_time = time.perf_counter()
    try:
        process = subprocess.Popen(
            cmd,
            cwd=cwd,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            encoding="utf-8",
            errors="replace",
            env={
                **os.environ,
                "PYTHONUNBUFFERED": "1",
                "PYTHONDONTWRITEBYTECODE": "1"
            }
        )

        try:
            stdout_data, stderr_data = process.communicate(
                input=stdin_data,
                timeout=limits.timeout_seconds
            )
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0

            # Cap output size
            if len(stdout_data) > limits.max_output_bytes:
                stdout_data = stdout_data[:limits.max_output_bytes] + "\n... [Output Truncated: Exceeded Maximum Buffer]"

            if process.returncode == 0:
                return RunResult(
                    status="success",
                    output=stdout_data,
                    error=stderr_data if stderr_data else None,
                    execution_time_ms=round(elapsed_ms, 2)
                )
            else:
                combined_err = f"{stderr_data}\n{stdout_data}".strip()
                return RunResult(
                    status="error",
                    output=stdout_data,
                    error=combined_err,
                    execution_time_ms=round(elapsed_ms, 2)
                )

        except subprocess.TimeoutExpired:
            # Kill process tree
            try:
                process.kill()
                process.communicate()
            except Exception:
                pass
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            return RunResult(
                status="timeout",
                output="",
                error=f"Time Limit Exceeded ({limits.timeout_seconds}s)",
                execution_time_ms=round(elapsed_ms, 2)
            )

    except Exception as e:
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        return RunResult(
            status="error",
            output="",
            error=str(e),
            execution_time_ms=round(elapsed_ms, 2)
        )
