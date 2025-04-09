
import { useState } from "react";
import { useTasks, Task, Subtask } from "@/context/TaskContext";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Check, Clock, PlusCircle, ChevronDown, ChevronRight, 
  CheckCircle, Trash2, Brain, Sparkles, Coffee, Zap, Moon 
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface TaskItemProps {
  task: Task;
}

export const TaskItem = ({ task }: TaskItemProps) => {
  const { completeTask, deleteTask, addSubtask, completeSubtask, deleteSubtask } = useTasks();
  
  const [expanded, setExpanded] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [completionMinutes, setCompletionMinutes] = useState("");
  const [newSubtaskName, setNewSubtaskName] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);

  // Format estimated time
  const formatEstimatedTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Get mood icon
  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case "Creative": return <Sparkles size={16} className="mr-1 text-purple-500" />;
      case "Focused": return <Brain size={16} className="mr-1 text-blue-500" />;
      case "Relaxed": return <Coffee size={16} className="mr-1 text-green-500" />;
      case "Energetic": return <Zap size={16} className="mr-1 text-amber-500" />;
      case "Tired": return <Moon size={16} className="mr-1 text-gray-500" />;
      default: return null;
    }
  };

  const handleCompleteTask = () => {
    setIsCompleteDialogOpen(true);
  };

  const handleCompleteConfirm = () => {
    completeTask(task.id, parseInt(completionMinutes) || task.estimatedTime);
    setCompletionMinutes("");
    setIsCompleteDialogOpen(false);
  };

  const handleAddSubtask = () => {
    if (!newSubtaskName.trim()) return;
    
    addSubtask(task.id, newSubtaskName.trim());
    setNewSubtaskName("");
    setIsAddingSubtask(false);
    // Expand to show the new subtask
    setExpanded(true);
  };

  return (
    <>
      <Card className={`transition-all hover:shadow-sm ${task.completed ? 'bg-muted/30' : ''}`}>
        <CardContent className="p-3">
          <div className="flex items-center">
            <div 
              role="button" 
              onClick={() => setExpanded(!expanded)}
              className="mr-2"
              aria-label={expanded ? "Collapse task" : "Expand task"}
            >
              {expanded ? (
                <ChevronDown size={18} className="text-muted-foreground" />
              ) : (
                <ChevronRight size={18} className="text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className={task.completed ? "text-muted-foreground line-through" : "font-medium"}>
                  {task.name}
                </span>
                {task.mood && (
                  <div className="flex items-center">
                    {getMoodIcon(task.mood)}
                  </div>
                )}
                {task.subtasks.length > 0 && (
                  <Badge variant="outline" className="ml-1">
                    {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center text-xs text-muted-foreground mt-1">
                <Clock size={12} className="mr-1" />
                <span>Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}</span>
                <span className="mx-1">•</span>
                <span>{formatEstimatedTime(task.estimatedTime)}</span>
              </div>
            </div>
            
            <div className="flex gap-1">
              {!task.completed && (
                <>
                  <Button variant="ghost" size="icon" onClick={handleCompleteTask}>
                    <Check size={16} className="text-green-500" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </>
              )}
              {task.completed && (
                <CheckCircle size={16} className="text-green-500" />
              )}
            </div>
          </div>
          
          {/* Subtasks */}
          {expanded && (
            <div className="mt-2 pl-6 space-y-2">
              {task.subtasks.length > 0 && (
                <div className="space-y-1">
                  {task.subtasks.map((subtask) => (
                    <div key={subtask.id} className="flex items-center text-sm">
                      {!subtask.completed ? (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6" 
                          onClick={() => completeSubtask(task.id, subtask.id)}
                        >
                          <div className="h-4 w-4 rounded-full border border-muted-foreground" />
                        </Button>
                      ) : (
                        <CheckCircle size={16} className="text-green-500 ml-1 mr-1" />
                      )}
                      <span className={subtask.completed ? "line-through text-muted-foreground" : ""}>
                        {subtask.name}
                      </span>
                      {!subtask.completed && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 ml-auto" 
                          onClick={() => deleteSubtask(task.id, subtask.id)}
                        >
                          <Trash2 size={12} className="text-muted-foreground" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add subtask input */}
              {!task.completed && (
                <div className="pt-1">
                  {isAddingSubtask ? (
                    <div className="flex gap-2">
                      <Input 
                        size={1}
                        placeholder="Enter subtask"
                        value={newSubtaskName}
                        onChange={(e) => setNewSubtaskName(e.target.value)}
                        className="h-8 text-sm flex-1"
                      />
                      <Button size="sm" className="h-8" onClick={handleAddSubtask}>
                        Add
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setIsAddingSubtask(true)} 
                      className="text-xs"
                    >
                      <PlusCircle size={14} className="mr-1" />
                      Add Subtask
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Complete task dialog */}
      <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Task</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid gap-2">
              <label htmlFor="completionTime">How many minutes did it take?</label>
              <Input
                id="completionTime"
                type="number"
                min="1"
                value={completionMinutes}
                onChange={(e) => setCompletionMinutes(e.target.value)}
                placeholder="Enter minutes"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleCompleteConfirm}>
              Complete Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
