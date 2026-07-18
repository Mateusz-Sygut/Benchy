ALTER TABLE public.user_profiles
  ADD COLUMN IF NOT EXISTS total_sit_sessions INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_sit_minutes INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS longest_sit_minutes INTEGER DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.sit_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  bench_id UUID REFERENCES public.benches(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ NOT NULL,
  ended_at TIMESTAMPTZ NOT NULL,
  duration_seconds INTEGER NOT NULL CHECK (duration_seconds >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.sit_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Sit sessions can be read by owner" ON public.sit_sessions;
DROP POLICY IF EXISTS "Users can insert own sit sessions" ON public.sit_sessions;
DROP POLICY IF EXISTS "Users can delete own sit sessions" ON public.sit_sessions;

CREATE POLICY "Sit sessions can be read by owner" ON public.sit_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sit sessions" ON public.sit_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own sit sessions" ON public.sit_sessions
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_sit_sessions_user_id ON public.sit_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sit_sessions_bench_id ON public.sit_sessions(bench_id);
CREATE INDEX IF NOT EXISTS idx_sit_sessions_started_at ON public.sit_sessions(started_at);

GRANT SELECT ON public.sit_sessions TO anon, authenticated;
GRANT INSERT, DELETE ON public.sit_sessions TO authenticated;

INSERT INTO public.achievements (name, description, icon, points, category, requirement_type, requirement_value, requirement_target, token_tier) VALUES
('firstSit', 'achievements.firstSit.description', '🧘', 15, 'sit', 'sit_count', 1, 'sits', 1),
('lingerer', 'achievements.lingerer.description', '🍃', 25, 'sit', 'sit_session', 5, 'minutes', 1),
('contemplator', 'achievements.contemplator.description', '🌅', 50, 'sit', 'sit_session', 15, 'minutes', 2)
ON CONFLICT (name) DO NOTHING;

NOTIFY pgrst, 'reload schema';
