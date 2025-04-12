
import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, CheckCircle, Sparkle } from "lucide-react";
import { formatDistanceToNow } from "@/lib/utils";
import { AddProjectDialog } from "@/components/projects/AddProjectDialog";
import { GenerateProjectDialog } from "@/components/projects/GenerateProjectDialog";
import { ProjectDetail } from "@/components/projects/ProjectDetail";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { AppNav } from "@/components/layout/AppNav";

const ProjectsPage = () => {
  const { projects } = useTasks();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isGenerateDialogOpen, setIsGenerateDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const isMobile = useIsMobile();

  const activeProjects = projects.filter(p => !p.completed);
  const completedProjects = projects.filter(p => p.completed);

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const closeProjectDetail = () => {
    setSelectedProjectId(null);
  };

  if (selectedProjectId) {
    return (
      <>
        <ProjectDetail projectId={selectedProjectId} onBack={closeProjectDetail} />
        <AppNav />
      </>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage and track your coding projects</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsGenerateDialogOpen(true)} variant="outline" className="gap-2">
            <Sparkle className="h-4 w-4 text-purple-500" />
            AI Generate
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Active Projects */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Active Projects</h2>
          {activeProjects.length > 0 ? (
            <div className={cn(
              "grid gap-4",
              isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
            )}>
              {activeProjects.map(project => (
                <Card 
                  key={project.id} 
                  className="group cursor-pointer hover:shadow-md transition-all duration-300"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <CardHeader>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {project.name}
                    </CardTitle>
                    {project.description && (
                      <CardDescription>{project.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                      </div>
                      {project.deadline && (
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-orange-500" />
                          Due {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="ml-auto group-hover:text-primary">
                      View Details →
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="bg-muted/50">
              <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground mb-4">No active projects. Create one to get started!</p>
                <Button onClick={() => setIsAddDialogOpen(true)} variant="outline" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Create Project
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Completed Projects */}
        {completedProjects.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-muted-foreground">Completed Projects</h2>
            <div className={cn(
              "grid gap-4",
              isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
            )}>
              {completedProjects.map(project => (
                <Card 
                  key={project.id} 
                  className="group cursor-pointer hover:shadow-md transition-all duration-300 bg-muted/30"
                  onClick={() => handleProjectClick(project.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="group-hover:text-primary transition-colors">
                        {project.name}
                      </CardTitle>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                    {project.description && (
                      <CardDescription>{project.description}</CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <div className="flex items-center">
                        <Calendar className="mr-2 h-4 w-4" />
                        Completed {project.completedAt && formatDistanceToNow(new Date(project.completedAt), { addSuffix: true })}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="ghost" size="sm" className="ml-auto group-hover:text-primary">
                      View Details →
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddProjectDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen}
      />
      
      <GenerateProjectDialog
        open={isGenerateDialogOpen}
        onOpenChange={setIsGenerateDialogOpen}
      />
      
      {/* Bottom Navigation */}
      <AppNav />
    </div>
  );
};

export default ProjectsPage;
