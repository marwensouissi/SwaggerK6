from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.classes.schemas import  UserCreate, UserRead, LoginRequest, LoginResponse
from app.store.crud import get_users, create_user, authenticate_user, get_user_by_username, get_user_by_email, set_verification_token, set_user_verified
from app.auth import admin_only, create_access_token, get_current_user, logout_token
from app.database import get_db
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from app.services.emails import send_verification_email
from typing import List
import logging
from app.models.models import User
from datetime import datetime


# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/users", tags=["users"])
security = HTTPBearer()
@router.get("/", response_model=List[UserRead])
def list_users(db: Session = Depends(get_db), user=Depends(admin_only)):
    return get_users(db)

@router.post("/", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def add_user(user_in: UserCreate, db: Session = Depends(get_db), user=Depends(admin_only)):
    """Admin-only endpoint to create users (will trigger verification email)."""
    logger.debug("Received user creation request: %s", user_in)

    # Check uniqueness
    if get_user_by_username(db, user_in.username):
        logger.debug("Username already exists: %s", user_in.username)
        raise HTTPException(status_code=400, detail="Username already exists")
    if get_user_by_email(db, user_in.email):
        logger.debug("Email already exists: %s", user_in.email)
        raise HTTPException(status_code=400, detail="Email already exists")

    # Create user
    try:
        created = create_user(db, user_in, role="user", require_verification=True)
        logger.debug("User created successfully: %s", created)
    except Exception as e:
        logger.error("Error creating user: %s", e)
        raise HTTPException(status_code=500, detail="Error creating user")

    # Send verification email (or fallback)
    try:
        sent, info = send_verification_email(created.email, created.username, created.verification_token)
        logger.debug("Verification email sent: %s, Info: %s", sent, info)
    except Exception as e:
        logger.error("Error sending verification email: %s", e)
        raise HTTPException(status_code=500, detail="Error sending verification email")

    # For dev without SMTP we return the link as part of response (so frontend/dev can show it).
    return {
        "id": created.id,
        "username": created.username,
        "email": created.email,
        "role": created.role,
        "is_verified": created.is_verified,
        "verification_sent": bool(sent),
        "verification_info": info  # link or message
    }

@router.post("/register", response_model=UserRead, status_code=status.HTTP_201_CREATED)
def register_user(user_in: UserCreate, db: Session = Depends(get_db)):
    """Public endpoint for user registration (same verification flow)."""
    if get_user_by_username(db, user_in.username):
        raise HTTPException(status_code=400, detail="Username already exists")
    if get_user_by_email(db, user_in.email):
        raise HTTPException(status_code=400, detail="Email already exists")

    created = create_user(db, user_in, role="user", require_verification=True)
    sent, info = send_verification_email(created.email, created.username, created.verification_token)
    return {
        "id": created.id,
        "username": created.username,
        "email": created.email,
        "role": created.role,
        "is_verified": created.is_verified,
        "verification_sent": bool(sent),
        "verification_info": info
    }

@router.get("/verify")
def verify_email(token: str, db: Session = Depends(get_db)):
    """Verify token endpoint (link sent in email)."""
    user = db.query(User).filter(User.verification_token == token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid token")

    if not user.verification_expiry or user.verification_expiry < datetime.utcnow():
        raise HTTPException(status_code=400, detail="Token expired")

    set_user_verified(db, user)

    return {
        "message": "Email verified successfully",
        "username": user.username,
        "email": user.email,
        "password": user.password, 
    }


@router.post("/resend-verification/{user_id}")
def resend_verification(user_id: int, db: Session = Depends(get_db), current_user=Depends(admin_only)):
    """
    Admin-only: resend verification to user_id.
    (You can change this to allow a user to trigger resend on their own account.)
    """
    user = get_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    if user.is_verified:
        raise HTTPException(status_code=400, detail="User already verified")

    user = set_verification_token(db, user, hours_valid=24)
    sent, info = send_verification_email(user.email, user.username, user.verification_token)
    return {"verification_sent": bool(sent), "verification_info": info}

from fastapi.responses import JSONResponse

@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """Login with JSON body"""
    user = authenticate_user(db, login_data.username, login_data.password)
    if not user:
        return JSONResponse(content="Invalid credentials", status_code=401)
    if not user.is_verified:
        return JSONResponse(content="Email not verified. Please verify your email before logging in.", status_code=403)

    access_token = create_access_token(user.username)
    return LoginResponse(
        access_token=access_token,
        token_type="bearer",
        user_id=user.id,
        username=user.username,
        role=user.role
    )

@router.post("/logout")
def logout(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Logout and invalidate token"""
    logout_token(credentials.credentials)
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=dict)     
def get_me(current_user: UserRead = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "is_verified": current_user.is_verified
    }