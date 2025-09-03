-- Ławeczka Database Schema
-- Migration: 001_initial_schema.sql
-- Created: 2025-01-09

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create benches table
CREATE TABLE public.benches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    image_type TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    average_rating DECIMAL(3,2) DEFAULT 0
);

-- Create ratings table
CREATE TABLE public.ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    bench_id UUID REFERENCES public.benches(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(bench_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE public.benches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for benches
CREATE POLICY "Anyone can read benches" ON public.benches
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create benches" ON public.benches
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own benches" ON public.benches
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own benches" ON public.benches
    FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for ratings
CREATE POLICY "Anyone can read ratings" ON public.ratings
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create ratings" ON public.ratings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ratings" ON public.ratings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ratings" ON public.ratings
    FOR DELETE USING (auth.uid() = user_id);

-- Function to update bench average rating
CREATE OR REPLACE FUNCTION update_bench_average_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.benches 
    SET average_rating = (
        SELECT AVG(rating)::DECIMAL(3,2) 
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
    FOR EACH ROW
    EXECUTE FUNCTION update_bench_average_rating();

-- Create indexes for performance
CREATE INDEX idx_benches_user_id ON public.benches(user_id);
CREATE INDEX idx_benches_location ON public.benches(latitude, longitude);
CREATE INDEX idx_ratings_bench_id ON public.ratings(bench_id);
CREATE INDEX idx_ratings_user_id ON public.ratings(user_id);

