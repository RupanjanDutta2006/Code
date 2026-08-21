import shutil
from pathlib import Path
from typing import Optional
from backend.executor.runner_interface import BaseRunner, CompileResult, RunResult, ResourceLimits
from backend.executor.subprocess_runner import run_subprocess

class KotlinRunner(BaseRunner):
    def language(self) -> str:
        return "kotlin"

    def file_extension(self) -> str:
        return ".kt"

    def is_compiled(self) -> bool:
        return True

    def compile(self, source_code: str, work_dir: Path) -> Optional[CompileResult]:
        source_file = work_dir / "Main.kt"
        source_file.write_text(source_code, encoding="utf-8")
        jar_file = work_dir / "Main.jar"

        kotlinc_bin = shutil.which("kotlinc") or "kotlinc"
        res = run_subprocess([kotlinc_bin, str(source_file), "-include-runtime", "-d", str(jar_file)], cwd=str(work_dir))
        
        if res.status == "success" and jar_file.exists():
            return CompileResult(success=True, output=res.output, artifact_path=str(jar_file))
        else:
            return CompileResult(success=False, output=res.error or "Kotlin compilation failed")

    def run(self, source_or_artifact: str, custom_input: str, work_dir: Path, limits: ResourceLimits) -> RunResult:
        jar_path = Path(source_or_artifact)
        java_bin = shutil.which("java") or "java"
        return run_subprocess([java_bin, "-jar", str(jar_path)], cwd=str(work_dir), stdin_data=custom_input, limits=limits)

    def get_docker_image(self) -> str:
        return "zenika/alpine-kotlin:latest"
