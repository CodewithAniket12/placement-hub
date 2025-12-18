import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Send, Settings2, Sparkles } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Company } from "@/hooks/useCompanies";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  placeholders: Placeholder[];
}

interface Placeholder {
  key: string;
  label: string;
  required: boolean;
  default?: string;
}

interface EmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  company: Company | null;
  onManageTemplates: () => void;
}

export function EmailComposeModal({ isOpen, onClose, company, onManageTemplates }: EmailComposeModalProps) {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [placeholderValues, setPlaceholderValues] = useState<Record<string, string>>({});
  const [previewSubject, setPreviewSubject] = useState("");
  const [previewBody, setPreviewBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPurpose, setAiPurpose] = useState("");

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
        if (formattedTemplates.length > 0) {
          setSelectedTemplateId(formattedTemplates[0].id);
        }
      }
      setIsLoading(false);
    }

    if (isOpen) {
      fetchTemplates();
    }
  }, [isOpen]);

  // Set default values when template or company changes
  useEffect(() => {
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template && company) {
      const defaults: Record<string, string> = {};
      template.placeholders.forEach((p) => {
        if (p.key === "company_name") {
          defaults[p.key] = company.name;
        } else if (p.key === "hr_name") {
          defaults[p.key] = company.hr_name || p.default || "Hi Team";
        } else if (p.default) {
          defaults[p.key] = p.default;
        }
      });
      setPlaceholderValues(defaults);
    }
  }, [selectedTemplateId, company, templates]);

  // Update preview when template or values change
  useEffect(() => {
    const template = templates.find((t) => t.id === selectedTemplateId);
    if (template) {
      let subject = template.subject;
      let body = template.body;

      Object.entries(placeholderValues).forEach(([key, value]) => {
        const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
        subject = subject.replace(regex, value || `{{${key}}}`);
        body = body.replace(regex, value || `{{${key}}}`);
      });

      setPreviewSubject(subject);
      setPreviewBody(body);
    }
  }, [selectedTemplateId, placeholderValues, templates]);

  const handlePlaceholderChange = (key: string, value: string) => {
    setPlaceholderValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerateWithAI = async () => {
    if (!company) return;
    
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-email", {
        body: {
          companyName: company.name,
          hrName: company.hr_name,
          purpose: aiPurpose || "Campus recruitment invitation - requesting the company to participate in our campus placement drive."
        }
      });

      if (error) throw error;

      if (data.error) {
        toast({
          title: "AI Error",
          description: data.error,
          variant: "destructive",
        });
        return;
      }

      setPreviewSubject(data.subject);
      setPreviewBody(data.body);
      
      toast({
        title: "Email Generated",
        description: "AI has drafted your email. Review and edit as needed.",
      });
    } catch (error: unknown) {
      console.error("Error generating email:", error);
      toast({
        title: "Generation Failed",
        description: error instanceof Error ? error.message : "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendEmail = async () => {
    if (!company) return;

    const template = templates.find((t) => t.id === selectedTemplateId);
    if (!template) return;

    // Validate required fields
    const missingRequired = template.placeholders
      .filter((p) => p.required && !placeholderValues[p.key])
      .map((p) => p.label);

    if (missingRequired.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingRequired.join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    try {
      const { data, error } = await supabase.functions.invoke("send-email", {
        body: {
          to: company.hr_email,
          subject: previewSubject,
          body: previewBody,
          companyName: company.name,
        },
      });

      if (error) throw error;

      // Log the email
      await supabase.from("email_logs").insert({
        template_id: selectedTemplateId,
        company_name: company.name,
        recipient_email: company.hr_email || "",
        subject: previewSubject,
        body: previewBody,
        status: "sent",
        sent_at: new Date().toISOString(),
      });

      toast({
        title: "Email sent!",
        description: `Successfully sent email to ${company.hr_email}`,
      });
      onClose();
    } catch (error: any) {
      console.error("Error sending email:", error);
      toast({
        title: "Failed to send email",
        description: error.message || "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Compose Email to {company?.name}</span>
            <Button variant="ghost" size="sm" onClick={onManageTemplates}>
              <Settings2 className="h-4 w-4 mr-2" />
              Manage Templates
            </Button>
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : templates.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No templates found. Create one first!</p>
            <Button onClick={onManageTemplates}>Create Template</Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* AI Generation Section */}
            <div className="space-y-3 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h4 className="font-medium">Generate with AI</h4>
              </div>
              <Textarea
                value={aiPurpose}
                onChange={(e) => setAiPurpose(e.target.value)}
                placeholder="Describe the purpose of your email (e.g., 'Invite for campus placement drive', 'Follow up on registration form')..."
                className="min-h-[80px]"
              />
              <Button
                onClick={handleGenerateWithAI}
                disabled={isGenerating}
                variant="outline"
                className="w-full gap-2 border-primary/30 hover:bg-primary/10"
              >
                {isGenerating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                {isGenerating ? "Generating..." : "Generate Email with AI"}
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or use template</span>
              </div>
            </div>

            {/* Template Selection */}
            <div className="space-y-2">
              <Label>Email Template</Label>
              <Select value={selectedTemplateId} onValueChange={setSelectedTemplateId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Placeholder Fields */}
            {selectedTemplate && selectedTemplate.placeholders.length > 0 && (
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <h4 className="font-medium text-sm text-muted-foreground">Fill in the details</h4>
                <div className="grid gap-4 sm:grid-cols-2">
                  {selectedTemplate.placeholders.map((placeholder) => (
                    <div key={placeholder.key} className="space-y-2">
                      <Label>
                        {placeholder.label}
                        {placeholder.required && <span className="text-destructive ml-1">*</span>}
                      </Label>
                      <Input
                        value={placeholderValues[placeholder.key] || ""}
                        onChange={(e) => handlePlaceholderChange(placeholder.key, e.target.value)}
                        placeholder={placeholder.default || `Enter ${placeholder.label.toLowerCase()}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Preview / Edit */}
            <div className="space-y-4">
              <h4 className="font-medium">Email Content</h4>
              <div className="border rounded-lg p-4 bg-card space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground">To:</Label>
                  <p className="font-medium">{company?.hr_email || "No email"}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Subject:</Label>
                  <Input
                    value={previewSubject}
                    onChange={(e) => setPreviewSubject(e.target.value)}
                    placeholder="Email subject..."
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">Body:</Label>
                  <Textarea
                    value={previewBody}
                    onChange={(e) => setPreviewBody(e.target.value)}
                    placeholder="Email body..."
                    className="min-h-[150px]"
                  />
                </div>
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={handleSendEmail}
              disabled={isSending}
              className="w-full gap-2"
              size="lg"
            >
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
