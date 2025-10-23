import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Video {
  id: string;
  title: string;
  description: string | null;
  video_url: string;
  duration: number | null;
  skill_id: string;
}

interface Skill {
  id: string;
  name: string;
  slug: string;
  sport_id: string;
}

interface Sport {
  id: string;
  name: string;
  slug: string;
}

const Video = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState<Video | null>(null);
  const [skill, setSkill] = useState<Skill | null>(null);
  const [sport, setSport] = useState<Sport | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadVideo();
  }, [videoId]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadVideo = async () => {
    try {
      // Load video
      const { data: videoData, error: videoError } = await supabase
        .from("videos")
        .select("*")
        .eq("id", videoId)
        .single();

      if (videoError) throw videoError;
      setVideo(videoData);

      // Load skill
      const { data: skillData, error: skillError } = await supabase
        .from("skills")
        .select("*")
        .eq("id", videoData.skill_id)
        .single();

      if (skillError) throw skillError;
      setSkill(skillData);

      // Load sport
      const { data: sportData, error: sportError } = await supabase
        .from("sports")
        .select("*")
        .eq("id", skillData.sport_id)
        .single();

      if (sportError) throw sportError;
      setSport(sportData);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar vídeo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "Duração desconhecida";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando vídeo...</p>
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
            onClick={() => navigate(`/sports/${sport?.slug}`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para {sport?.name}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="animate-fade-in">
          {/* Video Player */}
          <div className="bg-card rounded-xl overflow-hidden shadow-card mb-8">
            <div className="aspect-video bg-muted flex items-center justify-center">
              {video?.video_url ? (
                <video
                  controls
                  className="w-full h-full"
                  src={video.video_url}
                >
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-4">
                    Vídeo não disponível
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Este é um vídeo de demonstração. Substitua a URL por um link real.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Video Info */}
          <div className="bg-card rounded-xl p-8 shadow-card">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{video?.title}</h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{sport?.name}</span>
                  <span>•</span>
                  <span>{skill?.name}</span>
                  {video?.duration && (
                    <>
                      <span>•</span>
                      <span>{formatDuration(video.duration)}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {video?.description && (
              <div className="border-t border-border pt-6 mt-6">
                <h2 className="text-xl font-semibold mb-3">Sobre este treino</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {video.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Video;
