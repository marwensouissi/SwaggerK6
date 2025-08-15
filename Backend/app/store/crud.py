from sqlalchemy.orm import Session
from app.models import models
from passlib.context import CryptContext
from app.classes import schemas
from app.security import get_password_hash
from datetime import datetime, timedelta
import secrets

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 10):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate, role: str = "user", require_verification: bool = True):
    # ensure unique username/email handled by DB uniqueness - you may want to check and raise HTTPException in router
    hashed_pw = get_password_hash(user.password)
    verification_token = None
    verification_expiry = None
    is_verified = False
    if not require_verification:
        is_verified = True
    else:
        verification_token = secrets.token_urlsafe(32)
        verification_expiry = datetime.utcnow() + timedelta(hours=24)

    db_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed_pw,
        role=role,
        is_verified=is_verified,
        verification_token=verification_token,
        verification_expiry=verification_expiry
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def set_user_verified(db: Session, user: models.User):
    user.is_verified = True
    user.verification_token = None
    user.verification_expiry = None
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def set_verification_token(db: Session, user: models.User, hours_valid: int = 24):
    import secrets
    from datetime import datetime, timedelta
    t = secrets.token_urlsafe(32)
    user.verification_token = t
    user.verification_expiry = datetime.utcnow() + timedelta(hours=hours_valid)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user_id: int):
    user = get_user(db, user_id)
    if user:
        db.delete(user)
        db.commit()
    return user

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not verify_password(password, user.password):
        return None
    return user

def get_user_scenarios(db: Session, user_id: int):
    return db.query(models.Scenario).filter(models.Scenario.user_id == user_id).all()

