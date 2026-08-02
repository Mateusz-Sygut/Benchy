INSERT INTO public.bench_types (name, icon) VALUES
('park', '🌳')
ON CONFLICT (name) DO NOTHING;