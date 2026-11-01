DROP VIEW IF EXISTS public.bench_details;

DROP TRIGGER IF EXISTS update_bench_rating_trigger ON public.ratings;
DROP TRIGGER IF EXISTS update_ratings_updated_at ON public.ratings;
DROP FUNCTION IF EXISTS public.update_bench_average_rating() CASCADE;

DROP TABLE IF EXISTS public.ratings;

ALTER TABLE public.benches DROP COLUMN IF EXISTS average_rating;
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS total_ratings_given;

DELETE FROM public.user_achievements
WHERE achievement_id IN (
  SELECT id FROM public.achievements WHERE name IN ('rater', 'critic', 'judge')
);

DELETE FROM public.achievements
WHERE name IN ('rater', 'critic', 'judge');

DROP POLICY IF EXISTS "System can update average rating" ON public.benches;
DROP POLICY IF EXISTS "Authenticated users can update benches" ON public.benches;
CREATE POLICY "Authenticated users can update benches" ON public.benches
  FOR UPDATE USING (true);

CREATE VIEW public.bench_details
WITH (security_invoker = on)
AS
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
    b.created_at,
    b.updated_at,
    r.name AS rarity_name,
    r.level AS rarity_level,
    r.color AS rarity_color,
    r.description AS rarity_description,
    bt.name AS bench_type_name,
    bt.icon AS bench_type_icon,
    l.name AS location_name,
    l.icon AS location_icon,
    u.username,
    u.avatar_url,
    up.display_name,
    up.level AS user_level,
    up.experience_points,
    CASE WHEN f.id IS NOT NULL THEN true ELSE false END AS is_favorite
FROM public.benches b
LEFT JOIN public.rarity r ON b.rarity_id = r.id
LEFT JOIN public.bench_types bt ON b.bench_type_id = bt.id
LEFT JOIN public.locations l ON b.location_id = l.id
LEFT JOIN public.users u ON b.user_id = u.id
LEFT JOIN public.user_profiles up ON u.id = up.user_id
LEFT JOIN public.favorites f ON b.id = f.bench_id AND f.user_id = auth.uid();

GRANT SELECT ON public.bench_details TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_profiles (user_id, total_benches_created, total_time_spent)
  SELECT NEW.id, 0, 0
  WHERE NOT EXISTS (SELECT 1 FROM public.user_profiles WHERE user_id = NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

NOTIFY pgrst, 'reload schema';
