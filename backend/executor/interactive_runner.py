import os
import sys
import shutil
import time
import uuid
import asyncio
import subprocess
from pathlib import Path
from typing import Optional
from fastapi import WebSocket
from backend.config import DATA_DIR, EXECUTION_TIMEOUT_SECONDS
from backend.executor.registry import runner_registry

SANDBOX_ROOT = DATA_DIR / "sandboxes"
SANDBOX_ROOT.mkdir(exist_ok=True)

class InteractiveSession:
    def __init__(self, websocket: WebSocket, language: str, source_code: str, custom_input: str = ""):
        self.websocket = websocket
        self.language = language.lower().strip()
        self.source_code = source_code
        self.custom_input = custom_input
        self.session_id = str(uuid.uuid4())
        self.work_dir = SANDBOX_ROOT / f"inter_{self.session_id}"
        self.process: Optional[subprocess.Popen] = None
        self.is_running = False
        self.start_time = 0.0

    async def start(self):
        self.work_dir.mkdir(parents=True, exist_ok=True)
        self.start_time = time.perf_counter()
        runner = runner_registry.get(self.language)

        if not runner:
            await self.websocket.send_json({
                "type": "stderr",
                "data": f"Unsupported language '{self.language}'\r\n"
            })
            await self.websocket.send_json({"type": "finished", "status": "error", "exit_code": 1})
            return

        cmd = []
        env = {
            **os.environ,
            "PYTHONUNBUFFERED": "1",
            "PYTHONIOENCODING": "utf-8",
            "NODE_OPTIONS": "--no-warnings"
        }

        # Language compilation / command setup
        if self.language in ["python", "py", "python3"]:
            script = self.work_dir / "solution.py"
            script.write_text(self.source_code, encoding="utf-8")
            cmd = [sys.executable, "-u", str(script)]

        elif self.language in ["c"]:
            src = self.work_dir / "main.c"
            src.write_text(self.source_code, encoding="utf-8")
            exe = self.work_dir / ("main.exe" if os.name == "nt" else "main")
            compiler = shutil.which("gcc") or "gcc"
            
            await self.websocket.send_json({"type": "stdout", "data": f"[Compiling C code with {compiler}...]\r\n"})
            comp_proc = subprocess.run([compiler, "-O2", str(src), "-o", str(exe)], capture_output=True, text=True, cwd=str(self.work_dir))
            if comp_proc.returncode != 0:
                await self.websocket.send_json({"type": "stderr", "data": comp_proc.stderr + "\r\n"})
                await self.websocket.send_json({"type": "finished", "status": "error", "exit_code": 1})
                return
            cmd = [str(exe)]

        elif self.language in ["cpp", "c++"]:
            src = self.work_dir / "main.cpp"
            src.write_text(self.source_code, encoding="utf-8")
            exe = self.work_dir / ("main.exe" if os.name == "nt" else "main")
            compiler = shutil.which("g++") or "g++"

            await self.websocket.send_json({"type": "stdout", "data": f"[Compiling C++ code with {compiler}...]\r\n"})
            comp_proc = subprocess.run([compiler, "-std=c++17", "-O2", str(src), "-o", str(exe)], capture_output=True, text=True, cwd=str(self.work_dir))
            if comp_proc.returncode != 0:
                await self.websocket.send_json({"type": "stderr", "data": comp_proc.stderr + "\r\n"})
                await self.websocket.send_json({"type": "finished", "status": "error", "exit_code": 1})
                return
            cmd = [str(exe)]

        elif self.language in ["javascript", "js"]:
            script = self.work_dir / "index.js"
            script.write_text(self.source_code, encoding="utf-8")
            node = shutil.which("node") or "node"
            cmd = [node, str(script)]

        elif self.language in ["typescript", "ts"]:
            script = self.work_dir / "index.ts"
            script.write_text(self.source_code, encoding="utf-8")
            node = shutil.which("node") or "node"
            cmd = [node, "--experimental-strip-types", str(script)]

        elif self.language in ["java"]:
            # Extract class name or default to Main
            import re
            m = re.search(r"public\s+class\s+([A-Za-z0-9_]+)", self.source_code)
            class_name = m.group(1) if m else "Main"
            src = self.work_dir / f"{class_name}.java"
            src.write_text(self.source_code, encoding="utf-8")
            javac = shutil.which("javac") or "javac"
            java = shutil.which("java") or "java"

            await self.websocket.send_json({"type": "stdout", "data": "[Compiling Java code...]\r\n"})
            comp_proc = subprocess.run([javac, str(src)], capture_output=True, text=True, cwd=str(self.work_dir))
            if comp_proc.returncode != 0:
                await self.websocket.send_json({"type": "stderr", "data": comp_proc.stderr + "\r\n"})
                await self.websocket.send_json({"type": "finished", "status": "error", "exit_code": 1})
                return
            cmd = [java, class_name]

        elif self.language in ["sql"]:
            # Run SQL directly
            res = runner.run(self.source_code, "", self.work_dir, runner.get_resource_limits())
            await self.websocket.send_json({"type": "stdout", "data": res.output + "\r\n"})
            if res.error:
                await self.websocket.send_json({"type": "stderr", "data": res.error + "\r\n"})
            await self.websocket.send_json({
                "type": "finished",
                "status": res.status,
                "execution_time_ms": res.execution_time_ms,
                "exit_code": 0 if res.status == "success" else 1
            })
            self.cleanup()
            return

        elif self.language in ["html"]:
            await self.websocket.send_json({
                "type": "stdout",
                "data": "[HTML Live Preview Active]\r\n"
            })
            await self.websocket.send_json({
                "type": "finished",
                "status": "success",
                "execution_time_ms": 5.0,
                "exit_code": 0
            })
            self.cleanup()
            return

        else:
            # Other languages
            script = self.work_dir / f"main{runner.file_extension()}"
            script.write_text(self.source_code, encoding="utf-8")
            cmd = [sys.executable, "-u", str(script)]

        try:
            # Spawn interactive unbuffered process with merged stderr
            self.process = subprocess.Popen(
                cmd,
                cwd=str(self.work_dir),
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                bufsize=0,
                env=env
            )
            self.is_running = True

            # Write initial STDIN if provided
            if self.custom_input and self.process.stdin:
                try:
                    data_to_send = self.custom_input if self.custom_input.endswith("\n") else self.custom_input + "\n"
                    self.process.stdin.write(data_to_send.encode("utf-8"))
                    self.process.stdin.flush()
                except Exception as e:
                    print(f"Error writing initial STDIN: {e}")

            # Start stdout reader task
            loop = asyncio.get_running_loop()
            asyncio.create_task(self._stream_output(loop))

        except Exception as e:
            await self.websocket.send_json({
                "type": "stderr",
                "data": f"Failed to start process: {e}\r\n"
            })
            await self.websocket.send_json({"type": "finished", "status": "error", "exit_code": 1})
            self.cleanup()

    async def send_input(self, user_input: str):
        """Writes interactive user keystrokes / input directly into the running process STDIN."""
        if self.process and self.is_running and self.process.stdin:
            try:
                # Ensure newline if not present
                data_to_send = user_input if user_input.endswith("\n") else user_input + "\n"
                loop = asyncio.get_running_loop()
                await loop.run_in_executor(
                    None,
                    lambda: self._write_stdin(data_to_send)
                )
            except Exception as e:
                print(f"Error writing to stdin: {e}")

    def _write_stdin(self, data: str):
        if self.process and self.process.stdin:
            self.process.stdin.write(data.encode("utf-8"))
            self.process.stdin.flush()

    async def _stream_output(self, loop):
        """Reads stdout byte by byte / chunk by chunk in realtime and sends to websocket."""
        import psutil
        peak_memory_kb = 8192
        try:
            while self.is_running and self.process:
                # Sample memory
                try:
                    if self.process and self.process.pid:
                        p = psutil.Process(self.process.pid)
                        mem = p.memory_info().rss // 1024
                        for ch in p.children(recursive=True):
                            try: mem += ch.memory_info().rss // 1024
                            except Exception: pass
                        if mem > peak_memory_kb:
                            peak_memory_kb = mem
                except Exception:
                    pass

                # Read chunks non-blockingly via executor
                chunk = await loop.run_in_executor(None, lambda: self.process.stdout.read(1024) if self.process and self.process.stdout else None)
                if not chunk:
                    break
                
                text = chunk.decode("utf-8", errors="replace")
                await self.websocket.send_json({
                    "type": "stdout",
                    "data": text
                })

            if self.process:
                await loop.run_in_executor(None, self.process.wait)
                exit_code = self.process.returncode
                elapsed_ms = (time.perf_counter() - self.start_time) * 1000.0
                elapsed_sec = round(elapsed_ms / 1000.0, 3)

                await self.websocket.send_json({
                    "type": "finished",
                    "status": "success" if exit_code == 0 else "error",
                    "exit_code": exit_code,
                    "exitCode": exit_code,
                    "execution_time_ms": round(elapsed_ms, 2),
                    "executionTime": elapsed_sec,
                    "memory": peak_memory_kb,
                    "memory_kb": peak_memory_kb
                })
        except Exception as e:
            try:
                await self.websocket.send_json({"type": "stderr", "data": f"\r\n[Process terminated: {e}]\r\n"})
                await self.websocket.send_json({
                    "type": "finished",
                    "status": "error",
                    "exit_code": 1,
                    "exitCode": 1,
                    "execution_time_ms": 0,
                    "executionTime": 0,
                    "memory": 8192
                })
            except Exception:
                pass
        finally:
            self.is_running = False
            self.cleanup()

    def kill(self):
        self.is_running = False
        if self.process:
            try:
                import psutil
                parent = psutil.Process(self.process.pid)
                for child in parent.children(recursive=True):
                    try: child.kill()
                    except Exception: pass
                parent.kill()
            except Exception:
                try:
                    self.process.kill()
                except Exception:
                    pass
        self.cleanup()

    def cleanup(self):
        try:
            if self.work_dir.exists():
                shutil.rmtree(self.work_dir, ignore_errors=True)
        except Exception:
            pass
