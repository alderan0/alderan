
import { useState } from "react";
import { Task, useTasks } from "@/context/TaskContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const TaskList = () => {
  const { tasks, completeTask, deleteTask } = useTasks();
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [completionMinutes, setCompletionMinutes] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const handleCompleteClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setIsDialogOpen(true);
  };
  
  const handleCompleteSubmit = () => {
    if (selectedTaskId) {
      completeTask(selectedTaskId, parseInt(completionMinutes) || 0);
      setSelectedTaskId(null);
      setCompletionMinutes("");
      setIsDialogOpen(false);
    }
  };

  const formatDeadline = (deadline: Date) => {
    return formatDistanceToNow(deadline, { addSuffix: true });
  };
  
  // Convert priority (0-100) to a color
  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return "bg-red-500";
    if (priority >= 60) return "bg-orange-500";
    if (priority >= 40) return "bg-yellow-500";
    if (priority >= 20) return "bg-blue-500";
    return "bg-green-500";
  };
  
  const getEstimatedTimeText = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  
  return (
    <div className="space-y-6">
      {/* Incomplete tasks */}
      {incompleteTasks.length > 0 ? (
        <div className="grid gap-4">
          {incompleteTasks.map(task => (
            <Card key={task.id}>
              <CardHeader className="py-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-medium">{task.name}</CardTitle>
                  <div 
                    className={`h-3 w-3 rounded-full ${getPriorityColor(task.priority)}`} 
                    title={`Priority: ${Math.round(task.priority)}/100`}
                  />
                </div>
              </CardHeader>
              <CardContent className="py-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock size={16} className="mr-1" />
                  <span>Due {formatDeadline(task.deadline)}</span>
                  <span className="mx-2">•</span>
                  <span>{getEstimatedTimeText(task.estimatedTime)}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-1 pb-3 flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => deleteTask(task.id)}
                  className="text-muted-foreground"
                >
                  <Trash size={16} className="mr-1" />
                  Delete
                </Button>
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => handleCompleteClick(task)}
                >
                  <Check size={16} className="mr-1" />
                  Complete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tasks to do. Add one to get started!</p>
        </div>
      )}
      
      {/* Completed tasks (if any) */}
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
          <div className="grid gap-3">
            {completedTasks.map(task => (
              <div key={task.id} className="flex items-center px-3 py-2 rounded-md bg-muted">
                <Check size={16} className="mr-2 text-green-500" />
                <span className="text-muted-foreground line-through">{task.name}</span>
                {task.actualTime && (
                  <Badge variant="outline" className="ml-auto">
                    {getEstimatedTimeText(task.actualTime)}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Complete task dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="completionTime">How many minutes did it take?</Label>
            <Input
              id="completionTime"
              type="number"
              min="1"
              value={completionMinutes}
              onChange={(e) => setCompletionMinutes(e.target.value)}
              className="mt-2"
              placeholder="Enter minutes"
            />
          </div>
          <DialogFooter>
            <Button onClick={handleCompleteSubmit}>
              Complete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
