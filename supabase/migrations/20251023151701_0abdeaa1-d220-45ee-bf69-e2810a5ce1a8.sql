-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create sports table
CREATE TABLE public.sports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.sports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view sports"
  ON public.sports FOR SELECT
  TO authenticated
  USING (true);

-- Create skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sport_id UUID NOT NULL REFERENCES public.sports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(sport_id, slug)
);

ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills"
  ON public.skills FOR SELECT
  TO authenticated
  USING (true);

-- Create videos table
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  thumbnail_url TEXT,
  duration INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view videos"
  ON public.videos FOR SELECT
  TO authenticated
  USING (true);

-- Insert sample sports
INSERT INTO public.sports (name, slug, description) VALUES
  ('Futebol', 'futebol', 'Treinos e técnicas de futebol'),
  ('Vôlei', 'volei', 'Fundamentos e táticas de vôlei'),
  ('Basquete', 'basquete', 'Habilidades e jogadas de basquete'),
  ('Surf', 'surf', 'Técnicas e manobras de surf');

-- Insert sample skills for Futebol
INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Dribles', 'dribles', 'Aprenda dribles e fintas'
FROM public.sports WHERE slug = 'futebol';

INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Chutes', 'chutes', 'Técnicas de finalização'
FROM public.sports WHERE slug = 'futebol';

INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Passes', 'passes', 'Domínio de passes'
FROM public.sports WHERE slug = 'futebol';

-- Insert sample skills for Vôlei
INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Saque', 'saque', 'Técnicas de saque'
FROM public.sports WHERE slug = 'volei';

INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Bloqueio', 'bloqueio', 'Fundamentos de bloqueio'
FROM public.sports WHERE slug = 'volei';

INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Ataque', 'ataque', 'Técnicas de ataque'
FROM public.sports WHERE slug = 'volei';

-- Insert sample skills for Basquete
INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Arremesso', 'arremesso', 'Técnicas de arremesso'
FROM public.sports WHERE slug = 'basquete';

INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Drible', 'drible', 'Dribles e movimentação'
FROM public.sports WHERE slug = 'basquete';

INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Defesa', 'defesa', 'Fundamentos defensivos'
FROM public.sports WHERE slug = 'basquete';

-- Insert sample skills for Surf
INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Remada', 'remada', 'Técnicas de remada'
FROM public.sports WHERE slug = 'surf';

INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Drop', 'drop', 'Entrada na onda'
FROM public.sports WHERE slug = 'surf';

INSERT INTO public.skills (sport_id, name, slug, description)
SELECT id, 'Manobras', 'manobras', 'Manobras básicas e avançadas'
FROM public.sports WHERE slug = 'surf';

-- Insert sample videos (you'll replace these URLs with real videos)
INSERT INTO public.videos (skill_id, title, description, video_url, duration)
SELECT id, 'Dribles Básicos - Parte 1', 'Aprenda os dribles fundamentais', 'https://example.com/video1.mp4', 300
FROM public.skills WHERE slug = 'dribles' LIMIT 1;

INSERT INTO public.videos (skill_id, title, description, video_url, duration)
SELECT id, 'Chute de Longa Distância', 'Técnica para chutes potentes', 'https://example.com/video2.mp4', 420
FROM public.skills WHERE slug = 'chutes' LIMIT 1;

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();