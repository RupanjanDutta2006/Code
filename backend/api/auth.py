from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.database import get_db
from backend.models import User, UserRole
from backend.schemas import UserRegister, UserLogin, TokenResponse, UserResponse, FirebaseAuthRequest
from backend.utils.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse)
def register(req: UserRegister, db: Session = Depends(get_db)):
    # Check username
    if db.query(User).filter(User.username == req.username).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken. Please choose another."
        )
    # Check email
    if db.query(User).filter(User.email == req.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered. Please log in."
        )

    new_user = User(
        username=req.username,
        email=req.email,
        hashed_password=get_password_hash(req.password),
        role=req.role or UserRole.USER,
        full_name=req.full_name
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.username, "role": new_user.role.value})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(new_user)
    )

@router.post("/login", response_model=TokenResponse)
def login(req: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(
        (User.username == req.username_or_email) | (User.email == req.username_or_email)
    ).first()

    if not user or not verify_password(req.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username/email or password."
        )

    token = create_access_token({"sub": user.username, "role": user.role.value})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.post("/firebase", response_model=TokenResponse)
def firebase_login(req: FirebaseAuthRequest, db: Session = Depends(get_db)):
    user = None
    target_email = req.email or (f"{req.phone_number.replace('+', '')}@phone.codevault.pro" if req.phone_number else f"{req.uid}@firebase.codevault.pro")
    
    if req.email:
        user = db.query(User).filter(User.email == req.email).first()
    
    if not user and req.phone_number:
        user = db.query(User).filter(User.email == target_email).first()

    if not user:
        base_username = (
            req.email.split('@')[0] if req.email else 
            (f"phone_{req.phone_number.replace('+', '')}" if req.phone_number else f"user_{req.uid[:8]}")
        )
        base_username = "".join(c for c in base_username if c.isalnum() or c == "_")[:50]
        username = base_username or f"user_{req.uid[:8]}"
        
        counter = 1
        original_username = username
        while db.query(User).filter(User.username == username).first():
            username = f"{original_username}_{counter}"
            counter += 1

        new_user = User(
            username=username,
            email=target_email,
            hashed_password=get_password_hash(f"fb_{req.uid}"),
            role=req.role or UserRole.USER,
            full_name=req.full_name or username
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        user = new_user

    token = create_access_token({"sub": user.username, "role": user.role.value})
    return TokenResponse(
        access_token=token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )

@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)
