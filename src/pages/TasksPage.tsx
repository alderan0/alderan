
import { SuggestedTasks } from "@/components/tasks/SuggestedTasks";
import { TaskList } from "@/components/tasks/TaskList";
import { AddTaskForm } from "@/components/tasks/AddTaskForm";
import { MoodSelector } from "@/components/tasks/MoodSelector";
import { HabitTracker } from "@/components/tasks/HabitTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, LineChart, FolderKanban } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AIScheduleRecommendations } from "@/components/tasks/AIScheduleRecommendations";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

const TasksPage = () => {
  const { currentMood, projects } = useTasks();
  const isMobile = useIsMobile();

  // Get active projects count
  const activeProjects = projects?.filter(p => !p.completed) || [];
  const activeProjectsCount = activeProjects.length;

  return (
    <div className="space-y-6 pb-24 animate-in fade-in duration-500">
      <div className={cn(
        "grid gap-6",
        isMobile ? "grid-cols-1" : "grid-cols-1 lg:grid-cols-3"
      )}>
        {/* Main Dashboard Card */}
        <Card className={cn(
          "col-span-1",
          !isMobile && "lg:col-span-2"
        )}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
              Dashboard
            </CardTitle>
            <CardDescription>
              Plan your day based on your current mood and coding rhythm
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <MoodSelector />
            <SuggestedTasks />
          </CardContent>
        </Card>

        {/* Productivity Insights Card */}
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                Insights
              </CardTitle>
              <div className="flex items-center">
                <FolderKanban size={14} className="mr-1 text-blue-500" />
                <span className="text-sm">
                  {activeProjectsCount > 0 ? (
                    <>{activeProjectsCount} Active Project{activeProjectsCount !== 1 ? 's' : ''}</>
                  ) : (
                    <>No Projects</>
                  )}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {activeProjectsCount > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {activeProjects.map(project => (
                    <Link 
                      to={`/app/projects?id=${project.id}`} 
                      key={project.id}
                      className="transition-transform hover:scale-105"
                    >
                      <Badge variant="outline" className="cursor-pointer hover:bg-accent">
                        {project.name}
                      </Badge>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            <HabitTracker />
          </CardContent>
        </Card>
      </div>

      {/* Task Management Section */}
      <div className="space-y-6">
        <Tabs defaultValue="tasks" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="tasks">All Tasks</TabsTrigger>
            <TabsTrigger value="ai">AI Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="tasks" className="space-y-4">
            <AddTaskForm />
            <TaskList />
          </TabsContent>
          <TabsContent value="ai">
            <AIScheduleRecommendations />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default TasksPage;
