-- ========================================
-- 004_simple_lawappka.sql
-- Complete database schema for Lawappka
-- ========================================

-- Step 0: Clean existing data (to avoid conflicts)
-- Delete existing data in correct order (due to foreign key constraints)
-- Only delete if tables exist
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'benches') THEN
        DELETE FROM public.benches;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ratings') THEN
        DELETE FROM public.ratings;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'favorites') THEN
        DELETE FROM public.favorites;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_achievements') THEN
        DELETE FROM public.user_achievements;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_titles') THEN
        DELETE FROM public.user_titles;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_profiles') THEN
        DELETE FROM public.user_profiles;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users') THEN
        DELETE FROM public.users;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'rarity') THEN
        DELETE FROM public.rarity;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'bench_types') THEN
        DELETE FROM public.bench_types;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'locations') THEN
        DELETE FROM public.locations;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tags') THEN
        DELETE FROM public.tags;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'achievements') THEN
        DELETE FROM public.achievements;
    END IF;
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'titles') THEN
        DELETE FROM public.titles;
    END IF;
END $$;

-- Step 1: Create tables
CREATE TABLE IF NOT EXISTS public.rarity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    level INTEGER UNIQUE NOT NULL,
    color TEXT NOT NULL,
    description TEXT NOT NULL,
    rarity_level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bench_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    display_name TEXT,
    bio TEXT,
    level INTEGER DEFAULT 1,
    experience_points INTEGER DEFAULT 0,
    selected_title_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'display_name') THEN
        ALTER TABLE public.user_profiles ADD COLUMN display_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'bio') THEN
        ALTER TABLE public.user_profiles ADD COLUMN bio TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'level') THEN
        ALTER TABLE public.user_profiles ADD COLUMN level INTEGER DEFAULT 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'experience_points') THEN
        ALTER TABLE public.user_profiles ADD COLUMN experience_points INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'selected_title_id') THEN
        ALTER TABLE public.user_profiles ADD COLUMN selected_title_id UUID;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.benches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    image_type TEXT,
    image_url TEXT,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rarity_id UUID REFERENCES public.rarity(id),
    bench_type_id UUID REFERENCES public.bench_types(id),
    location_id UUID REFERENCES public.locations(id),
    tags TEXT[],
    average_rating DECIMAL(3, 2) DEFAULT 0.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'benches' AND column_name = 'name') THEN
        ALTER TABLE public.benches ADD COLUMN name TEXT DEFAULT 'Unnamed Bench';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'benches' AND column_name = 'description') THEN
        ALTER TABLE public.benches ADD COLUMN description TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'benches' AND column_name = 'image_type') THEN
        ALTER TABLE public.benches ADD COLUMN image_type TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'benches' AND column_name = 'image_url') THEN
        ALTER TABLE public.benches ADD COLUMN image_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'benches' AND column_name = 'tags') THEN
        ALTER TABLE public.benches ADD COLUMN tags TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'benches' AND column_name = 'average_rating') THEN
        ALTER TABLE public.benches ADD COLUMN average_rating DECIMAL(3, 2) DEFAULT 0.0;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bench_id UUID REFERENCES public.benches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bench_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bench_id UUID REFERENCES public.benches(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bench_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    points INTEGER NOT NULL,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'achievements' AND column_name = 'points') THEN
        ALTER TABLE public.achievements ADD COLUMN points INTEGER DEFAULT 0;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'achievements' AND column_name = 'category') THEN
        ALTER TABLE public.achievements ADD COLUMN category TEXT DEFAULT 'general';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'achievements' AND column_name = 'requirement_type') THEN
        ALTER TABLE public.achievements ADD COLUMN requirement_type TEXT DEFAULT 'count';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'achievements' AND column_name = 'requirement_value') THEN
        ALTER TABLE public.achievements ADD COLUMN requirement_value INTEGER DEFAULT 1;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'achievements' AND column_name = 'requirement_target') THEN
        ALTER TABLE public.achievements ADD COLUMN requirement_target TEXT DEFAULT 'benches';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'achievements' AND column_name = 'token_tier') THEN
        ALTER TABLE public.achievements ADD COLUMN token_tier INTEGER DEFAULT 1;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.titles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    rarity_level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add missing columns if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'titles' AND column_name = 'icon') THEN
        ALTER TABLE public.titles ADD COLUMN icon TEXT DEFAULT '🏆';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'titles' AND column_name = 'rarity_level') THEN
        ALTER TABLE public.titles ADD COLUMN rarity_level INTEGER DEFAULT 1;
    END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_titles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title_id UUID REFERENCES public.titles(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, title_id)
);

-- Step 2: Insert data
INSERT INTO public.rarity (name, level, color, description) VALUES
('common', 1, '#808080', 'rarity.common.description'),
('normal', 2, '#00FF00', 'rarity.normal.description'),
('rare', 3, '#0080FF', 'rarity.rare.description'),
('unique', 4, '#FF8000', 'rarity.unique.description'),
('anomalous', 5, '#FF0080', 'rarity.anomalous.description')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.bench_types (name, icon) VALUES
('metal', '🛋️'),
('wooden', '🪑'),
('stone', '🗿'),
('designer', '✨')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.locations (name, icon) VALUES
('park', '🌳'),
('city', '🏙️'),
('forest', '🌲'),
('water', '🌊')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.tags (name, category) VALUES
('peaceful', 'atmosphere'),
('loud', 'atmosphere'),
('warm', 'temperature'),
('cold', 'temperature'),
('covered', 'protection'),
('open', 'protection'),
('scenic', 'location'),
('central', 'location'),
('remote', 'location'),
('accessible', 'accessibility'),
('inaccessible', 'accessibility')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.achievements (name, description, icon, points, category, requirement_type, requirement_value, requirement_target, token_tier) VALUES
('firstBench', 'achievements.firstBench.description', '🪑', 10, 'bench', 'count', 1, 'benches', 1),
('collector', 'achievements.collector.description', '📚', 50, 'bench', 'count', 10, 'benches', 2),
('expert', 'achievements.expert.description', '🏆', 200, 'bench', 'count', 50, 'benches', 3),
('master', 'achievements.master.description', '👑', 500, 'bench', 'count', 100, 'benches', 4),
('rater', 'achievements.rater.description', '⭐', 25, 'rating', 'count', 10, 'ratings', 1),
('critic', 'achievements.critic.description', '📝', 100, 'rating', 'count', 50, 'ratings', 2),
('judge', 'achievements.judge.description', '⚖️', 250, 'rating', 'count', 100, 'ratings', 3),
('favorite', 'achievements.favorite.description', '❤️', 30, 'favorite', 'count', 10, 'favorites', 1),
('connoisseur', 'achievements.connoisseur.description', '💎', 150, 'favorite', 'count', 50, 'favorites', 2),
('specialist', 'achievements.specialist.description', '🎯', 400, 'favorite', 'count', 100, 'favorites', 3)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.titles (name, description, icon, rarity_level) VALUES
('novice', 'titles.novice.description', '🌱', 1),
('benchUser', 'titles.benchUser.description', '🪑', 2),
('collector', 'titles.collector.description', '📚', 3),
('expert', 'titles.expert.description', '🏆', 4),
('master', 'titles.master.description', '👑', 5),
('legend', 'titles.legend.description', '🌟', 6)
ON CONFLICT (name) DO NOTHING;

-- Step 3: Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_titles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create RLS policies
-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can read all users" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "User profiles can be read by all" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own user profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own user profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Benches can be read by all" ON public.benches;
DROP POLICY IF EXISTS "Users can insert own benches" ON public.benches;
DROP POLICY IF EXISTS "Users can update own benches" ON public.benches;
DROP POLICY IF EXISTS "Users can delete own benches" ON public.benches;
DROP POLICY IF EXISTS "Ratings can be read by all" ON public.ratings;
DROP POLICY IF EXISTS "Users can insert own ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can update own ratings" ON public.ratings;
DROP POLICY IF EXISTS "Users can delete own ratings" ON public.ratings;
DROP POLICY IF EXISTS "Favorites can be read by all" ON public.favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;
DROP POLICY IF EXISTS "User achievements can be read by all" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "User titles can be read by all" ON public.user_titles;
DROP POLICY IF EXISTS "Users can insert own titles" ON public.user_titles;

-- Users can read all users
CREATE POLICY "Users can read all users" ON public.users
    FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- User profiles can be read by all
CREATE POLICY "User profiles can be read by all" ON public.user_profiles
    FOR SELECT USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own user profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own user profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Benches can be read by all
CREATE POLICY "Benches can be read by all" ON public.benches
    FOR SELECT USING (true);

-- Users can insert their own benches
CREATE POLICY "Users can insert own benches" ON public.benches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own benches
CREATE POLICY "Users can update own benches" ON public.benches
    FOR UPDATE USING (auth.uid() = user_id);

-- Allow system to update average_rating (for triggers)
CREATE POLICY "System can update average rating" ON public.benches
    FOR UPDATE USING (true);

-- Users can delete their own benches
CREATE POLICY "Users can delete own benches" ON public.benches
    FOR DELETE USING (auth.uid() = user_id);

-- Ratings can be read by all
CREATE POLICY "Ratings can be read by all" ON public.ratings
    FOR SELECT USING (true);

-- Users can insert their own ratings
CREATE POLICY "Users can insert own ratings" ON public.ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings" ON public.ratings
    FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own ratings
CREATE POLICY "Users can delete own ratings" ON public.ratings
    FOR DELETE USING (auth.uid() = user_id);

-- Favorites can be read by all
CREATE POLICY "Favorites can be read by all" ON public.favorites
    FOR SELECT USING (true);

-- Users can insert their own favorites
CREATE POLICY "Users can insert own favorites" ON public.favorites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can delete their own favorites
CREATE POLICY "Users can delete own favorites" ON public.favorites
    FOR DELETE USING (auth.uid() = user_id);

-- User achievements can be read by all
CREATE POLICY "User achievements can be read by all" ON public.user_achievements
    FOR SELECT USING (true);

-- Users can insert their own achievements
CREATE POLICY "Users can insert own achievements" ON public.user_achievements
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User titles can be read by all
CREATE POLICY "User titles can be read by all" ON public.user_titles
    FOR SELECT USING (true);

-- Users can insert their own titles
CREATE POLICY "Users can insert own titles" ON public.user_titles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Step 5: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_benches_user_id ON public.benches(user_id);
CREATE INDEX IF NOT EXISTS idx_benches_rarity_id ON public.benches(rarity_id);
CREATE INDEX IF NOT EXISTS idx_benches_bench_type_id ON public.benches(bench_type_id);
CREATE INDEX IF NOT EXISTS idx_benches_location_id ON public.benches(location_id);
CREATE INDEX IF NOT EXISTS idx_benches_created_at ON public.benches(created_at);
CREATE INDEX IF NOT EXISTS idx_ratings_bench_id ON public.ratings(bench_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_bench_id ON public.favorites(bench_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id ON public.user_achievements(achievement_id);
CREATE INDEX IF NOT EXISTS idx_user_titles_user_id ON public.user_titles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_titles_title_id ON public.user_titles(title_id);

-- Step 6: Create functions for automatic updates
-- Drop existing functions first to avoid conflicts
DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_benches_updated_at BEFORE UPDATE ON public.benches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ratings_updated_at BEFORE UPDATE ON public.ratings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 7: Smart Rarity System
-- Drop existing function first to avoid return type conflicts
DROP FUNCTION IF EXISTS calculate_smart_rarity() CASCADE;
DROP FUNCTION IF EXISTS set_smart_rarity() CASCADE;

-- Function to calculate smart rarity based on existing bench counts
CREATE OR REPLACE FUNCTION calculate_smart_rarity()
RETURNS TEXT AS $$
DECLARE
    normal_count INTEGER;
    rare_count INTEGER;
    unique_count INTEGER;
    common_count INTEGER;
    anomalous_count INTEGER;
    total_count INTEGER;
    max_count INTEGER;
    second_max_count INTEGER;
    rarity_name TEXT;
BEGIN
    -- Count benches by rarity
    SELECT COUNT(*) INTO normal_count FROM public.benches WHERE rarity_id = (SELECT id FROM public.rarity WHERE name = 'normal');
    SELECT COUNT(*) INTO rare_count FROM public.benches WHERE rarity_id = (SELECT id FROM public.rarity WHERE name = 'rare');
    SELECT COUNT(*) INTO unique_count FROM public.benches WHERE rarity_id = (SELECT id FROM public.rarity WHERE name = 'unique');
    SELECT COUNT(*) INTO common_count FROM public.benches WHERE rarity_id = (SELECT id FROM public.rarity WHERE name = 'common');
    SELECT COUNT(*) INTO anomalous_count FROM public.benches WHERE rarity_id = (SELECT id FROM public.rarity WHERE name = 'anomalous');
    
    -- Calculate total
    total_count := normal_count + rare_count + unique_count + common_count + anomalous_count;
    
    -- If no benches exist, default to normal
    IF total_count = 0 THEN
        RETURN 'normal';
    END IF;
    
    -- Find max and second max counts
    SELECT MAX(count) INTO max_count FROM (
        SELECT normal_count as count UNION ALL
        SELECT rare_count as count UNION ALL
        SELECT unique_count as count UNION ALL
        SELECT common_count as count UNION ALL
        SELECT anomalous_count as count
    ) counts;
    
    SELECT MAX(count) INTO second_max_count FROM (
        SELECT normal_count as count UNION ALL
        SELECT rare_count as count UNION ALL
        SELECT unique_count as count UNION ALL
        SELECT common_count as count UNION ALL
        SELECT anomalous_count as count
    ) counts WHERE count < max_count;
    
    -- Smart rarity logic
    IF max_count = normal_count AND second_max_count = rare_count AND max_count - second_max_count >= 1 THEN
        RETURN 'normal';
    ELSIF max_count = rare_count AND second_max_count = normal_count AND max_count - second_max_count >= 1 THEN
        RETURN 'rare';
    ELSIF max_count = unique_count AND second_max_count = common_count AND max_count - second_max_count >= 5 THEN
        RETURN 'unique';
    ELSIF max_count = common_count AND second_max_count = unique_count AND max_count - second_max_count >= 5 THEN
        RETURN 'common';
    ELSIF unique_count = common_count AND unique_count > 0 THEN
        RETURN 'anomalous';
    ELSE
        RETURN 'normal';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to set smart rarity
CREATE OR REPLACE FUNCTION set_smart_rarity()
RETURNS TRIGGER AS $$
DECLARE
    rarity_name TEXT;
    rarity_id UUID;
BEGIN
    -- Calculate smart rarity
    rarity_name := calculate_smart_rarity();
    
    -- Get rarity ID
    SELECT id INTO rarity_id FROM public.rarity WHERE name = rarity_name;
    
    -- Set rarity_id
    NEW.rarity_id := rarity_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set smart rarity
CREATE TRIGGER set_smart_rarity_trigger
    BEFORE INSERT ON public.benches
    FOR EACH ROW
    EXECUTE FUNCTION set_smart_rarity();

-- Step 8: Automatic Rating Updates
-- Drop existing function first to avoid conflicts
DROP FUNCTION IF EXISTS update_bench_average_rating() CASCADE;

-- Function to update bench average rating
CREATE OR REPLACE FUNCTION update_bench_average_rating()
RETURNS TRIGGER AS $$
DECLARE
    target_bench_id UUID;
    avg_rating DECIMAL(3, 2);
BEGIN
    -- Get bench_id from the trigger
    IF TG_OP = 'DELETE' THEN
        target_bench_id := OLD.bench_id;
    ELSE
        target_bench_id := NEW.bench_id;
    END IF;
    
    -- Calculate average rating
    SELECT AVG(rating)::DECIMAL(3, 2) INTO avg_rating
    FROM public.ratings
    WHERE ratings.bench_id = target_bench_id;
    
    -- Update bench average rating
    UPDATE public.benches
    SET average_rating = COALESCE(avg_rating, 0.0)
    WHERE id = target_bench_id;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update bench average rating
CREATE TRIGGER update_bench_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_bench_average_rating();

-- Step 9: Create views for easier querying
CREATE OR REPLACE VIEW public.bench_details AS
SELECT 
    b.id,
    b.name,
    b.description,
    b.latitude,
    b.longitude,
    b.image_type,
    b.image_url,
    b.user_id,
    b.rarity_id,
    b.bench_type_id,
    b.location_id,
    b.tags,
    b.average_rating,
    b.created_at,
    b.updated_at,
    r.name as rarity_name,
    r.level as rarity_level,
    r.color as rarity_color,
    r.description as rarity_description,
    bt.name as bench_type_name,
    bt.icon as bench_type_icon,
    l.name as location_name,
    l.icon as location_icon,
    u.username,
    u.avatar_url,
    up.display_name,
    up.level as user_level,
    up.experience_points,
    CASE WHEN f.id IS NOT NULL THEN true ELSE false END as is_favorite
FROM public.benches b
LEFT JOIN public.rarity r ON b.rarity_id = r.id
LEFT JOIN public.bench_types bt ON b.bench_type_id = bt.id
LEFT JOIN public.locations l ON b.location_id = l.id
LEFT JOIN public.users u ON b.user_id = u.id
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.favorites f ON b.id = f.bench_id AND f.user_id = auth.uid();

-- Step 10: Grant permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.benches TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.ratings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.favorites TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.user_profiles TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.user_achievements TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.user_titles TO authenticated;