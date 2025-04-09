import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner";

export interface Task {
  id: string;
  name: string;
  deadline: Date;
  estimatedTime: number; // In minutes
  priority: number;
  completed: boolean;
  completedAt?: Date;
  actualTime?: number; // In minutes
  mood?: "Creative" | "Focused" | "Relaxed" | "Energetic" | "Tired"; // Added mood property
}

export interface Habit {
  id: string;
  name: string;
  createdAt: Date;
  streak: number;
  lastCompleted?: Date;
  preferredMood?: "Creative" | "Focused" | "Relaxed" | "Energetic" | "Tired";
  preferredTimeOfDay?: "morning" | "afternoon" | "evening" | "night";
}

export interface Tool {
  id: string;
  name: string;
  type: "water" | "fertilize" | "prune" | "decorate" | "illuminate" | "enhance" | "customize";
  description: string;
  effect: {
    height?: number;
    leaves?: number;
    health?: number;
    beauty?: number;
    style?: string;
  };
  used: boolean;
  tier: "sapling" | "young" | "mature";
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "priority" | "completed">) => void;
  completeTask: (id: string, actualTime: number) => void;
  deleteTask: (id: string) => void;
  prioritizeTasks: () => void;
  suggestedTasks: Task[];
  tools: Tool[];
  habits: Habit[];
  currentMood: string;
  setCurrentMood: (mood: string) => void;
  suggestHabit: () => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Updated tools database with vibe coder themed tools
const toolsDatabase = [
  {
    name: "Syntax Highlighter Brush",
    type: "customize" as const,
    description: "Recolors leaves in code syntax themes",
    effect: { beauty: 8, style: "syntax" },
    tier: "sapling" as const
  },
  {
    name: "Debugging Fertilizer",
    type: "fertilize" as const,
    description: "Speeds up tree growth by fixing bugs",
    effect: { height: 10, health: 8 },
    tier: "sapling" as const
  },
  {
    name: "Pixel Pruner",
    type: "prune" as const,
    description: "Shapes tree into pixel art",
    effect: { beauty: 12, style: "pixel" },
    tier: "young" as const
  },
  {
    name: "Lo-Fi Watering Can",
    type: "water" as const,
    description: "Adds a lo-fi aesthetic with muted tones",
    effect: { height: 6, health: 4, style: "lofi" },
    tier: "sapling" as const
  },
  {
    name: "Night Mode Lantern",
    type: "illuminate" as const,
    description: "Illuminates tree with a dark-mode vibe",
    effect: { beauty: 15, style: "nightmode" },
    tier: "mature" as const
  },
  {
    name: "Code Comment Bird",
    type: "decorate" as const,
    description: "Adds birds displaying random code comments",
    effect: { beauty: 10, style: "birds" },
    tier: "young" as const
  },
  {
    name: "Binary Bark Engraver",
    type: "customize" as const,
    description: "Carves binary patterns into bark",
    effect: { beauty: 8, style: "binary" },
    tier: "young" as const
  },
  {
    name: "Function Flower Pot",
    type: "enhance" as const,
    description: "Grows function-shaped flowers around your tree",
    effect: { beauty: 18, leaves: 8, style: "functions" },
    tier: "mature" as const
  },
  {
    name: "Looping Lights",
    type: "illuminate" as const,
    description: "Adds animated light loops using recursion",
    effect: { beauty: 14, style: "loops" },
    tier: "mature" as const
  },
  {
    name: "Recursive Roots",
    type: "enhance" as const,
    description: "Extends roots in beautiful recursive patterns",
    effect: { health: 12, beauty: 10, style: "recursive" },
    tier: "mature" as const
  },
];

// Enhanced AI prioritization function with mood weighting
const calculatePriority = (task: Omit<Task, "id" | "priority" | "completed">, tasks: Task[], currentMood: string): number => {
  const now = new Date();
  const deadlineDate = new Date(task.deadline);
  
  // Calculate hours until deadline
  const hoursUntilDeadline = Math.max(0, (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  // Higher priority for tasks due sooner
  const deadlineScore = 100 - Math.min(100, hoursUntilDeadline);
  
  // Higher priority for shorter tasks
  const timeScore = 100 - Math.min(100, task.estimatedTime);
  
  // Mood compatibility score (if task has a mood)
  let moodScore = 50; // Neutral by default
  if (task.mood && task.mood === currentMood) {
    moodScore = 100; // Perfect match
  } else if (task.mood) {
    // Some compatibility based on mood pairs that work well together
    if ((task.mood === "Creative" && currentMood === "Relaxed") || 
        (task.mood === "Focused" && currentMood === "Energetic") ||
        (task.mood === "Relaxed" && currentMood === "Tired")) {
      moodScore = 75; // Good match
    } else {
      moodScore = 25; // Not a good match
    }
  }
  
  // Combine scores (70% traditional factors, 30% mood)
  return ((deadlineScore * 0.5) + (timeScore * 0.2)) * 0.7 + (moodScore * 0.3);
};

// Detect patterns in user's task completion to suggest habits
const detectHabitPattern = (tasks: Task[]): Habit | null => {
  const completedTasks = tasks.filter(task => task.completed);
  if (completedTasks.length < 5) return null;
  
  // Get time of day distribution
  const timeDistribution = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0
  };
  
  // Get mood distribution
  const moodDistribution: Record<string, number> = {};
  
  completedTasks.forEach(task => {
    const completedAt = task.completedAt || new Date();
    const hour = completedAt.getHours();
    
    // Categorize time of day
    if (hour >= 5 && hour < 12) timeDistribution.morning++;
    else if (hour >= 12 && hour < 17) timeDistribution.afternoon++;
    else if (hour >= 17 && hour < 22) timeDistribution.evening++;
    else timeDistribution.night++;
    
    // Count mood if available
    if (task.mood) {
      moodDistribution[task.mood] = (moodDistribution[task.mood] || 0) + 1;
    }
  });
  
  // Find most productive time
  let mostProductiveTime: "morning" | "afternoon" | "evening" | "night" = "morning";
  let maxTime = timeDistribution.morning;
  
  if (timeDistribution.afternoon > maxTime) {
    mostProductiveTime = "afternoon";
    maxTime = timeDistribution.afternoon;
  }
  if (timeDistribution.evening > maxTime) {
    mostProductiveTime = "evening";
    maxTime = timeDistribution.evening;
  }
  if (timeDistribution.night > maxTime) {
    mostProductiveTime = "night";
    maxTime = timeDistribution.night;
  }
  
  // Find preferred mood if available
  let preferredMood: "Creative" | "Focused" | "Relaxed" | "Energetic" | "Tired" | undefined;
  let maxMood = 0;
  
  Object.entries(moodDistribution).forEach(([mood, count]) => {
    if (count > maxMood) {
      preferredMood = mood as any;
      maxMood = count;
    }
  });
  
  // Create habit suggestions based on patterns
  let habitName = "";
  
  if (mostProductiveTime === "morning") {
    habitName = "Morning coding session";
  } else if (mostProductiveTime === "afternoon") {
    habitName = "Afternoon productivity block";
  } else if (mostProductiveTime === "evening") {
    habitName = "Evening dev work";
  } else {
    habitName = "Night owl coding";
  }
  
  if (preferredMood) {
    habitName += ` when ${preferredMood.toLowerCase()}`;
  }
  
  return {
    id: Date.now().toString(),
    name: habitName,
    createdAt: new Date(),
    streak: 0,
    preferredMood,
    preferredTimeOfDay: mostProductiveTime
  };
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        return JSON.parse(saved).map((task: any) => ({
          ...task,
          deadline: new Date(task.deadline),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [tools, setTools] = useState<Tool[]>(() => {
    const saved = localStorage.getItem('tools');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('habits');
    if (saved) {
      try {
        return JSON.parse(saved).map((habit: any) => ({
          ...habit,
          createdAt: new Date(habit.createdAt),
          lastCompleted: habit.lastCompleted ? new Date(habit.lastCompleted) : undefined
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [currentMood, setCurrentMood] = useState<string>(() => {
    const saved = localStorage.getItem('currentMood');
    return saved || "Focused";
  });

  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('tools', JSON.stringify(tools));
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('currentMood', currentMood);
    
    // Update suggested tasks whenever tasks or mood changes
    const newSuggested = [...tasks]
      .filter(task => !task.completed)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
    
    setSuggestedTasks(newSuggested);
    
    // Update habit streaks
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (!habit.lastCompleted) return habit;
        
        const lastCompleted = new Date(habit.lastCompleted);
        lastCompleted.setHours(0, 0, 0, 0);
        
        // Calculate difference in days
        const diffTime = today.getTime() - lastCompleted.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // If completed today, keep streak, if yesterday, streak continues, otherwise reset
        if (diffDays === 0) {
          return habit;
        } else if (diffDays === 1) {
          return { ...habit, lastCompleted: today, streak: habit.streak + 1 };
        } else if (diffDays > 1) {
          return { ...habit, streak: 0 };
        }
        
        return habit;
      })
    );
  }, [tasks, tools, habits, currentMood]);

  const addTask = (taskData: Omit<Task, "id" | "priority" | "completed">) => {
    const priority = calculatePriority(taskData, tasks, currentMood);
    const newTask: Task = {
      id: Date.now().toString(),
      ...taskData,
      priority,
      completed: false
    };

    setTasks(prev => [...prev, newTask]);
    toast.success("Task added successfully");
    
    // Re-prioritize all tasks after adding a new one
    prioritizeTasks();
  };

  const completeTask = (id: string, actualTime: number) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? {
        ...task, 
        completed: true, 
        completedAt: new Date(),
        actualTime
      } : task
    ));

    // Generate a random tool as a reward, with tier based on task priority
    const completedTask = tasks.find(task => task.id === id);
    let tierCategory: "sapling" | "young" | "mature" = "sapling";
    
    if (completedTask && completedTask.priority > 80) {
      tierCategory = "mature";
    } else if (completedTask && completedTask.priority > 50) {
      tierCategory = "young";
    }
    
    // Filter tools by tier
    const eligibleTools = toolsDatabase.filter(tool => {
      if (tierCategory === "mature") return true; // All tools eligible
      if (tierCategory === "young") return tool.tier !== "mature"; // Sapling and young only
      return tool.tier === "sapling"; // Only sapling tools
    });
    
    const randomToolIndex = Math.floor(Math.random() * eligibleTools.length);
    const toolTemplate = eligibleTools[randomToolIndex];
    
    const newTool: Tool = {
      id: Date.now().toString(),
      ...toolTemplate,
      used: false
    };
    
    setTools(prev => [...prev, newTool]);
    toast.success(`Task completed! You earned: ${newTool.name}`);
    
    // Update habit completion if task completion time matches habit time of day
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay: "morning" | "afternoon" | "evening" | "night" = "morning";
    
    if (hour >= 5 && hour < 12) timeOfDay = "morning";
    else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    else if (hour >= 17 && hour < 22) timeOfDay = "evening";
    else timeOfDay = "night";
    
    setHabits(prev => 
      prev.map(habit => 
        habit.preferredTimeOfDay === timeOfDay
          ? { ...habit, lastCompleted: now, streak: habit.streak + 1 }
          : habit
      )
    );
    
    // Suggest a new habit if we have enough data
    suggestHabit();
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.info("Task deleted");
  };

  const prioritizeTasks = () => {
    setTasks(prev => {
      // Only re-prioritize incomplete tasks
      const incompleteTasks = prev.filter(task => !task.completed);
      const completedTasks = prev.filter(task => task.completed);
      
      // Calculate new priorities with mood weighting
      const reprioritized = incompleteTasks.map(task => {
        const recalculatedPriority = calculatePriority(
          {
            name: task.name,
            deadline: task.deadline,
            estimatedTime: task.estimatedTime,
            mood: task.mood
          }, 
          prev,
          currentMood
        );
        
        return {
          ...task,
          priority: recalculatedPriority
        };
      });
      
      // Sort by priority (highest first)
      reprioritized.sort((a, b) => b.priority - a.priority);
      
      return [...reprioritized, ...completedTasks];
    });
  };
  
  const suggestHabit = () => {
    const habitSuggestion = detectHabitPattern(tasks);
    if (!habitSuggestion) return;
    
    // Check if we already have a similar habit
    const existingSimilar = habits.find(h => 
      h.preferredTimeOfDay === habitSuggestion.preferredTimeOfDay && 
      h.preferredMood === habitSuggestion.preferredMood
    );
    
    if (!existingSimilar) {
      setHabits(prev => [...prev, habitSuggestion]);
      toast.success(`New habit detected! Try "${habitSuggestion.name}" for increased productivity.`, {
        duration: 5000
      });
    }
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      completeTask,
      deleteTask,
      prioritizeTasks,
      suggestedTasks,
      tools,
      habits,
      currentMood,
      setCurrentMood,
      suggestHabit
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
