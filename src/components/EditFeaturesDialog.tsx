import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { toast } from "sonner";

interface Feature {
  id: string;
  icon: string;
  title: string;
  description: string;
  order: number;
  visible: boolean;
}

interface EditFeaturesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  features: Feature[];
  onSave: (features: Feature[]) => Promise<void>;
}

const EditFeaturesDialog = ({
  open,
  onOpenChange,
  features: initialFeatures,
  onSave,
}: EditFeaturesDialogProps) => {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [saving, setSaving] = useState(false);

  const addFeature = () => {
    const newFeature: Feature = {
      id: Date.now().toString(),
      icon: "✨",
      title: "New Feature",
      description: "Describe this feature...",
      order: features.length + 1,
      visible: true,
    };
    setFeatures([...features, newFeature]);
  };

  const updateFeature = (id: string, field: keyof Feature, value: any) => {
    setFeatures(features.map((f) => (f.id === id ? { ...f, [field]: value } : f)));
  };

  const deleteFeature = (id: string) => {
    setFeatures(features.filter((f) => f.id !== id));
  };

  const moveFeature = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === features.length - 1)
    ) {
      return;
    }

    const newFeatures = [...features];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newFeatures[index], newFeatures[targetIndex]] = [
      newFeatures[targetIndex],
      newFeatures[index],
    ];

    // Update order values
    newFeatures.forEach((f, i) => {
      f.order = i + 1;
    });

    setFeatures(newFeatures);
  };

  const handleSave = async () => {
    if (features.some((f) => !f.title.trim() || !f.description.trim())) {
      toast.error("All features must have a title and description");
      return;
    }

    setSaving(true);
    try {
      await onSave(features);
      onOpenChange(false);
      toast.success("Features updated successfully");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Features</DialogTitle>
          <DialogDescription>
            Add, edit, or remove feature cards. Drag to reorder.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div
              key={feature.id}
              className="border border-border rounded-lg p-4 space-y-3 bg-secondary/20"
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveFeature(index, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveFeature(index, "down")}
                    disabled={index === features.length - 1}
                  >
                    ↓
                  </Button>
                </div>
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <Input
                  value={feature.icon}
                  onChange={(e) => updateFeature(feature.id, "icon", e.target.value)}
                  className="w-20 text-2xl text-center"
                  placeholder="Icon"
                />
                <Input
                  value={feature.title}
                  onChange={(e) => updateFeature(feature.id, "title", e.target.value)}
                  placeholder="Feature title"
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteFeature(feature.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea
                  value={feature.description}
                  onChange={(e) => updateFeature(feature.id, "description", e.target.value)}
                  placeholder="Feature description"
                  rows={2}
                />
              </div>
            </div>
          ))}

          <Button onClick={addFeature} variant="outline" className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Feature
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditFeaturesDialog;
