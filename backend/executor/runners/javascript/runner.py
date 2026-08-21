import shutil
from pathlib import Path
from backend.executor.runner_interface import BaseRunner, RunResult, ResourceLimits
from backend.executor.subprocess_runner import run_subprocess

class JavaScriptRunner(BaseRunner):
    def language(self) -> str:
        return "javascript"

    def file_extension(self) -> str:
        return ".js"

    def is_compiled(self) -> bool:
        return False

    def run(self, source_or_artifact: str, custom_input: str, work_dir: Path, limits: ResourceLimits) -> RunResult:
        script_file = work_dir / "index.js"
        script_file.write_text(source_or_artifact, encoding="utf-8")
        
        node_bin = shutil.which("node") or "node"
        return run_subprocess(
            [node_bin, str(script_file)],
            cwd=str(work_dir),
            stdin_data=custom_input,
            limits=limits
        )

    def get_docker_image(self) -> str:
        return "node:20-slim"
