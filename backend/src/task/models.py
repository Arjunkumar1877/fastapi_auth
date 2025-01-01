from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLAlchemyEnum
from src.db.base import Base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

class TaskStatus(str, Enum):
    pending = "pending"
    in_progress = "in progress"
    completed = "completed"

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), index=True, nullable=False)
    description = Column(String, index=True, nullable=True)
    status = Column(SQLAlchemyEnum(TaskStatus), default=TaskStatus.pending, nullable=False)
    due_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    image_url = Column(String(255), nullable=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)

    user = relationship("User", back_populates="tasks")

    def __repr__(self):
        return f"<ToDoItem(id={self.id}, title={self.title}, status={self.status})>"
