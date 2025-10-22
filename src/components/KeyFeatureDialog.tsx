import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface KeyFeature {
  id?: string;
  title: string;
  description: string;
  icon: string;
  icon_bg_color: string;
  display_order: number;
  is_active: boolean;
}

interface KeyFeatureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: KeyFeature | null;
  onSave: (feature: Omit<KeyFeature, "id">) => void;
}

const KeyFeatureDialog = ({ open, onOpenChange, feature, onSave }: KeyFeatureDialogProps) => {
  const [formData, setFormData] = useState<Omit<KeyFeature, "id">>({
    title: "",
    description: "",
    icon: "🤖",
    icon_bg_color: "#6366f1",
    display_order: 0,
    is_active: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (feature) {
      setFormData({
        title: feature.title,
        description: feature.description,
        icon: feature.icon,
        icon_bg_color: feature.icon_bg_color,
        display_order: feature.display_order,
        is_active: feature.is_active,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        icon: "🤖",
        icon_bg_color: "#6366f1",
        display_order: 0,
        is_active: true,
      });
    }
    setErrors({});
  }, [feature, open]);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.icon.trim()) {
      newErrors.icon = "Icon is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSave(formData);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{feature ? "Edit Feature" : "Add New Feature"}</DialogTitle>
          <DialogDescription>
            {feature ? "Update the feature details below." : "Create a new key feature for your homepage."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Feature Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., 24/7 Availability"
            />
            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe this feature..."
              rows={3}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="icon">Icon/Emoji *</Label>
              <Input
                id="icon"
                value={formData.icon}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="🤖"
                maxLength={5}
              />
              {errors.icon && <p className="text-sm text-destructive">{errors.icon}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="color"
                  type="color"
                  value={formData.icon_bg_color}
                  onChange={(e) => setFormData({ ...formData, icon_bg_color: e.target.value })}
                  className="h-10 w-16 p-1 cursor-pointer"
                />
                <Input
                  type="text"
                  value={formData.icon_bg_color}
                  onChange={(e) => setFormData({ ...formData, icon_bg_color: e.target.value })}
                  placeholder="#6366f1"
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="order">Display Order</Label>
            <Input
              id="order"
              type="number"
              value={formData.display_order}
              onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
              placeholder="0"
            />
            <p className="text-xs text-muted-foreground">Lower numbers appear first</p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4"
            />
            <Label htmlFor="active" className="cursor-pointer">Active (visible on homepage)</Label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {feature ? "Update" : "Create"} Feature
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default KeyFeatureDialog;
