
import { Task, Project, Tool } from '@/context/TaskContext';
import { v4 as uuidv4 } from 'uuid';

export const generateSampleProfiles = (): any[] => {
  return [
    { id: uuidv4(), name: 'Alex Johnson', email: 'alex@example.com', avatar: '👨‍💻' },
    { id: uuidv4(), name: 'Sarah Chen', email: 'sarah@example.com', avatar: '👩‍💻' },
    { id: uuidv4(), name: 'Miguel Rodriguez', email: 'miguel@example.com', avatar: '🧑‍💻' },
    { id: uuidv4(), name: 'Priya Patel', email: 'priya@example.com', avatar: '👩‍💻' },
    { id: uuidv4(), name: 'James Wilson', email: 'james@example.com', avatar: '👨‍💻' },
    { id: uuidv4(), name: 'Emma Davis', email: 'emma@example.com', avatar: '👩‍💻' },
    { id: uuidv4(), name: 'Jamal Ahmed', email: 'jamal@example.com', avatar: '🧑‍💻' },
    { id: uuidv4(), name: 'Olivia Martinez', email: 'olivia@example.com', avatar: '👩‍💻' },
    { id: uuidv4(), name: 'Daniel Kim', email: 'daniel@example.com', avatar: '👨‍💻' },
    { id: uuidv4(), name: 'Sophia Lee', email: 'sophia@example.com', avatar: '👩‍💻' },
  ];
};

export const generateSampleTasks = (): Task[] => {
  const now = new Date();
  const tasks: Task[] = [
    {
      id: uuidv4(),
      name: 'Set up React project with TypeScript',
      description: 'Initialize a new React project with TypeScript and configure ESLint and Prettier',
      deadline: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000),
      estimatedTime: 60,
      completed: false,
      priority: 85,
      difficulty: 30,
      mood: 'Focused',
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000)
    },
    {
      id: uuidv4(),
      name: 'Learn Tailwind CSS',
      description: 'Go through Tailwind CSS documentation and build a sample component library',
      deadline: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000),
      estimatedTime: 180,
      completed: false,
      priority: 70,
      difficulty: 60,
      mood: 'Creative',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: uuidv4(),
      name: 'Implement authentication with Supabase',
      description: 'Set up user authentication using Supabase Auth',
      deadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000),
      estimatedTime: 120,
      completed: false,
      priority: 90,
      difficulty: 75,
      mood: 'Focused',
      createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: uuidv4(),
      name: 'Create responsive dashboard UI',
      description: 'Design and implement a responsive dashboard using Figma and React',
      deadline: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      estimatedTime: 240,
      completed: false,
      priority: 65,
      difficulty: 60,
      mood: 'Creative',
      createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000)
    },
    {
      id: uuidv4(),
      name: 'Fix cross-browser compatibility issues',
      description: 'Test and fix UI issues across Chrome, Firefox, and Safari',
      deadline: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000),
      estimatedTime: 90,
      completed: true,
      actualTime: 120,
      priority: 95,
      difficulty: 80,
      mood: 'Focused',
      createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000),
      completedAt: new Date(now.getTime() - 12 * 60 * 60 * 1000)
    },
    {
      id: uuidv4(),
      name: 'Learn Next.js basics',
      description: 'Go through the official Next.js tutorial',
      deadline: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
      estimatedTime: 150,
      completed: false,
      priority: 75,
      difficulty: 50,
      mood: 'Energetic',
      createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: uuidv4(),
      name: 'Implement dark mode',
      description: 'Add dark mode support using Tailwind and CSS variables',
      deadline: new Date(now.getTime() + 6 * 24 * 60 * 60 * 1000),
      estimatedTime: 90,
      completed: false,
      priority: 60,
      difficulty: 40,
      mood: 'Creative',
      createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000)
    },
  ];

  return tasks;
};

export const generateSampleProjects = (): Project[] => {
  const now = new Date();
  const projects: Project[] = [
    {
      id: uuidv4(),
      name: 'Personal Portfolio Website',
      description: 'A developer portfolio website built with React and Tailwind',
      deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      completed: false,
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    },
    {
      id: uuidv4(),
      name: 'Task Management App',
      description: 'A productivity app for managing tasks and projects',
      deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      completed: false,
      createdAt: new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    },
    {
      id: uuidv4(),
      name: 'E-commerce Dashboard',
      description: 'Admin dashboard for managing products and orders',
      deadline: new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000),
      completed: false,
      createdAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000)
    },
    {
      id: uuidv4(),
      name: 'Blog CMS',
      description: 'Content management system for a technical blog',
      deadline: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000),
      completed: true,
      createdAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      completedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000)
    },
  ];

  return projects;
};

export const generateSampleTools = (): Tool[] => {
  return [
    {
      id: uuidv4(),
      name: 'Project Planner',
      type: 'planning',
      description: 'Creates structured project plans',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Code Formatter',
      type: 'coding',
      description: 'Formats and organizes your code',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Bug Hunter',
      type: 'debugging',
      description: 'Helps identify and fix bugs',
      isActive: false
    },
    {
      id: uuidv4(),
      name: 'AI Assistant',
      type: 'productivity',
      description: 'Provides AI-powered coding help',
      isActive: true
    },
    {
      id: uuidv4(),
      name: 'Time Tracker',
      type: 'productivity',
      description: 'Tracks time spent on tasks',
      isActive: false
    },
  ];
};

export const loadSampleData = () => {
  // Load sample data into localStorage if it doesn't exist yet
  if (!localStorage.getItem('sampleDataLoaded')) {
    const tasks = generateSampleTasks();
    const projects = generateSampleProjects();
    const tools = generateSampleTools();
    
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('projects', JSON.stringify(projects));
    localStorage.setItem('tools', JSON.stringify(tools));
    localStorage.setItem('sampleDataLoaded', 'true');
    
    console.log('Sample data loaded successfully');
    return { tasks, projects, tools };
  }
  
  return null;
};
