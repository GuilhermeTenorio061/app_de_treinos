import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from "recharts";

interface Sport {
  id: string;
  name: string;
  slug: string;
}

interface SkillProgress {
  skill: string;
  progress: number;
}

const SPORT_SKILLS: Record<string, string[]> = {
  futebol: ['Chute', 'Passe', 'Velocidade', 'Movimentação', 'Explosão', 'Drible', 'Impulsão'],
  basquete: ['Arremesso', 'Impulsão', 'Passe', 'Bandeja', 'Movimentação', 'Defesa', 'Drible'],
  volei: ['Impulsão', 'Levantamento', 'Ataque', 'Defesa', 'Movimentação', 'Bloqueio'],
  futsal: ['Chute', 'Passe', 'Movimentação', 'Físico', 'Aceleração', 'Marcação', 'Drible'],
  handebol: ['Arremesso', 'Passe', 'Defesa', 'Movimentação', 'Físico', 'Drible'],
  tenis: ['Backhand', 'Forehand', 'Saque', 'Defesa', 'Velocidade', 'Agilidade'],
  natacao: ['Nado Crawl', 'Nado Borboleta', 'Nado de Costas', 'Nado Peito', 'Resistência', 'Fôlego'],
  surf: ['Drop', 'Remada', 'Tubo', 'Rasgada', 'Cut Back', 'Batida', 'Duck Dive'],
  box: ['Jab', 'Direto', 'Cruzado', 'Uppercut', 'Gancho', 'Esquiva', 'Defesa', 'Movimentação'],
  'jiu-jitsu': ['Guarda', 'Passagem', 'Montada', 'Finalizações', 'Quedas', 'Defesa', 'Transições'],
  futevolei: ['Ataque', 'Defesa', 'Levantamento', 'Recepção', 'Saque', 'Movimentação'],
  corrida: ['Velocidade', 'Resistência', 'Fôlego', 'Técnica', 'Ritmo', 'Explosão']
};

const Development = () => {
  const [sport, setSport] = useState<Sport | null>(null);
  const [progress, setProgress] = useState<SkillProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { sportSlug } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadData();
  }, [sportSlug]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadData = async () => {
    try {
      // Load sport data
      const { data: sportData, error: sportError } = await supabase
        .from("sports")
        .select("*")
        .eq("slug", sportSlug)
        .single();

      if (sportError) throw sportError;
      setSport(sportData);

      // Load user progress
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("skill_name, videos_watched")
        .eq("user_id", user.id)
        .eq("sport_id", sportData.id);

      if (progressError) throw progressError;

      // Create progress array with all skills
      const skills = SPORT_SKILLS[sportSlug || ''] || [];
      const progressMap = new Map(progressData?.map(p => [p.skill_name, p.videos_watched]) || []);
      
      const chartData = skills.map(skill => ({
        skill,
        progress: Math.min((progressMap.get(skill) || 0) * 5, 100) // Each video = 5%, max 100
      }));

      setProgress(chartData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!sport) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-muted-foreground">Esporte não encontrado</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Voltar ao Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(`/sports/${sportSlug}`)}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-energy bg-clip-text text-transparent">
              Desenvolvimento - {sport.name}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Seu Progresso
            </h2>
            <p className="text-xl text-muted-foreground">
              Acompanhe sua evolução em cada valência do {sport.name.toLowerCase()}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Assista vídeos de treino para aumentar seu progresso em cada habilidade
            </p>
          </div>

          <div className="bg-card rounded-2xl border-2 border-border p-8 animate-scale-in">
            <ResponsiveContainer width="100%" height={500}>
              <RadarChart data={progress}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 14 }}
                />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <Radar 
                  name="Progresso" 
                  dataKey="progress" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.6}
                />
                <Legend 
                  wrapperStyle={{ 
                    paddingTop: '20px',
                    color: 'hsl(var(--foreground))'
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {progress.map((item) => (
              <div 
                key={item.skill}
                className="bg-card rounded-lg border border-border p-4 text-center hover:border-primary transition-colors"
              >
                <h3 className="font-semibold mb-2">{item.skill}</h3>
                <div className="text-2xl font-bold text-primary">
                  {item.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Development;