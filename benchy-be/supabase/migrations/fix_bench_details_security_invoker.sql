DROP VIEW IF EXISTS public.bench_details;

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
    b.average_rating,
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

NOTIFY pgrst, 'reload schema';
