from fastapi import APIRouter, Depends, HTTPException, status, Body
from sqlalchemy.orm import Session
from src.user.services import UserService
from src.user.schemas import UserCreate, UserResponse, UserUpdate
from src.db.base import get_db
from src.auth.services import AuthService

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return UserService(db).get_users()

@router.get("/{user_id}", response_model=UserResponse)
def get_user_by_id(user_id: int, db: Session = Depends(get_db)):
    return UserService(db).get_user_by_id(user_id)

@router.post("/register", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    return UserService(db).create_user(user)

@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user: UserUpdate, db: Session = Depends(get_db)):
    return UserService(db).update_user(user_id, user)

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    return UserService(db).delete_user(user_id)

@router.put("/password/{user_id}")
def change_password(user_id: int, password: str = Body(...), db: Session = Depends(get_db)):
    return UserService(db).change_password(user_id, password)