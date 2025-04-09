
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTasks } from "@/context/TaskContext";
import { Calendar, Clock, Zap, Coffee, Brain, Moon, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export const AIScheduleRecommendations = () => {
  const { tasks, currentMood, habits } = useTasks();
  const [recommendations, setRecommendations] = useState<{
    daily: string[];
    weekly: string[];
    monthly: string[];
  }>({
    daily: [],
    weekly: [],
    monthly: []
  });
  
  useEffect(() => {
    // Generate AI recommendations based on tasks, mood, and habits
    const incompleteTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    // This would ideally use a real AI algorithm, but for now we'll use some heuristics
    const dailyRecs: string[] = [];
    const weeklyRecs: string[] = [];
    const monthlyRecs: string[] = [];
    
    // Generate daily recommendations based on mood
    if (incompleteTasks.length > 0) {
      const matchingMoodTasks = incompleteTasks.filter(t => t.mood === currentMood).length;
      
      switch(currentMood) {
        case "Creative":
          dailyRecs.push(`Schedule UI design and brainstorming sessions for today while your creative energy is high.`);
          break;
        case "Focused":
          dailyRecs.push(`Set aside 2-3 hours for deep work on complex tasks that require concentration.`);
          break;
        case "Relaxed":
          dailyRecs.push(`Today is great for code reviews and documentation while you're in a relaxed state.`);
          break;
        case "Energetic":
          dailyRecs.push(`Tackle high-priority bugs and quick wins to maintain momentum while energized.`);
          break;
        case "Tired":
          dailyRecs.push(`Focus on smaller, manageable tasks today. Consider resting and resuming with fresh energy.`);
          break;
      }
      
      if (matchingMoodTasks > 0) {
        dailyRecs.push(`You have ${matchingMoodTasks} tasks that match your current mood - prioritize these first.`);
      }
    }
    
    // Generate weekly recommendations
    if (incompleteTasks.length >= 3) {
      weeklyRecs.push(`Plan to complete at least ${Math.min(5, incompleteTasks.length)} tasks this week to stay on track.`);
      
      // Group by mood
      const moodGroups: Record<string, number> = {};
      incompleteTasks.forEach(task => {
        if (task.mood) {
          moodGroups[task.mood] = (moodGroups[task.mood] || 0) + 1;
        }
      });
      
      // Recommend specific days
      if (moodGroups["Focused"] && moodGroups["Focused"] >= 2) {
        weeklyRecs.push(`Schedule focused coding sessions on Tuesday and Thursday mornings.`);
      }
      
      if (moodGroups["Creative"] && moodGroups["Creative"] >= 2) {
        weeklyRecs.push(`Plan creative design work for Wednesday afternoon when you're often most creative.`);
      }
    }
    
    // Generate monthly recommendations based on task load and completion
    if (completedTasks.length > 0) {
      const avgCompletionTime = completedTasks.reduce((sum, task) => 
        sum + (task.actualTime || task.estimatedTime), 0) / completedTasks.length;
      
      const totalRemainingTime = incompleteTasks.reduce((sum, task) => 
        sum + task.estimatedTime, 0);
      
      const estimatedDays = Math.ceil(totalRemainingTime / (avgCompletionTime * 2));
      
      if (estimatedDays > 0) {
        monthlyRecs.push(`Based on your completion rate, you need about ${estimatedDays} days to finish all current tasks.`);
      }
      
      if (habits.length > 0) {
        monthlyRecs.push(`Continue your "${habits[0].name}" habit to improve productivity by ~15% this month.`);
      }
    } else {
      monthlyRecs.push(`Complete your first few tasks to get personalized monthly recommendations.`);
    }
    
    setRecommendations({
      daily: dailyRecs,
      weekly: weeklyRecs,
      monthly: monthlyRecs
    });
    
  }, [tasks, currentMood, habits]);
  
  // Helper function to get mood icon
  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "Creative": return <Sparkles size={16} className="mr-1 text-purple-500" />;
      case "Focused": return <Brain size={16} className="mr-1 text-blue-500" />;
      case "Relaxed": return <Coffee size={16} className="mr-1 text-green-500" />;
      case "Energetic": return <Zap size={16} className="mr-1 text-amber-500" />;
      case "Tired": return <Moon size={16} className="mr-1 text-gray-500" />;
      default: return <Clock size={16} className="mr-1" />;
    }
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            <Clock className="mr-2 h-5 w-5 text-purple-500" />
            Daily Schedule
          </CardTitle>
          <div className="flex items-center">
            <Badge variant="outline" className="bg-purple-100 text-purple-800">Today</Badge>
            <span className="ml-2 flex items-center text-sm font-medium">
              {getMoodIcon(currentMood)}
              <span>{currentMood} Mood</span>
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.daily.length > 0 ? (
              recommendations.daily.map((rec, index) => (
                <li key={index} className="text-sm rounded-md bg-muted p-2">
                  {rec}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">Complete more tasks to receive daily recommendations.</li>
            )}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-blue-500" />
            Weekly Plan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.weekly.length > 0 ? (
              recommendations.weekly.map((rec, index) => (
                <li key={index} className="text-sm rounded-md bg-muted p-2">
                  {rec}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">Add more tasks to receive weekly planning recommendations.</li>
            )}
          </ul>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-md flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-green-500" />
            Monthly Outlook
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {recommendations.monthly.length > 0 ? (
              recommendations.monthly.map((rec, index) => (
                <li key={index} className="text-sm rounded-md bg-muted p-2">
                  {rec}
                </li>
              ))
            ) : (
              <li className="text-sm text-muted-foreground">Complete more tasks to see monthly projections.</li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
