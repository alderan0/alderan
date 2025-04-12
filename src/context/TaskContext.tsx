import { createContext, useState, useContext, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { useTree } from "./TreeContext";
import { v4 as uuidv4 } from "uuid";

export interface Subtask {
  id: string;
  name: string;
  completed: boolean;
  completedAt?: Date;
}

interface TaskStats {
  completionRate: number;
  averageCompletionTime: number;
  productivityScore: number;
  highPriorityTasks: number;
}

export interface Task {
  id: string;
  name: string;
  deadline: Date;
  estimatedTime: number;
  actualTime?: number;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  mood?: 'Creative' | 'Focused' | 'Relaxed' | 'Energetic' | 'Tired';
  projectId?: string;
  createdAt: Date;
  completedAt?: Date;
  subtasks: Subtask[];
  notes?: string;
  difficulty?: number;
  tags?: string[];
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  deadline?: Date;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
}

export interface ProjectResource {
  id: string;
  name: string;
  type: "app" | "resource";
  description: string;
  url: string;
  iconName: string; // Name of the Lucide icon to use
}

export interface Habit {
  id: string;
  name: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  streak: number;
  lastCompleted?: Date;
  preferredMood?: 'Creative' | 'Focused' | 'Relaxed' | 'Energetic' | 'Tired';
}

export interface Tool {
  id: string;
  name: string;
  type: string;
  minLevel?: number; // Using minLevel to align with the level system (1-20)
  description: string;
  used: boolean;
  effect: {
    height?: number;
    leaves?: number;
    health?: number;
    beauty?: number;
    style?: string;
  };
}

interface TaskContextType {
  tasks: Task[];
  addTask: (task: Pick<Task, 'name' | 'deadline' | 'estimatedTime' | 'mood'>) => void;
  completeTask: (id: string, actualTime: number) => void;
  deleteTask: (id: string, useForTraining?: boolean) => void;
  prioritizeTasks: () => void;
  suggestedTasks: Task[];
  tools: Tool[];
  habits: Habit[];
  currentMood: string;
  setCurrentMood: (mood: string) => void;
  suggestHabit: () => void;
  projects: Project[];
  addProject: (project: Omit<Project, "id" | "completed" | "completedAt" | "createdAt">) => void;
  completeProject: (id: string) => void;
  deleteProject: (id: string) => void;
  addSubtask: (taskId: string, subtaskName: string) => void;
  completeSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  getProjectResources: (projectId: string) => ProjectResource[];
  setTaskDifficulty: (taskId: string, rating: "easy" | "medium" | "hard") => void;
  deleteCompletedTasks: (useForTraining: boolean) => void;
  updateAITrainingPreference: (enabled: boolean) => void;
  getAIScheduleSuggestions: () => {
    daily: string[];
    weekly: string[];
    monthly: string[];
  };
  getMoodBasedSuggestions: () => Task[];
  getTaskStats: () => TaskStats;
  aiTrainingEnabled: boolean;
  updateTaskPriority: (taskId: string, priority: "low" | "medium" | "high") => void;
  calculateProductivityScore: () => number;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

const toolsDatabase = [
  {
    name: "Syntax Highlighter Brush",
    type: "customize" as const,
    description: "Recolors leaves in code syntax themes",
    effect: { beauty: 8, style: "syntax" },
    minLevel: 1
  },
  {
    name: "Debugging Fertilizer",
    type: "fertilize" as const,
    description: "Speeds up tree growth by fixing bugs",
    effect: { height: 10, health: 8 },
    minLevel: 2
  },
  {
    name: "Code Comment Bird",
    type: "decorate" as const,
    description: "Adds birds displaying random code comments",
    effect: { beauty: 10, style: "birds" },
    minLevel: 3
  },
  {
    name: "Pixel Pruner",
    type: "prune" as const,
    description: "Shapes tree into pixel art",
    effect: { beauty: 12, style: "pixel" },
    minLevel: 4
  },
  {
    name: "Lo-Fi Watering Can",
    type: "water" as const,
    description: "Adds a lo-fi aesthetic with muted tones",
    effect: { height: 6, health: 4, style: "lofi" },
    minLevel: 5
  },
  {
    name: "Variable Vine",
    type: "enhance" as const,
    description: "Grows dynamic vines that respond to code changes",
    effect: { height: 8, beauty: 6, style: "variable" },
    minLevel: 6
  },
  {
    name: "Function Flower Pot",
    type: "enhance" as const,
    description: "Grows function-shaped flowers around your tree",
    effect: { beauty: 10, leaves: 5, style: "functions" },
    minLevel: 7
  },
  {
    name: "Binary Bark Engraver",
    type: "customize" as const,
    description: "Carves binary patterns into bark",
    effect: { beauty: 8, style: "binary" },
    minLevel: 8
  },
  {
    name: "API Connector",
    type: "customize" as const,
    description: "Connects your tree to external resources with animated tendrils",
    effect: { height: 12, beauty: 12, style: "api" },
    minLevel: 9
  },
  {
    name: "Looping Lights",
    type: "illuminate" as const,
    description: "Adds animated light loops using recursion",
    effect: { beauty: 14, style: "loops" },
    minLevel: 10
  },
  {
    name: "Query Optimizer",
    type: "enhance" as const,
    description: "Optimizes tree performance with subtle glowing patterns",
    effect: { health: 15, beauty: 8, style: "query" },
    minLevel: 11
  },
  {
    name: "Night Mode Lantern",
    type: "illuminate" as const,
    description: "Illuminates tree with a dark-mode vibe",
    effect: { beauty: 15, style: "nightmode" },
    minLevel: 12
  },
  {
    name: "Component Constructor",
    type: "build" as const,
    description: "Creates reusable tree components with special properties",
    effect: { height: 14, leaves: 12, beauty: 6 },
    minLevel: 13
  },
  {
    name: "Algorithm Animator",
    type: "enhance" as const,
    description: "Visualizes sorting algorithms with branch movements",
    effect: { beauty: 20, health: 5, style: "algorithm" },
    minLevel: 14
  },
  {
    name: "Function Fountain",
    type: "enhance" as const,
    description: "Creates a fountain of function particles at the base of your tree",
    effect: { beauty: 18, leaves: 8, style: "functions" },
    minLevel: 15
  },
  {
    name: "Data Structure Decorator",
    type: "decorate" as const,
    description: "Adds visual representations of data structures to your tree",
    effect: { beauty: 15, leaves: 10, style: "datastructure" },
    minLevel: 16
  },
  {
    name: "CI/CD Pipeline",
    type: "enhance" as const,
    description: "Creates a continuous improvement system for your tree",
    effect: { health: 16, height: 8, beauty: 6 },
    minLevel: 17
  },
  {
    name: "Recursive Roots",
    type: "enhance" as const,
    description: "Extends roots in beautiful recursive patterns",
    effect: { health: 12, beauty: 10, style: "recursive" },
    minLevel: 18
  },
  {
    name: "Cloud Integration System",
    type: "enhance" as const,
    description: "Surrounds your tree with floating cloud platforms",
    effect: { beauty: 22, health: 10, style: "cloud" },
    minLevel: 19
  },
  {
    name: "Quantum Quantum",
    type: "illuminate" as const,
    description: "Adds quantum computing-inspired light effects",
    effect: { beauty: 25, style: "quantum" },
    minLevel: 20
  }
];

const resourcesDatabase: ProjectResource[] = [
  {
    id: "1",
    name: "VS Code",
    type: "app",
    description: "Powerful code editor for all languages",
    url: "https://code.visualstudio.com/",
    iconName: "code",
  },
  {
    id: "2",
    name: "Figma",
    type: "app",
    description: "Design and prototype UI/UX",
    url: "https://www.figma.com/",
    iconName: "palette",
  },
  {
    id: "3",
    name: "GitHub",
    type: "app",
    description: "Version control and collaboration",
    url: "https://github.com/",
    iconName: "git-branch",
  },
  {
    id: "4",
    name: "Postman",
    type: "app",
    description: "API testing and documentation",
    url: "https://www.postman.com/",
    iconName: "server",
  },
  {
    id: "5",
    name: "MDN Web Docs",
    type: "resource",
    description: "Comprehensive web development documentation",
    url: "https://developer.mozilla.org/",
    iconName: "file-text",
  },
  {
    id: "6",
    name: "Stack Overflow",
    type: "resource",
    description: "Community Q&A for programmers",
    url: "https://stackoverflow.com/",
    iconName: "help-circle",
  },
  {
    id: "7",
    name: "Frontend Masters",
    type: "resource",
    description: "In-depth web development courses",
    url: "https://frontendmasters.com/",
    iconName: "graduation-cap",
  },
  {
    id: "8",
    name: "Dribbble",
    type: "resource",
    description: "Design inspiration and resources",
    url: "https://dribbble.com/",
    iconName: "droplets",
  },
  {
    id: "9",
    name: "DevDocs",
    type: "resource",
    description: "Fast API documentation browser",
    url: "https://devdocs.io/",
    iconName: "book-open",
  },
  {
    id: "10",
    name: "Notion",
    type: "app",
    description: "All-in-one workspace for notes and tasks",
    url: "https://www.notion.so/",
    iconName: "layers",
  },
];

interface TaskWithPriorityScore extends Omit<Task, 'priority'> {
  priorityScore: number;
  priority: 'low' | 'medium' | 'high';
}

type NewTaskInput = Pick<Task, 'name' | 'deadline' | 'estimatedTime' | 'mood'>;

const calculatePriority = (task: NewTaskInput, tasks: Task[], currentMood: string): number => {
  const now = new Date().getTime();
  const deadlineDate = new Date(task.deadline).getTime();
  
  const hoursUntilDeadline = Math.max(0, (deadlineDate - now) / (1000 * 60 * 60));
  
  const deadlineScore = 100 - Math.min(100, hoursUntilDeadline);
  
  const timeScore = 100 - Math.min(100, task.estimatedTime);
  
  let moodScore = 50;
  if (task.mood && task.mood === currentMood) {
    moodScore = 100;
  } else if (task.mood) {
    if ((task.mood === "Creative" && currentMood === "Relaxed") || 
        (task.mood === "Focused" && currentMood === "Energetic") ||
        (task.mood === "Relaxed" && currentMood === "Tired")) {
      moodScore = 75;
    } else {
      moodScore = 25;
    }
  }
  
  return Math.floor((deadlineScore * 0.4) + (timeScore * 0.3) + (moodScore * 0.3));
};

const detectHabitPattern = (tasks: Task[]): Habit | null => {
  const completedTasks = tasks.filter(task => task.completed);
  if (completedTasks.length < 5) return null;
  
  const timeDistribution = {
    morning: 0,
    afternoon: 0,
    evening: 0,
    night: 0
  };
  
  const moodDistribution: Record<string, number> = {};
  
  completedTasks.forEach(task => {
    const completedAt = task.completedAt || new Date();
    const hour = completedAt.getHours();
    
    if (hour >= 5 && hour < 12) timeDistribution.morning++;
    else if (hour >= 12 && hour < 17) timeDistribution.afternoon++;
    else if (hour >= 17 && hour < 22) timeDistribution.evening++;
    else timeDistribution.night++;
    
    if (task.mood) {
      moodDistribution[task.mood] = (moodDistribution[task.mood] || 0) + 1;
    }
  });
  
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
  
  let preferredMood: "Creative" | "Focused" | "Relaxed" | "Energetic" | "Tired" | undefined;
  let maxMood = 0;
  
  Object.entries(moodDistribution).forEach(([mood, count]) => {
    if (count > maxMood) {
      preferredMood = mood as any;
      maxMood = count;
    }
  });
  
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
    frequency: "daily",
    streak: 0,
    lastCompleted: undefined,
    preferredMood: preferredMood,
  };
};

const suggestResources = (projectName: string, taskNames: string[]): ProjectResource[] => {
  const projectLower = projectName.toLowerCase();
  const taskLower = taskNames.map(t => t.toLowerCase());
  
  const suggestions: ProjectResource[] = [];
  const allKeywords = [projectLower, ...taskLower].join(" ");
  
  // Define keyword categories
  const webDevKeywords = ["web", "website", "frontend", "html", "css", "javascript", "js", "react", "vue", "angular"];
  const designKeywords = ["design", "ui", "ux", "mockup", "wireframe", "figma", "sketch", "prototype"];
  const backendKeywords = ["backend", "api", "server", "database", "db", "node", "express", "django", "flask", "sql"];
  const mobileKeywords = ["mobile", "app", "ios", "android", "react native", "flutter", "swift", "kotlin"];
  const devopsKeywords = ["devops", "deployment", "ci/cd", "docker", "kubernetes", "aws", "cloud"];
  
  // Check for keyword matches
  const hasWebDev = webDevKeywords.some(kw => allKeywords.includes(kw));
  const hasDesign = designKeywords.some(kw => allKeywords.includes(kw));
  const hasBackend = backendKeywords.some(kw => allKeywords.includes(kw));
  const hasMobile = mobileKeywords.some(kw => allKeywords.includes(kw));
  const hasDevOps = devopsKeywords.some(kw => allKeywords.includes(kw));
  
  // Add relevant resources based on project type
  if (hasWebDev || hasBackend || hasMobile || hasDevOps) {
    suggestions.push(resourcesDatabase.find(r => r.name === "VS Code")!);
  }
  
  if (hasDesign) {
    suggestions.push(resourcesDatabase.find(r => r.name === "Figma")!);
    suggestions.push(resourcesDatabase.find(r => r.name === "Dribbble")!);
  }
  
  if (hasWebDev) {
    suggestions.push(resourcesDatabase.find(r => r.name === "MDN Web Docs")!);
    suggestions.push(resourcesDatabase.find(r => r.name === "Frontend Masters")!);
  }
  
  if (hasBackend) {
    suggestions.push(resourcesDatabase.find(r => r.name === "Postman")!);
    suggestions.push(resourcesDatabase.find(r => r.name === "DevDocs")!);
  }
  
  // Add general development resources
  suggestions.push(resourcesDatabase.find(r => r.name === "GitHub")!);
  suggestions.push(resourcesDatabase.find(r => r.name === "Stack Overflow")!);
  
  // Add project management tools
  suggestions.push(resourcesDatabase.find(r => r.name === "Notion")!);
  
  // Remove duplicates and limit to 5 most relevant suggestions
  const uniqueSuggestions = Array.from(new Set(suggestions));
  return uniqueSuggestions.slice(0, 5);
};

const calculateTaskDifficulty = (name: string, notes: string, estimatedTime: number, rating: "easy" | "medium" | "hard"): number => {
  const baseDifficulty = 50;
  
  if (rating === "easy") return baseDifficulty + 10;
  if (rating === "medium") return baseDifficulty;
  if (rating === "hard") return baseDifficulty - 10;
  
  return baseDifficulty;
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const treeContext = useTree();
  const { calculateTaskDifficulty, addPoints, getCurrentLevel } = treeContext;
  
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('tasks');
    if (saved) {
      try {
        return JSON.parse(saved).map((task: any) => ({
          ...task,
          deadline: new Date(task.deadline),
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
          subtasks: task.subtasks || []
        }));
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('projects');
    if (saved) {
      try {
        return JSON.parse(saved).map((project: any) => ({
          ...project,
          deadline: project.deadline ? new Date(project.deadline) : undefined,
          completedAt: project.completedAt ? new Date(project.completedAt) : undefined,
          createdAt: new Date(project.createdAt)
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
          preferredMood: habit.preferredMood as any
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

  const [aiTrainingEnabled, setAITrainingEnabled] = useState(true);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('tools', JSON.stringify(tools));
    localStorage.setItem('habits', JSON.stringify(habits));
    localStorage.setItem('currentMood', currentMood);
    
    const newSuggested = [...tasks]
      .filter(task => !task.completed)
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 3);
    
    setSuggestedTasks(newSuggested);
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    setHabits(prevHabits => 
      prevHabits.map(habit => {
        if (!habit.lastCompleted) return habit;
        
        const lastCompleted = new Date(habit.lastCompleted);
        lastCompleted.setHours(0, 0, 0, 0);
        
        const diffTime = today.getTime() - lastCompleted.getTime();
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
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
  }, [tasks, projects, tools, habits, currentMood]);

  const calculateHabitScore = (habits: Habit[]): number => {
    if (habits.length === 0) return 0;
    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    return Math.min(100, Math.floor((totalStreak / habits.length) * 10));
  };

  const calculateProductivityScore = (): number => {
    if (tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.completed);
    const completionRate = completedTasks.length / tasks.length;
    const highPriorityCompleted = completedTasks.filter(task => task.priority === 'high').length;
    return Math.min(100, Math.floor((completionRate * 70) + (highPriorityCompleted * 30)));
  };

  const addTask = (taskData: NewTaskInput): void => {
    const newTask: Task = {
      ...taskData,
      id: uuidv4(),
      priority: 'medium' as const,
      completed: false,
      subtasks: [],
      createdAt: new Date(),
      actualTime: 0,
      difficulty: 1,
      notes: '',
      tags: []
    };
    setTasks(prev => [...prev, newTask]);
    prioritizeTasks();
  };

  const completeTask = (id: string, actualTime: number) => {
    const completedTask = tasks.find(task => task.id === id);
    if (!completedTask) return;
    
    setTasks(prev => prev.map(task => 
      task.id === id ? {
        ...task, 
        completed: true, 
        completedAt: new Date(),
        actualTime
      } : task
    ));

    const taskDifficulty = completedTask.difficulty || 50;
    const pointsAwarded = Math.round(taskDifficulty);
    
    addPoints(pointsAwarded);
    
    const currentLevel = getCurrentLevel();
    
    const difficultyBonus = Math.floor(taskDifficulty / 20);
    const maxToolLevel = Math.min(20, currentLevel + difficultyBonus);
    
    const eligibleTools = toolsDatabase.filter(tool => 
      tool.minLevel <= maxToolLevel
    );
    
    if (eligibleTools.length > 0) {
      const randomToolIndex = Math.floor(Math.random() * eligibleTools.length);
      const toolTemplate = eligibleTools[randomToolIndex];
      
      const newTool: Tool = {
        id: Date.now().toString(),
        ...toolTemplate,
        used: false
      };
      
      setTools(prev => [...prev, newTool]);
      toast.success(`Task completed! Earned ${pointsAwarded} points and ${newTool.name}!`);
    } else {
      toast.success(`Task completed! Earned ${pointsAwarded} points!`);
    }
    
    const now = new Date();
    const hour = now.getHours();
    let timeOfDay: "morning" | "afternoon" | "evening" | "night" = "morning";
    
    if (hour >= 5 && hour < 12) timeOfDay = "morning";
    else if (hour >= 12 && hour < 17) timeOfDay = "afternoon";
    else if (hour >= 17 && hour < 22) timeOfDay = "evening";
    else timeOfDay = "night";
    
    setHabits(prev => 
      prev.map(habit => 
        habit.frequency === "daily" && habit.lastCompleted && habit.lastCompleted.getHours() === hour
          ? { ...habit, lastCompleted: now, streak: habit.streak + 1 }
          : habit
      )
    );
    
    suggestHabit();
  };

  const deleteTask = (id: string, useForTraining = true) => {
    if (useForTraining) {
      const taskToDelete = tasks.find(task => task.id === id);
      if (taskToDelete && taskToDelete.completed) {
        const completedTime = taskToDelete.completedAt;
        const mood = taskToDelete.mood;
        const actualTime = taskToDelete.actualTime;
        
        console.log(`Training data from deleted task: ${taskToDelete.name}`, {
          completedAt: completedTime,
          mood: mood,
          actualTime: actualTime,
          difficulty: taskToDelete.difficulty
        });
        
        if (taskToDelete.mood) {
          // Use this data to refine mood-based suggestions
        }
      }
    }
    
    setTasks(prev => prev.filter(task => task.id !== id));
    toast.info("Task deleted");
  };

  const prioritizeTasks = () => {
    setTasks(prev => {
      const incompleteTasks = prev.filter(task => !task.completed);
      const completedTasks = prev.filter(task => task.completed);
      
      const tasksWithScores: TaskWithPriorityScore[] = incompleteTasks.map(task => {
        const priorityScore = calculatePriority(
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
          priorityScore,
          priority: priorityScore > 66 ? 'high' as const : priorityScore > 33 ? 'medium' as const : 'low' as const
        };
      });
      
      tasksWithScores.sort((a, b) => b.priorityScore - a.priorityScore);
      
      return [...tasksWithScores, ...completedTasks];
    });
  };
  
  const suggestHabit = () => {
    const completedTasks = tasks.filter(task => task.completed);
    if (completedTasks.length < 5) return;
    
    const timeDistribution = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    };
    
    const moodDistribution: Record<string, number> = {};
    const taskTypeDistribution: Record<string, number> = {};
    
    completedTasks.forEach(task => {
      const completedAt = task.completedAt || new Date();
      const hour = completedAt.getHours();
      
      if (hour >= 5 && hour < 12) timeDistribution.morning++;
      else if (hour >= 12 && hour < 17) timeDistribution.afternoon++;
      else if (hour >= 17 && hour < 22) timeDistribution.evening++;
      else timeDistribution.night++;
      
      if (task.mood) {
        moodDistribution[task.mood] = (moodDistribution[task.mood] || 0) + 1;
      }
      
      // Track task types based on keywords
      const taskText = task.name.toLowerCase();
      if (taskText.includes('bug') || taskText.includes('fix')) {
        taskTypeDistribution['debugging'] = (taskTypeDistribution['debugging'] || 0) + 1;
      } else if (taskText.includes('feature') || taskText.includes('implement')) {
        taskTypeDistribution['feature'] = (taskTypeDistribution['feature'] || 0) + 1;
      } else if (taskText.includes('test') || taskText.includes('review')) {
        taskTypeDistribution['testing'] = (taskTypeDistribution['testing'] || 0) + 1;
      }
    });
    
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
    
    let preferredMood: "Creative" | "Focused" | "Relaxed" | "Energetic" | "Tired" | undefined;
    let maxMood = 0;
    
    Object.entries(moodDistribution).forEach(([mood, count]) => {
      if (count > maxMood) {
        preferredMood = mood as any;
        maxMood = count;
      }
    });
    
    // Find most successful task type
    let preferredTaskType = '';
    let maxTaskType = 0;
    
    Object.entries(taskTypeDistribution).forEach(([type, count]) => {
      if (count > maxTaskType) {
        preferredTaskType = type;
        maxTaskType = count;
      }
    });
    
    let habitName = "";
    let habitDescription = "";
    
    if (mostProductiveTime === "morning") {
      habitName = "Morning coding session";
      habitDescription = "You're most productive in the morning";
    } else if (mostProductiveTime === "afternoon") {
      habitName = "Afternoon productivity block";
      habitDescription = "Your peak performance is in the afternoon";
    } else if (mostProductiveTime === "evening") {
      habitName = "Evening dev work";
      habitDescription = "Evening hours are your most productive";
    } else {
      habitName = "Night owl coding";
      habitDescription = "You excel at night coding sessions";
    }
    
    if (preferredMood) {
      habitName += ` when ${preferredMood.toLowerCase()}`;
      habitDescription += `, especially when you're feeling ${preferredMood.toLowerCase()}`;
    }
    
    if (preferredTaskType) {
      habitDescription += `. You're particularly good at ${preferredTaskType} tasks`;
