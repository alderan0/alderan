
import { useTasks } from "@/context/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export const SuggestedTasks = () => {
  const { suggestedTasks } = useTasks();
  
  if (suggestedTasks.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold">Suggested Tasks</h2>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md">Start with these:</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {suggestedTasks.map(task => (
              <div key={task.id} className="flex items-center p-2 rounded-md bg-muted">
                <div className="flex-1">
                  <p className="font-medium">{task.name}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock size={12} className="mr-1" />
                    <span>Due {formatDistanceToNow(task.deadline, { addSuffix: true })}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="ml-2">
                  <Check size={16} />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
