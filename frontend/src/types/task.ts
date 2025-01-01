export enum TaskStatus {
    Pending = "pending",
    InProgress = "in_progress",
    Completed = "completed"
}

export interface Task {
    id: number;
    title: string;
    description: string;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
    due_date: string | null;
    image_url: string | null;
}

export interface TaskAnalytics {
    total_tasks: number;
    pending_tasks: number;
    in_progress_tasks: number;
    completed_tasks: number;
}