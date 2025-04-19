
import { useState, useEffect } from "react";
import { useTasks } from "@/context/TaskContext";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Brain, Coffee, Zap, Moon } from "lucide-react";

export const MoodSelector = () => {
  const { currentMood, setCurrentMood, prioritizeTasks } = useTasks();
  const [showAnimation, setShowAnimation] = useState(false);
  
  useEffect(() => {
    prioritizeTasks();
    // Add animation when mood changes
    setShowAnimation(true);
    const timeout = setTimeout(() => {
      setShowAnimation(false);
    }, 1000);
    
    return () => clearTimeout(timeout);
  }, [currentMood, prioritizeTasks]);
  
  const moods = [
    { value: "Creative", label: "Creative", icon: <Sparkles className="h-4 w-4" />, color: "from-purple-500 to-pink-500" },
    { value: "Focused", label: "Focused", icon: <Brain className="h-4 w-4" />, color: "from-blue-500 to-cyan-500" },
    { value: "Relaxed", label: "Relaxed", icon: <Coffee className="h-4 w-4" />, color: "from-green-500 to-emerald-500" },
    { value: "Energetic", label: "Energized", icon: <Zap className="h-4 w-4" />, color: "from-yellow-500 to-amber-500" },
    { value: "Tired", label: "Tired", icon: <Moon className="h-4 w-4" />, color: "from-slate-500 to-gray-500" },
  ];
  
  const getCurrentMoodColor = () => {
    const mood = moods.find(m => m.value === currentMood);
    return mood ? mood.color : "from-alderan-green-dark to-alderan-green-light";
  };
  
  return (
    <Card className="mb-6 relative overflow-hidden">
      <CardContent className="p-4">
        <div className="mb-2">
          <h2 className="text-sm font-medium text-muted-foreground">Current Vibe</h2>
          <h3 className="text-xl font-semibold flex items-center">
            {moods.find(m => m.value === currentMood)?.icon}
            <span className="ml-2">{currentMood}</span>
          </h3>
        </div>
        
        <Tabs defaultValue={currentMood} onValueChange={setCurrentMood} className="w-full">
          <TabsList className="grid grid-cols-5">
            {moods.map((mood) => (
              <TabsTrigger
                key={mood.value}
                value={mood.value}
                className="flex items-center justify-center data-[state=active]:bg-gradient-to-r data-[state=active]:text-white"
                style={{
                  backgroundImage: currentMood === mood.value ? `linear-gradient(to right, var(--tw-gradient-stops))` : 'none'
                }}
                data-gradient={mood.color}
              >
                {mood.icon}
                <span className="hidden sm:inline ml-2">{mood.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* Animated gradient effect when mood changes */}
        {showAnimation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            exit={{ opacity: 0 }}
            className={`absolute inset-0 bg-gradient-to-r ${getCurrentMoodColor()} pointer-events-none`}
          />
        )}
      </CardContent>
    </Card>
  );
};
