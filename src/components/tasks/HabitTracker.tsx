
import React from 'react';
import { useTasks } from '@/context/TaskContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, CircleSlash, Coffee, Target, Sparkles, Brain, Zap, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export const HabitTracker = () => {
  const { habits, currentMood } = useTasks();
  
  // Sort habits by streak (descending)
  const sortedHabits = [...(habits || [])].sort((a, b) => (b.streak || 0) - (a.streak || 0));
  
  // Take top 3 habits by streak
  const topHabits = sortedHabits.slice(0, 3);
  
  const getMoodEmoji = (mood?: string) => {
    switch (mood) {
      case 'Creative': return <Sparkles className="h-4 w-4 text-purple-500" />;
      case 'Focused': return <Brain className="h-4 w-4 text-blue-500" />;
      case 'Relaxed': return <Coffee className="h-4 w-4 text-green-500" />;
      case 'Energetic': return <Zap className="h-4 w-4 text-amber-500" />;
      case 'Tired': return <Moon className="h-4 w-4 text-slate-500" />;
      default: return null;
    }
  };
  
  const getStrengthLabel = (streak: number) => {
    if (streak >= 20) return 'Expert';
    if (streak >= 10) return 'Strong';
    if (streak >= 5) return 'Building';
    if (streak >= 1) return 'Started';
    return 'New';
  };
  
  const getProgressValue = (streak: number) => {
    return Math.min(100, streak * 5);
  };
  
  if (!habits || habits.length === 0) {
    return (
      <Card className="border-dashed bg-muted/50">
        <CardContent className="pt-6 text-center text-muted-foreground">
          <div className="flex flex-col items-center gap-2">
            <Target className="h-6 w-6" />
            <p>Complete tasks to identify habits</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="text-sm font-medium">Productivity Habits</div>
      
      <div className="space-y-3">
        {topHabits.map(habit => {
          const isActive = habit.preferredMood === currentMood;
          const streak = habit.streak || 0;
          const strengthLabel = getStrengthLabel(streak);
          
          return (
            <Card 
              key={habit.id}
              className={cn(
                "border overflow-hidden transition-colors",
                isActive ? "border-primary bg-primary/5" : undefined
              )}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <CircleSlash className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="text-sm font-medium truncate max-w-[120px]">
                      {habit.name}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {habit.preferredMood && getMoodEmoji(habit.preferredMood)}
                    <span className="text-xs font-medium">
                      {streak} day{streak !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground">{strengthLabel}</span>
                    <span className="font-medium">{getProgressValue(streak)}%</span>
                  </div>
                  <Progress value={getProgressValue(streak)} className="h-1" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default HabitTracker;
