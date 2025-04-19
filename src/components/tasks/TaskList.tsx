import { useState } from "react";
import { useTasks, Task } from "@/context/TaskContext";
import { TaskDeleteDialog } from "./TaskDeleteDialog";
import { formatDistanceToNow } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Check,
  Trash,
  BarChart2,
  Clock,
  Sparkles,
  Brain,
  Coffee,
  Zap,
  Moon,
  Trash2
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export const TaskList = () => {
  const { tasks, currentMood, completeTask, setTaskDifficulty, deleteCompletedTasks, updateAITrainingPreference } = useTasks();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState("");
  const [selectedTaskName, setSelectedTaskName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [difficultyDialogOpen, setDifficultyDialogOpen] = useState(false);
  const [completionMinutes, setCompletionMinutes] = useState("");
  const [useForAITraining, setUseForAITraining] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const completedToday = tasks.filter(task => {
    if (!task.completed || !task.completedAt) return false;
    const today = new Date();
    const completedDate = new Date(task.completedAt);
    return (
      completedDate.getDate() === today.getDate() &&
      completedDate.getMonth() === today.getMonth() &&
      completedDate.getFullYear() === today.getFullYear()
    );
  });

  const handleDeleteTask = (id: string, name: string) => {
    setSelectedTaskId(id);
    setSelectedTaskName(name);
    setDeleteDialogOpen(true);
  };

  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);
  
  const handleCompleteClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setIsDialogOpen(true);
  };
  
  const handleDifficultyClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setDifficultyDialogOpen(true);
  };
  
  const handleDifficultySet = (difficulty: "easy" | "medium" | "hard") => {
    if (selectedTaskId) {
      setTaskDifficulty(selectedTaskId, difficulty);
      setSelectedTaskId("");
      setDifficultyDialogOpen(false);
    }
  };
  
  const handleCompleteSubmit = () => {
    if (selectedTaskId) {
      completeTask(selectedTaskId, parseInt(completionMinutes) || 0);
      setSelectedTaskId("");
      setCompletionMinutes("");
      setIsDialogOpen(false);
    }
  };

  const formatDeadline = (deadline: Date | string) => {
    if (!deadline) return 'No deadline';
    return formatDistanceToNow(deadline, { addSuffix: true });
  };
  
  const getPriorityColor = (priority: number) => {
    if (priority >= 80) return "bg-red-500";
    if (priority >= 60) return "bg-orange-500";
    if (priority >= 40) return "bg-yellow-500";
    if (priority >= 20) return "bg-blue-500";
    return "bg-green-500";
  };
  
  const getDifficultyBadge = (difficulty?: number) => {
    if (!difficulty) return { text: "Not rated", class: "bg-gray-500" };
    
    if (difficulty >= 80) return { text: "Very Hard", class: "bg-red-500" };
    if (difficulty >= 60) return { text: "Hard", class: "bg-orange-500" };
    if (difficulty >= 40) return { text: "Medium", class: "bg-yellow-500" };
    if (difficulty >= 20) return { text: "Easy", class: "bg-blue-500" };
    return { text: "Very Easy", class: "bg-green-500" };
  };
  
  const getEstimatedTimeText = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };
  
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
  
  const getMoodMatchStyle = (task: Task) => {
    if (task.mood && task.mood === currentMood) {
      return "border-l-4 border-l-purple-500";
    }
    return "";
  };
  
  const handleDeleteCompleted = async () => {
    await deleteCompletedTasks(useForAITraining);
  };

  const hasCompletedTasks = completedTasks.length > 0;

  return (
    <div className="space-y-6">
      {hasCompletedTasks && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm" className="ml-auto flex gap-2">
              <Trash2 className="h-4 w-4" />
              Delete Completed Tasks
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Completed Tasks</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete all completed tasks? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex items-center space-x-2 py-4">
              <Switch
                id="ai-training"
                checked={useForAITraining}
                onCheckedChange={setUseForAITraining}
              />
              <Label htmlFor="ai-training">Use completed tasks to train AI for better recommendations</Label>
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCompleted}>
                Delete Tasks
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
      
      {incompleteTasks.length > 0 ? (
        <div className="grid gap-4">
          {incompleteTasks.map(task => {
            const difficultyInfo = getDifficultyBadge(task.difficulty);
            
            return (
              <Card 
                key={task.id}
                className={`transition-all hover:shadow-md ${getMoodMatchStyle(task)}`}
              >
                <CardHeader className="py-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium">{task.name}</CardTitle>
                    <div 
                      className={`h-3 w-3 rounded-full ${getPriorityColor(Number(task.priority))}`} 
                      title={`Priority: ${Math.round(Number(task.priority))}/100`}
                    />
                  </div>
                </CardHeader>
                <CardContent className="py-2">
                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-1" />
                      <span>Due {formatDeadline(task.deadline)}</span>
                    </div>
                    
                    <span className="mx-1">•</span>
                    <span>{getEstimatedTimeText(task.estimatedTime)}</span>
                    
                    {task.mood && (
                      <>
                        <span className="mx-1">•</span>
                        <div className="flex items-center">
                          {getMoodIcon(task.mood)}
                          <span>{task.mood}</span>
                          {task.mood === currentMood && (
                            <Badge variant="outline" className="ml-1 text-[10px] py-0 h-4 bg-purple-100 text-purple-800 border-purple-300">
                              Matching Vibe
                            </Badge>
                          )}
                        </div>
                      </>
                    )}
                    
                    <div className="flex items-center ml-auto">
                      <BarChart2 size={16} className="mr-1" />
                      <Badge className={difficultyInfo.class}>
                        {difficultyInfo.text}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-1 pb-3 flex flex-wrap gap-2 justify-between">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeleteTask(task.id, task.name)}
                      className="text-muted-foreground"
                    >
                      <Trash size={16} className="mr-1" />
                      Delete
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDifficultyClick(task)}
                    >
                      <BarChart2 size={16} className="mr-1" />
                      Rate
                    </Button>
                  </div>
                  <Button 
                    variant="default" 
                    size="sm" 
                    onClick={() => handleCompleteClick(task)}
                    className={task.mood === currentMood ? 
                      "bg-gradient-to-r from-purple-500 to-blue-500" : 
                      ""}
                  >
                    <Check size={16} className="mr-1" />
                    Complete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No tasks to do. Add one to get started!</p>
        </div>
      )}
      
      {completedTasks.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Completed Tasks</h2>
          <div className="grid gap-3">
            {completedTasks.map(task => {
              const difficultyInfo = getDifficultyBadge(task.difficulty);
              
              return (
                <div key={task.id} className="flex items-center px-3 py-2 rounded-md bg-muted">
                  <Check size={16} className="mr-2 text-green-500" />
                  <span className="text-muted-foreground line-through">{task.name}</span>
                  
                  <div className="flex items-center ml-auto gap-2">
                    {task.mood && (
                      <div className="flex items-center">
                        {getMoodIcon(task.mood)}
                      </div>
                    )}
                    
                    <Badge className={cn("text-[10px]", difficultyInfo.class)}>
                      {difficultyInfo.text}
                    </Badge>
                    
                    {task.actualTime && (
                      <Badge variant="outline">
                        {getEstimatedTimeText(task.actualTime)}
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
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
      
      <Dialog open={difficultyDialogOpen} onOpenChange={setDifficultyDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Rate Task Difficulty</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              Rating the difficulty helps the AI better calculate points and rewards
            </p>
            
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                className="border-blue-500 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                onClick={() => handleDifficultySet("easy")}
              >
                Easy
              </Button>
              <Button
                variant="outline"
                className="border-yellow-500 text-yellow-500 hover:text-yellow-600 hover:bg-yellow-50"
                onClick={() => handleDifficultySet("medium")}
              >
                Medium
              </Button>
              <Button
                variant="outline"
                className="border-red-500 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => handleDifficultySet("hard")}
              >
                Hard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      <TaskDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        taskId={selectedTaskId}
        taskName={selectedTaskName}
      />
    </div>
  );
};
