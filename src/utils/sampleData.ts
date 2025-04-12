
import { Task, Project, Tool } from "@/context/TaskContext";

// Initialize local storage with sample data for testing purposes
export const loadSampleData = () => {
  // Check if we've already loaded sample data
  if (localStorage.getItem('alreadyLoadedSampleData')) {
    return;
  }

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  // Sample tasks
  const sampleTasks: Task[] = [
    {
      id: "task-1",
      name: "Implement login functionality",
      description: "Create a login screen with email and password fields, forgot password link, and form validation.",
      deadline: tomorrow,
      estimatedTime: 120,
      completed: false,
      priority: 90,
      difficulty: 65,
      mood: "Focused",
      createdAt: today,
      subtasks: [
        { id: "subtask-1", name: "Create login form UI", completed: false, taskId: "task-1" },
        { id: "subtask-2", name: "Implement form validation", completed: false, taskId: "task-1" },
        { id: "subtask-3", name: "Connect to authentication API", completed: false, taskId: "task-1" }
      ]
    },
    {
      id: "task-2",
      name: "Design dashboard wireframes",
      description: "Create wireframes for the main dashboard including stats widgets, activity feed, and navigation.",
      deadline: tomorrow,
      estimatedTime: 90,
      completed: false,
      priority: 85,
      difficulty: 50,
      mood: "Creative",
      createdAt: today,
      subtasks: []
    },
    {
      id: "task-3",
      name: "Set up CI/CD pipeline",
      description: "Configure GitHub Actions for continuous integration and automatic deployment to staging environment.",
      deadline: nextWeek,
      estimatedTime: 180,
      completed: false,
      priority: 75,
      difficulty: 80,
      mood: "Focused",
      createdAt: today,
      subtasks: []
    },
    {
      id: "task-4",
      name: "Write API documentation",
      description: "Document all available API endpoints, request/response formats, and authentication requirements.",
      deadline: nextWeek,
      estimatedTime: 150,
      completed: false,
      priority: 60,
      difficulty: 40,
      mood: "Relaxed",
      createdAt: today,
      subtasks: []
    },
    {
      id: "task-5",
      name: "Fix payment processing bug",
      description: "Investigate and resolve issue with payment processing failing for international credit cards.",
      deadline: yesterday,
      estimatedTime: 60,
      completed: true,
      actualTime: 90,
      priority: 95,
      difficulty: 70,
      mood: "Focused",
      createdAt: yesterday,
      completedAt: today,
      subtasks: []
    },
    {
      id: "task-6",
      name: "Update dependencies",
      description: "Update all npm packages to their latest compatible versions and test for any breaking changes.",
      deadline: nextWeek,
      estimatedTime: 120,
      completed: false,
      priority: 50,
      difficulty: 30,
      mood: "Relaxed",
      createdAt: today,
      subtasks: []
    },
    {
      id: "task-7",
      name: "Create user onboarding flow",
      description: "Design and implement a step-by-step onboarding process for new users.",
      deadline: nextWeek,
      estimatedTime: 240,
      completed: false,
      priority: 80,
      difficulty: 60,
      mood: "Creative",
      createdAt: today,
      subtasks: []
    }
  ];

  // Sample projects
  const sampleProjects: Project[] = [
    {
      id: "project-1",
      name: "E-commerce Website Redesign",
      description: "Modernize the existing e-commerce platform with improved UX/UI, faster performance, and mobile responsiveness.",
      deadline: new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000),
      completed: false,
      createdAt: new Date(today.getTime() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: "project-2",
      name: "Mobile App Development",
      description: "Create a cross-platform mobile app for both iOS and Android using React Native.",
      deadline: new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000),
      completed: false,
      createdAt: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: "project-3",
      name: "Marketing Website",
      description: "Design and develop a marketing website for a new product launch.",
      completed: true,
      createdAt: new Date(today.getTime() - 45 * 24 * 60 * 60 * 1000),
      completedAt: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000)
    }
  ];

  // Sample productivity tools
  const sampleTools: Tool[] = [
    {
      id: "tool-1",
      name: "Focus Boost",
      type: "productivity",
      description: "Increases your focus for the next work session",
      isActive: false,
      effect: {
        health: 5,
        leaves: 10
      }
    },
    {
      id: "tool-2",
      name: "Rainbow Leaves",
      type: "decoration",
      description: "Adds vibrant colors to your tree's leaves",
      isActive: false,
      effect: {
        beauty: 15,
        style: "rainbow"
      }
    },
    {
      id: "tool-3",
      name: "Growth Fertilizer",
      type: "growth",
      description: "Accelerates your tree's growth",
      isActive: true,
      effect: {
        height: 20,
        health: 10
      }
    }
  ];

  // Sample habits
  const sampleHabits = [
    {
      id: "habit-1",
      name: "Morning coding session",
      streak: 5,
      lastCompleted: new Date(today.getTime() - 24 * 60 * 60 * 1000)
    },
    {
      id: "habit-2",
      name: "Document progress",
      streak: 3,
      lastCompleted: today
    },
    {
      id: "habit-3",
      name: "Review code",
      streak: 0,
      lastCompleted: new Date(today.getTime() - 3 * 24 * 60 * 60 * 1000)
    }
  ];

  // Set sample data in localStorage
  localStorage.setItem('tasks', JSON.stringify(sampleTasks));
  localStorage.setItem('projects', JSON.stringify(sampleProjects));
  localStorage.setItem('tools', JSON.stringify(sampleTools));
  localStorage.setItem('habits', JSON.stringify(sampleHabits));
  localStorage.setItem('currentMood', JSON.stringify("Focused"));
  localStorage.setItem('alreadyLoadedSampleData', 'true');
};
