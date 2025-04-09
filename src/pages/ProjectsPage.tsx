
import { useState } from "react";
import { useTasks } from "@/context/TaskContext";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Calendar, CheckCircle, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AddProjectDialog } from "@/components/projects/AddProjectDialog";
import { ProjectDetail } from "@/components/projects/ProjectDetail";

const ProjectsPage = () => {
  const { projects } = useTasks();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Filter for active and completed projects
  const activeProjects = projects.filter(p => !p.completed);
  const completedProjects = projects.filter(p => p.completed);

  const handleProjectClick = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const closeProjectDetail = () => {
    setSelectedProjectId(null);
  };

  return (
    <div className="pb-20 space-y-6">
      {/* If a project is selected, show project detail view */}
      {selectedProjectId ? (
        <ProjectDetail 
          projectId={selectedProjectId} 
          onBack={closeProjectDetail}
        />
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Projects
            </h1>
            <Button 
              onClick={() => setIsDialogOpen(true)}
              size="lg"
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 w-full sm:w-auto shadow-md transition-all hover:shadow-lg"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create New Project
            </Button>
          </div>
          
          {/* Active projects */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Active Projects</h2>
            {activeProjects.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {activeProjects.map(project => (
                  <Card 
                    key={project.id} 
                    className="cursor-pointer hover:shadow-md transition-all"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <CardHeader>
                      <CardTitle>{project.name}</CardTitle>
                      {project.description && (
                        <CardDescription>{project.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {/* Project details */}
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="mr-1 h-4 w-4" />
                          Created {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                        </div>
                        
                        {project.deadline && (
                          <div className="mt-1 flex items-center">
                            <Calendar className="mr-1 h-4 w-4 text-orange-500" />
                            Due {formatDistanceToNow(new Date(project.deadline), { addSuffix: true })}
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm">
                        View Details →
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground text-center py-12 bg-muted/50 rounded-lg">
                <p className="mb-4">No active projects. Create a new project to get started.</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-purple-500 to-blue-500"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create New Project
                </Button>
              </div>
            )}
          </div>
          
          {/* Completed projects */}
          {completedProjects.length > 0 && (
            <div className="space-y-4 mt-8">
              <h2 className="text-xl font-semibold">Completed Projects</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {completedProjects.map(project => (
                  <Card 
                    key={project.id} 
                    className="cursor-pointer hover:shadow-md transition-all bg-muted/30"
                    onClick={() => handleProjectClick(project.id)}
                  >
                    <CardHeader>
                      <div className="flex items-center space-x-2">
                        <CardTitle>{project.name}</CardTitle>
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </div>
                      {project.description && (
                        <CardDescription>{project.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      {/* Project details */}
                      <div className="text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <CheckCircle className="mr-1 h-4 w-4 text-green-500" />
                          Completed {project.completedAt && formatDistanceToNow(new Date(project.completedAt), { addSuffix: true })}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm">
                        View Details →
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Add project dialog */}
      <AddProjectDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </div>
  );
};

export default ProjectsPage;
