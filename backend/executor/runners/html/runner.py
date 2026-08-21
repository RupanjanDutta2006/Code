from pathlib import Path
from backend.executor.runner_interface import BaseRunner, RunResult, ResourceLimits

class HtmlRunner(BaseRunner):
    def language(self) -> str:
        return "html"

    def file_extension(self) -> str:
        return ".html"

    def is_compiled(self) -> bool:
        return False

    def run(self, source_or_artifact: str, custom_input: str, work_dir: Path, limits: ResourceLimits) -> RunResult:
        # HTML/CSS is rendered safely on the client side via sandboxed iframe
        return RunResult(
            status="success",
            output="[HTML/CSS Preview Active] Rendered safely in client-side sandboxed iframe.",
            execution_time_ms=5.0
        )

    def get_docker_image(self) -> str:
        return "nginx:alpine"
