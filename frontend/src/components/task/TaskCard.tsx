import React from 'react';
import { Check, Clock, CalendarDays, AlertCircle, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Task } from '@/types/task';
import { baseURL } from '@/api/const';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'in progress':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const TaskCard = ({ task, onEdit, onDelete }: TaskCardProps) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const isOverdue = task.due_date && new Date(task.due_date) < new Date();

  return (
    <div className='flex flex-col p-4 hover:bg-gray-50 border border-gray-200 transition-colors rounded-lg'>
    <div className="group flex items-center">
        <div className="flex-grow min-w-0">
        <div className="flex items-center mb-1">
          <h3 className={`font-medium truncate ${
            task.status.toLowerCase() === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
          <span className={`ml-2 px-2 py-0.5 text-xs rounded-full ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-500 line-clamp-2 mb-2">{task.description}</p>
        )}
      </div>

      {task.image_url && (
        <div className="flex-shrink-0 ml-8">
          <img
            src={`${baseURL}${task.image_url}`}
            alt={task.title}
            className="w-14 h-14 rounded object-cover"
          />
        </div>
      )}

      <div className="flex-shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8">
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem 
              onClick={() => onDelete(task)}
              className="text-red-600"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
        
    </div>
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {task.due_date && (
            <div className="flex items-center">
              {isOverdue ? (
                <AlertCircle className="w-4 h-4 mr-1 text-red-500" />
              ) : (
                <CalendarDays className="w-4 h-4 mr-1" />
              )}
              <span className={isOverdue ? 'text-red-500' : ''}>
                Due {formatDate(task.due_date)}
              </span>
            </div>
          )}
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Created {formatDate(task.created_at)}</span>
          </div>
        </div>
    </div>
  );
};

export default TaskCard;