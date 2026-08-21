import hashlib

def compute_content_hash(content: str) -> str:
    """Returns SHA-256 hex digest of source code content."""
    return hashlib.sha256(content.strip().encode("utf-8")).hexdigest()

def compute_cache_key(language: str, source_code: str, custom_input: str = "", flags: str = "") -> str:
    """Generates execution cache key for idempotent code runs."""
    payload = f"{language.lower()}|{source_code.strip()}|{custom_input.strip()}|{flags}"
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()
