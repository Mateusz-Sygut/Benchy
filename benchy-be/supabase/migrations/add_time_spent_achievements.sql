INSERT INTO public.achievements (name, description, icon, points, category, requirement_type, requirement_value, requirement_target, token_tier) VALUES
('sitter', 'achievements.sitter.description', '🪑', 20, 'time', 'time_spent', 30, 'minutes', 1),
('benchPhilosopher', 'achievements.benchPhilosopher.description', '🤔', 75, 'time', 'time_spent', 120, 'minutes', 2)
ON CONFLICT (name) DO NOTHING;

NOTIFY pgrst, 'reload schema';