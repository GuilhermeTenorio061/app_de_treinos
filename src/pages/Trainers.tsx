import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Mail, Phone, Star, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sport {
  id: string;
  name: string;
  slug: string;
}

interface Trainer {
  id: string;
  name: string;
  description: string;
  contact: string;
  hourly_rate: number;
  experience_years: number | null;
  specialties: string[] | null;
  image_url: string | null;
}

const Trainers = () => {
  const [sport, setSport] = useState<Sport | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
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
      // Load sport
      const { data: sportData, error: sportError } = await supabase
        .from("sports")
        .select("*")
        .eq("slug", sportSlug)
        .single();

      if (sportError) throw sportError;
      setSport(sportData);

      // Load trainers
      const { data: trainersData, error: trainersError } = await supabase
        .from("trainers")
        .select("*")
        .eq("sport_id", sportData.id)
        .order("hourly_rate");

      if (trainersError) throw trainersError;
      setTrainers(trainersData || []);
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
              Treinadores de {sport?.name}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Encontre seu treinador ideal
            </h2>
            <p className="text-xl text-muted-foreground">
              Profissionais especializados em {sport?.name.toLowerCase()} prontos para te ajudar
            </p>
          </div>

          {trainers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-muted-foreground">
                Nenhum treinador disponível no momento
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {trainers.map((trainer, index) => (
                <div
                  key={trainer.id}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-glow animate-scale-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Trainer Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="text-2xl font-bold mb-2">{trainer.name}</h3>
                            {trainer.experience_years && (
                              <div className="flex items-center gap-2 text-muted-foreground mb-3">
                                <Award className="w-4 h-4" />
                                <span>{trainer.experience_years} anos de experiência</span>
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-primary">
                              R$ {trainer.hourly_rate.toFixed(2)}
                            </div>
                            <div className="text-sm text-muted-foreground">por hora</div>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-4 leading-relaxed">
                          {trainer.description}
                        </p>

                        {/* Specialties */}
                        {trainer.specialties && trainer.specialties.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                              <Star className="w-4 h-4 text-primary" />
                              Especialidades
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {trainer.specialties.map((specialty, i) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium"
                                >
                                  {specialty}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Contact */}
                        <div className="pt-4 border-t border-border">
                          <h4 className="text-sm font-semibold mb-3">Contato</h4>
                          <div className="flex flex-col gap-2 text-sm text-muted-foreground">
                            {trainer.contact.split('|').map((contact, i) => (
                              <div key={i} className="flex items-center gap-2">
                                {contact.includes('@') ? (
                                  <Mail className="w-4 h-4" />
                                ) : (
                                  <Phone className="w-4 h-4" />
                                )}
                                <span>{contact.trim()}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Trainers;
