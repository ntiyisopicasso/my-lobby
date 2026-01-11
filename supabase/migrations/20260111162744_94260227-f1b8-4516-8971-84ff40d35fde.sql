-- Create enum for games
CREATE TYPE public.game_type AS ENUM ('cod-mobile', 'pubg-mobile', 'free-fire');

-- Create enum for skill levels
CREATE TYPE public.skill_level AS ENUM ('beginner', 'intermediate', 'pro', 'any');

-- Create enum for gender preferences
CREATE TYPE public.gender_preference AS ENUM ('any', 'male', 'female', 'mixed');

-- Create profiles table for user game data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  username TEXT NOT NULL,
  game game_type NOT NULL,
  gamer_tag TEXT NOT NULL,
  region TEXT,
  level INTEGER DEFAULT 1,
  rank TEXT DEFAULT 'Unranked',
  is_verified BOOLEAN DEFAULT false,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lobbies table
CREATE TABLE public.lobbies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  game game_type NOT NULL,
  game_mode TEXT NOT NULL,
  max_players INTEGER NOT NULL DEFAULT 4 CHECK (max_players >= 2 AND max_players <= 100),
  skill_level skill_level NOT NULL DEFAULT 'any',
  language TEXT NOT NULL DEFAULT 'English',
  region TEXT,
  gender_preference gender_preference NOT NULL DEFAULT 'any',
  voice_chat BOOLEAN NOT NULL DEFAULT false,
  password TEXT,
  is_private BOOLEAN NOT NULL DEFAULT false,
  host_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create lobby_members table for tracking who joined which lobby
CREATE TABLE public.lobby_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lobby_id UUID REFERENCES public.lobbies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(lobby_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobbies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lobby_members ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Lobbies policies
CREATE POLICY "Active lobbies are viewable by everyone" 
ON public.lobbies 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Authenticated users can create lobbies" 
ON public.lobbies 
FOR INSERT 
WITH CHECK (auth.uid() = host_id);

CREATE POLICY "Hosts can update their own lobbies" 
ON public.lobbies 
FOR UPDATE 
USING (auth.uid() = host_id);

CREATE POLICY "Hosts can delete their own lobbies" 
ON public.lobbies 
FOR DELETE 
USING (auth.uid() = host_id);

-- Lobby members policies
CREATE POLICY "Lobby members are viewable by everyone" 
ON public.lobby_members 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can join lobbies" 
ON public.lobby_members 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave lobbies" 
ON public.lobby_members 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_lobbies_updated_at
BEFORE UPDATE ON public.lobbies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for lobbies and lobby_members
ALTER PUBLICATION supabase_realtime ADD TABLE public.lobbies;
ALTER PUBLICATION supabase_realtime ADD TABLE public.lobby_members;