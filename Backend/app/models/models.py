from sqlalchemy import Column, Integer, String, ForeignKey, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)  # hashed password
    role = Column(String, default="user")
    is_verified = Column(Boolean, default=False)
    verification_token = Column(String, nullable=True)
    verification_expiry = Column(DateTime, nullable=True)

    scenarios = relationship("Scenario", back_populates="user")


class Scenario(Base):
    __tablename__ = "scenarios"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(Text)  # This holds the rendered/generated test script
    name = Column(String, index=True)  # Ensure unique usernames



    # Many-to-one relationship: Each scenario belongs to one user
    user = relationship("User", back_populates="scenarios")


