
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// Task-related type definitions
export interface NewTaskInput {
  name: string;
  description?: string;
  deadline: Date;
  estimatedTime: number;
  mood?: string;
  projectId?: string;
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  deadline: Date;
  completed: boolean;
  estimatedTime: number;
  actualTime?: number;
  priority?: number;
  difficulty?: number;
  mood?: string;
  projectId?: string;
  createdAt: Date;
  completedAt?: Date;
  subtasks: Subtask[];
}

export interface Subtask {
  id: string;
  name: string;
  completed: boolean;
  taskId: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  deadline?: Date;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  tasks?: Task[];
}

export interface Tool {
  id: string;
  name: string;
  type: string;
  description?: string;
  isActive: boolean;
  used?: boolean;
  effect?: string;
  minLevel?: number;
}

export interface NewProjectInput {
  name: string;
  description?: string;
  deadline?: Date;
}

// The context state interface
interface TaskContextState {
  tasks: Task[];
  projects: Project[];
  tools: Tool[];
  currentMood: string;
  suggestedTasks: Task[];
  addTask: (task: NewTaskInput) => void;
  completeTask: (id: string, actualTime: number) => void;
  deleteTask: (id: string, useForTraining?: boolean) => void;
  setTaskDifficulty: (id: string, difficulty: 'easy' | 'medium' | 'hard') => void;
  addProject: (project: NewProjectInput) => void;
  completeProject: (id: string) => void;
  deleteProject: (id: string) => void;
  setMood: (mood: string) => void;
  deleteCompletedTasks: (useForAITraining?: boolean) => void;
  updateAITrainingPreference: (useForTraining: boolean) => void;
  generateProjectFromRequirements: (requirements: string) => Promise<void>;
  addSubtask: (taskId: string, subtaskName: string) => void;
  completeSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;
  getProjectResources: (projectId: string) => any[];
  getTaskStats: () => any;
  getAIScheduleSuggestions: () => any[];
  habits: any[];
  getMoodBasedSuggestions: () => any[];
  setCurrentMood: (mood: string) => void;
  prioritizeTasks: () => void;
}

// Create the context with a default undefined value
const TaskContext = createContext<TaskContextState | undefined>(undefined);

// Calculate task priority based on various factors
const calculatePriority = (task: NewTaskInput, tasks: Task[], currentMood: string): number => {
  const now = new Date().getTime();
  const deadlineDate = new Date(task.deadline).getTime();
  
  const hoursUntilDeadline = Math.max(0, (deadlineDate - now) / (1000 * 60 * 60));
  
  const deadlineScore = 100 - Math.min(100, hoursUntilDeadline);
  
  // Ensure estimatedTime is converted to a number
  const estimatedTimeNum = Number(task.estimatedTime) || 0;
  const timeScore = 100 - Math.min(100, estimatedTimeNum);
  
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

// Hook for adding to local storage
const useLocalStorage = <T,>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
};

// TaskProvider component
export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useLocalStorage<Task[]>("tasks", []);
  const [projects, setProjects] = useLocalStorage<Project[]>("projects", []);
  const [tools, setTools] = useLocalStorage<Tool[]>("tools", []);
  const [currentMood, setCurrentMood] = useLocalStorage<string>("currentMood", "Focused");
  const [useAITraining, setUseAITraining] = useLocalStorage<boolean>("useAITraining", true);
  const [habits, setHabits] = useLocalStorage<any[]>("habits", []);

  // Get suggested tasks based on priority and current mood
  const suggestedTasks = tasks
    .filter(task => !task.completed)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .slice(0, 3);

  // Add a new task
  const addTask = (taskInput: NewTaskInput) => {
    const now = new Date();
    const newTask: Task = {
      id: uuidv4(),
      name: taskInput.name,
      description: taskInput.description,
      deadline: taskInput.deadline,
      completed: false,
      estimatedTime: Number(taskInput.estimatedTime),
      mood: taskInput.mood,
      projectId: taskInput.projectId,
      createdAt: now,
      priority: calculatePriority(taskInput, tasks, currentMood),
      subtasks: []
    };

    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  // Complete a task
  const completeTask = (id: string, actualTime: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, completed: true, completedAt: new Date(), actualTime }
          : task
      )
    );
  };

  // Delete a task
  const deleteTask = (id: string, useForTraining?: boolean) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
  };

  // Set task difficulty
  const setTaskDifficulty = (id: string, difficulty: 'easy' | 'medium' | 'hard') => {
    const difficultyMap = {
      easy: 30,
      medium: 60,
      hard: 90
    };

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id ? { ...task, difficulty: difficultyMap[difficulty] } : task
      )
    );
  };

  // Add a new project
  const addProject = (projectInput: NewProjectInput) => {
    const newProject: Project = {
      id: uuidv4(),
      name: projectInput.name,
      description: projectInput.description,
      deadline: projectInput.deadline,
      completed: false,
      createdAt: new Date()
    };

    setProjects(prevProjects => [...prevProjects, newProject]);
  };

  // Complete a project
  const completeProject = (id: string) => {
    setProjects(prevProjects =>
      prevProjects.map(project =>
        project.id === id
          ? { ...project, completed: true, completedAt: new Date() }
          : project
      )
    );

    // Also complete all tasks in the project
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.projectId === id && !task.completed
          ? { ...task, completed: true, completedAt: new Date() }
          : task
      )
    );
  };

  // Delete a project
  const deleteProject = (id: string) => {
    setProjects(prevProjects => prevProjects.filter(project => project.id !== id));
    
    // Also delete all tasks in the project
    setTasks(prevTasks => prevTasks.filter(task => task.projectId !== id));
  };

  // Set the current mood
  const setMood = (mood: string) => {
    setCurrentMood(mood);
  };

  // Delete completed tasks
  const deleteCompletedTasks = (useForAITraining = true) => {
    setTasks(prevTasks => prevTasks.filter(task => !task.completed));
  };

  // Update AI training preference
  const updateAITrainingPreference = (useForTraining: boolean) => {
    setUseAITraining(useForTraining);
  };

  // Add a subtask to a task
  const addSubtask = (taskId: string, subtaskName: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const newSubtask = {
            id: uuidv4(),
            name: subtaskName,
            completed: false,
            taskId
          };
          return {
            ...task,
            subtasks: [...(task.subtasks || []), newSubtask]
          };
        }
        return task;
      })
    );
  };

  // Complete a subtask
  const completeSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: (task.subtasks || []).map(subtask =>
              subtask.id === subtaskId ? { ...subtask, completed: true } : subtask
            )
          };
        }
        return task;
      })
    );
  };

  // Delete a subtask
  const deleteSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            subtasks: (task.subtasks || []).filter(subtask => subtask.id !== subtaskId)
          };
        }
        return task;
      })
    );
  };

  // Get project resources (mock data)
  const getProjectResources = (projectId: string) => {
    // Return mock data for now
    return [
      {
        id: '1',
        name: 'React Documentation',
        description: 'Official React documentation',
        type: 'resource',
        url: 'https://reactjs.org'
      },
      {
        id: '2',
        name: 'VS Code',
        description: 'Code editor for project development',
        type: 'app',
        url: 'https://code.visualstudio.com'
      }
    ];
  };

  // Get task statistics (mock data)
  const getTaskStats = () => {
    return {
      completionRate: 0.75,
      averageCompletionTime: 45,
      productivityScore: 'B+',
      highPriorityTasks: 3
    };
  };

  // Get AI schedule suggestions (mock data)
  const getAIScheduleSuggestions = () => {
    return [
      {
        id: '1',
        title: 'Morning Focus Block',
        description: 'Complete high-priority tasks when energy is highest',
        tasks: ['Task 1', 'Task 2']
      },
      {
        id: '2',
        title: 'Afternoon Creative Session',
        description: 'Work on creative tasks after lunch',
        tasks: ['Task 3', 'Task 4']
      }
    ];
  };

  // Get mood-based suggestions
  const getMoodBasedSuggestions = () => {
    // Mock suggestions based on current mood
    switch (currentMood) {
      case 'Focused':
        return [
          { id: '1', type: 'task', title: 'Deep work session', description: 'Block 90 minutes for focused work' },
          { id: '2', type: 'resource', title: 'Flow state playlist', description: 'Background music for concentration' }
        ];
      case 'Creative':
        return [
          { id: '3', type: 'task', title: 'Brainstorming session', description: 'Generate new ideas for projects' },
          { id: '4', type: 'tool', title: 'Mind mapping tool', description: 'Visualize your thoughts' }
        ];
      default:
        return [];
    }
  };

  // Prioritize tasks based on current mood and deadlines
  const prioritizeTasks = () => {
    setTasks(prevTasks => 
      prevTasks.map(task => {
        if (!task.completed) {
          return { ...task, priority: calculatePriority({
            name: task.name,
            deadline: task.deadline,
            estimatedTime: task.estimatedTime,
            mood: task.mood,
            projectId: task.projectId
          }, tasks, currentMood) };
        }
        return task;
      })
    );
  };

  // Generate a project and tasks from requirements using AI
  const generateProjectFromRequirements = async (requirements: string) => {
    try {
      // Mock implementation for generating projects from AI
      console.log("Generating project from requirements:", requirements);
      
      // Create a new project based on the requirements
      const projectName = requirements.split('\n')[0] || "New AI Generated Project";
      const projectDesc = "AI generated project based on requirements";
      
      const newProject: Project = {
        id: uuidv4(),
        name: projectName,
        description: projectDesc,
        completed: false,
        createdAt: new Date()
      };
      
      // Add the project
      setProjects(prev => [...prev, newProject]);
      
      // Generate some mock tasks based on requirements
      const keyPhrases = requirements.split('\n')
        .filter(line => line.trim().length > 10)
        .slice(0, 5);
      
      const newTasks: Task[] = keyPhrases.map((phrase, index) => ({
        id: uuidv4(),
        name: `Task ${index + 1}: ${phrase.slice(0, 30)}...`,
        description: phrase,
        deadline: new Date(Date.now() + (index + 1) * 86400000),
        completed: false,
        estimatedTime: 60 + index * 30,
        priority: 80 - index * 10,
        projectId: newProject.id,
        createdAt: new Date(),
        subtasks: []
      }));
      
      // Add the tasks
      setTasks(prev => [...prev, ...newTasks]);
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error generating project from requirements:", error);
      return Promise.reject(error);
    }
  };

  // Provide the context value
  const value = {
    tasks,
    projects,
    tools,
    currentMood,
    suggestedTasks,
    habits,
    addTask,
    completeTask,
    deleteTask,
    setTaskDifficulty,
    addProject,
    completeProject,
    deleteProject,
    setMood,
    setCurrentMood: setMood,
    deleteCompletedTasks,
    updateAITrainingPreference,
    generateProjectFromRequirements,
    addSubtask,
    completeSubtask,
    deleteSubtask,
    getProjectResources,
    getTaskStats,
    getAIScheduleSuggestions,
    getMoodBasedSuggestions,
    prioritizeTasks
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

// Custom hook for using the task context
export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
