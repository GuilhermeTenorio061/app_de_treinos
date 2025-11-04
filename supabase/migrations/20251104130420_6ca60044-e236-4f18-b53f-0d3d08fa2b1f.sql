-- Create trainers table
CREATE TABLE public.trainers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sport_id UUID NOT NULL REFERENCES public.sports(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  contact TEXT NOT NULL,
  hourly_rate DECIMAL(10, 2) NOT NULL,
  experience_years INTEGER,
  specialties TEXT[],
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing trainers
CREATE POLICY "Anyone can view trainers"
ON public.trainers
FOR SELECT
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_trainers_updated_at
BEFORE UPDATE ON public.trainers
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample trainers for each sport
INSERT INTO public.trainers (sport_id, name, description, contact, hourly_rate, experience_years, specialties)
SELECT 
  s.id,
  'João Silva',
  'Treinador experiente com foco em desenvolvimento técnico e tático. Trabalhou com atletas de base e profissionais.',
  'joao.silva@email.com | (11) 98765-4321',
  150.00,
  10,
  ARRAY['Técnica', 'Tática', 'Preparação Física']
FROM public.sports s
WHERE s.slug = 'futebol';

INSERT INTO public.trainers (sport_id, name, description, contact, hourly_rate, experience_years, specialties)
SELECT 
  s.id,
  'Maria Santos',
  'Especialista em alto rendimento com certificações internacionais. Foco em periodização e performance.',
  'maria.santos@email.com | (11) 97654-3210',
  200.00,
  15,
  ARRAY['Alto Rendimento', 'Periodização', 'Análise de Performance']
FROM public.sports s
WHERE s.slug = 'futebol';

INSERT INTO public.trainers (sport_id, name, description, contact, hourly_rate, experience_years, specialties)
SELECT 
  s.id,
  'Carlos Oliveira',
  'Ex-atleta profissional, especializado em fundamentos e técnicas de levantamento.',
  'carlos.oliveira@email.com | (21) 99876-5432',
  120.00,
  8,
  ARRAY['Fundamentos', 'Levantamento', 'Bloqueio']
FROM public.sports s
WHERE s.slug = 'volei';

INSERT INTO public.trainers (sport_id, name, description, contact, hourly_rate, experience_years, specialties)
SELECT 
  s.id,
  'Ana Costa',
  'Treinadora focada em finalizações e arremessos. Experiência com equipes juvenis e adultas.',
  'ana.costa@email.com | (11) 96543-2109',
  180.00,
  12,
  ARRAY['Arremesso', 'Finalização', 'Tática Ofensiva']
FROM public.sports s
WHERE s.slug = 'basquete';

INSERT INTO public.trainers (sport_id, name, description, contact, hourly_rate, experience_years, specialties)
SELECT 
  s.id,
  'Pedro Martins',
  'Surfista profissional e instrutor certificado. Especialista em ondas grandes e manobras radicais.',
  'pedro.martins@email.com | (13) 98765-1234',
  250.00,
  20,
  ARRAY['Ondas Grandes', 'Manobras', 'Segurança']
FROM public.sports s
WHERE s.slug = 'surf';

INSERT INTO public.trainers (sport_id, name, description, contact, hourly_rate, experience_years, specialties)
SELECT 
  s.id,
  'Lucas Ferreira',
  'Especialista em defesa e contra-ataques. Trabalhou em equipes escolares e clubes.',
  'lucas.ferreira@email.com | (11) 95432-1098',
  130.00,
  7,
  ARRAY['Defesa', 'Contra-ataque', 'Sistemas Táticos']
FROM public.sports s
WHERE s.slug = 'handebol';

INSERT INTO public.trainers (sport_id, name, description, contact, hourly_rate, experience_years, specialties)
SELECT 
  s.id,
  'Fernanda Lima',
  'Ex-tenista profissional com foco em técnicas de saque e forehand. Preparação mental.',
  'fernanda.lima@email.com | (11) 94321-0987',
  220.00,
  14,
  ARRAY['Saque', 'Forehand', 'Preparação Mental']
FROM public.sports s
WHERE s.slug = 'tenis';

INSERT INTO public.trainers (sport_id, name, description, contact, hourly_rate, experience_years, specialties)
SELECT 
  s.id,
  'Ricardo Alves',
  'Técnico de natação com especialização em estilos e viradas. Trabalha com todas as idades.',
  'ricardo.alves@email.com | (11) 93210-9876',
  160.00,
  11,
  ARRAY['Crawl', 'Costas', 'Viradas', 'Técnica Respiratória']
FROM public.sports s
WHERE s.slug = 'natacao';

INSERT INTO public.trainers (sport_id, name, description, contact, hourly_rate, experience_years, specialties)
SELECT 
  s.id,
  'Thiago Rocha',
  'Treinador especializado em jogadas rápidas e dribles. Foco em técnica individual.',
  'thiago.rocha@email.com | (11) 92109-8765',
  140.00,
  9,
  ARRAY['Dribles', 'Finalizações', 'Técnica Individual']
FROM public.sports s
WHERE s.slug = 'futsal';