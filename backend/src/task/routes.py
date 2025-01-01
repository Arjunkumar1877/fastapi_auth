from fastapi import APIRouter, Depends, HTTPException, status, Form, File, UploadFile
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from src.task.services import TaskService
from src.task.schemas import TaskCreate, TaskResponse, TaskAnalyticsResponse
from src.db.base import get_db
from src.auth.services import AuthService
from src.user.models import User
from src.user.schemas import UserResponse
from src.task.schemas import TaskUpdate
from datetime import datetime

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

router = APIRouter(
    prefix="/tasks",
    tags=["tasks"]
)

def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)):
    return AuthService.get_current_user(token, db) 

@router.post("/", response_model=TaskResponse)
def create_task(
    title: str = Form(...),
    description: str = Form(...),
    status: str = Form(...),
    due_date: str = Form(...),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    form_data = {
        "title": title,
        "description": description,
        "status": status,
        "due_date": due_date
    }
    return TaskService(db).create_task(form_data, current_user, image)

@router.get("/", response_model=list[TaskResponse])
def get_all_tasks(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return TaskService(db).get_all_tasks(current_user)

@router.get("/{task_id}", response_model=TaskResponse)
def get_task_by_id(task_id: int, db: Session = Depends(get_db)):
    return TaskService(db).get_task_by_id(task_id)

@router.put("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    title: str = Form(None),
    description: str = Form(None),
    status: str = Form(None),
    due_date: str = Form(None),
    image: UploadFile | None = File(None),
    db: Session = Depends(get_db)
):
    form_data = {
        "title": title,
        "description": description,
        "status": status,
        "due_date": due_date,
    }

    return TaskService(db).update_task(task_id, form_data, image)


@router.patch("/{task_id}", response_model=TaskResponse)
def partial_update_task(task_id: int, task: TaskUpdate, db: Session = Depends(get_db)):
    return TaskService(db).update_task(task_id, task)
    
@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db)): 
    return TaskService(db).delete_task(task_id)

@router.get("/analytics/", response_model=TaskAnalyticsResponse)
def get_task_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return TaskService(db).get_task_analytics(current_user)