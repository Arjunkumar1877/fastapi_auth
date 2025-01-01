from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum


class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in progress"
    completed = "completed"


class TaskBase(BaseModel):
    title: str = Field(..., max_length=255)
    description: str | None = None
    status: TaskStatus
    due_date: datetime | None = None
    image_url: str | None = None


class TaskCreate(TaskBase):
    pass

class TaskUpdate(TaskBase):
    pass

class TaskResponse(TaskBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: int

    class Config:
        orm_mode = True


class TaskAnalyticsResponse(BaseModel):
    total_tasks: int
    pending_tasks: int
    in_progress_tasks: int
    completed_tasks: int