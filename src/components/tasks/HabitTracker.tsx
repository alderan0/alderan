
import { useTasks } from "@/context/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Repeat, Check, Zap, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { format } from "date-fns";

export const HabitTracker = () => {
  const { habits } = useTasks();
  
  if (habits.length === 0) {
    return null;
  }
  
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };
  
  // Helper to get time of day in human-readable form
  const formatTimeOfDay = (timeOfDay: string | undefined) => {
    switch (timeOfDay) {
      case "morning": return "Morning (5am-12pm)";
      case "afternoon": return "Afternoon (12pm-5pm)";
      case "evening": return "Evening (5pm-10pm)";
      case "night": return "Night (10pm-5am)";
      default: return "Any time";
    }
  };
  
  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg">
          <Repeat className="h-5 w-5 mr-2 text-alderan-blue" />
          AI-Detected Habits
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Based on your task completion patterns, we've identified these productive habits:
        </p>
        
        <motion.div 
          className="space-y-3"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {habits.map((habit) => (
            <motion.div 
              key={habit.id} 
              className="p-3 bg-muted rounded-lg flex justify-between items-center"
              variants={item}
            >
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{habit.name}</h3>
                  {habit.streak >= 3 && (
                    <Badge className="ml-2 bg-gradient-to-r from-amber-500 to-orange-500">
                      {habit.streak}x Streak
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center text-xs text-muted-foreground mt-1 space-x-4">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>{formatTimeOfDay(habit.preferredTimeOfDay)}</span>
                  </div>
                  
                  {habit.preferredMood && (
                    <div className="flex items-center">
                      <Zap className="h-3 w-3 mr-1" />
                      <span>{habit.preferredMood} mood</span>
                    </div>
                  )}
                  
                  {habit.lastCompleted && (
                    <div className="flex items-center">
                      <Check className="h-3 w-3 mr-1 text-green-500" />
                      <span className="text-green-600">
                        Last: {format(new Date(habit.lastCompleted), "MMM d")}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              
              <Button variant="ghost" size="sm" className="h-8">
                <Zap className="h-4 w-4 mr-1" />
                <span className="sr-only sm:not-sr-only">Use Energy</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>
      </CardContent>
    </Card>
  );
};
