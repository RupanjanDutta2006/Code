from typing import Dict, Optional, List
from backend.executor.runner_interface import BaseRunner
from backend.executor.runners.c.runner import CRunner
from backend.executor.runners.cpp.runner import CppRunner
from backend.executor.runners.python.runner import PythonRunner
from backend.executor.runners.java.runner import JavaRunner
from backend.executor.runners.javascript.runner import JavaScriptRunner
from backend.executor.runners.typescript.runner import TypeScriptRunner
from backend.executor.runners.go.runner import GoRunner
from backend.executor.runners.rust.runner import RustRunner
from backend.executor.runners.kotlin.runner import KotlinRunner
from backend.executor.runners.html.runner import HtmlRunner
from backend.executor.runners.sql.runner import SqlRunner

class RunnerRegistry:
    def __init__(self):
        self._runners: Dict[str, BaseRunner] = {}
        self._register_default_runners()

    def _register_default_runners(self):
        self.register(CRunner())
        self.register(CppRunner())
        self.register(PythonRunner())
        self.register(JavaRunner())
        self.register(JavaScriptRunner())
        self.register(TypeScriptRunner())
        self.register(GoRunner())
        self.register(RustRunner())
        self.register(KotlinRunner())
        self.register(HtmlRunner())
        self.register(SqlRunner())

    def register(self, runner: BaseRunner):
        lang = runner.language().lower()
        self._runners[lang] = runner

    def get(self, language: str) -> Optional[BaseRunner]:
        normalized = language.lower().strip()
        # Aliases
        if normalized in ["c++", "cc", "cxx"]:
            normalized = "cpp"
        elif normalized in ["py", "python3"]:
            normalized = "python"
        elif normalized in ["js", "node"]:
            normalized = "javascript"
        elif normalized in ["ts"]:
            normalized = "typescript"
        elif normalized in ["rs"]:
            normalized = "rust"
        elif normalized in ["kt"]:
            normalized = "kotlin"
        elif normalized in ["htm", "css", "html5"]:
            normalized = "html"
        elif normalized in ["sqlite", "sqlite3", "postgres", "mysql"]:
            normalized = "sql"
        return self._runners.get(normalized)

    def supported_languages(self) -> List[str]:
        return list(self._runners.keys())

runner_registry = RunnerRegistry()
