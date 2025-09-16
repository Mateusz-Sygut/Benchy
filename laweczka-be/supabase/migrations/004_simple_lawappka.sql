-- Simple ŁawAppka Migration
-- This migration creates everything step by step without complex triggers

-- Step 1: Create basic tables first
CREATE TABLE IF NOT EXISTS public.rarity (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    level INTEGER NOT NULL UNIQUE,
    color TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.bench_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.locations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    category TEXT NOT NULL,
    requirement_type TEXT NOT NULL,
    requirement_value INTEGER NOT NULL,
    token_tier INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.titles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    rarity_level INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Insert data
INSERT INTO public.rarity (name, level, color, description) VALUES
('Ordynarna', 1, '#808080', 'Najczęściej spotykane ławeczki'),
('Normalna', 2, '#00FF00', 'Standardowe ławeczki'),
('Rzadka', 3, '#0080FF', 'Rzadko spotykane ławeczki'),
('Unikatowa', 4, '#FF8000', 'Bardzo rzadkie ławeczki'),
('Anomalna', 5, '#FF0080', 'Niezwykle rzadkie ławeczki')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.bench_types (name, icon) VALUES
('Metalowa', '🛋️'),
('Drewniana', '🪑'),
('Kamienna', '🗿'),
('Dizajnerska', '✨')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.locations (name, icon) VALUES
('Park', '🌳'),
('Miasto', '🏙️'),
('Las', '🌲'),
('Woda', '🌊')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.tags (name, category) VALUES
('Spokojna', 'Atmosfera'),
('Zatłoczona', 'Atmosfera'),
('Cicha', 'Dźwięk'),
('Głośna', 'Dźwięk'),
('Zadbana', 'Stan'),
('Niezadbana', 'Stan'),
('Żul', 'Ludzie'),
('Menel', 'Ludzie'),
('Nur', 'Ludzie'),
('Wygodna', 'Komfort'),
('Niewygodna', 'Komfort'),
('Zacieniona', 'Światło'),
('Słoneczna', 'Światło')
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.achievements (name, description, icon, category, requirement_type, requirement_value, token_tier) VALUES
('Pierwsza Ławeczka', 'Dodaj swoją pierwszą ławeczkę', '🪑', 'Tworzenie', 'bench_count', 1, 1),
('Ławeczkarz', 'Dodaj 10 ławeczek', '🏆', 'Tworzenie', 'bench_count', 10, 2),
('Mistrz Ławeczek', 'Dodaj 50 ławeczek', '👑', 'Tworzenie', 'bench_count', 50, 3),
('Siedzący', 'Spędź 5 minut na ławeczce', '⏰', 'Czas', 'time_spent', 5, 1),
('Ławeczkowy Filozof', 'Spędź 30 minut na ławeczce', '🧘', 'Czas', 'time_spent', 30, 2),
('Oceniacz', 'Oceń 5 ławeczek', '⭐', 'Ocenianie', 'rating_count', 5, 1),
('Krytyk', 'Oceń 20 ławeczek', '📝', 'Ocenianie', 'rating_count', 20, 2)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.titles (name, description, rarity_level) VALUES
('Nowicjusz', 'Pierwsze kroki w świecie ławeczek', 1),
('Ławeczkarz', 'Doświadczony twórca ławeczek', 2),
('Mistrz Ławeczek', 'Prawdziwy ekspert od ławeczek', 3),
('Filozof Ławeczkowy', 'Głęboki myśliciel', 2),
('Krytyk Siedzenia', 'Znawca komfortu', 2),
('Anomalia', 'Niezwykły użytkownik', 5)
ON CONFLICT (name) DO NOTHING;

-- Step 3: Create main tables
-- First, check if benches table exists and add missing columns
DO $$
BEGIN
    -- Add rarity_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'benches' AND column_name = 'rarity_id' AND table_schema = 'public') THEN
        ALTER TABLE public.benches ADD COLUMN rarity_id UUID REFERENCES public.rarity(id);
    END IF;
    
    -- Add bench_type_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'benches' AND column_name = 'bench_type_id' AND table_schema = 'public') THEN
        ALTER TABLE public.benches ADD COLUMN bench_type_id UUID REFERENCES public.bench_types(id);
    END IF;
    
    -- Add location_id column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'benches' AND column_name = 'location_id' AND table_schema = 'public') THEN
        ALTER TABLE public.benches ADD COLUMN location_id UUID REFERENCES public.locations(id);
    END IF;
    
    -- Add tags column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'benches' AND column_name = 'tags' AND table_schema = 'public') THEN
        ALTER TABLE public.benches ADD COLUMN tags TEXT[];
    END IF;
    
    -- Add image_url column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'benches' AND column_name = 'image_url' AND table_schema = 'public') THEN
        ALTER TABLE public.benches ADD COLUMN image_url TEXT;
    END IF;
    
    -- Add is_favorite column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'benches' AND column_name = 'is_favorite' AND table_schema = 'public') THEN
        ALTER TABLE public.benches ADD COLUMN is_favorite BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- Create benches table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.benches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    image_type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    average_rating DECIMAL(3,2) DEFAULT 0,
    rarity_id UUID REFERENCES public.rarity(id),
    bench_type_id UUID REFERENCES public.bench_types(id),
    location_id UUID REFERENCES public.locations(id),
    tags TEXT[],
    image_url TEXT,
    is_favorite BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS public.ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bench_id UUID REFERENCES public.benches(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bench_id, user_id)
);

CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    bench_id UUID REFERENCES public.benches(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, bench_id)
);

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
    selected_title_id UUID REFERENCES public.titles(id),
    avatar_url TEXT,
    total_benches_created INTEGER DEFAULT 0,
    total_time_spent INTEGER DEFAULT 0,
    total_ratings_given INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    achievement_id UUID REFERENCES public.achievements(id) NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

CREATE TABLE IF NOT EXISTS public.user_titles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    title_id UUID REFERENCES public.titles(id) NOT NULL,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, title_id)
);

-- Step 4: Set default rarity for existing benches (only if rarity_id column exists)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'benches' AND column_name = 'rarity_id' AND table_schema = 'public') THEN
        UPDATE public.benches 
        SET rarity_id = (SELECT id FROM public.rarity WHERE level = 1 LIMIT 1)
        WHERE rarity_id IS NULL;
    END IF;
END $$;

-- Step 5: Enable RLS
ALTER TABLE public.rarity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bench_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.benches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS Policies
DROP POLICY IF EXISTS "Anyone can read rarity" ON public.rarity;
CREATE POLICY "Anyone can read rarity" ON public.rarity FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read bench_types" ON public.bench_types;
CREATE POLICY "Anyone can read bench_types" ON public.bench_types FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read locations" ON public.locations;
CREATE POLICY "Anyone can read locations" ON public.locations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read tags" ON public.tags;
CREATE POLICY "Anyone can read tags" ON public.tags FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read achievements" ON public.achievements;
CREATE POLICY "Anyone can read achievements" ON public.achievements FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read titles" ON public.titles;
CREATE POLICY "Anyone can read titles" ON public.titles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Anyone can read benches" ON public.benches;
CREATE POLICY "Anyone can read benches" ON public.benches FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create benches" ON public.benches;
CREATE POLICY "Authenticated users can create benches" ON public.benches FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own benches" ON public.benches;
CREATE POLICY "Users can update their own benches" ON public.benches FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own benches" ON public.benches;
CREATE POLICY "Users can delete their own benches" ON public.benches FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Anyone can read ratings" ON public.ratings;
CREATE POLICY "Anyone can read ratings" ON public.ratings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can create ratings" ON public.ratings;
CREATE POLICY "Authenticated users can create ratings" ON public.ratings FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own ratings" ON public.ratings;
CREATE POLICY "Users can update their own ratings" ON public.ratings FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own ratings" ON public.ratings;
CREATE POLICY "Users can delete their own ratings" ON public.ratings FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own favorites" ON public.favorites;
CREATE POLICY "Users can read their own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own favorites" ON public.favorites;
CREATE POLICY "Users can create their own favorites" ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own favorites" ON public.favorites;
CREATE POLICY "Users can delete their own favorites" ON public.favorites FOR DELETE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own achievements" ON public.user_achievements;
CREATE POLICY "Users can read their own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own achievements" ON public.user_achievements;
CREATE POLICY "Users can create their own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own titles" ON public.user_titles;
CREATE POLICY "Users can read their own titles" ON public.user_titles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own titles" ON public.user_titles;
CREATE POLICY "Users can create their own titles" ON public.user_titles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can read their own profile" ON public.user_profiles;
CREATE POLICY "Users can read their own profile" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create their own profile" ON public.user_profiles;
CREATE POLICY "Users can create their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Step 7: Create indexes
CREATE INDEX IF NOT EXISTS idx_benches_user_id ON public.benches(user_id);
CREATE INDEX IF NOT EXISTS idx_benches_location ON public.benches(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_benches_rarity ON public.benches(rarity_id);
CREATE INDEX IF NOT EXISTS idx_benches_type ON public.benches(bench_type_id);
CREATE INDEX IF NOT EXISTS idx_benches_location_type ON public.benches(location_id);
CREATE INDEX IF NOT EXISTS idx_ratings_bench_id ON public.ratings(bench_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id ON public.ratings(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_bench_id ON public.favorites(bench_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_titles_user_id ON public.user_titles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);

-- Step 8: Smart Rarity System Functions and Triggers

-- Function to calculate smart rarity based on existing benches
CREATE OR REPLACE FUNCTION calculate_smart_rarity()
RETURNS UUID AS $$
DECLARE
    rarity_counts RECORD;
    total_benches INTEGER;
    rarity_id UUID;
BEGIN
    -- Count benches by rarity
    SELECT 
        COUNT(*) FILTER (WHERE rarity_id = (SELECT id FROM public.rarity WHERE level = 1)) as common_count,
        COUNT(*) FILTER (WHERE rarity_id = (SELECT id FROM public.rarity WHERE level = 2)) as normal_count,
        COUNT(*) FILTER (WHERE rarity_id = (SELECT id FROM public.rarity WHERE level = 3)) as rare_count,
        COUNT(*) FILTER (WHERE rarity_id = (SELECT id FROM public.rarity WHERE level = 4)) as unique_count,
        COUNT(*) FILTER (WHERE rarity_id = (SELECT id FROM public.rarity WHERE level = 5)) as anomalous_count,
        COUNT(*) as total_count
    INTO rarity_counts
    FROM public.benches;
    
    total_benches := rarity_counts.total_count;
    
    -- If no benches yet, start with Normal
    IF total_benches = 0 THEN
        SELECT id INTO rarity_id FROM public.rarity WHERE level = 2;
        RETURN rarity_id;
    END IF;
    
    -- Smart rarity logic:
    -- 1. If Normal > Rare by 1+, set to Rare
    IF rarity_counts.normal_count > rarity_counts.rare_count THEN
        SELECT id INTO rarity_id FROM public.rarity WHERE level = 3;
        RETURN rarity_id;
    END IF;
    
    -- 2. If Rare > Normal by 1+, set to Normal  
    IF rarity_counts.rare_count > rarity_counts.normal_count THEN
        SELECT id INTO rarity_id FROM public.rarity WHERE level = 2;
        RETURN rarity_id;
    END IF;
    
    -- 3. If Unique is 5+ more than any other rarity, set to Unique
    IF rarity_counts.unique_count >= GREATEST(rarity_counts.common_count, rarity_counts.normal_count, rarity_counts.rare_count, rarity_counts.anomalous_count) + 5 THEN
        SELECT id INTO rarity_id FROM public.rarity WHERE level = 4;
        RETURN rarity_id;
    END IF;
    
    -- 4. If Common is 5+ more than any other rarity, set to Common
    IF rarity_counts.common_count >= GREATEST(rarity_counts.normal_count, rarity_counts.rare_count, rarity_counts.unique_count, rarity_counts.anomalous_count) + 5 THEN
        SELECT id INTO rarity_id FROM public.rarity WHERE level = 1;
        RETURN rarity_id;
    END IF;
    
    -- 5. If Unique and Common are equal, set to Anomalous
    IF rarity_counts.unique_count = rarity_counts.common_count AND rarity_counts.unique_count > 0 THEN
        SELECT id INTO rarity_id FROM public.rarity WHERE level = 5;
        RETURN rarity_id;
    END IF;
    
    -- 6. Default fallback: alternate between Normal and Rare
    IF total_benches % 2 = 0 THEN
        SELECT id INTO rarity_id FROM public.rarity WHERE level = 2;
    ELSE
        SELECT id INTO rarity_id FROM public.rarity WHERE level = 3;
    END IF;
    
    RETURN rarity_id;
END;
$$ LANGUAGE plpgsql;

-- Function to set smart rarity for new benches
CREATE OR REPLACE FUNCTION set_smart_rarity()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.rarity_id IS NULL THEN
        NEW.rarity_id := calculate_smart_rarity();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically set smart rarity for new benches
CREATE TRIGGER set_smart_rarity_trigger
    BEFORE INSERT ON public.benches
    FOR EACH ROW EXECUTE FUNCTION set_smart_rarity();

-- Function to update bench average rating
CREATE OR REPLACE FUNCTION update_bench_average_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.benches 
    SET average_rating = (
        SELECT COALESCE(AVG(rating), 0) 
        FROM public.ratings 
        WHERE bench_id = COALESCE(NEW.bench_id, OLD.bench_id)
    )
    WHERE id = COALESCE(NEW.bench_id, OLD.bench_id);
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update average rating
CREATE TRIGGER update_bench_rating_trigger
    AFTER INSERT OR UPDATE OR DELETE ON public.ratings
    FOR EACH ROW EXECUTE FUNCTION update_bench_average_rating();
