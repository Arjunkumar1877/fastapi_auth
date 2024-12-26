from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from src.user.models import User
from src.auth.schemas import UserLogin, Token, TokenData
from src.auth.utils.jwt import create_access_token, verify_token
from src.auth.utils.password import verify_password
from src.config import settings
from datetime import timedelta
from typing import Optional
from src.user.schemas import UserResponse


class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def authenticate_user(self, email: str, password: str) -> User:
        user = self.db.query(User).filter(User.email == email).first()
        if not user or not verify_password(password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )
        return user

    def login(self, user_login: UserLogin) -> Token:
        user = self.authenticate_user(user_login.email, user_login.password)
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"id": user.id}, expires_delta=access_token_expires
        )
        return {"access_token": access_token, "token_type": "bearer"}

    def get_current_user(self, token: str) -> dict:
        payload = verify_token(token)
        id = payload.get("id")
        if id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        return self.db.query(User).filter(User.id == id).first()