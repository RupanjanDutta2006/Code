import difflib

def generate_unified_diff(old_text: str, new_text: str, from_label: str = "Previous", to_label: str = "Current") -> str:
    """Generates standard unified diff representation between two code versions."""
    old_lines = old_text.splitlines(keepends=True)
    new_lines = new_text.splitlines(keepends=True)
    
    diff = difflib.unified_diff(
        old_lines,
        new_lines,
        fromfile=from_label,
        tofile=to_label,
        lineterm=""
    )
    return "\n".join(diff)
