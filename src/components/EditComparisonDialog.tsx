import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { toast } from "sonner";

interface ComparisonRow {
  id: string;
  type: "section" | "feature";
  label: string;
  values: string[];
  order: number;
}

interface EditComparisonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  headers: string[];
  rows: ComparisonRow[];
  onSave: (data: { headers: string[]; rows: ComparisonRow[] }) => Promise<void>;
}

const EditComparisonDialog = ({
  open,
  onOpenChange,
  headers: initialHeaders,
  rows: initialRows,
  onSave,
}: EditComparisonDialogProps) => {
  const [rows, setRows] = useState<ComparisonRow[]>(initialRows);
  const [saving, setSaving] = useState(false);

  const addRow = (type: "section" | "feature") => {
    const newRow: ComparisonRow = {
      id: Date.now().toString(),
      type,
      label: type === "section" ? "New Section" : "New Feature",
      values: type === "section" ? ["", "", "", ""] : ["", "", "", ""],
      order: rows.length + 1,
    };
    setRows([...rows, newRow]);
  };

  const updateRow = (id: string, field: keyof ComparisonRow, value: any) => {
    setRows(rows.map((r) => (r.id === id ? { ...r, [field]: value } : r)));
  };

  const updateValue = (id: string, index: number, value: string) => {
    setRows(
      rows.map((r) => {
        if (r.id === id) {
          const newValues = [...r.values];
          newValues[index] = value;
          return { ...r, values: newValues };
        }
        return r;
      })
    );
  };

  const deleteRow = (id: string) => {
    setRows(rows.filter((r) => r.id !== id));
  };

  const moveRow = (index: number, direction: "up" | "down") => {
    if (
      (direction === "up" && index === 0) ||
      (direction === "down" && index === rows.length - 1)
    ) {
      return;
    }

    const newRows = [...rows];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    [newRows[index], newRows[targetIndex]] = [newRows[targetIndex], newRows[index]];

    newRows.forEach((r, i) => {
      r.order = i + 1;
    });

    setRows(newRows);
  };

  const handleSave = async () => {
    if (rows.some((r) => !r.label.trim())) {
      toast.error("All rows must have a label");
      return;
    }

    setSaving(true);
    try {
      await onSave({ headers: initialHeaders, rows });
      onOpenChange(false);
      toast.success("Comparison table updated successfully");
    } finally {
      setSaving(false);
    }
  };

  const valueOptions = [
    { label: "Checkmark ✓", value: "check" },
    { label: "Cross ✗", value: "cross" },
    { label: "Custom text", value: "text" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Comparison Table</DialogTitle>
          <DialogDescription>
            Manage comparison table rows. Add features or section headers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {rows.map((row, index) => (
            <div
              key={row.id}
              className={`border rounded-lg p-4 space-y-3 ${
                row.type === "section" ? "bg-primary/5 border-primary" : "bg-secondary/20 border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveRow(index, "up")}
                    disabled={index === 0}
                  >
                    ↑
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => moveRow(index, "down")}
                    disabled={index === rows.length - 1}
                  >
                    ↓
                  </Button>
                </div>
                <GripVertical className="h-5 w-5 text-muted-foreground" />
                <Select
                  value={row.type}
                  onValueChange={(value) => updateRow(row.id, "type", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="section">Section</SelectItem>
                    <SelectItem value="feature">Feature</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  value={row.label}
                  onChange={(e) => updateRow(row.id, "label", e.target.value)}
                  placeholder="Feature name"
                  className="flex-1"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => deleteRow(row.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {row.type === "feature" && (
                <div className="grid grid-cols-4 gap-2 pl-10">
                  {["Starter", "Pro", "Business", "Enterprise"].map((plan, idx) => (
                    <div key={idx}>
                      <Label className="text-xs">{plan}</Label>
                      <Input
                        value={row.values[idx]}
                        onChange={(e) => updateValue(row.id, idx, e.target.value)}
                        placeholder="Value"
                        className="mt-1"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Use: "check", "cross", or text
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <div className="flex gap-2">
            <Button onClick={() => addRow("feature")} variant="outline" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Feature Row
            </Button>
            <Button onClick={() => addRow("section")} variant="outline" className="flex-1">
              <Plus className="h-4 w-4 mr-2" />
              Add Section Header
            </Button>
          </div>
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

export default EditComparisonDialog;
