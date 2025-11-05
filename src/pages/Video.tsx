import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload } from "lucide-react";
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
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadVideo();
  }, [videoId]);

  const trackProgress = async () => {
    if (!video || !skill || !sport) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if progress exists
      const { data: existing } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("sport_id", sport.id)
        .eq("skill_name", skill.name)
        .maybeSingle();

      if (existing) {
        // Update existing progress
        await supabase
          .from("user_progress")
          .update({ videos_watched: existing.videos_watched + 1 })
          .eq("id", existing.id);
      } else {
        // Create new progress
        await supabase
          .from("user_progress")
          .insert({
            user_id: user.id,
            sport_id: sport.id,
            skill_name: skill.name,
            videos_watched: 1
          });
      }
    } catch (error) {
      console.error("Error tracking progress:", error);
    }
  };

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

      // Set default video if no video_url exists
      if (!videoData.video_url && sportData.slug === 'futebol') {
        setUploadedVideoUrl('/videos/futebol-treino.mp4');
      }
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('mp4')) {
      toast({
        title: "Formato inválido",
        description: "Por favor, selecione um arquivo MP4",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuário não autenticado");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('videos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('videos')
        .getPublicUrl(fileName);

      setUploadedVideoUrl(publicUrl);
      
      toast({
        title: "Upload realizado!",
        description: "Seu vídeo foi carregado com sucesso",
      });
    } catch (error: any) {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
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
            <div className="aspect-video bg-muted flex items-center justify-center relative">
              {uploadedVideoUrl || video?.video_url ? (
                <video
                  controls
                  controlsList="nodownload"
                  className="w-full h-full"
                  src={uploadedVideoUrl || video.video_url}
                  onEnded={trackProgress}
                >
                  Seu navegador não suporta o elemento de vídeo.
                </video>
              ) : (
                <div className="text-center p-8">
                  <p className="text-muted-foreground mb-4">
                    Nenhum vídeo carregado
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Faça upload de um arquivo MP4 para visualizar
                  </p>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {uploading ? "Carregando..." : "Selecionar Vídeo MP4"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="video/mp4"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              )}
            </div>
            {(uploadedVideoUrl || video?.video_url) && (
              <div className="p-4 border-t border-border bg-card/50">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Carregando..." : "Trocar Vídeo"}
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>
            )}
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
