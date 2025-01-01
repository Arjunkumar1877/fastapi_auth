import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Task, TaskStatus } from '@/types/task';
import { baseURL } from '@/api/const';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

interface FormErrors {
  title?: string;
  status?: string;
  due_date?: string;
}

interface TaskFormProps {
  initialData?: Task;
  onSubmit: (formData: FormData) => Promise<void>;
  isLoading: boolean;
}

const INITIAL_FORM_DATA = {
  title: "",
  description: "",
  status: "",
  due_date: "",
  image_url: "",
};

const TaskForm: React.FC<TaskFormProps> = ({ 
  initialData = INITIAL_FORM_DATA,
  onSubmit,
  isLoading 
}) => {
  const [errors, setErrors] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [formData, setFormData] = useState(initialData);
  const [statusOptions] = useState<TaskStatus[]>([
    TaskStatus.Pending,
    TaskStatus.InProgress,
    TaskStatus.Completed,
  ]);
  

  useEffect(() => {
    if (initialData.image_url) {
      setPreviewUrl(baseURL + initialData.image_url);
    } else {
      setPreviewUrl(null);
    }
  }, [initialData]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.status.trim()) {
      newErrors.status = 'Status is required';
    }
    
    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    }

    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    
    if (name === "image") {
      const file = files?.[0];
      if (file) {
        setSelectedImage(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (formErrors[name as keyof FormErrors]) {
        setFormErrors(prev => ({ ...prev, [name]: undefined }));
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'image_url') {
          data.append(key, value);
        }
      });
      
      if (selectedImage) {
        data.append("image", selectedImage);
      } else {
        data.append("image_url", "");
      }

      await onSubmit(data);
    } catch (error: any) {
      setErrors([error.response?.data?.detail || "An unknown error occurred"]);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image_url: "" }));
    setSelectedImage(null);
    setPreviewUrl(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <div className="space-y-2">
        <Label htmlFor="title">Title*</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={formErrors.title ? "border-red-500" : ""}
        />
        {formErrors.title && (
          <p className="text-red-500 text-sm">{formErrors.title}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="status">Status*</Label>
        <Select 
            name="status"
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
        >
            <SelectTrigger className={formErrors.status ? "border-red-500" : ""}>
            <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
            {statusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
            ))}
            </SelectContent>
        </Select>
        {formErrors.status && (
            <p className="text-red-500 text-sm">{formErrors.status}</p>
        )}
        </div>
      <div className="space-y-2">
        <Label htmlFor="due_date">Due Date*</Label>
        <Input
          id="due_date"
          name="due_date"
          type="date"
          value={formData.due_date}
          onChange={handleChange}
          className={formErrors.due_date ? "border-red-500" : ""}
        />
        {formErrors.due_date && (
          <p className="text-red-500 text-sm">{formErrors.due_date}</p>
        )}
      </div>
      <div className="space-y-2">
        {previewUrl ? (
          <div className="mt-2 flex items-center justify-around">
            <img
              src={previewUrl}
              alt="Preview"
              width={200}
              height={200}
              className="object-cover"
            />
            <div className="mt-2">
              <Button variant={"outlineDestructive"} size={"sm"} onClick={removeImage}>Remove Image</Button>
            </div>
          </div>
        ) : (
            <div>
            <Label htmlFor="image">Upload Image</Label>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
            />
            </div>
        )}
      </div>
      {errors.length > 0 && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors[0]}</AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {initialData === INITIAL_FORM_DATA ? 'Adding...' : 'Updating...'} 
          </>
        ) : (
          initialData === INITIAL_FORM_DATA ? 'Add Task' : 'Update Task'
        )}
      </Button>
    </form>
  );
};

export default TaskForm;