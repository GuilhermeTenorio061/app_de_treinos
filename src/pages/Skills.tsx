import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Skill {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Sport {
  id: string;
  name: string;
  slug: string;
}

interface Video {
  id: string;
  title: string;
  skill_id: string;
}

const Skills = () => {
  const { sportSlug } = useParams();
  const [sport, setSport] = useState<Sport | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [videoCount, setVideoCount] = useState<{ [key: string]: number }>({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
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
      // Load sport
      const { data: sportData, error: sportError } = await supabase
        .from("sports")
        .select("*")
        .eq("slug", sportSlug)
        .single();

      if (sportError) throw sportError;
      setSport(sportData);

      // Load skills
      const { data: skillsData, error: skillsError } = await supabase
        .from("skills")
        .select("*")
        .eq("sport_id", sportData.id)
        .order("name");

      if (skillsError) throw skillsError;
      setSkills(skillsData || []);

      // Count videos for each skill
      const counts: { [key: string]: number } = {};
      for (const skill of skillsData || []) {
        const { count } = await supabase
          .from("videos")
          .select("*", { count: "exact", head: true })
          .eq("skill_id", skill.id);
        counts[skill.id] = count || 0;
      }
      setVideoCount(counts);
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

  const handleSkillClick = async (skillId: string) => {
    // Get first video for this skill
    const { data: videos } = await supabase
      .from("videos")
      .select("id")
      .eq("skill_id", skillId)
      .limit(1);

    if (videos && videos.length > 0) {
      navigate(`/video/${videos[0].id}`);
    } else {
      toast({
        title: "Nenhum vídeo disponível",
        description: "Esta habilidade ainda não possui vídeos.",
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {sport?.name}
          </h1>
          <p className="text-xl text-muted-foreground">
            Escolha a habilidade para treinar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {skills.map((skill, index) => (
            <div
              key={skill.id}
              className="group relative bg-card rounded-xl overflow-hidden border border-border hover:border-secondary/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-glow animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => handleSkillClick(skill.id)}
            >
              <div className="aspect-video bg-gradient-growth flex items-center justify-center">
                <Play className="w-16 h-16 opacity-80 group-hover:scale-110 transition-transform" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{skill.name}</h3>
                {skill.description && (
                  <p className="text-muted-foreground mb-3">{skill.description}</p>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {videoCount[skill.id] || 0} vídeos
                  </span>
                  <Play className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Skills;
