import os
import shutil
import re
from pathlib import Path
from typing import Optional
from backend.executor.runner_interface import BaseRunner, CompileResult, RunResult, ResourceLimits
from backend.executor.subprocess_runner import run_subprocess

class JavaRunner(BaseRunner):
    def language(self) -> str:
        return "java"

    def file_extension(self) -> str:
        return ".java"

    def is_compiled(self) -> bool:
        return True

    def _extract_class_name(self, source_code: str) -> str:
        match = re.search(r"public\s+class\s+([A-Za-z0-9_]+)", source_code)
        if match:
            return match.group(1)
        match_any = re.search(r"class\s+([A-Za-z0-9_]+)", source_code)
        if match_any:
            return match_any.group(1)
        return "Main"

    def compile(self, source_code: str, work_dir: Path) -> Optional[CompileResult]:
        class_name = self._extract_class_name(source_code)
        source_file = work_dir / f"{class_name}.java"
        source_file.write_text(source_code, encoding="utf-8")

        javac_bin = shutil.which("javac") or "javac"
        res = run_subprocess([javac_bin, str(source_file)], cwd=str(work_dir))
        
        class_file = work_dir / f"{class_name}.class"
        if res.status == "success" and class_file.exists():
            return CompileResult(success=True, output=res.output, artifact_path=class_name)
        else:
            return CompileResult(success=False, output=res.error or "Java compilation failed")

    def run(self, source_or_artifact: str, custom_input: str, work_dir: Path, limits: ResourceLimits) -> RunResult:
        class_name = source_or_artifact
        java_bin = shutil.which("java") or "java"
        return run_subprocess([java_bin, "-Xmx128m", class_name], cwd=str(work_dir), stdin_data=custom_input, limits=limits)

    def get_docker_image(self) -> str:
        return "openjdk:17-slim"
