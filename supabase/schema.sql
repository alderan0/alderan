-- Create custom types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE task_difficulty AS ENUM ('Easy', 'Medium', 'Hard', 'Very Hard');
CREATE TYPE task_mood AS ENUM ('Energetic', 'Focused', 'Neutral', 'Tired', 'Stressed');
CREATE TYPE reward_type AS ENUM ('growth', 'decoration');
CREATE TYPE reward_rarity AS ENUM ('Common', 'Uncommon', 'Rare', 'Exquisite');

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    role user_role DEFAULT 'user'
);

-- Create trees table
CREATE TABLE public.trees (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    level INTEGER DEFAULT 1,
    health INTEGER DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    active_rewards JSONB DEFAULT '[]',
    style_preferences JSONB DEFAULT '{}'
);

-- Create projects table
CREATE TABLE public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMPTZ,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    CONSTRAINT project_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 100)
);

-- Create tasks table
CREATE TABLE public.tasks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
    parent_task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    deadline TIMESTAMPTZ,
    completed BOOLEAN DEFAULT FALSE,
    difficulty task_difficulty DEFAULT 'Medium',
    estimated_time INTEGER, -- in minutes
    actual_time INTEGER, -- in minutes
    mood task_mood DEFAULT 'Neutral',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    ai_difficulty INTEGER, -- AI calculated difficulty (1-100)
    CONSTRAINT task_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 200)
);

-- Create rewards table
CREATE TABLE public.rewards (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type reward_type NOT NULL,
    name TEXT NOT NULL,
    rarity reward_rarity NOT NULL,
    acquired_at TIMESTAMPTZ DEFAULT NOW(),
    used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'
);

-- Create community votes table
CREATE TABLE public.community_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    tree_id UUID REFERENCES public.trees(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, tree_id)
);

-- Create achievements table
CREATE TABLE public.achievements (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    unlocked_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create beta_access table
CREATE TABLE public.beta_access (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ,
    approved_by UUID REFERENCES auth.users(id)
);

-- Create feedback table
CREATE TABLE public.feedback (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('chat', 'survey')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Create survey_questions table
CREATE TABLE public.survey_questions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    question TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('objective', 'subjective')),
    options JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    active BOOLEAN DEFAULT true
);

-- Create survey_responses table
CREATE TABLE public.survey_responses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.survey_questions(id) ON DELETE CASCADE,
    response TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create functions and triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_trees_updated_at
    BEFORE UPDATE ON public.trees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- Row Level Security Policies
-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- Trees
ALTER TABLE public.trees ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Trees are viewable by everyone"
    ON public.trees FOR SELECT
    USING (true);

CREATE POLICY "Users can update own tree"
    ON public.trees FOR UPDATE
    USING (auth.uid() = user_id);

-- Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Projects are viewable by owner"
    ON public.projects FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Projects are insertable by owner"
    ON public.projects FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Projects are updatable by owner"
    ON public.projects FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Projects are deletable by owner"
    ON public.projects FOR DELETE
    USING (auth.uid() = user_id);

-- Tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tasks are viewable by owner"
    ON public.tasks FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Tasks are insertable by owner"
    ON public.tasks FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Tasks are updatable by owner"
    ON public.tasks FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Tasks are deletable by owner"
    ON public.tasks FOR DELETE
    USING (auth.uid() = user_id);

-- Rewards
ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Rewards are viewable by owner"
    ON public.rewards FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Rewards are insertable by owner"
    ON public.rewards FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Rewards are updatable by owner"
    ON public.rewards FOR UPDATE
    USING (auth.uid() = user_id);

-- Community Votes
ALTER TABLE public.community_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Votes are viewable by everyone"
    ON public.community_votes FOR SELECT
    USING (true);

CREATE POLICY "Users can vote once per tree"
    ON public.community_votes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Achievements
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Achievements are viewable by owner"
    ON public.achievements FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Achievements are insertable by system"
    ON public.achievements FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Beta access policies
CREATE POLICY "Users can view their own beta access status"
    ON public.beta_access FOR SELECT
    USING (email = auth.jwt()->>'email');

CREATE POLICY "Only admins can manage beta access"
    ON public.beta_access FOR ALL
    USING (auth.jwt()->>'role' = 'admin');

-- Feedback policies
CREATE POLICY "Users can insert their own feedback"
    ON public.feedback FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own feedback"
    ON public.feedback FOR SELECT
    USING (auth.uid() = user_id);

-- Survey policies
CREATE POLICY "Anyone can view active survey questions"
    ON public.survey_questions FOR SELECT
    USING (active = true);

CREATE POLICY "Users can insert their own survey responses"
    ON public.survey_responses FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own survey responses"
    ON public.survey_responses FOR SELECT
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX idx_tasks_parent_task_id ON public.tasks(parent_task_id);
CREATE INDEX idx_projects_user_id ON public.projects(user_id);
CREATE INDEX idx_rewards_user_id ON public.rewards(user_id);
CREATE INDEX idx_community_votes_tree_id ON public.community_votes(tree_id);
CREATE INDEX idx_achievements_user_id ON public.achievements(user_id); 