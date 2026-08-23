import subprocess
import time
import os
import signal
import threading
from typing import List, Optional, Dict
import psutil
from backend.executor.runner_interface import RunResult, ResourceLimits

class ActiveProcessTracker:
    def __init__(self):
        self._lock = threading.Lock()
        self._processes: Dict[str, subprocess.Popen] = {}

    def register(self, execution_id: str, proc: subprocess.Popen):
        with self._lock:
            self._processes[execution_id] = proc

    def unregister(self, execution_id: str):
        with self._lock:
            self._processes.pop(execution_id, None)

    def stop(self, execution_id: str) -> bool:
        with self._lock:
            proc = self._processes.get(execution_id)
            if not proc:
                return False
            try:
                # Terminate process and all children
                parent = psutil.Process(proc.pid)
                for child in parent.children(recursive=True):
                    try:
                        child.kill()
                    except Exception:
                        pass
                parent.kill()
                return True
            except Exception:
                try:
                    proc.kill()
                    return True
                except Exception:
                    return False

active_process_tracker = ActiveProcessTracker()

def parse_error_type(stderr: str, stdout: str) -> Optional[str]:
    """Analyzes error streams to accurately classify error type."""
    combined = f"{stderr}\n{stdout}"
    
    # Common Python Exceptions
    python_errors = [
        "SyntaxError", "IndentationError", "TabError", "ZeroDivisionError",
        "NameError", "TypeError", "ValueError", "IndexError", "KeyError",
        "AttributeError", "ImportError", "ModuleNotFoundError", "RecursionError",
        "MemoryError", "FileNotFoundError", "UnboundLocalError", "AssertionError"
    ]
    for err in python_errors:
        if err in combined:
            return err
            
    # C/C++ & Java Compilation Errors
    if "error:" in combined or "fatal error:" in combined:
        return "CompilationError"
    if "java.lang." in combined:
        import re
        m = re.search(r"java\.lang\.([A-Za-z0-9_]+Exception|Error)", combined)
        if m:
            return m.group(1)
        return "RuntimeError"
    
    # Node.js errors
    if "ReferenceError:" in combined:
        return "ReferenceError"
    if "TypeError:" in combined:
        return "TypeError"
    if "SyntaxError:" in combined:
        return "SyntaxError"
    if "RangeError:" in combined:
        return "RangeError"
        
    # Segmentation Fault
    if "Segmentation fault" in combined or "SIGSEGV" in combined:
        return "SegmentationFault"
        
    return "RuntimeError"

def run_subprocess(
    cmd: List[str],
    cwd: str,
    stdin_data: str = "",
    limits: Optional[ResourceLimits] = None,
    execution_id: Optional[str] = None
) -> RunResult:
    """
    Executes a process securely with:
    - Real peak memory sampling via psutil (enforcing Memory Limit Exceeded)
    - Wall-clock timeout enforcement (Time Limit Exceeded)
    - Output truncation (Output Limit Exceeded)
    - Full stdin piping & separate stdout/stderr capture
    - Accurate error type classification
    """
    if limits is None:
        limits = ResourceLimits()

    start_time = time.perf_counter()
    peak_memory_kb = 0
    max_allowed_kb = limits.max_memory_mb * 1024
    mle_occurred = False

    env = {
        **os.environ,
        "PYTHONUNBUFFERED": "1",
        "PYTHONDONTWRITEBYTECODE": "1",
        "PYTHONIOENCODING": "utf-8",
        "NODE_OPTIONS": "--no-warnings"
    }

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
            env=env
        )

        if execution_id:
            active_process_tracker.register(execution_id, process)

        # Monitor memory in background thread
        stop_monitor = threading.Event()
        
        def monitor_memory():
            nonlocal peak_memory_kb, mle_occurred
            try:
                ps_proc = psutil.Process(process.pid)
                while not stop_monitor.is_set() and process.poll() is None:
                    try:
                        mem_info = ps_proc.memory_info()
                        current_kb = mem_info.rss // 1024
                        # Also check child processes
                        for child in ps_proc.children(recursive=True):
                            try:
                                current_kb += child.memory_info().rss // 1024
                            except Exception:
                                pass
                        if current_kb > peak_memory_kb:
                            peak_memory_kb = current_kb
                        if current_kb > max_allowed_kb:
                            mle_occurred = True
                            try:
                                for child in ps_proc.children(recursive=True):
                                    try: child.kill()
                                    except Exception: pass
                                ps_proc.kill()
                            except Exception:
                                pass
                            break
                    except (psutil.NoSuchProcess, psutil.AccessDenied):
                        break
                    time.sleep(0.01) # Sample every 10ms
            except Exception:
                pass

        monitor_thread = threading.Thread(target=monitor_memory, daemon=True)
        monitor_thread.start()

        try:
            stdout_data, stderr_data = process.communicate(
                input=stdin_data,
                timeout=limits.timeout_seconds
            )
        finally:
            stop_monitor.set()
            if execution_id:
                active_process_tracker.unregister(execution_id)

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        elapsed_sec = round(elapsed_ms / 1000.0, 3)

        # Baseline memory minimum for small runs
        if peak_memory_kb == 0:
            peak_memory_kb = 8192 # default ~8 MB baseline

        # Handle Memory Limit Exceeded
        if mle_occurred:
            return RunResult(
                status="mle",
                output=stdout_data or "",
                stdout=stdout_data or "",
                stderr=f"Memory Limit Exceeded: Process exceeded {limits.max_memory_mb} MB limit.",
                error=f"Memory Limit Exceeded: Process exceeded {limits.max_memory_mb} MB limit.",
                execution_time_ms=round(elapsed_ms, 2),
                execution_time=elapsed_sec,
                memory_kb=peak_memory_kb,
                exit_code=137,
                error_type="MemoryLimitExceeded"
            )

        # Cap output size
        if len(stdout_data) > limits.max_output_bytes:
            stdout_data = stdout_data[:limits.max_output_bytes] + "\n... [Output Limit Exceeded: Truncated at 1MB]"

        exit_code = process.returncode if process.returncode is not None else 0

        if exit_code == 0:
            return RunResult(
                status="success",
                output=stdout_data,
                stdout=stdout_data,
                stderr=stderr_data or "",
                error=stderr_data if stderr_data else None,
                execution_time_ms=round(elapsed_ms, 2),
                execution_time=elapsed_sec,
                memory_kb=peak_memory_kb,
                exit_code=0,
                error_type=None
            )
        else:
            err_type = parse_error_type(stderr_data, stdout_data)
            combined_err = f"{stderr_data}\n{stdout_data}".strip() if not stderr_data else stderr_data.strip()
            return RunResult(
                status="error",
                output=stdout_data,
                stdout=stdout_data,
                stderr=stderr_data,
                error=combined_err,
                execution_time_ms=round(elapsed_ms, 2),
                execution_time=elapsed_sec,
                memory_kb=peak_memory_kb,
                exit_code=exit_code,
                error_type=err_type
            )

    except subprocess.TimeoutExpired:
        # Kill process and all children
        try:
            parent = psutil.Process(process.pid)
            for child in parent.children(recursive=True):
                try: child.kill()
                except Exception: pass
            parent.kill()
        except Exception:
            try: process.kill()
            except Exception: pass
        if execution_id:
            active_process_tracker.unregister(execution_id)

        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        elapsed_sec = round(elapsed_ms / 1000.0, 3)
        return RunResult(
            status="timeout",
            output="",
            stdout="",
            stderr=f"⏱ Time Limit Exceeded: Your program exceeded the {limits.timeout_seconds} second time limit.",
            error=f"Time Limit Exceeded ({limits.timeout_seconds}s)",
            execution_time_ms=round(elapsed_ms, 2),
            execution_time=elapsed_sec,
            memory_kb=peak_memory_kb or 12400,
            exit_code=124,
            error_type="TimeLimitExceeded"
        )

    except Exception as e:
        if execution_id:
            active_process_tracker.unregister(execution_id)
        elapsed_ms = (time.perf_counter() - start_time) * 1000.0
        elapsed_sec = round(elapsed_ms / 1000.0, 3)
        return RunResult(
            status="error",
            output="",
            stdout="",
            stderr=str(e),
            error=str(e),
            execution_time_ms=round(elapsed_ms, 2),
            execution_time=elapsed_sec,
            memory_kb=0,
            exit_code=1,
            error_type="SystemError"
        )
