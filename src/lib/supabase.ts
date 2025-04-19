import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const signUp = async ({ email, password }: { email: string; password: string }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
};

export const signIn = async ({ email, password }: { email: string; password: string }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Database types
export type User = {
  id: string;
  email: string;
  created_at: string;
  username?: string;
  avatar_url?: string;
};

export type Tree = {
  id: string;
  user_id: string;
  level: number;
  health: number;
  created_at: string;
  updated_at: string;
  active_rewards: string[];
  style_preferences: Record<string, any>;
};

export type Task = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  deadline?: string;
  completed: boolean;
  difficulty: string;
  estimated_time: number;
  actual_time?: number;
  mood: string;
  created_at: string;
  completed_at?: string;
  project_id?: string;
  parent_task_id?: string;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  deadline?: string;
  completed: boolean;
  created_at: string;
  completed_at?: string;
};

export type Reward = {
  id: string;
  user_id: string;
  type: 'growth' | 'decoration';
  name: string;
  rarity: string;
  acquired_at: string;
  used_at?: string;
  expires_at?: string;
};

// Database helper functions
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const updateUserProfile = async (userId: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  return { data, error };
};

export const getUserTree = async (userId: string) => {
  const { data, error } = await supabase
    .from('trees')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

export const updateTree = async (treeId: string, updates: Partial<Tree>) => {
  const { data, error } = await supabase
    .from('trees')
    .update(updates)
    .eq('id', treeId);
  return { data, error };
};

export const getUserTasks = async (userId: string) => {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createTask = async (task: Omit<Task, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();
  return { data, error };
};

export const updateTask = async (taskId: string, updates: Partial<Task>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', taskId);
  return { data, error };
};

export const getUserProjects = async (userId: string) => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createProject = async (project: Omit<Project, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([project])
    .select()
    .single();
  return { data, error };
};

export const updateProject = async (projectId: string, updates: Partial<Project>) => {
  const { data, error } = await supabase
    .from('projects')
    .update(updates)
    .eq('id', projectId);
  return { data, error };
};

export const getUserRewards = async (userId: string) => {
  const { data, error } = await supabase
    .from('rewards')
    .select('*')
    .eq('user_id', userId)
    .order('acquired_at', { ascending: false });
  return { data, error };
};

export const createReward = async (reward: Omit<Reward, 'id' | 'acquired_at'>) => {
  const { data, error } = await supabase
    .from('rewards')
    .insert([reward])
    .select()
    .single();
  return { data, error };
}; 