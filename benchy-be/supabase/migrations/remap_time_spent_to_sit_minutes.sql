UPDATE public.achievements
SET
  category = 'sit',
  requirement_type = 'sit_minutes',
  requirement_target = 'minutes'
WHERE name IN ('sitter', 'benchPhilosopher');
