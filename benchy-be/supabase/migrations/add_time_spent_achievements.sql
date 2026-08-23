INSERT INTO public.achievements (name, description, icon, points, category, requirement_type, requirement_value, requirement_target, token_tier) VALUES
('sitter', 'achievements.sitter.description', '🪑', 20, 'sit', 'sit_minutes', 30, 'minutes', 1),
('benchPhilosopher', 'achievements.benchPhilosopher.description', '🤔', 75, 'sit', 'sit_minutes', 120, 'minutes', 2)
ON CONFLICT (name) DO UPDATE SET
  category = EXCLUDED.category,
  requirement_type = EXCLUDED.requirement_type,
  requirement_target = EXCLUDED.requirement_target,
  requirement_value = EXCLUDED.requirement_value;
