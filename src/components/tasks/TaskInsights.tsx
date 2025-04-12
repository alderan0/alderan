import { useTasks } from "@/context/TaskContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, CheckCircle2, Clock, Target } from "lucide-react";

export const TaskInsights = () => {
  const { tasks, getTaskStats } = useTasks();
  const stats = getTaskStats();

  const insights = [
    {
      title: "Completion Rate",
      value: `${Math.round(stats.completionRate * 100)}%`,
      icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
      description: "Tasks completed on time"
    },
    {
      title: "Average Time",
      value: `${Math.round(stats.averageCompletionTime)} min`,
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      description: "Per task completion"
    },
    {
      title: "Productivity Score",
      value: stats.productivityScore,
      icon: <Target className="h-5 w-5 text-purple-500" />,
      description: "Based on task efficiency"
    },
    {
      title: "Task Distribution",
      value: `${stats.highPriorityTasks} high priority`,
      icon: <BarChart3 className="h-5 w-5 text-amber-500" />,
      description: "Out of " + tasks.length + " total tasks"
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Task Insights</CardTitle>
        <CardDescription>
          Your productivity metrics and task statistics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {insight.icon}
              </div>
              <div>
                <p className="text-sm font-medium">{insight.title}</p>
                <p className="text-2xl font-bold">{insight.value}</p>
                <p className="text-xs text-muted-foreground">{insight.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}; 