import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Users, Dumbbell, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sport {
  id: string;
  name: string;
  slug: string;
  description: string;
}

const SportMenu = () => {
  const [sport, setSport] = useState<Sport | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { sportSlug } = useParams();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadSport();
  }, [sportSlug]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadSport = async () => {
    try {
      const { data, error } = await supabase
        .from("sports")
        .select("*")
        .eq("slug", sportSlug)
        .single();

      if (error) throw error;
      setSport(data);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar esporte",
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
              onClick={() => navigate("/dashboard")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold bg-gradient-energy bg-clip-text text-transparent">
              {sport.name}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              O que você procura?
            </h2>
            <p className="text-xl text-muted-foreground">
              Escolha entre treinadores, treinos ou acompanhe seu desenvolvimento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Treinadores Card */}
            <div
              className="group relative bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-glow animate-scale-in"
              onClick={() => navigate(`/sports/${sportSlug}/treinadores`)}
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Treinadores</h3>
                <p className="text-muted-foreground mb-6">
                  Encontre treinadores especializados em {sport.name.toLowerCase()} para aulas particulares
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
                  Ver treinadores
                  <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>

            {/* Treinos Card */}
            <div
              className="group relative bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-glow animate-scale-in"
              style={{ animationDelay: "100ms" }}
              onClick={() => navigate(`/sports/${sportSlug}/treinos`)}
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Dumbbell className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Treinos</h3>
                <p className="text-muted-foreground mb-6">
                  Acesse vídeos de treino com técnicas e exercícios específicos
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
                  Ver treinos
                  <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>

            {/* Desenvolvimento Card */}
            <div
              className="group relative bg-card rounded-2xl overflow-hidden border-2 border-border hover:border-primary transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-glow animate-scale-in"
              style={{ animationDelay: "200ms" }}
              onClick={() => navigate(`/sports/${sportSlug}/desenvolvimento`)}
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <TrendingUp className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Desenvolvimento</h3>
                <p className="text-muted-foreground mb-6">
                  Acompanhe seu progresso e evolução em cada valência do esporte
                </p>
                <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
                  Ver progresso
                  <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SportMenu;
