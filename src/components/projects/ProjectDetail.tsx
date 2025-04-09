
import { useState } from "react";
import { useTasks, Task } from "@/context/TaskContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  Calendar, 
  CheckCircle, 
  Trash2, 
  PlusCircle, 
  ExternalLink, 
  Code,
  BookOpen
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AddTaskDialog } from "./AddTaskDialog";
import { TaskItem } from "./TaskItem";
import { ProjectResources } from "./ProjectResources";

interface ProjectDetailProps {
  projectId: string;
  onBack: () => void;
}

export const ProjectDetail = ({ projectId, onBack }: ProjectDetailProps) => {
  const { 
    projects, completeProject, deleteProject, 
    tasks, getProjectResources
  } = useTasks();
  
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const project = projects.find(p => p.id === projectId);
  
  if (!project) {
    return (
      <div className="text-center py-8">
        <p>Project not found.</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }

  // Get tasks for this project
  const projectTasks = tasks.filter(task => task.projectId === projectId);
  const activeTasks = projectTasks.filter(task => !task.completed);
  const completedTasks = projectTasks.filter(task => task.completed);
  
  // Get AI-suggested resources for this project
  const projectResources = getProjectResources(projectId);

  const handleComplete = () => {
    completeProject(projectId);
  };

  const handleDelete = () => {
    if (confirmDelete) {
      deleteProject(projectId);
      onBack();
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000); // Reset after 3 seconds
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center">
        <Button onClick={onBack} variant="ghost" size="sm" className="mr-4">
          <ChevronLeft className="mr-1 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold flex-1">
          {project.name}
          {project.completed && (
            <CheckCircle className="inline ml-2 h-5 w-5 text-green-500" />
          )}
        </h1>
        <div className="space-x-2">
          {!project.completed && (
            <Button 
              onClick={handleComplete} 
              variant="outline" 
              size="sm"
              className="border-green-500 text-green-500 hover:bg-green-500/10"
            >
              <CheckCircle className="mr-1 h-4 w-4" />
              Complete
            </Button>
          )}
          <Button 
            onClick={handleDelete} 
            variant="destructive" 
            size="sm"
          >
            <Trash2 className="mr-1 h-4 w-4" />
            {confirmDelete ? "Confirm Delete" : "Delete"}
          </Button>
        </div>
      </div>
      
      {/* Project info */}
      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {project.description && (
              <p className="text-muted-foreground">{project.description}</p>
            )}
            <div className="flex items-center text-sm">
              <Calendar className="mr-1 h-4 w-4" />
              <span>Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}</span>
            </div>
            {project.deadline && (
              <div className="flex items-center text-sm">
                <Calendar className="mr-1 h-4 w-4 text-orange-500" />
                <span>Due {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}</span>
              </div>
            )}
            {project.completedAt && (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle className="mr-1 h-4 w-4" />
                <span>Completed {formatDistanceToNow(new Date(project.completedAt), { addSuffix: true })}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* AI-Suggested Resources */}
      <ProjectResources resources={projectResources} />
      
      {/* Tasks Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Tasks</h2>
          {!project.completed && (
            <Button 
              onClick={() => setIsAddTaskDialogOpen(true)}
              size="sm"
              variant="outline"
            >
              <PlusCircle className="mr-1 h-4 w-4" />
              Add Task
            </Button>
          )}
        </div>
        
        {/* Active Tasks */}
        {activeTasks.length > 0 ? (
          <div className="space-y-2">
            {activeTasks.map(task => (
              <TaskItem key={task.id} task={task} />
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground text-center py-6 bg-muted/20 rounded-lg">
            <p>No active tasks. Add a task to get started.</p>
          </div>
        )}
        
        {/* Completed Tasks */}
        {completedTasks.length > 0 && (
          <div className="mt-6 space-y-2">
            <h3 className="text-md font-medium text-muted-foreground">Completed Tasks</h3>
            <div className="space-y-2">
              {completedTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Add task dialog */}
      <AddTaskDialog 
        open={isAddTaskDialogOpen}
        onOpenChange={setIsAddTaskDialogOpen}
        projectId={projectId}
      />
    </div>
  );
};
