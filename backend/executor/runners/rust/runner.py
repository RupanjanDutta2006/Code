import os
import shutil
from pathlib import Path
from typing import Optional
from backend.executor.runner_interface import BaseRunner, CompileResult, RunResult, ResourceLimits
from backend.executor.subprocess_runner import run_subprocess

class RustRunner(BaseRunner):
    def language(self) -> str:
        return "rust"

    def file_extension(self) -> str:
        return ".rs"

    def is_compiled(self) -> bool:
        return True

    def compile(self, source_code: str, work_dir: Path) -> Optional[CompileResult]:
        source_file = work_dir / "main.rs"
        source_file.write_text(source_code, encoding="utf-8")
        exe_file = work_dir / ("main.exe" if os.name == "nt" else "main")

        rustc_bin = shutil.which("rustc") or "rustc"
        res = run_subprocess([rustc_bin, "-O", str(source_file), "-o", str(exe_file)], cwd=str(work_dir))
        
        if res.status == "success" and exe_file.exists():
            return CompileResult(success=True, output=res.output, artifact_path=str(exe_file))
        else:
            return CompileResult(success=False, output=res.error or "Rust compilation failed")

    def run(self, source_or_artifact: str, custom_input: str, work_dir: Path, limits: ResourceLimits) -> RunResult:
        exe_path = Path(source_or_artifact)
        if not exe_path.exists():
            return RunResult(status="error", output="", error="Rust executable not found.")
        return run_subprocess([str(exe_path)], cwd=str(work_dir), stdin_data=custom_input, limits=limits)

    def get_docker_image(self) -> str:
        return "rust:1.77-slim-bookworm"
