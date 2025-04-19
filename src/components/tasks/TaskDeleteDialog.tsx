
import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface TaskDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskName: string;
}

export const TaskDeleteDialog = ({ open, onOpenChange, taskId, taskName }: TaskDeleteDialogProps) => {
  const { deleteTask } = useTasks();
  const [useForTraining, setUseForTraining] = useState(true);
  
  const handleConfirmDelete = () => {
    deleteTask(taskId, useForTraining);
    onOpenChange(false);
  };
  
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Task</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete "{taskName}"?
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex items-center space-x-2 py-4">
          <Checkbox 
            id="useForTraining" 
            checked={useForTraining}
            onCheckedChange={(checked) => setUseForTraining(checked as boolean)}
          />
          <Label htmlFor="useForTraining" className="text-sm">
            Use this task data to train the AI on my habits
          </Label>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmDelete} className="bg-red-500 hover:bg-red-600">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
