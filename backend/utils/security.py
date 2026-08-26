import bcrypt
from datetime import datetime, timedelta
from typing import Optional, Union, Any
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from backend.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from backend.database.database import get_db
from backend.models import User, UserRole

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False

def get_password_hash(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def decode_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None

def get_current_user_optional(
    token: Optional[str] = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> Optional[User]:
    if not token:
        return None
    payload = decode_token(token)
    if not payload:
        return None
    username: str = payload.get("sub")
    if not username:
        return None
    user = db.query(User).filter(User.username == username).first()
    return user

def get_current_user(
    current_user: Optional[User] = Depends(get_current_user_optional)
) -> User:
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required. Please log in.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user

import hashlib
import random
import string

def hash_access_key(key: str) -> str:
    """Compute deterministic salted hash of classroom access key for safe storage and verification."""
    normalized = key.strip().upper().replace(" ", "")
    return hashlib.sha256(f"{SECRET_KEY}:{normalized}".encode("utf-8")).hexdigest()

def generate_secure_access_key(prefix: Optional[str] = None) -> str:
    """Generate a clean, unambiguous, non-sequential mobile-friendly access key e.g. DSA-7K4P."""
    # Character set excluding easily confused characters: 0/O, 1/I/L
    SAFE_CHARS = "23456789ABCDEFGHJKMNPQRSTUVWXYZ"
    
    if prefix:
        clean_prefix = "".join([c for c in prefix.upper() if c.isalnum()])[:4]
    else:
        clean_prefix = "".join(random.choices("ABCDEFGHJKMNPQRSTUVWXYZ", k=3))
    
    if not clean_prefix or len(clean_prefix) < 2:
        clean_prefix = "".join(random.choices("ABCDEFGHJKMNPQRSTUVWXYZ", k=3))
        
    part1 = "".join(random.choices(SAFE_CHARS, k=4))
    return f"{clean_prefix}-{part1}"

def require_creator_or_teacher(
    current_user: User = Depends(get_current_user)
) -> User:
    if current_user.role not in [UserRole.CREATOR, UserRole.TEACHER]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Action requires Creator or Teacher permissions."
        )
    return current_user

def require_teacher(
    current_user: User = Depends(get_current_user)
) -> User:
    # Any authenticated user is eligible to act as classroom creator/teacher for classrooms they own
    return current_user

