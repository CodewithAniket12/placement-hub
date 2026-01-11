import { useState, useEffect, useRef } from "react";
import { Company, useUpdateCompanyNotes, useUpdateCompany, useDeleteCompany, useBlacklistCompany, useExtractAndSaveFormData } from "@/hooks/useCompanies";
import { X, ExternalLink, Phone, Mail, CheckCircle2, Clock, Send, StickyNote, User, Users, Pencil, Trash2, Ban, Upload, FileText, Briefcase, MapPin, GraduationCap, FileCheck, Loader2, CalendarPlus } from "lucide-react";
import { AddTaskModal } from "@/components/tasks/AddTaskModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
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

interface CompanyDetailsPanelProps {
  company: Company | null;
  isOpen: boolean;
  onClose: () => void;
  onSendEmail?: (company: Company) => void;
}

const POC_OPTIONS = ["Aniket", "Rushikesh", "Priya", "Bajrang", "Manasi", "Parshuram"];

export function CompanyDetailsPanel({ company, isOpen, onClose, onSendEmail }: CompanyDetailsPanelProps) {
  const [notes, setNotes] = useState("");
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingDetails, setIsEditingDetails] = useState(false);
  const [isEditingJobDetails, setIsEditingJobDetails] = useState(false);
  const [editForm, setEditForm] = useState({
    hr_name: "",
    hr_phone: "",
    hr_email: "",
    poc_1st: "",
    poc_2nd: "",
  });
  const [jobDetailsForm, setJobDetailsForm] = useState({
    job_roles: "",
    package_offered: "",
    eligibility_criteria: "",
    bond_details: "",
    job_location: "",
    selection_process: "",
  });
  
  // Dialog states
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlacklistDialog, setShowBlacklistDialog] = useState(false);
  const [showEmailConfirmDialog, setShowEmailConfirmDialog] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [blacklistReason, setBlacklistReason] = useState("");
  
  const updateNotes = useUpdateCompanyNotes();
  const updateCompany = useUpdateCompany();
  const deleteCompany = useDeleteCompany();
  const blacklistCompany = useBlacklistCompany();
  const extractFormData = useExtractAndSaveFormData();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when company changes
  useEffect(() => {
    if (company) {
      if (!isEditingNotes) {
        setNotes(company.notes || "");
      }
      if (!isEditingDetails) {
        setEditForm({
          hr_name: company.hr_name || "",
          hr_phone: company.hr_phone || "",
          hr_email: company.hr_email || "",
          poc_1st: company.poc_1st,
          poc_2nd: company.poc_2nd || "",
        });
      }
      if (!isEditingJobDetails) {
        setJobDetailsForm({
          job_roles: company.job_roles || "",
          package_offered: company.package_offered || "",
          eligibility_criteria: company.eligibility_criteria || "",
          bond_details: company.bond_details || "",
          job_location: company.job_location || "",
          selection_process: company.selection_process || "",
        });
      }
    }
  }, [company?.id, company?.hr_name, company?.hr_phone, company?.hr_email, company?.poc_1st, company?.poc_2nd, company?.notes, company?.job_roles, company?.package_offered, company?.eligibility_criteria, company?.bond_details, company?.job_location, company?.selection_process, isEditingNotes, isEditingDetails, isEditingJobDetails]);

  if (!company) return null;

  const handleSendEmail = () => {
    if (onSendEmail && company.hr_email) {
      setShowEmailConfirmDialog(true);
    }
  };

  const confirmSendEmail = () => {
    if (onSendEmail && company.hr_email) {
      onSendEmail(company);
    }
    setShowEmailConfirmDialog(false);
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

  const handleSaveDetails = async () => {
    try {
      await updateCompany.mutateAsync({
        id: company.id,
        hr_name: editForm.hr_name.trim() || null,
        hr_phone: editForm.hr_phone.trim() || null,
        hr_email: editForm.hr_email.trim() || null,
        poc_1st: editForm.poc_1st,
        poc_2nd: editForm.poc_2nd || null,
      });
      setIsEditingDetails(false);
      toast({ title: "Company details updated!" });
    } catch (error) {
      toast({ title: "Failed to update details", variant: "destructive" });
    }
  };

  const handleSaveJobDetails = async () => {
    try {
      await updateCompany.mutateAsync({
        id: company.id,
        job_roles: jobDetailsForm.job_roles.trim() || null,
        package_offered: jobDetailsForm.package_offered.trim() || null,
        eligibility_criteria: jobDetailsForm.eligibility_criteria.trim() || null,
        bond_details: jobDetailsForm.bond_details.trim() || null,
        job_location: jobDetailsForm.job_location.trim() || null,
        selection_process: jobDetailsForm.selection_process.trim() || null,
        registration_status: "Submitted",
      });
      setIsEditingJobDetails(false);
      toast({ title: "Job details updated!" });
    } catch (error) {
      toast({ title: "Failed to update job details", variant: "destructive" });
    }
  };

  const handleDeleteCompany = async () => {
    try {
      await deleteCompany.mutateAsync(company.id);
      setShowDeleteDialog(false);
      onClose();
      toast({ title: "Company deleted successfully" });
    } catch (error) {
      toast({ title: "Failed to delete company", variant: "destructive" });
    }
  };

  const handleBlacklistCompany = async () => {
    if (!blacklistReason.trim()) {
      toast({ title: "Please provide a reason for blacklisting", variant: "destructive" });
      return;
    }
    try {
      await blacklistCompany.mutateAsync({ id: company.id, reason: blacklistReason.trim() });
      setShowBlacklistDialog(false);
      setBlacklistReason("");
      toast({ title: "Company blacklisted" });
    } catch (error) {
      toast({ title: "Failed to blacklist company", variant: "destructive" });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !company) return;
    
    try {
      await extractFormData.mutateAsync({ companyId: company.id, file });
      toast({ title: "Registration form data extracted successfully!" });
    } catch (error) {
      toast({ 
        title: "Failed to extract form data", 
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive" 
      });
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
              <div className="flex flex-wrap gap-2 items-center">
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
                <Select
                  value={company.registration_status}
                  onValueChange={async (value: string) => {
                    try {
                      await updateCompany.mutateAsync({
                        id: company.id,
                        registration_status: value as "Pending" | "Submitted",
                      });
                      toast({ title: `Registration status updated to ${value}` });
                    } catch (error) {
                      toast({ title: "Failed to update status", variant: "destructive" });
                    }
                  }}
                >
                  <SelectTrigger className={`w-[160px] h-7 text-xs border-0 ${
                    company.registration_status === "Submitted"
                      ? "bg-success/10 text-success"
                      : "bg-warning/10 text-warning"
                  }`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Form Pending
                      </span>
                    </SelectItem>
                    <SelectItem value="Submitted">
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Form Submitted
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Registration Form Data Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Job Details
                </h3>
                {!isEditingJobDetails && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingJobDetails(true)} className="text-xs">
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>
              <div className="rounded-xl border border-border bg-muted/50 p-4">
                {isEditingJobDetails ? (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Job Roles</Label>
                      <Input
                        value={jobDetailsForm.job_roles}
                        onChange={(e) => setJobDetailsForm({ ...jobDetailsForm, job_roles: e.target.value })}
                        placeholder="e.g., Software Engineer, Data Analyst"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Package Offered</Label>
                      <Input
                        value={jobDetailsForm.package_offered}
                        onChange={(e) => setJobDetailsForm({ ...jobDetailsForm, package_offered: e.target.value })}
                        placeholder="e.g., 6-8 LPA"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Eligibility Criteria</Label>
                      <Textarea
                        value={jobDetailsForm.eligibility_criteria}
                        onChange={(e) => setJobDetailsForm({ ...jobDetailsForm, eligibility_criteria: e.target.value })}
                        placeholder="e.g., Min 7.0 CGPA, CS/IT branches only"
                        className="min-h-[60px]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Job Location</Label>
                      <Input
                        value={jobDetailsForm.job_location}
                        onChange={(e) => setJobDetailsForm({ ...jobDetailsForm, job_location: e.target.value })}
                        placeholder="e.g., Pune, Bangalore"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Bond Details</Label>
                      <Input
                        value={jobDetailsForm.bond_details}
                        onChange={(e) => setJobDetailsForm({ ...jobDetailsForm, bond_details: e.target.value })}
                        placeholder="e.g., 2 year service agreement"
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Selection Process</Label>
                      <Textarea
                        value={jobDetailsForm.selection_process}
                        onChange={(e) => setJobDetailsForm({ ...jobDetailsForm, selection_process: e.target.value })}
                        placeholder="e.g., Online Test → Technical Interview → HR"
                        className="min-h-[60px]"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={handleSaveJobDetails} disabled={updateCompany.isPending}>
                        {updateCompany.isPending ? "Saving..." : "Save"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => {
                        setJobDetailsForm({
                          job_roles: company.job_roles || "",
                          package_offered: company.package_offered || "",
                          eligibility_criteria: company.eligibility_criteria || "",
                          bond_details: company.bond_details || "",
                          job_location: company.job_location || "",
                          selection_process: company.selection_process || "",
                        });
                        setIsEditingJobDetails(false);
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : company.registration_status === "Submitted" ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-success mb-3">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Data Available</span>
                    </div>
                    
                    {company.job_roles && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <Briefcase className="h-3 w-3" />
                          Job Roles
                        </div>
                        <p className="text-sm text-card-foreground">{company.job_roles}</p>
                      </div>
                    )}
                    
                    {company.package_offered && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <FileCheck className="h-3 w-3" />
                          Package Offered
                        </div>
                        <p className="text-sm text-card-foreground">{company.package_offered}</p>
                      </div>
                    )}
                    
                    {company.eligibility_criteria && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <GraduationCap className="h-3 w-3" />
                          Eligibility Criteria
                        </div>
                        <p className="text-sm text-card-foreground">{company.eligibility_criteria}</p>
                      </div>
                    )}
                    
                    {company.job_location && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          Location
                        </div>
                        <p className="text-sm text-card-foreground">{company.job_location}</p>
                      </div>
                    )}
                    
                    {company.bond_details && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          Bond Details
                        </div>
                        <p className="text-sm text-card-foreground">{company.bond_details}</p>
                      </div>
                    )}
                    
                    {company.selection_process && (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                          Selection Process
                        </div>
                        <p className="text-sm text-card-foreground">{company.selection_process}</p>
                      </div>
                    )}
                    
                    <div className="pt-2 border-t border-border">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={extractFormData.isPending}
                      >
                        {extractFormData.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            Extracting...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-1" />
                            Re-extract from PDF
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-warning">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">No Job Details</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Upload a PDF or click Edit to add job details manually.</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={extractFormData.isPending}
                    >
                      {extractFormData.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-1" />
                          Upload & Extract PDF
                        </>
                      )}
                    </Button>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".pdf"
                  className="hidden"
                />
              </div>
            </div>

            {/* POC Section */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Point of Contact & HR</h3>
                {!isEditingDetails && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingDetails(true)} className="text-xs">
                    <Pencil className="h-3 w-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {isEditingDetails ? (
                <div className="space-y-4 p-4 border border-border rounded-xl bg-muted/30">
                  {/* POC Fields */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="space-y-1">
                      <Label className="text-xs">1st POC</Label>
                      <Select value={editForm.poc_1st} onValueChange={(v) => setEditForm({ ...editForm, poc_1st: v })}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {POC_OPTIONS.map((poc) => (
                            <SelectItem key={poc} value={poc}>{poc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">2nd POC</Label>
                      <Select value={editForm.poc_2nd} onValueChange={(v) => setEditForm({ ...editForm, poc_2nd: v })}>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {POC_OPTIONS.filter(p => p !== editForm.poc_1st).map((poc) => (
                            <SelectItem key={poc} value={poc}>{poc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* HR Fields */}
                  <div className="space-y-1">
                    <Label className="text-xs">HR Name</Label>
                    <Input
                      value={editForm.hr_name}
                      onChange={(e) => setEditForm({ ...editForm, hr_name: e.target.value })}
                      placeholder="Contact name"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">HR Phone</Label>
                    <Input
                      value={editForm.hr_phone}
                      onChange={(e) => setEditForm({ ...editForm, hr_phone: e.target.value })}
                      placeholder="Phone number"
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">HR Email</Label>
                    <Input
                      type="email"
                      value={editForm.hr_email}
                      onChange={(e) => setEditForm({ ...editForm, hr_email: e.target.value })}
                      placeholder="email@company.com"
                      className="h-9"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" onClick={handleSaveDetails} disabled={updateCompany.isPending}>
                      {updateCompany.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => {
                      setEditForm({
                        hr_name: company.hr_name || "",
                        hr_phone: company.hr_phone || "",
                        hr_email: company.hr_email || "",
                        poc_1st: company.poc_1st,
                        poc_2nd: company.poc_2nd || "",
                      });
                      setIsEditingDetails(false);
                    }}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="rounded-xl border border-border bg-muted/50 p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-primary" />
                      <span className="text-xs font-medium text-primary uppercase">1st POC</span>
                    </div>
                    <p className="text-card-foreground font-medium">{company.poc_1st}</p>
                  </div>
                  {company.poc_2nd && (
                    <div className="rounded-xl border border-border bg-muted/50 p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase">2nd POC</span>
                      </div>
                      <p className="text-card-foreground">{company.poc_2nd}</p>
                    </div>
                  )}
                  {(company.hr_name || company.hr_phone || company.hr_email) && (
                    <div className="rounded-xl border border-border bg-muted/50 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-muted-foreground uppercase">HR Contact</span>
                      </div>
                      {company.hr_name && (
                        <p className="text-base font-medium text-card-foreground">{company.hr_name}</p>
                      )}
                      <div className="space-y-1 mt-2">
                        {company.hr_phone && (
                          <a href={`tel:${company.hr_phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                            <Phone className="h-3 w-3" />
                            {company.hr_phone}
                          </a>
                        )}
                        {company.hr_email && (
                          <a href={`mailto:${company.hr_email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                            <Mail className="h-3 w-3" />
                            {company.hr_email}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                  {!company.hr_name && !company.hr_phone && !company.hr_email && (
                    <p className="text-sm text-muted-foreground italic">No HR contact added. Click Edit to add.</p>
                  )}
                </div>
              )}
            </div>

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

            {/* Actions Section */}
            <div className="mb-6">
              <h3 className="mb-3 text-sm font-medium text-muted-foreground uppercase tracking-wide">Actions</h3>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddTaskModal(true)}
                  className="text-primary border-primary/30 hover:bg-primary/10"
                >
                  <CalendarPlus className="h-4 w-4 mr-1" />
                  Add Follow-up
                </Button>
                {company.status !== "Blacklisted" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowBlacklistDialog(true)}
                    className="text-warning border-warning/30 hover:bg-warning/10"
                  >
                    <Ban className="h-4 w-4 mr-1" />
                    Blacklist
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-border p-6">
            <Button
              onClick={handleSendEmail}
              className={`w-full gap-2 rounded-xl py-6 text-base ${
                company.hr_email 
                  ? "bg-primary hover:bg-primary/90" 
                  : "bg-muted text-muted-foreground"
              }`}
              size="lg"
              disabled={!company.hr_email}
            >
              <Send className="h-5 w-5" />
              {company.hr_email ? `Email ${company.hr_name || 'HR'}` : "No Email Available"}
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Company</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{company.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCompany}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteCompany.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Blacklist Dialog */}
      <AlertDialog open={showBlacklistDialog} onOpenChange={setShowBlacklistDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Blacklist Company</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for blacklisting <strong>{company.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Textarea
            value={blacklistReason}
            onChange={(e) => setBlacklistReason(e.target.value)}
            placeholder="Enter reason for blacklisting..."
            className="min-h-[80px] mt-2"
          />
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setBlacklistReason("")}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlacklistCompany}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
              disabled={!blacklistReason.trim()}
            >
              {blacklistCompany.isPending ? "Blacklisting..." : "Blacklist"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Email Confirmation Dialog */}
      <AlertDialog open={showEmailConfirmDialog} onOpenChange={setShowEmailConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Email</AlertDialogTitle>
            <AlertDialogDescription>
              Send email to <strong>{company.hr_email}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSendEmail}>
              Send Email
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showAddTaskModal}
        onClose={() => setShowAddTaskModal(false)}
        preselectedCompanyId={company.id}
      />
    </>
  );
}
