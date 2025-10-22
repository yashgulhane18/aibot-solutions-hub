import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PricingCard from "@/components/PricingCard";
import ChatWidget from "@/components/ChatWidget";
import FeatureCard from "@/components/FeatureCard";
import ComparisonTable from "@/components/ComparisonTable";
import EditDescriptionDialog from "@/components/EditDescriptionDialog";
import EditFeaturesDialog from "@/components/EditFeaturesDialog";
import EditComparisonDialog from "@/components/EditComparisonDialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Edit, Save, X } from "lucide-react";
import { toast } from "sonner";
import { checkIsAdmin, getCurrentUser } from "@/lib/auth-utils";

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  visible: boolean;
}

interface ComparisonRow {
  id: string;
  type: "section" | "feature";
  label: string;
  values: string[];
  order: number;
}

interface Agent {
  id: string;
  name: string;
  description: string;
  image: string;
  starter_price: number;
  starter_features: string[];
  pro_price: number;
  pro_features: string[];
  business_price: number;
  business_features: string[];
  enterprise_price: number;
  enterprise_features: string[];
  features: Feature[];
  comparison_table: {
    headers: string[];
    rows: ComparisonRow[];
  };
  comparison_enabled: boolean;
}

const AgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editDescriptionOpen, setEditDescriptionOpen] = useState(false);
  const [editFeaturesOpen, setEditFeaturesOpen] = useState(false);
  const [editComparisonOpen, setEditComparisonOpen] = useState(false);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Fetch agent data
        const { data, error } = await supabase
          .from("agents")
          .select("*")
          .eq("id", id)
          .single();

        if (error) throw error;
        
        // Transform the data to match our Agent interface
        const transformedAgent: Agent = {
          ...data,
          features: (data.features as any) || [],
          comparison_table: (data.comparison_table as any) || { headers: [], rows: [] },
        };
        
        setAgent(transformedAgent);

        // Check admin status
        const user = await getCurrentUser();
        if (user) {
          const adminStatus = await checkIsAdmin(user.id);
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error("Error fetching agent:", error);
        toast.error("Failed to load agent details");
      } finally {
        setLoading(false);
      }
    };

    if (id) initializeData();
  }, [id]);

  const updateAgentData = async (field: string, value: any) => {
    if (!agent || !isAdmin) return;

    try {
      const { error } = await supabase
        .from("agents")
        .update({ [field]: value })
        .eq("id", agent.id);

      if (error) throw error;

      setAgent({ ...agent, [field]: value });
      toast.success("Updated successfully");
    } catch (error) {
      console.error("Error updating agent:", error);
      toast.error("Failed to update agent");
      throw error;
    }
  };

  const handleSaveDescription = async (description: string) => {
    await updateAgentData("description", description);
  };

  const handleSaveFeatures = async (features: Feature[]) => {
    await updateAgentData("features", features);
  };

  const handleSaveComparison = async (data: { headers: string[]; rows: ComparisonRow[] }) => {
    await updateAgentData("comparison_table", data);
  };

  const handleToggleComparison = async (enabled: boolean) => {
    await updateAgentData("comparison_enabled", enabled);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  if (!agent) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Agent Not Found</h1>
            <Link to="/catalog">
              <Button>Back to Catalog</Button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  const visibleFeatures = agent?.features?.filter((f) => f.visible) || [];

  return (
    <>
      <Navbar />
      <ChatWidget />
      
      <main className="min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Back Button & Edit Mode Toggle */}
          <div className="flex justify-between items-center mb-8">
            <Link to="/catalog">
              <Button variant="ghost" className="group">
                <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                Back to Catalog
              </Button>
            </Link>
            
            {isAdmin && (
              <Button
                variant={editMode ? "destructive" : "secondary"}
                onClick={() => setEditMode(!editMode)}
                className="gap-2"
              >
                {editMode ? (
                  <>
                    <X className="h-4 w-4" />
                    Exit Edit Mode
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit Mode
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Agent Hero */}
          <div className="text-center mb-16 animate-fade-in relative">
            <div className="text-8xl mb-6">{agent.image}</div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">{agent.name}</h1>
            <div className="relative inline-block">
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                {agent.description}
              </p>
              {editMode && (
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute -right-12 top-0"
                  onClick={() => setEditDescriptionOpen(true)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Features Section */}
          {visibleFeatures.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold animate-fade-in">Key Features</h2>
                {editMode && (
                  <Button onClick={() => setEditFeaturesOpen(true)} variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Features
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleFeatures
                  .sort((a, b) => a.order - b.order)
                  .map((feature) => (
                    <FeatureCard
                      key={feature.id}
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                    />
                  ))}
              </div>
            </div>
          )}

          {/* Pricing Section */}
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-center mb-12 animate-fade-in">
              Choose Your Plan
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <PricingCard
                tier="Starter"
                price={agent.starter_price}
                features={agent.starter_features}
              />
              <PricingCard
                tier="Pro"
                price={agent.pro_price}
                features={agent.pro_features}
                popular={true}
              />
              <PricingCard
                tier="Business"
                price={agent.business_price}
                features={agent.business_features}
              />
              <PricingCard
                tier="Enterprise"
                price={agent.enterprise_price}
                features={agent.enterprise_features}
              />
            </div>
          </div>

          {/* Comparison Table */}
          {agent.comparison_enabled && agent.comparison_table?.rows && agent.comparison_table.rows.length > 0 && (
            <div className="mb-16">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-4xl font-bold animate-fade-in">Compare Plans</h2>
                <div className="flex items-center gap-4">
                  {editMode && (
                    <>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={agent.comparison_enabled}
                          onCheckedChange={handleToggleComparison}
                        />
                        <span className="text-sm text-muted-foreground">Enable</span>
                      </div>
                      <Button onClick={() => setEditComparisonOpen(true)} variant="outline">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Comparison
                      </Button>
                    </>
                  )}
                </div>
              </div>
              <ComparisonTable
                headers={agent.comparison_table.headers}
                rows={agent.comparison_table.rows}
              />
            </div>
          )}
          
          {/* Show enable toggle when in edit mode but comparison is disabled */}
          {editMode && !agent.comparison_enabled && (
            <div className="mb-16 text-center p-8 border-2 border-dashed border-border rounded-lg animate-fade-in">
              <h2 className="text-2xl font-bold mb-4">Compare Plans</h2>
              <p className="text-muted-foreground mb-4">Enable the comparison table to show plan differences</p>
              <div className="flex items-center justify-center gap-2">
                <Switch
                  checked={agent.comparison_enabled}
                  onCheckedChange={handleToggleComparison}
                />
                <span className="text-sm">Enable Comparison Table</span>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Edit Dialogs */}
      {isAdmin && agent && (
        <>
          <EditDescriptionDialog
            open={editDescriptionOpen}
            onOpenChange={setEditDescriptionOpen}
            currentDescription={agent.description}
            onSave={handleSaveDescription}
          />
          <EditFeaturesDialog
            open={editFeaturesOpen}
            onOpenChange={setEditFeaturesOpen}
            features={agent.features || []}
            onSave={handleSaveFeatures}
          />
          <EditComparisonDialog
            open={editComparisonOpen}
            onOpenChange={setEditComparisonOpen}
            headers={agent.comparison_table?.headers || []}
            rows={agent.comparison_table?.rows || []}
            onSave={handleSaveComparison}
          />
        </>
      )}
    </>
  );
};

export default AgentDetail;
