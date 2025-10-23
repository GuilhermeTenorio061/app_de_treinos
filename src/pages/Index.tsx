import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Dumbbell, Play, Award, TrendingUp } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/dashboard");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-20 text-center">
        <div className="animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-energy mb-6">
            <Dumbbell className="w-10 h-10" />
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-energy bg-clip-text text-transparent">
            SportsTrain
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Aprimore suas habilidades esportivas com vídeos de treino profissionais
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-energy hover:opacity-90 text-lg px-8"
              onClick={() => navigate("/auth")}
            >
              Começar agora
              <Play className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-card rounded-xl p-8 border border-border hover:border-primary/50 transition-all animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-gradient-energy flex items-center justify-center mb-4">
              <Play className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Vídeos Profissionais</h3>
            <p className="text-muted-foreground">
              Acesse centenas de vídeos de treino de alta qualidade
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 border border-border hover:border-secondary/50 transition-all animate-scale-in" style={{ animationDelay: "100ms" }}>
            <div className="w-12 h-12 rounded-full bg-gradient-growth flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Múltiplos Esportes</h3>
            <p className="text-muted-foreground">
              Futebol, vôlei, basquete, surf e muito mais
            </p>
          </div>

          <div className="bg-card rounded-xl p-8 border border-border hover:border-accent/50 transition-all animate-scale-in" style={{ animationDelay: "200ms" }}>
            <div className="w-12 h-12 rounded-full bg-gradient-focus flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold mb-3">Evolua suas Skills</h3>
            <p className="text-muted-foreground">
              Aprenda técnicas e táticas de forma progressiva
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-energy rounded-2xl p-12 text-center max-w-3xl mx-auto animate-scale-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para começar?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Crie sua conta grátis e comece a treinar hoje mesmo
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg px-8"
            onClick={() => navigate("/auth")}
          >
            Criar conta grátis
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;
