
import { SuggestedTasks } from "@/components/tasks/SuggestedTasks";
import { TaskList } from "@/components/tasks/TaskList";
import { AddTaskForm } from "@/components/tasks/AddTaskForm";
import { MoodSelector } from "@/components/tasks/MoodSelector";
import { HabitTracker } from "@/components/tasks/HabitTracker";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Code, LineChart, FolderKanban } from "lucide-react";
import { useTasks } from "@/context/TaskContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AIScheduleRecommendations } from "@/components/tasks/AIScheduleRecommendations";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

const TasksPage = () => {
  const {
    currentMood,
    projects
  } = useTasks();
  const isMobile = useIsMobile();

  // Get active projects count
  const activeProjects = projects?.filter(p => !p.completed) || [];
  const activeProjectsCount = activeProjects.length;

  return <div className="pb-24 space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="col-span-3 md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">Dashboard</CardTitle>
            <CardDescription>
              Plan your day based on your current mood and coding rhythm
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MoodSelector />
            <SuggestedTasks />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center text-lg">
                <Calendar className="mr-2 h-5 w-5 text-purple-500" />
                Productivity Insights
              </CardTitle>
              
              {/* Project indicator instead of button */}
              <div className="flex items-center">
                <FolderKanban size={14} className="mr-1 text-blue-500" />
                <span className="text-sm">
                  {activeProjectsCount > 0 ? <>{activeProjectsCount} Active Project{activeProjectsCount !== 1 ? 's' : ''}</> : <>No Projects</>}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Display active project names */}
            {activeProjectsCount > 0 && (
              <div className="space-y-2 mb-3">
                <div className="flex flex-wrap gap-2">
                  {activeProjects.map(project => (
                    <Link to={`/app/projects?id=${project.id}`} key={project.id}>
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
      
      <Tabs defaultValue="tasks" className="w-full">
        <TabsList className={`grid grid-cols-3 mb-4 ${isMobile ? 'sticky top-0 z-10 bg-background/95 backdrop-blur-sm' : ''}`}>
          <TabsTrigger value="tasks" className="flex items-center">
            <Code className="mr-2 h-4 w-4" />
            <span>Tasks</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center">
            <Calendar className="mr-2 h-4 w-4" />
            <span>Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center">
            <LineChart className="mr-2 h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="tasks" className={isMobile ? 'pb-20' : ''}>
          <TaskList />
        </TabsContent>
        
        <TabsContent value="schedule">
          <AIScheduleRecommendations />
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Productivity Analytics</CardTitle>
              <CardDescription>Track your coding productivity over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Productivity analytics will be available once you complete more tasks.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <AddTaskForm />
    </div>;
};

export default TasksPage;
