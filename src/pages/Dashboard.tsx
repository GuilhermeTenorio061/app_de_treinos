import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Play } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import futebolImg from "@/assets/futebol.jpg";
import voleiImg from "@/assets/volei.jpg";
import basqueteImg from "@/assets/basquete.jpg";
import surfImg from "@/assets/surf.jpg";
import handebolImg from "@/assets/handebol.jpg";
import tenisImg from "@/assets/tenis.jpg";
import natacaoImg from "@/assets/natacao.jpg";
import futsalImg from "@/assets/futsal.jpg";
import boxImg from "@/assets/box.jpg";
import jiujitsuImg from "@/assets/jiu-jitsu.jpg";
import futevoleiImg from "@/assets/futevolei.jpg";
import corridaImg from "@/assets/corrida.jpg";
import typusLogo from "@/assets/typus-logo.png";

interface Sport {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string | null;
}

const Dashboard = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadSports();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadSports = async () => {
    try {
      const { data, error } = await supabase
        .from("sports")
        .select("*")
        .order("name");

      if (error) throw error;
      setSports(data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar esportes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const getSportImage = (sportName: string) => {
    const images: { [key: string]: string } = {
      'Futebol': futebolImg,
      'Vôlei': voleiImg,
      'Basquete': basqueteImg,
      'Surf': surfImg,
      'Handebol': handebolImg,
      'Tênis': tenisImg,
      'Natação': natacaoImg,
      'Futsal': futsalImg,
      'Box': boxImg,
      'Jiu-Jitsu': jiujitsuImg,
      'Futevôlei': futevoleiImg,
      'Corrida': corridaImg
    };
    return images[sportName] || futebolImg;
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
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={typusLogo} alt="Typus Logo" className="w-10 h-10" />
            <h1 className="text-2xl font-bold bg-gradient-energy bg-clip-text text-transparent">
              Typus
            </h1>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Escolha seu esporte
          </h2>
          <p className="text-xl text-muted-foreground">
            Comece sua jornada de treinamento
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {sports.map((sport, index) => (
            <div
              key={sport.id}
              className="group relative bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-glow animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/sports/${sport.slug}`)}
            >
              <div className="aspect-square relative overflow-hidden">
                <img 
                  src={getSportImage(sport.name)} 
                  alt={sport.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-2 flex items-center justify-between">
                  {sport.name}
                  <Play className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
                <p className="text-muted-foreground">{sport.description}</p>
              </div>
              <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
