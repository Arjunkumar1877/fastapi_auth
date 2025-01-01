from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from src.auth.schemas import RefrestTokenRequest, UserLogin, Token, TokenRequest
from src.auth.services import AuthService
from src.db.base import get_db
from src.user.schemas import UserResponse

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

@router.post("/login", response_model=Token)
def login(user_login: UserLogin, db: Session = Depends(get_db)):
    return AuthService(db).login(user_login)

@router.post("/token/verify")
def verify_token(token_request: TokenRequest, db: Session = Depends(get_db)):
    return AuthService(db).verify_token(token_request.token)  

@router.post("/token/refresh", response_model=Token)
def refresh_token(token_request: RefrestTokenRequest, db: Session = Depends(get_db)):
    return AuthService(db).refresh_token(token_request.refresh_token)  

@router.get("/me", response_model=UserResponse)
def me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token is missing",
        )
    
    user = AuthService(db).get_current_user(token=token, db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    return user