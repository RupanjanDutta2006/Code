import sys
from pathlib import Path
from backend.executor.runner_interface import BaseRunner, RunResult, ResourceLimits
from backend.executor.subprocess_runner import run_subprocess

class PythonRunner(BaseRunner):
    def language(self) -> str:
        return "python"

    def file_extension(self) -> str:
        return ".py"

    def is_compiled(self) -> bool:
        return False

    def run(self, source_or_artifact: str, custom_input: str, work_dir: Path, limits: ResourceLimits) -> RunResult:
        script_file = work_dir / "solution.py"
        script_file.write_text(source_or_artifact, encoding="utf-8")
        
        python_bin = sys.executable or "python"
        return run_subprocess(
            [python_bin, "-u", str(script_file)],
            cwd=str(work_dir),
            stdin_data=custom_input,
            limits=limits
        )

    def get_docker_image(self) -> str:
        return "python:3.12-slim"
