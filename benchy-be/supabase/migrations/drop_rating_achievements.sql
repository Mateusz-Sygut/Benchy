DELETE FROM public.user_achievements
WHERE achievement_id IN (
  SELECT id FROM public.achievements WHERE name IN ('rater', 'critic', 'judge')
);

DELETE FROM public.achievements
WHERE name IN ('rater', 'critic', 'judge');
