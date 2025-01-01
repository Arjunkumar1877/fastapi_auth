from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from src.user.models import User
from src.auth.schemas import UserLogin, Token, TokenData
from src.auth.utils.jwt import create_access_token, verify_token, create_refresh_token
from src.auth.utils.password import verify_password
from src.config import settings
from datetime import timedelta
from typing import Optional
from src.user.schemas import UserResponse
import jwt


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

        refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        refresh_token = create_refresh_token(
            data={"id": user.id}, expires_delta=refresh_token_expires
        )

        return {
            "access_token": access_token, 
            "refresh_token": refresh_token,
            "token_type": "bearer"
            }
    
    def refresh_token(self, token_request: TokenData) -> Token: 
        user = self.get_current_user(token_request, self.db)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, 
                detail="Invalid refresh token",
            )
        
        access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"id": user.id}, expires_delta=access_token_expires
        )

        refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
        refresh_token = create_refresh_token(
            data={"id": user.id}, expires_delta=refresh_token_expires
        )
  
        return {
            "access_token": access_token, 
            "refresh_token": refresh_token,
            "token_type": "bearer"
            }
    
    def verify_token(self, token: str):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
            return payload  
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
            )
        except jwt.JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )

    @staticmethod
    def get_current_user(token: str, db: Session) -> User:
        payload = verify_token(token)  
        user_id = payload.get("id")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
            )
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        return user
