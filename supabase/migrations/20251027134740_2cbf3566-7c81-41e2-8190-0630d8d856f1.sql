-- Insert skills for Handebol
INSERT INTO public.skills (name, slug, description, sport_id) VALUES
  ('Arremesso', 'arremesso', 'Técnicas de arremesso e finalização ao gol', '67b789cb-800b-47e2-9296-3d4077d2f84f'),
  ('Defesa', 'defesa-handebol', 'Posicionamento e técnicas defensivas', '67b789cb-800b-47e2-9296-3d4077d2f84f'),
  ('Drible', 'drible-handebol', 'Dribles e mudanças de direção', '67b789cb-800b-47e2-9296-3d4077d2f84f'),
  ('Contra-ataque', 'contra-ataque', 'Transição rápida defesa-ataque', '67b789cb-800b-47e2-9296-3d4077d2f84f');

-- Insert skills for Tênis
INSERT INTO public.skills (name, slug, description, sport_id) VALUES
  ('Saque', 'saque', 'Técnicas de saque e variações', '06f06d8b-8f4e-47ae-b10d-1254ac6dcf8c'),
  ('Forehand', 'forehand', 'Golpe de direita e potência', '06f06d8b-8f4e-47ae-b10d-1254ac6dcf8c'),
  ('Backhand', 'backhand', 'Golpe de esquerda e controle', '06f06d8b-8f4e-47ae-b10d-1254ac6dcf8c'),
  ('Voleio', 'voleio', 'Jogo na rede e voleios', '06f06d8b-8f4e-47ae-b10d-1254ac6dcf8c');

-- Insert skills for Natação
INSERT INTO public.skills (name, slug, description, sport_id) VALUES
  ('Crawl', 'crawl', 'Técnica do nado crawl e respiração', '0f4b51f2-cf8a-479a-9323-4ea6bb9b0e23'),
  ('Costas', 'costas', 'Técnica do nado de costas', '0f4b51f2-cf8a-479a-9323-4ea6bb9b0e23'),
  ('Peito', 'peito', 'Técnica do nado de peito', '0f4b51f2-cf8a-479a-9323-4ea6bb9b0e23'),
  ('Borboleta', 'borboleta', 'Técnica do nado borboleta', '0f4b51f2-cf8a-479a-9323-4ea6bb9b0e23');

-- Insert skills for Futsal
INSERT INTO public.skills (name, slug, description, sport_id) VALUES
  ('Dribles', 'dribles-futsal', 'Dribles e fintas em espaços reduzidos', 'fd26c585-2f47-480d-9beb-dc2c4bc99401'),
  ('Finalizações', 'finalizacoes-futsal', 'Técnicas de chute e finalização', 'fd26c585-2f47-480d-9beb-dc2c4bc99401'),
  ('Passes', 'passes-futsal', 'Passes curtos e precisão', 'fd26c585-2f47-480d-9beb-dc2c4bc99401'),
  ('Defesa', 'defesa-futsal', 'Marcação e posicionamento defensivo', 'fd26c585-2f47-480d-9beb-dc2c4bc99401');

-- Insert example videos for Handebol skills
INSERT INTO public.videos (title, description, video_url, skill_id, duration)
SELECT 
  'Treino de ' || s.name,
  'Vídeo de treinamento de ' || s.name || ' para handebol',
  'https://www.youtube.com/watch?v=example',
  s.id,
  600
FROM public.skills s
WHERE s.sport_id = '67b789cb-800b-47e2-9296-3d4077d2f84f';

-- Insert example videos for Tênis skills
INSERT INTO public.videos (title, description, video_url, skill_id, duration)
SELECT 
  'Treino de ' || s.name,
  'Vídeo de treinamento de ' || s.name || ' para tênis',
  'https://www.youtube.com/watch?v=example',
  s.id,
  600
FROM public.skills s
WHERE s.sport_id = '06f06d8b-8f4e-47ae-b10d-1254ac6dcf8c';

-- Insert example videos for Natação skills
INSERT INTO public.videos (title, description, video_url, skill_id, duration)
SELECT 
  'Treino de ' || s.name,
  'Vídeo de treinamento de ' || s.name || ' para natação',
  'https://www.youtube.com/watch?v=example',
  s.id,
  600
FROM public.skills s
WHERE s.sport_id = '0f4b51f2-cf8a-479a-9323-4ea6bb9b0e23';

-- Insert example videos for Futsal skills
INSERT INTO public.videos (title, description, video_url, skill_id, duration)
SELECT 
  'Treino de ' || s.name,
  'Vídeo de treinamento de ' || s.name || ' para futsal',
  'https://www.youtube.com/watch?v=example',
  s.id,
  600
FROM public.skills s
WHERE s.sport_id = 'fd26c585-2f47-480d-9beb-dc2c4bc99401';
