from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, List
from pathlib import Path
from dataclasses import dataclass

@dataclass
class ResourceLimits:
    timeout_seconds: int = 5
    max_memory_mb: int = 256
    max_output_bytes: int = 1048576 # 1 MB

@dataclass
class CompileResult:
    success: bool
    output: str
    artifact_path: Optional[str] = None

@dataclass
class RunResult:
    status: str # 'success', 'error', 'timeout'
    output: str
    error: Optional[str] = None
    execution_time_ms: float = 0.0

class BaseRunner(ABC):
    @abstractmethod
    def language(self) -> str:
        pass

    @abstractmethod
    def file_extension(self) -> str:
        pass

    def is_compiled(self) -> bool:
        return False

    def compile(self, source_code: str, work_dir: Path) -> Optional[CompileResult]:
        return None

    @abstractmethod
    def run(
        self,
        source_or_artifact: str,
        custom_input: str,
        work_dir: Path,
        limits: ResourceLimits
    ) -> RunResult:
        pass

    def get_docker_image(self) -> str:
        return "alpine:latest"

    def get_resource_limits(self) -> ResourceLimits:
        return ResourceLimits()
