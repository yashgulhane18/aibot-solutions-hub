import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Edit, Trash2, ArrowLeft, Sparkles } from "lucide-react";
import { checkIsAdmin } from "@/lib/auth-utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import KeyFeatureDialog from "@/components/KeyFeatureDialog";

interface KeyFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  icon_bg_color: string;
  display_order: number;
  is_active: boolean;
}

const AdminKeyFeatures = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [features, setFeatures] = useState<KeyFeature[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<KeyFeature | null>(null);

  useEffect(() => {
    checkAuth();
    fetchFeatures();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/admin/login");
      return;
    }

    const isAdmin = await checkIsAdmin(session.user.id);
    if (!isAdmin) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
      return;
    }
    setLoading(false);
  };

  const fetchFeatures = async () => {
    const { data, error } = await supabase
      .from("key_features")
      .select("*")
      .order("display_order");

    if (error) {
      toast.error("Failed to fetch features");
      console.error(error);
      return;
    }

    setFeatures(data || []);
  };

  const handleDelete = async () => {
    if (!selectedFeature) return;

    const { error } = await supabase
      .from("key_features")
      .delete()
      .eq("id", selectedFeature.id);

    if (error) {
      toast.error("Failed to delete feature");
      console.error(error);
      return;
    }

    toast.success("Feature deleted successfully");
    setDeleteDialogOpen(false);
    setSelectedFeature(null);
    fetchFeatures();
  };

  const handleSave = async (feature: Omit<KeyFeature, "id">) => {
    if (selectedFeature) {
      // Update existing
      const { error } = await supabase
        .from("key_features")
        .update(feature)
        .eq("id", selectedFeature.id);

      if (error) {
        toast.error("Failed to update feature");
        console.error(error);
        return;
      }
      toast.success("Feature updated successfully");
    } else {
      // Create new
      const { error } = await supabase
        .from("key_features")
        .insert([feature]);

      if (error) {
        toast.error("Failed to create feature");
        console.error(error);
        return;
      }
      toast.success("Feature created successfully");
    }

    setEditDialogOpen(false);
    setSelectedFeature(null);
    fetchFeatures();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/admin/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Manage Key Features</span>
            </div>
          </div>
          <Button onClick={() => {
            setSelectedFeature(null);
            setEditDialogOpen(true);
          }}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Feature
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Card key={feature.id} className="hover:border-primary/50 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-4"
                    style={{ backgroundColor: feature.icon_bg_color }}
                  >
                    {feature.icon}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedFeature(feature);
                        setEditDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        setSelectedFeature(feature);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Order: {feature.display_order}</span>
                  <span>•</span>
                  <span>{feature.is_active ? "Active" : "Inactive"}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {features.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No features yet. Add your first feature to get started!</p>
          </div>
        )}
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{selectedFeature?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add/Edit Dialog */}
      <KeyFeatureDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        feature={selectedFeature}
        onSave={handleSave}
      />
    </div>
  );
};

export default AdminKeyFeatures;
