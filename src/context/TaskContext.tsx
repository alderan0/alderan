
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
}

export interface Tool {
  id: string;
  name: string;
  type: "water" | "fertilize" | "prune" | "decorate";
  description: string;
  effect: {
    height?: number;
    leaves?: number;
    health?: number;
    beauty?: number;
  };
  used: boolean;
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "priority" | "completed">) => void;
  completeTask: (id: string, actualTime: number) => void;
  deleteTask: (id: string) => void;
  prioritizeTasks: () => void;
  suggestedTasks: Task[];
  tools: Tool[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Tools available in the app
const toolsDatabase = [
  {
    name: "Watering Can",
    type: "water" as const,
    description: "Waters your tree to increase its height",
    effect: { height: 5 }
  },
  {
    name: "Basic Fertilizer",
    type: "fertilize" as const,
    description: "Adds nutrients to help grow more leaves",
    effect: { leaves: 3, health: 2 }
  },
  {
    name: "Advanced Fertilizer",
    type: "fertilize" as const,
    description: "Premium nutrients for rapid growth",
    effect: { leaves: 5, health: 5, height: 2 }
  },
  {
    name: "Pruning Shears",
    type: "prune" as const,
    description: "Shapes your tree for better aesthetics",
    effect: { beauty: 7 }
  },
  {
    name: "String Lights",
    type: "decorate" as const,
    description: "Decorative lights to beautify your tree",
    effect: { beauty: 10 }
  },
];

// AI prioritization function (simplified)
const calculatePriority = (task: Omit<Task, "id" | "priority" | "completed">, tasks: Task[]): number => {
  const now = new Date();
  const deadlineDate = new Date(task.deadline);
  
  // Calculate hours until deadline
  const hoursUntilDeadline = Math.max(0, (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60));
  
  // Higher priority for tasks due sooner
  const deadlineScore = 100 - Math.min(100, hoursUntilDeadline);
  
  // Higher priority for shorter tasks
  const timeScore = 100 - Math.min(100, task.estimatedTime);
  
  // Combine scores (weight deadlines more)
  return (deadlineScore * 0.7) + (timeScore * 0.3);
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

  const [suggestedTasks, setSuggestedTasks] = useState<Task[]>([]);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('tools', JSON.stringify(tools));
    
    // Update suggested tasks whenever tasks change
    const newSuggested = [...tasks]
      .filter(task => !task.completed)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
    
    setSuggestedTasks(newSuggested);
  }, [tasks, tools]);

  const addTask = (taskData: Omit<Task, "id" | "priority" | "completed">) => {
    const priority = calculatePriority(taskData, tasks);
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

    // Generate a random tool as a reward
    const randomToolIndex = Math.floor(Math.random() * toolsDatabase.length);
    const toolTemplate = toolsDatabase[randomToolIndex];
    
    const newTool: Tool = {
      id: Date.now().toString(),
      ...toolTemplate,
      used: false
    };
    
    setTools(prev => [...prev, newTool]);
    toast.success(`Task completed! You earned: ${newTool.name}`);
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
      
      // Calculate new priorities
      const reprioritized = incompleteTasks.map(task => {
        const recalculatedPriority = calculatePriority(
          {
            name: task.name,
            deadline: task.deadline,
            estimatedTime: task.estimatedTime
          }, 
          prev
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

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      completeTask,
      deleteTask,
      prioritizeTasks,
      suggestedTasks,
      tools
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
