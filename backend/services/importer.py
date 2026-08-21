import os
import zipfile
import io
from pathlib import Path
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from backend.models import Program, Folder, ProgramVersion
from backend.services.hash_service import compute_content_hash

EXTENSION_MAP = {
    ".c": "c",
    ".cpp": "cpp",
    ".cc": "cpp",
    ".cxx": "cpp",
    ".py": "python",
    ".java": "java",
    ".js": "javascript",
    ".ts": "typescript",
    ".go": "go",
    ".rs": "rust",
    ".kt": "kotlin",
    ".html": "html",
    ".htm": "html",
    ".css": "css",
    ".sql": "sql"
}

IGNORE_DIRS = {
    ".git", "node_modules", "__pycache__", "target", ".pytest_cache",
    "dist", "build", "bin", "obj", ".vscode", ".idea", ".agents", "venv", ".venv"
}

IGNORE_EXTENSIONS = {
    ".exe", ".dll", ".so", ".o", ".obj", ".class", ".pyc", ".pyo", ".zip", ".tar", ".gz"
}

def detect_language(filename: str) -> str:
    ext = Path(filename).suffix.lower()
    return EXTENSION_MAP.get(ext, None)

def infer_category(relative_path: str) -> str:
    parts = Path(relative_path).parts
    if len(parts) > 1:
        folder_name = parts[0].lower()
        if any(k in folder_name for k in ["dsa", "data_structure", "algorithm", "tree", "graph", "dp", "sorting", "search"]):
            return "Data Structures & Algorithms"
        if any(k in folder_name for k in ["web", "frontend", "html", "css", "js", "api"]):
            return "Web Development"
        if any(k in folder_name for k in ["contest", "codeforces", "leetcode", "judge", "cp"]):
            return "Competitive Programming"
        if any(k in folder_name for k in ["database", "sql", "db"]):
            return "Database & SQL"
        return parts[0].replace("_", " ").title()
    return "General"

def import_files_data(
    db: Session,
    user_id: int,
    file_entries: List[Dict[str, Any]] # list of {"path": "dsa/trees/bst.py", "content": "..."}
) -> Dict[str, Any]:
    """Imports an array of file entries, creating folders and programs with deduplication."""
    imported_programs = []
    folders_created = 0
    skipped_count = 0
    folder_cache: Dict[str, int] = {} # path_str -> folder_id

    for entry in file_entries:
        rel_path = entry.get("path", "").replace("\\", "/").strip("/")
        content = entry.get("content", "")
        
        path_obj = Path(rel_path)
        parts = list(path_obj.parts)
        
        # Check ignore rules
        if any(p in IGNORE_DIRS for p in parts):
            continue
        if path_obj.suffix.lower() in IGNORE_EXTENSIONS:
            continue
        
        language = detect_language(path_obj.name)
        if not language or not content.strip():
            skipped_count += 1
            continue

        # Handle folder hierarchy
        current_parent_id = None
        if len(parts) > 1:
            curr_path = ""
            for folder_part in parts[:-1]:
                curr_path = f"{curr_path}/{folder_part}" if curr_path else folder_part
                if curr_path in folder_cache:
                    current_parent_id = folder_cache[curr_path]
                else:
                    existing_folder = db.query(Folder).filter(
                        Folder.user_id == user_id,
                        Folder.name == folder_part,
                        Folder.parent_id == current_parent_id
                    ).first()
                    if not existing_folder:
                        new_folder = Folder(
                            name=folder_part,
                            parent_id=current_parent_id,
                            user_id=user_id
                        )
                        db.add(new_folder)
                        db.commit()
                        db.refresh(new_folder)
                        existing_folder = new_folder
                        folders_created += 1
                    
                    folder_cache[curr_path] = existing_folder.id
                    current_parent_id = existing_folder.id

        content_hash = compute_content_hash(content)
        title = path_obj.stem.replace("_", " ").replace("-", " ").title()
        category = infer_category(rel_path)

        # Check for deduplication (same user, folder, and hash or title)
        existing_program = db.query(Program).filter(
            Program.user_id == user_id,
            Program.folder_id == current_parent_id,
            Program.title == title
        ).first()

        if existing_program:
            # If content changed, create new version
            if existing_program.content_hash != content_hash:
                existing_program.source_code = content
                existing_program.content_hash = content_hash
                existing_program.language = language
                
                version_count = len(existing_program.versions)
                new_version = ProgramVersion(
                    program_id=existing_program.id,
                    version_number=version_count + 1,
                    source_code=content,
                    content_hash=content_hash,
                    commit_message="Imported updated file",
                    created_by=user_id
                )
                db.add(new_version)
                db.commit()
                db.refresh(existing_program)
                imported_programs.append(existing_program)
            else:
                skipped_count += 1
        else:
            new_prog = Program(
                title=title,
                description=f"Imported from {rel_path}",
                language=language,
                category=category,
                folder_id=current_parent_id,
                user_id=user_id,
                is_public=True,
                source_code=content,
                content_hash=content_hash
            )
            db.add(new_prog)
            db.commit()
            db.refresh(new_prog)

            # Create initial version 1
            v1 = ProgramVersion(
                program_id=new_prog.id,
                version_number=1,
                source_code=content,
                content_hash=content_hash,
                commit_message="Initial import",
                created_by=user_id
            )
            db.add(v1)
            db.commit()
            imported_programs.append(new_prog)

    return {
        "imported_count": len(imported_programs),
        "folders_created": folders_created,
        "skipped_count": skipped_count,
        "programs": imported_programs
    }

def process_zip_upload(db: Session, user_id: int, zip_bytes: bytes) -> Dict[str, Any]:
    """Extracts and parses uploaded zip archive into file entries."""
    file_entries = []
    with zipfile.ZipFile(io.BytesIO(zip_bytes), "r") as zf:
        for info in zf.infolist():
            if info.is_dir():
                continue
            filename = info.filename
            try:
                content = zf.read(filename).decode("utf-8", errors="ignore")
                file_entries.append({"path": filename, "content": content})
            except Exception:
                continue
    return import_files_data(db, user_id, file_entries)
