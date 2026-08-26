import bcrypt
import hashlib
import random
import string
from datetime import datetime, timedelta
from typing import Optional, Union, Any, Dict
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
    # 1. First try decoding as local HS256 JWT
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except Exception:
        pass

    # 2. Try decoding as Firebase ID token (RS256 / Google JWT)
    try:
        claims = jwt.get_unverified_claims(token)
        iss = claims.get("iss", "")
        # Validate that it is a Google Firebase token
        if "securetoken.google.com" in iss or "accounts.google.com" in iss:
            exp = claims.get("exp")
            if exp and datetime.utcfromtimestamp(exp) < datetime.utcnow() - timedelta(minutes=5):
                return None
            return claims
    except Exception:
        pass

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
    
    # Extract identity fields from payload (handles local JWT and Firebase ID tokens)
    username: Optional[str] = payload.get("sub")
    email: Optional[str] = payload.get("email")
    uid: Optional[str] = payload.get("user_id") or payload.get("sub")
    name: Optional[str] = payload.get("name")
    
    # 1. Try finding existing user by email
    user = None
    if email:
        user = db.query(User).filter(User.email == email).first()
    
    # 2. Try finding user by username
    if not user and username:
        user = db.query(User).filter(User.username == username).first()

    # 3. Auto-provision user record for authenticated Firebase users
    if not user and (email or uid):
        raw_name = email.split("@")[0] if email else f"user_{uid[:8]}"
        base_username = "".join([c for c in raw_name if c.isalnum() or c in "_-"])[:20] or f"user_{uid[:6]}"
        candidate_username = base_username
        suffix = 1
        while db.query(User).filter(User.username == candidate_username).first():
            candidate_username = f"{base_username}_{suffix}"
            suffix += 1
        
        user = User(
            username=candidate_username,
            email=email or f"{uid}@codevault.internal",
            hashed_password=get_password_hash(f"firebase_{uid}"),
            full_name=name or candidate_username,
            role=UserRole.TEACHER,  # Grant teacher permissions so user can create classrooms
            created_at=datetime.utcnow()
        )
        db.add(user)
        try:
            db.commit()
            db.refresh(user)
        except Exception:
            db.rollback()
            user = db.query(User).filter((User.email == email) | (User.username == candidate_username)).first()

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

def hash_access_key(key: str) -> str:
    """Compute deterministic salted hash of classroom access key for safe storage and verification."""
    normalized = key.strip().upper().replace(" ", "")
    return hashlib.sha256(f"{SECRET_KEY}:{normalized}".encode("utf-8")).hexdigest()

def generate_secure_access_key(prefix: Optional[str] = None) -> str:
    """Generate a clean, unambiguous, non-sequential mobile-friendly access key e.g. DSA-7K4P."""
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
    return current_user
