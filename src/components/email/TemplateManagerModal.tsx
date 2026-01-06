import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Edit2, ArrowLeft, X, UserPlus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCoordinators, useAddCoordinator, Coordinator } from "@/hooks/useCoordinators";

interface Placeholder {
  key: string;
  label: string;
  required: boolean;
  default?: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  placeholders: Placeholder[];
}

interface TemplateManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TemplateManagerModal({ isOpen, onClose }: TemplateManagerModalProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState<"list" | "edit">("list");
  const [editingTemplate, setEditingTemplate] = useState<Partial<EmailTemplate> | null>(null);
  const [placeholders, setPlaceholders] = useState<Placeholder[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  
  // Coordinator management
  const { data: coordinators = [] } = useCoordinators();
  const addCoordinatorMutation = useAddCoordinator();
  const [showAddCoordinator, setShowAddCoordinator] = useState(false);
  const [newCoordinatorName, setNewCoordinatorName] = useState("");
  const [newCoordinatorPhone, setNewCoordinatorPhone] = useState("");

  const handleAddCoordinator = async () => {
    if (!newCoordinatorName.trim() || !newCoordinatorPhone.trim()) {
      toast({ title: "Please enter both name and phone number", variant: "destructive" });
      return;
    }
    try {
      await addCoordinatorMutation.mutateAsync({ 
        name: newCoordinatorName.trim(), 
        phone: newCoordinatorPhone.trim() 
      });
      toast({ title: "Coordinator added successfully" });
      setNewCoordinatorName("");
      setNewCoordinatorPhone("");
      setShowAddCoordinator(false);
    } catch (error: any) {
      toast({ title: "Failed to add coordinator", description: error.message, variant: "destructive" });
    }
  };

  // Fetch templates
  useEffect(() => {
    async function fetchTemplates() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("email_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching templates:", error);
        toast({ title: "Error", description: "Failed to load templates", variant: "destructive" });
      } else if (data) {
        const formattedTemplates: EmailTemplate[] = data.map((t) => ({
          id: t.id,
          name: t.name,
          subject: t.subject,
          body: t.body,
          placeholders: Array.isArray(t.placeholders) 
            ? (t.placeholders as unknown as Placeholder[]) 
            : [],
        }));
        setTemplates(formattedTemplates);
      }
      setIsLoading(false);
    }

    if (isOpen) {
      fetchTemplates();
      setView("list");
    }
  }, [isOpen]);

  const handleCreateNew = () => {
    setEditingTemplate({
      name: "",
      subject: "",
      body: "",
      placeholders: [],
    });
    setPlaceholders([]);
    setView("edit");
  };

  const handleEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setPlaceholders(template.placeholders || []);
    setView("edit");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    const { error } = await supabase.from("email_templates").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: "Failed to delete template", variant: "destructive" });
    } else {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
      toast({ title: "Template deleted" });
    }
  };

  const addPlaceholder = () => {
    setPlaceholders((prev) => [
      ...prev,
      { key: "", label: "", required: false, default: "" },
    ]);
  };

  const updatePlaceholder = (index: number, field: keyof Placeholder, value: string | boolean) => {
    setPlaceholders((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    );
  };

  const removePlaceholder = (index: number) => {
    setPlaceholders((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!editingTemplate?.name || !editingTemplate?.subject || !editingTemplate?.body) {
      toast({
        title: "Missing required fields",
        description: "Please fill in name, subject, and body",
        variant: "destructive",
      });
      return;
    }

    // Validate placeholders
    const validPlaceholders = placeholders.filter((p) => p.key && p.label);

    setIsSaving(true);

    const templateData = {
      name: editingTemplate.name,
      subject: editingTemplate.subject,
      body: editingTemplate.body,
      placeholders: JSON.parse(JSON.stringify(validPlaceholders)),
    };

    try {
      if (editingTemplate.id) {
        // Update existing
        const { error } = await supabase
          .from("email_templates")
          .update(templateData)
          .eq("id", editingTemplate.id);

        if (error) throw error;

        setTemplates((prev) =>
          prev.map((t) =>
            t.id === editingTemplate.id ? { ...t, ...templateData, placeholders: validPlaceholders } : t
          )
        );
        toast({ title: "Template updated" });
      } else {
        // Create new
        const { data, error } = await supabase
          .from("email_templates")
          .insert(templateData)
          .select()
          .single();

        if (error) throw error;

        const newTemplate = {
          ...data,
          placeholders: validPlaceholders,
        } as EmailTemplate;
        setTemplates((prev) => [newTemplate, ...prev]);
        toast({ title: "Template created" });
      }

      setView("list");
      setEditingTemplate(null);
    } catch (error: any) {
      console.error("Error saving template:", error);
      toast({
        title: "Error saving template",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {view === "edit" && (
              <Button variant="ghost" size="sm" onClick={() => setView("list")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            {view === "list" ? "Email Templates" : editingTemplate?.id ? "Edit Template" : "Create Template"}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : view === "list" ? (
          <div className="space-y-4">
            {/* Coordinator Management */}
            <div className="p-4 border rounded-lg bg-muted/30 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Coordinators</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAddCoordinator(!showAddCoordinator)}
                  className="gap-1"
                >
                  <UserPlus className="h-4 w-4" />
                  Add
                </Button>
              </div>
              
              {showAddCoordinator && (
                <div className="flex gap-2 items-end p-3 bg-background rounded-lg border">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={newCoordinatorName}
                      onChange={(e) => setNewCoordinatorName(e.target.value)}
                      placeholder="Enter name"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Phone</Label>
                    <Input
                      value={newCoordinatorPhone}
                      onChange={(e) => setNewCoordinatorPhone(e.target.value)}
                      placeholder="Enter phone"
                    />
                  </div>
                  <Button 
                    size="sm" 
                    onClick={handleAddCoordinator}
                    disabled={addCoordinatorMutation.isPending}
                  >
                    {addCoordinatorMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}
                  </Button>
                </div>
              )}
              
              <div className="flex flex-wrap gap-2">
                {coordinators.map((c) => (
                  <div key={c.id} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {c.name} ({c.phone})
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={handleCreateNew} className="w-full gap-2">
              <Plus className="h-4 w-4" />
              Create New Template
            </Button>

            {templates.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No templates yet. Create your first one!
              </p>
            ) : (
              <div className="space-y-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-card"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{template.name}</h4>
                      <p className="text-sm text-muted-foreground truncate">{template.subject}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {template.placeholders.length} placeholder(s)
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(template.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Template Details */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Template Name *</Label>
                <Input
                  value={editingTemplate?.name || ""}
                  onChange={(e) =>
                    setEditingTemplate((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="e.g., Introduction Email"
                />
              </div>

              <div className="space-y-2">
                <Label>Subject Line *</Label>
                <Input
                  value={editingTemplate?.subject || ""}
                  onChange={(e) =>
                    setEditingTemplate((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  placeholder="e.g., Introduction from {{company_name}}"
                />
                <p className="text-xs text-muted-foreground">
                  Use {"{{placeholder_key}}"} for dynamic values
                </p>
              </div>

              <div className="space-y-2">
                <Label>Email Body *</Label>
                <Textarea
                  value={editingTemplate?.body || ""}
                  onChange={(e) =>
                    setEditingTemplate((prev) => ({ ...prev, body: e.target.value }))
                  }
                  placeholder="Dear {{hr_name}},&#10;&#10;We are reaching out..."
                  rows={8}
                />
              </div>
            </div>

            {/* Placeholders */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Placeholders</Label>
                <Button variant="outline" size="sm" onClick={addPlaceholder}>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Placeholder
                </Button>
              </div>

              {placeholders.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No placeholders defined. Add placeholders like hr_name, company_name, etc.
                </p>
              ) : (
                <div className="space-y-3">
                  {placeholders.map((placeholder, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-end p-3 bg-muted/50 rounded-lg"
                    >
                      <div className="space-y-1">
                        <Label className="text-xs">Key (no spaces)</Label>
                        <Input
                          value={placeholder.key}
                          onChange={(e) =>
                            updatePlaceholder(index, "key", e.target.value.replace(/\s/g, "_").toLowerCase())
                          }
                          placeholder="company_name"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Label</Label>
                        <Input
                          value={placeholder.label}
                          onChange={(e) => updatePlaceholder(index, "label", e.target.value)}
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Default</Label>
                        <Input
                          value={placeholder.default || ""}
                          onChange={(e) => updatePlaceholder(index, "default", e.target.value)}
                          placeholder="Optional"
                          className="w-24"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={placeholder.required}
                            onChange={(e) => updatePlaceholder(index, "required", e.target.checked)}
                            className="rounded"
                          />
                          Req
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removePlaceholder(index)}
                          className="text-destructive h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Save Button */}
            <Button onClick={handleSave} disabled={isSaving} className="w-full" size="lg">
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingTemplate?.id ? "Update Template" : "Create Template"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
