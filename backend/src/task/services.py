from src.task.models import Task
from src.task.schemas import TaskCreate, TaskUpdate, TaskResponse
from src.db.base import Base
from sqlalchemy.orm import Session
from fastapi import HTTPException, status, UploadFile
from src.user.models import User
from uuid import uuid4
import os
import shutil
from datetime import datetime
from pathlib import Path

class TaskService:
    def __init__(self, db: Session):
        self.db = db
        self.upload_dir = Path("static/images/tasks").resolve()
        self.upload_dir.mkdir(parents=True, exist_ok=True)  
    def save_image(self, image: UploadFile) -> str:
        """Save uploaded image and return the file path"""
        filename = f"{datetime.now().strftime('%Y%m%d_%H%M%S')}{Path(image.filename).suffix}"
        file_path = self.upload_dir / filename  

        with file_path.open("wb") as buffer:
            shutil.copyfileobj(image.file, buffer)

        return f"/static/images/tasks/{filename}"

    def create_task(
        self, 
        form_data: dict, 
        current_user: User, 
        image: UploadFile | None = None 
    ) -> Task:
        try:
            task_data = {
                **form_data,
                "image_url": self.save_image(image) if image else None,
                "due_date": datetime.fromisoformat(form_data["due_date"]),
                "user_id": current_user.id,
            }
            
            task = Task(**task_data)
            self.db.add(task)
            self.db.commit()
            self.db.refresh(task)
            return task
            
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=400, detail=str(e))
        
    def get_task_by_id(self, task_id: int) -> TaskResponse:
        task = self.db.query(Task).filter(Task.id == task_id).first()
        if task is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        return task

    def update_task(self, task_id: int, form_data: dict, image: UploadFile | None = None) -> TaskResponse:
        print("----update task----")
        print("form data", form_data)
        db_task = self.get_task_by_id(task_id)
        print("db_task", db_task)
        try:
            update_data = {
                **form_data,
                "due_date": datetime.fromisoformat(form_data["due_date"])
            }

            if image:
                print("image")
                new_image_url = self.save_image(image)
                update_data["image_url"] = new_image_url
            else:
                print("no image")
                update_data["image_url"] = ""

            self.db.query(Task).filter(Task.id == task_id).update(update_data)
            self.db.commit()
            self.db.refresh(db_task)
            return db_task
        except Exception as e:
            self.db.rollback()
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


    def delete_task(self, task_id: int):
        task = self.get_task_by_id(task_id)
        try:
            self.db.delete(task)
            self.db.commit()
            return {"message": "Task deleted successfully"}
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
        
    def get_all_tasks(self, current_user: User):
        return self.db.query(Task).filter(Task.user_id == current_user.id).all()
    
    def get_task_analytics(self, current_user: User):
        tasks = self.db.query(Task).filter(Task.user_id == current_user.id).all()
        return {
            "total_tasks": len(tasks),
            "pending_tasks": len([task for task in tasks if task.status == "pending"]),
            "in_progress_tasks": len([task for task in tasks if task.status == "in_progress"]),
            "completed_tasks": len([task for task in tasks if task.status == "completed"]),
        }