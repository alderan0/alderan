
import { Task, Project, Tool } from "@/context/TaskContext";
import { v4 as uuidv4 } from "uuid";

// Generate random date within 30 days (past or future)
const randomDate = (future = true) => {
  const date = new Date();
  const range = future ? 30 : -30;
  date.setDate(date.getDate() + Math.floor(Math.random() * range));
  return date;
};

// Generate random profile data
export const generateMockProfiles = (count = 10) => {
  const profiles = [];
  const names = ['Alex', 'Jordan', 'Taylor', 'Morgan', 'Casey', 'Riley', 'Jamie', 'Quinn', 'Avery', 'Sam', 'Blake', 'Dakota'];
  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];
  
  for (let i = 0; i < count; i++) {
    profiles.push({
      id: uuidv4(),
      name: `${names[Math.floor(Math.random() * names.length)]} ${String.fromCharCode(65 + Math.floor(Math.random() * 26)}.`,
      skillLevel: skillLevels[Math.floor(Math.random() * skillLevels.length)],
      points: Math.floor(Math.random() * 5000),
      tasksCompleted: Math.floor(Math.random() * 100),
      projectsCompleted: Math.floor(Math.random() * 10),
      joinedDate: new Date(Date.now() - Math.floor(Math.random() * 90 * 24 * 60 * 60 * 1000)), // Random date within last 90 days
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`
    });
  }
  
  return profiles;
};

// Generate mock tasks
export const generateMockTasks = (count = 15) => {
  const tasks: Task[] = [];
  const moods = ['Focused', 'Creative', 'Relaxed', 'Energetic', 'Tired'];
  const taskNames = [
    'Setup development environment', 
    'Create component library', 
    'Implement authentication flow', 
    'Design landing page',
    'Optimize database queries',
    'Write unit tests',
    'Fix cross-browser compatibility issues',
    'Implement responsive design',
    'Setup CI/CD pipeline',
    'Create documentation',
    'Review pull requests',
    'Implement analytics',
    'Optimize application performance',
    'Add dark mode support',
    'Implement search functionality'
  ];
  
  for (let i = 0; i < count; i++) {
    const completed = Math.random() > 0.7;
    const estimatedTime = Math.floor(Math.random() * 120) + 15; // 15-135 minutes
    const actualTime = completed ? Math.floor(estimatedTime * (Math.random() * 0.5 + 0.75)) : undefined; // +/- 25% of estimated
    const deadline = randomDate(true);
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)); // Random date within last 14 days
    const completedAt = completed ? new Date(createdAt.getTime() + Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)) : undefined; // 0-7 days after creation
    
    const task: Task = {
      id: uuidv4(),
      name: taskNames[i % taskNames.length],
      description: `Task description for ${taskNames[i % taskNames.length]}. This is a sample task for demonstration purposes.`,
      deadline,
      completed,
      estimatedTime,
      actualTime,
      priority: Math.floor(Math.random() * 100),
      mood: moods[Math.floor(Math.random() * moods.length)],
      createdAt,
      completedAt,
      subtasks: []
    };
    
    // Add subtasks
    const subtaskCount = Math.floor(Math.random() * 4) + 1;
    for (let j = 0; j < subtaskCount; j++) {
      task.subtasks.push({
        id: uuidv4(),
        name: `Subtask ${j + 1} for ${task.name}`,
        completed: Math.random() > 0.5,
        taskId: task.id
      });
    }
    
    tasks.push(task);
  }
  
  return tasks;
};

// Generate mock projects
export const generateMockProjects = (count = 5, tasks: Task[] = []) => {
  const projects: Project[] = [];
  const projectNames = [
    'E-commerce Platform', 
    'Personal Portfolio', 
    'Admin Dashboard',
    'Mobile App UI',
    'Content Management System',
    'Social Media Integration',
    'API Gateway',
    'Interactive Data Visualization',
    'Progressive Web App',
    'User Authentication System'
  ];
  
  for (let i = 0; i < count; i++) {
    const completed = Math.random() > 0.8;
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)); // Random date within last 30 days
    const completedAt = completed ? new Date(createdAt.getTime() + Math.floor(Math.random() * 14 * 24 * 60 * 60 * 1000)) : undefined; // 0-14 days after creation
    
    const project: Project = {
      id: uuidv4(),
      name: projectNames[i % projectNames.length],
      description: `A project for ${projectNames[i % projectNames.length]}. This includes various tasks and features to be implemented.`,
      deadline: randomDate(true),
      completed,
      createdAt,
      completedAt
    };
    
    projects.push(project);
  }
  
  // Assign some tasks to projects
  if (tasks.length > 0) {
    tasks.forEach((task, index) => {
      if (index < tasks.length * 0.7) { // 70% of tasks belong to projects
        const projectIndex = Math.floor(Math.random() * projects.length);
        task.projectId = projects[projectIndex].id;
      }
    });
  }
  
  return projects;
};

// Generate mock tools
export const generateMockTools = (count = 5) => {
  const tools: Tool[] = [];
  const toolNames = [
    'Productivity Booster',
    'Focus Timer',
    'Creativity Enhancer',
    'Task Analyzer',
    'Energy Drink',
    'AI Assistant',
    'Code Generator',
    'Bug Hunter',
    'Time Saver',
    'Code Formatter'
  ];
  
  const toolTypes = ['booster', 'timer', 'analyzer', 'generator', 'enhancer'];
  
  for (let i = 0; i < count; i++) {
    const tool: Tool = {
      id: uuidv4(),
      name: toolNames[i % toolNames.length],
      type: toolTypes[i % toolTypes.length],
      description: `A tool that helps with ${toolNames[i % toolNames.length].toLowerCase()}. Use it to improve your productivity.`,
      isActive: Math.random() > 0.5,
      used: Math.random() > 0.7,
      effect: {
        height: Math.floor(Math.random() * 10) + 1,
        leaves: Math.floor(Math.random() * 20) + 1,
        health: Math.floor(Math.random() * 100),
        beauty: Math.floor(Math.random() * 100),
        special: ['Glow', 'Sparkle', 'Rainbow', 'Wave', 'Pulse'][Math.floor(Math.random() * 5)],
        style: ['Modern', 'Retro', 'Nature', 'Tech', 'Minimal'][Math.floor(Math.random() * 5)]
      },
      minLevel: Math.floor(Math.random() * 5) + 1
    };
    
    tools.push(tool);
  }
  
  return tools;
};

// Generate mock habits
export const generateMockHabits = (count = 5) => {
  const habits = [];
  const habitNames = [
    'Write code daily',
    'Review documentation',
    'Read tech articles',
    'Participate in code reviews',
    'Learn a new concept',
    'Practice algorithmic problems',
    'Contribute to open-source',
    'Refactor old code',
    'Meditate before coding',
    'Take short breaks'
  ];
  
  for (let i = 0; i < count; i++) {
    const createdAt = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
    const lastCompleted = Math.random() > 0.3 ? new Date(Date.now() - Math.floor(Math.random() * 3 * 24 * 60 * 60 * 1000)) : null;
    
    habits.push({
      id: uuidv4(),
      name: habitNames[i % habitNames.length],
      created_at: createdAt,
      last_completed: lastCompleted,
      streak: Math.floor(Math.random() * 30),
      user_id: "sample-user"
    });
  }
  
  return habits;
};

// Load all sample data together
export const loadSampleData = () => {
  try {
    // Check if sample data already exists
    const tasks = localStorage.getItem("tasks");
    const projects = localStorage.getItem("projects");
    const tools = localStorage.getItem("tools");
    const habits = localStorage.getItem("habits");
    
    // If data doesn't exist, create it
    if (!tasks) {
      const mockTasks = generateMockTasks(15);
      localStorage.setItem("tasks", JSON.stringify(mockTasks));
    }
    
    if (!projects) {
      const parsedTasks = tasks ? JSON.parse(tasks) : [];
      const mockProjects = generateMockProjects(5, parsedTasks);
      localStorage.setItem("projects", JSON.stringify(mockProjects));
      
      // Update tasks with project IDs
      if (parsedTasks.length > 0 && parsedTasks[0].projectId) {
        localStorage.setItem("tasks", JSON.stringify(parsedTasks));
      }
    }
    
    if (!tools) {
      const mockTools = generateMockTools(8);
      localStorage.setItem("tools", JSON.stringify(mockTools));
    }
    
    if (!habits) {
      const mockHabits = generateMockHabits(5);
      localStorage.setItem("habits", JSON.stringify(mockHabits));
    }
    
    console.log("Sample data loaded successfully");
  } catch (error) {
    console.error("Error loading sample data:", error);
  }
};
