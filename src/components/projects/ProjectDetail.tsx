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
  const { projects, tasks, completeProject, deleteProject } = useTasks();
  const [isAddTaskDialogOpen, setIsAddTaskDialogOpen] = useState(false);
  
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;
  
  const projectTasks = tasks.filter(t => t.projectId === projectId);
  const activeTasks = projectTasks.filter(t => !t.completed);
  const completedTasks = projectTasks.filter(t => t.completed);
  
  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="mb-4"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Projects
        </Button>
        <div className="flex gap-2">
          {!project.completed && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => completeProject(projectId)}
            >
              <CheckCircle className="h-4 w-4 mr-1" />
              Complete Project
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteProject(projectId)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Delete Project
          </Button>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
          {project.description && (
            <CardDescription>{project.description}</CardDescription>
          )}
          {project.deadline && (
            <div className="flex items-center text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4 mr-1" />
              Due {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}
            </div>
          )}
        </CardHeader>
      </Card>
      
      {/* Project Resources */}
      <ProjectResources projectId={projectId} />
      
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
