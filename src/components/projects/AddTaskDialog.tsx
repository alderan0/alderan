
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useTasks } from '@/context/TaskContext';
import { Textarea } from '@/components/ui/textarea';
import { DatePicker } from '@/components/ui/date-picker';
import { toast } from 'sonner';

interface AddTaskDialogProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTaskDialog({ projectId, open, onOpenChange }: AddTaskDialogProps) {
  const { addTask } = useTasks();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<Date | undefined>(undefined);
  const [estimatedTime, setEstimatedTime] = useState('');
  const [mood, setMood] = useState<"Creative" | "Focused" | "Relaxed" | "Energetic" | "Tired">("Focused");
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title) {
      toast.error('Please enter a task title');
      return;
    }
    
    if (!dueDate) {
      toast.error('Please select a due date');
      return;
    }
    
    const estimatedMinutes = parseInt(estimatedTime) || 30;
    
    try {
      await addTask({
        name: title,
        deadline: dueDate,
        estimatedTime: estimatedMinutes,
        mood: mood,
      });
      
      toast.success('Task added successfully');
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast.error('Failed to add task');
      console.error(error);
    }
  };
  
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setDueDate(undefined);
    setEstimatedTime('');
    setMood("Focused");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Task to Project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Due Date</Label>
              <Input 
                type="date"
                value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                onChange={(e) => setDueDate(e.target.value ? new Date(e.target.value) : undefined)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
              <Input
                id="estimatedTime"
                type="number"
                min="1"
                placeholder="30"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="mood">Task Mood</Label>
              <Select
                value={mood}
                onValueChange={(value) => setMood(value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mood" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Creative">Creative</SelectItem>
                  <SelectItem value="Focused">Focused</SelectItem>
                  <SelectItem value="Relaxed">Relaxed</SelectItem>
                  <SelectItem value="Energetic">Energetic</SelectItem>
                  <SelectItem value="Tired">Tired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default AddTaskDialog;
