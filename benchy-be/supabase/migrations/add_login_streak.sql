DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'current_streak'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN current_streak INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'longest_streak'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN longest_streak INTEGER DEFAULT 0;
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'user_profiles' AND column_name = 'last_login_date'
    ) THEN
        ALTER TABLE public.user_profiles ADD COLUMN last_login_date DATE;
    END IF;
END $$;

INSERT INTO public.achievements (name, description, icon, points, category, requirement_type, requirement_value, requirement_target, token_tier) VALUES
('streak3', 'achievements.streak3.description', '🔥', 15, 'streak', 'login_streak', 3, 'logins', 1),
('streak7', 'achievements.streak7.description', '🔥', 40, 'streak', 'login_streak', 7, 'logins', 2),
('streak30', 'achievements.streak30.description', '🌟', 150, 'streak', 'login_streak', 30, 'logins', 3)
ON CONFLICT (name) DO NOTHING;

NOTIFY pgrst, 'reload schema';