import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ChatWidget from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";
import { supabase } from "@/integrations/supabase/client";
interface KeyFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  icon_bg_color: string;
}
const Index = () => {
  const [features, setFeatures] = useState<KeyFeature[]>([]);
  useEffect(() => {
    fetchFeatures();
  }, []);
  const fetchFeatures = async () => {
    const {
      data,
      error
    } = await supabase.from("key_features").select("*").eq("is_active", true).order("display_order");
    if (!error && data) {
      setFeatures(data);
    }
  };
  return <>
      <Navbar />
      <ChatWidget />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{
      backgroundImage: `url(${heroImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/90 to-background"></div>
        <div className="container mx-auto px-4 relative z-10 pt-20">
          <div className="text-center max-w-5xl mx-auto animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Empowering Education with{" "}
              <span className="bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent animate-glow">
                AI Agents
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed">
              Transform your business with intelligent AI solutions. From chatbots to data analyzers, 
              we create custom AI agents that drive real results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up">
              <Link to="/catalog">
                <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 group">
                  Explore Catalog
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link to="/request">
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Contact Us
              </Button>
              </Link>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto">
              <div className="text-center animate-fade-in" style={{
              animationDelay: "0.2s"
            }}>
                
                
              </div>
              <div className="text-center animate-fade-in" style={{
              animationDelay: "0.3s"
            }}>
                
                
              </div>
              <div className="text-center animate-fade-in" style={{
              animationDelay: "0.4s"
            }}>
                
                
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Who We Are</h2>
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Aibotclip is a pioneering AI education and service platform dedicated to helping businesses 
                harness the power of artificial intelligence. We specialize in creating custom AI agents 
                that solve real-world problems and drive measurable results.
              </p>
              <p>
                Our team of AI experts works closely with clients to understand their unique challenges 
                and develop tailored solutions. From intelligent chatbots to advanced data analyzers, 
                we build AI tools that transform how businesses operate.
              </p>
              <p>
                With a focus on education and empowerment, we don't just deliver solutions—we help 
                you understand and leverage AI technology to stay ahead in an increasingly digital world.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Aibotclip?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive AI solutions designed for modern businesses
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => <Card key={feature.id} className="group hover:border-primary/50 hover:shadow-[var(--shadow-elevated)] transition-all duration-300 hover:-translate-y-2 animate-fade-in-up" style={{
            animationDelay: `${index * 0.1}s`
          }}>
                <CardHeader>
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform" style={{
                backgroundColor: feature.icon_bg_color
              }}>
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Explore our catalog of AI agents and find the perfect solution for your needs.
            </p>
            <Link to="/catalog">
              <Button size="lg" className="text-lg px-12 py-6 bg-primary hover:bg-primary/90 group">
                View AI Agents
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>;
};
export default Index;