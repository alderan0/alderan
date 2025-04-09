
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTasks } from "@/context/TaskContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

export const AddTaskForm = () => {
  const { addTask } = useTasks();
  const [taskName, setTaskName] = useState("");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [estimatedHours, setEstimatedHours] = useState("");
  const [estimatedMinutes, setEstimatedMinutes] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName || !deadlineDate) {
      return;
    }
    
    // Combine date and time for deadline
    const dateString = `${deadlineDate}${deadlineTime ? 'T' + deadlineTime : 'T23:59'}`;
    const deadline = new Date(dateString);
    
    // Calculate total minutes
    const hours = parseInt(estimatedHours) || 0;
    const minutes = parseInt(estimatedMinutes) || 0;
    const totalMinutes = (hours * 60) + minutes;
    
    addTask({
      name: taskName,
      deadline,
      estimatedTime: totalMinutes || 30, // Default to 30 minutes if not specified
    });
    
    // Reset form
    setTaskName("");
    setDeadlineDate("");
    setDeadlineTime("");
    setEstimatedHours("");
    setEstimatedMinutes("");
    setIsOpen(false);
  };
  
  // Get today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-20 right-4 rounded-full h-14 w-14 shadow-lg">
          <Plus size={24} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="What do you need to do?"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline Date</Label>
            <Input
              id="deadline"
              type="date"
              value={deadlineDate}
              min={today}
              onChange={(e) => setDeadlineDate(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="deadlineTime">Deadline Time (Optional)</Label>
            <Input
              id="deadlineTime"
              type="time"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Estimated Time</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="estimatedHours"
                  type="number"
                  min="0"
                  value={estimatedHours}
                  onChange={(e) => setEstimatedHours(e.target.value)}
                  placeholder="Hours"
                />
              </div>
              <div className="flex-1">
                <Input
                  id="estimatedMinutes"
                  type="number"
                  min="0"
                  max="59"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                  placeholder="Minutes"
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" className="w-full">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
