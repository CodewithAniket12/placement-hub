import { useState, useEffect } from "react";
import { Company, useUpdateCompanyNotes } from "@/hooks/useCompanies";
import { X, ExternalLink, Phone, Mail, CheckCircle2, Clock, Send, StickyNote, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

interface CompanyDetailsPanelProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CompanyDetailsPanel({ company, isOpen, onClose }: CompanyDetailsPanelProps) {
  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const updateNotes = useUpdateCompanyNotes();

  // Sync notes when company changes
  useEffect(() => {
    if (company && !isEditingNotes) {
      setNotes(company.notes || "");
    }
  }, [company?.id, company?.notes, isEditingNotes]);

  if (!company) return null;

  const handleSendEmail = () => {
    console.log("Open Mail Template");
  };

  const handleSaveNotes = async () => {
    try {
      await updateNotes.mutateAsync({ id: company.id, notes });
      setIsEditingNotes(false);
      toast({ title: "Notes saved successfully" });
    } catch (error) {
      toast({ title: "Failed to save notes", variant: "destructive" });
    }
  };


  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 z-50 h-full w-full max-w-md bg-card shadow-panel transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h2 className="text-xl font-semibold text-card-foreground">{company.name}</h2>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {company.website}
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Status Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">Status</h3>
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant={company.status === "Active" ? "default" : "destructive"}
                  className={
                    company.status === "Active"
                      ? "bg-success/10 text-success hover:bg-success/20 border-0"
                      : "bg-destructive/10 text-destructive hover:bg-destructive/20 border-0"
                  }
                >
                  {company.status}
                </Badge>
                <Badge
                  className={
                    company.registration_status === "Submitted"
                      ? "bg-success/10 text-success hover:bg-success/20 border-0"
                      : "bg-warning/10 text-warning hover:bg-warning/20 border-0"
                  }
                >
                  {company.registration_status === "Submitted" ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Form Submitted
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      Form Pending
                    </span>
                  )}
                </Badge>
              </div>
            </div>

            {/* POC Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">Point of Contact</h3>
              <div className="space-y-3">
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-primary" />
                    <span className="text-xs font-medium text-primary uppercase">1st POC (Primary)</span>
                  </div>
                  <p className="text-card-foreground font-medium">{company.poc_1st}</p>
                </div>
                {company.poc_2nd && (
                  <div className="rounded-xl border border-border bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-xs font-medium text-muted-foreground uppercase">2nd POC (Backup)</span>
                    </div>
                    <p className="text-card-foreground">{company.poc_2nd}</p>
                  </div>
                )}
              </div>
            </div>

            {/* HR Details */}
            {(company.hr_name || company.hr_phone || company.hr_email) && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">HR Contact</h3>
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  {company.hr_name && (
                    <p className="mb-3 text-base font-medium text-card-foreground">{company.hr_name}</p>
                  )}
                  <div className="space-y-2">
                    {company.hr_phone && (
                      <a
                        href={`tel:${company.hr_phone}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {company.hr_phone}
                      </a>
                    )}
                    {company.hr_email && (
                      <a
                        href={`mailto:${company.hr_email}`}
                        className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                        {company.hr_email}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Industry */}
            {company.industry && (
              <div className="mb-6">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">Industry</h3>
                <p className="text-card-foreground">{company.industry}</p>
              </div>
            )}

            {/* Notes Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <StickyNote className="h-4 w-4" />
                  Notes
                </h3>
                {!isEditingNotes && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingNotes(true)}
                    className="text-xs"
                  >
                    Edit
                  </Button>
                )}
              </div>
              {isEditingNotes ? (
                <div className="space-y-3">
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add notes about this company..."
                    className="min-h-[100px] rounded-xl"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={updateNotes.isPending}
                    >
                      {updateNotes.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setNotes(company.notes || "");
                        setIsEditingNotes(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl border border-border bg-muted/50 p-4">
                  <p className="text-card-foreground whitespace-pre-wrap">
                    {company.notes || "No notes added yet."}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <Button
              onClick={handleSendEmail}
              className="w-full gap-2 rounded-xl bg-primary hover:bg-primary/90 py-6 text-base"
              size="lg"
            >
              <Send className="h-5 w-5" />
              Send Email
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
