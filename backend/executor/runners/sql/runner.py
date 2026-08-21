import sqlite3
import time
from pathlib import Path
from backend.executor.runner_interface import BaseRunner, RunResult, ResourceLimits

class SqlRunner(BaseRunner):
    def language(self) -> str:
        return "sql"

    def file_extension(self) -> str:
        return ".sql"

    def is_compiled(self) -> bool:
        return False

    def run(self, source_or_artifact: str, custom_input: str, work_dir: Path, limits: ResourceLimits) -> RunResult:
        start_time = time.perf_counter()
        # Create an ephemeral in-memory SQLite database
        conn = None
        try:
            conn = sqlite3.connect(":memory:")
            cursor = conn.cursor()

            # If custom_input contains setup SQL or CSV, execute it first
            if custom_input.strip():
                try:
                    cursor.executescript(custom_input)
                except Exception as e:
                    return RunResult(
                        status="error",
                        output="",
                        error=f"Error executing input/seed SQL script: {e}",
                        execution_time_ms=(time.perf_counter() - start_time) * 1000.0
                    )

            output_lines = []
            statements = [s.strip() for s in source_or_artifact.split(";") if s.strip()]

            for stmt in statements:
                try:
                    cursor.execute(stmt)
                    if cursor.description:
                        # Format as clean table
                        headers = [col[0] for col in cursor.description]
                        rows = cursor.fetchall()
                        
                        col_widths = [len(h) for h in headers]
                        for row in rows:
                            for i, val in enumerate(row):
                                col_widths[i] = max(col_widths[i], len(str(val)))

                        header_line = " | ".join(h.ljust(col_widths[i]) for i, h in enumerate(headers))
                        separator_line = "-+-".join("-" * col_widths[i] for i in range(len(headers)))
                        
                        output_lines.append(f">> Query: {stmt}")
                        output_lines.append(header_line)
                        output_lines.append(separator_line)

                        if rows:
                            for row in rows:
                                row_str = " | ".join(str(val if val is not None else "NULL").ljust(col_widths[i]) for i, val in enumerate(row))
                                output_lines.append(row_str)
                            output_lines.append(f"({len(rows)} rows returned)\n")
                        else:
                            output_lines.append("(0 rows returned)\n")
                    else:
                        conn.commit()
                        output_lines.append(f">> Executed: {stmt}")
                        output_lines.append(f"(Rows affected: {cursor.rowcount})\n")

                except sqlite3.Error as e:
                    elapsed_ms = (time.perf_counter() - start_time) * 1000.0
                    return RunResult(
                        status="error",
                        output="\n".join(output_lines),
                        error=f"SQL Error in '{stmt}': {e}",
                        execution_time_ms=round(elapsed_ms, 2)
                    )

            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            return RunResult(
                status="success",
                output="\n".join(output_lines),
                execution_time_ms=round(elapsed_ms, 2)
            )

        except Exception as e:
            elapsed_ms = (time.perf_counter() - start_time) * 1000.0
            return RunResult(
                status="error",
                output="",
                error=f"Database execution error: {e}",
                execution_time_ms=round(elapsed_ms, 2)
            )
        finally:
            if conn:
                conn.close()

    def get_docker_image(self) -> str:
        return "keinos/sqlite3:latest"
