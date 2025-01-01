import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import API from '@/api/axios';
import { Task } from '@/types/task';
import TaskForm from '@/components/common/task/TaskForm';
import ConfirmModal from '@/components/common/ConfirmModal';
import TaskCard from '@/components/task/TaskCard';

const Tasks = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>(undefined);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await API.get<Task[]>('/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      if (selectedTask) {
        const response = await API.put(`/tasks/${selectedTask.id}`, formData);
        setTasks(prev => prev.map(task => 
          task.id === selectedTask.id ? response.data : task
        ));
      } else {
        const response = await API.post('/tasks', formData);
        setTasks(prev => [...prev, response.data]);
      }
      handleCloseDialog();
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsOpen(false);
    setIsDeleteDialogOpen(false);
    setSelectedTask(undefined);
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsOpen(true);
  };

  const handleDelete = async (task: Task) => {
    setSelectedTask(task);
    setIsDeleteDialogOpen(true);
  };

  const onDeleteConfirm = async () => {
    if (selectedTask) {
      try {
        await API.delete(`/tasks/${selectedTask.id}`);
        setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setIsDeleteDialogOpen(false);
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Tasks</h2>
        <Dialog 
          open={isOpen} 
          onOpenChange={(open) => {
            setIsOpen(open);
            if (!open) {
              setSelectedTask(undefined);
            }
          }}
        >
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] mx-auto mx-4 p-4 rounded-lg">
            <DialogHeader>
              <DialogTitle>
                {selectedTask ? 'Edit Task' : 'Add Task'}
              </DialogTitle>
            </DialogHeader>
            <TaskForm
              initialData={selectedTask}
              onSubmit={handleSubmit}
              isLoading={isLoading}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <ConfirmModal
        isOpen={isDeleteDialogOpen}
        onClose={handleCloseDialog}
        onConfirm={onDeleteConfirm}
        loading={isLoading}
        title="Delete Task"
        description="Are you sure you want to delete this task? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </div>
  );
};

export default Tasks;