
import React from 'react';
import { useTasks } from '@/context/TaskContext';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Brain, Coffee, Moon, Sparkles, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';

export const MoodBasedSuggestions = () => {
  const { currentMood, getMoodBasedSuggestions, completeTask } = useTasks();
  const suggestedTasks = getMoodBasedSuggestions();

  const getMoodIcon = (mood?: string) => {
    switch (mood) {
      case 'Creative':
        return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'Focused':
        return <Brain className="h-4 w-4 text-blue-500" />;
      case 'Relaxed':
        return <Coffee className="h-4 w-4 text-green-500" />;
      case 'Energetic':
        return <Zap className="h-4 w-4 text-amber-500" />;
      case 'Tired':
        return <Moon className="h-4 w-4 text-slate-500" />;
      default:
        return null;
    }
  };

  if (suggestedTasks.length === 0) {
    return (
      <Card className="border-dashed bg-muted/50">
        <CardContent className="pt-6 text-center text-muted-foreground">
          No mood-based suggestions available
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {suggestedTasks.map((task) => (
        <Card key={task.id} className={cn("border-l-4", 
          task.mood === 'Creative' ? "border-l-purple-500" :
          task.mood === 'Focused' ? "border-l-blue-500" :
          task.mood === 'Relaxed' ? "border-l-green-500" :
          task.mood === 'Energetic' ? "border-l-amber-500" :
          "border-l-slate-500"
        )}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getMoodIcon(task.mood)}
                <span className="font-medium">{task.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => completeTask(task.id, 30)}
              >
                Complete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MoodBasedSuggestions;
