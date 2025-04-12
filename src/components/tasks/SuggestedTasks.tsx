
import { useTasks } from "@/context/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock, Brain, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export const SuggestedTasks = () => {
  const { suggestedTasks, completeTask, currentMood } = useTasks();
  
  if (suggestedTasks.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Brain className="mr-2 h-5 w-5 text-purple-500" />
          AI Suggested Tasks
        </h2>
        <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
          Based on your {currentMood} mood
        </Badge>
      </div>
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            <Sparkles size={18} className="mr-2 text-amber-500" />
            Highest priority tasks for your workflow
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {suggestedTasks.map(task => (
              <div key={task.id} className="flex items-center p-3 rounded-md bg-muted/80 hover:bg-muted transition-colors">
                <div className="flex-1">
                  <p className="font-medium">{task.name}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center">
                      <Clock size={12} className="mr-1" />
                      <span>Due {formatDistanceToNow(new Date(task.deadline), { addSuffix: true })}</span>
                    </div>
                    {task.estimatedTime && (
                      <span className="flex items-center">
                        • Est. {task.estimatedTime} min
                      </span>
                    )}
                    {task.mood && (
                      <span className="flex items-center">
                        • {task.mood} mood
                      </span>
                    )}
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-2 hover:bg-green-100 hover:text-green-800 transition-colors"
                  onClick={() => completeTask(task.id, task.estimatedTime)}
                >
                  <Check size={16} className="mr-1" />
                  Complete
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
