import shutil
from pathlib import Path
from backend.executor.runner_interface import BaseRunner, RunResult, ResourceLimits
from backend.executor.subprocess_runner import run_subprocess

class TypeScriptRunner(BaseRunner):
    def language(self) -> str:
        return "typescript"

    def file_extension(self) -> str:
        return ".ts"

    def is_compiled(self) -> bool:
        return False

    def run(self, source_or_artifact: str, custom_input: str, work_dir: Path, limits: ResourceLimits) -> RunResult:
        script_file = work_dir / "index.ts"
        script_file.write_text(source_or_artifact, encoding="utf-8")
        
        node_bin = shutil.which("node") or "node"
        # Node v22+ and v24 natively support --experimental-strip-types
        res = run_subprocess(
            [node_bin, "--experimental-strip-types", str(script_file)],
            cwd=str(work_dir),
            stdin_data=custom_input,
            limits=limits
        )
        if res.status == "error" and "experimental-strip-types" in (res.error or ""):
            # Fallback to ts-node if available
            ts_node = shutil.which("ts-node") or "ts-node"
            res = run_subprocess([ts_node, str(script_file)], cwd=str(work_dir), stdin_data=custom_input, limits=limits)
            
        return res

    def get_docker_image(self) -> str:
        return "node:22-slim"
