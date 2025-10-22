import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ArrowLeft, Sparkles } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  short_description: string;
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
}

const AdminAgents = () => {
  const navigate = useNavigate();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    short_description: "",
    description: "",
    image: "🤖",
    starter_price: 499,
    starter_features: "",
    pro_price: 999,
    pro_features: "",
    business_price: 1999,
    business_features: "",
    enterprise_price: 4999,
    enterprise_features: "",
  });

  useEffect(() => {
    checkAuth();
    fetchAgents();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
    }
  };

  const fetchAgents = async () => {
    try {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setAgents(data || []);
    } catch (error) {
      toast.error("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const agentData = {
      name: formData.name,
      short_description: formData.short_description,
      description: formData.description,
      image: formData.image,
      starter_price: formData.starter_price,
      starter_features: formData.starter_features.split("\n").filter(f => f.trim()),
      pro_price: formData.pro_price,
      pro_features: formData.pro_features.split("\n").filter(f => f.trim()),
      business_price: formData.business_price,
      business_features: formData.business_features.split("\n").filter(f => f.trim()),
      enterprise_price: formData.enterprise_price,
      enterprise_features: formData.enterprise_features.split("\n").filter(f => f.trim()),
    };

    try {
      if (selectedAgent) {
        const { error } = await supabase
          .from("agents")
          .update(agentData)
          .eq("id", selectedAgent.id);
        
        if (error) throw error;
        toast.success("Agent updated successfully");
      } else {
        const { error } = await supabase
          .from("agents")
          .insert([agentData]);
        
        if (error) throw error;
        toast.success("Agent created successfully");
      }
      
      setDialogOpen(false);
      resetForm();
      fetchAgents();
    } catch (error: any) {
      toast.error(error.message || "Failed to save agent");
    }
  };

  const handleEdit = (agent: Agent) => {
    setSelectedAgent(agent);
    setFormData({
      name: agent.name,
      short_description: agent.short_description,
      description: agent.description,
      image: agent.image,
      starter_price: agent.starter_price,
      starter_features: agent.starter_features.join("\n"),
      pro_price: agent.pro_price,
      pro_features: agent.pro_features.join("\n"),
      business_price: agent.business_price,
      business_features: agent.business_features.join("\n"),
      enterprise_price: agent.enterprise_price,
      enterprise_features: agent.enterprise_features.join("\n"),
    });
    setDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedAgent) return;

    try {
      const { error } = await supabase
        .from("agents")
        .delete()
        .eq("id", selectedAgent.id);

      if (error) throw error;
      toast.success("Agent deleted successfully");
      setDeleteDialogOpen(false);
      fetchAgents();
    } catch (error: any) {
      toast.error(error.message || "Failed to delete agent");
    }
  };

  const resetForm = () => {
    setSelectedAgent(null);
    setFormData({
      name: "",
      short_description: "",
      description: "",
      image: "🤖",
      starter_price: 499,
      starter_features: "",
      pro_price: 999,
      pro_features: "",
      business_price: 1999,
      business_features: "",
      enterprise_price: 4999,
      enterprise_features: "",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Manage Agents</span>
            </div>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="mr-2 h-4 w-4" />
                Add Agent
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{selectedAgent ? "Edit Agent" : "Create New Agent"}</DialogTitle>
                <DialogDescription>
                  {selectedAgent ? "Update the agent details" : "Add a new AI agent to your catalog"}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Agent Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="image">Emoji Icon</Label>
                  <Input
                    id="image"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="🤖"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="short_description">Short Description</Label>
                  <Input
                    id="short_description"
                    value={formData.short_description}
                    onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Full Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                {/* Pricing Tiers */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Starter */}
                  <div className="space-y-2">
                    <Label>Starter Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.starter_price}
                      onChange={(e) => setFormData({ ...formData, starter_price: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Starter Features (one per line)</Label>
                    <Textarea
                      value={formData.starter_features}
                      onChange={(e) => setFormData({ ...formData, starter_features: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>

                  {/* Pro */}
                  <div className="space-y-2">
                    <Label>Pro Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.pro_price}
                      onChange={(e) => setFormData({ ...formData, pro_price: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pro Features (one per line)</Label>
                    <Textarea
                      value={formData.pro_features}
                      onChange={(e) => setFormData({ ...formData, pro_features: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>

                  {/* Business */}
                  <div className="space-y-2">
                    <Label>Business Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.business_price}
                      onChange={(e) => setFormData({ ...formData, business_price: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Business Features (one per line)</Label>
                    <Textarea
                      value={formData.business_features}
                      onChange={(e) => setFormData({ ...formData, business_features: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>

                  {/* Enterprise */}
                  <div className="space-y-2">
                    <Label>Enterprise Price (₹)</Label>
                    <Input
                      type="number"
                      value={formData.enterprise_price}
                      onChange={(e) => setFormData({ ...formData, enterprise_price: parseInt(e.target.value) })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Enterprise Features (one per line)</Label>
                    <Textarea
                      value={formData.enterprise_features}
                      onChange={(e) => setFormData({ ...formData, enterprise_features: e.target.value })}
                      rows={3}
                      required
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary hover:bg-primary/90">
                    {selectedAgent ? "Update" : "Create"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </header>

      {/* Agents List */}
      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          </div>
        ) : agents.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <p className="text-xl text-muted-foreground">No agents yet. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent) => (
              <Card key={agent.id} className="group hover:border-primary/50 transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-4xl mb-2">{agent.image}</div>
                      <CardTitle>{agent.name}</CardTitle>
                      <CardDescription className="mt-2">{agent.short_description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(agent)} className="flex-1">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedAgent(agent);
                        setDeleteDialogOpen(true);
                      }}
                      className="flex-1"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the agent "{selectedAgent?.name}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminAgents;
