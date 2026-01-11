import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Building2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useCreateCompany } from "@/hooks/useCompanies";

interface AddCompanyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POC_OPTIONS = ["Aniket", "Rushikesh", "Priya", "Bajrang", "Manasi", "Parshuram"];

export function AddCompanyModal({ isOpen, onClose }: AddCompanyModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    website: "",
    contact_type: "HR" as "HR" | "Alumni" | "Other",
    custom_designation: "",
    hr_name: "",
    hr_phone: "",
    hr_email: "",
    poc_1st: "Aniket",
    poc_2nd: "",
    notes: "",
    status: "Active" as "Active" | "Blacklisted",
    registration_status: "Pending" as "Submitted" | "Pending",
  });

  const createCompany = useCreateCompany();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({ title: "Company name is required", variant: "destructive" });
      return;
    }
    if (!formData.poc_1st) {
      toast({ title: "1st POC is required", variant: "destructive" });
      return;
    }

    try {
      await createCompany.mutateAsync({
        name: formData.name.trim(),
        industry: formData.industry.trim() || null,
        website: formData.website.trim() || null,
        hr_name: formData.hr_name.trim() || null,
        hr_phone: formData.hr_phone.trim() || null,
        hr_email: formData.hr_email.trim() || null,
        poc_1st: formData.poc_1st,
        poc_2nd: formData.poc_2nd || null,
        notes: formData.notes.trim() || null,
        status: formData.status,
        registration_status: formData.registration_status,
        job_roles: null,
        package_offered: null,
        eligibility_criteria: null,
        bond_details: null,
        job_location: null,
        selection_process: null,
      });

      toast({ title: "Company added successfully!" });
      onClose();
      setFormData({
        name: "",
        industry: "",
        website: "",
        contact_type: "HR",
        custom_designation: "",
        hr_name: "",
        hr_phone: "",
        hr_email: "",
        poc_1st: "Aniket",
        poc_2nd: "",
        notes: "",
        status: "Active",
        registration_status: "Pending",
      });
    } catch (error) {
      toast({ title: "Failed to add company", variant: "destructive" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Add New Company
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Company Name */}
          <div className="space-y-2">
            <Label>Company Name *</Label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter company name"
            />
          </div>

          {/* Industry */}
          <div className="space-y-2">
            <Label>Industry</Label>
            <Input
              value={formData.industry}
              onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
              placeholder="e.g., Technology, Finance"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label>Website</Label>
            <Input
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              placeholder="https://example.com"
            />
          </div>

          {/* Contact Details */}
          <div className="p-4 bg-muted/50 rounded-lg space-y-4">
            <h4 className="font-medium text-sm">Contact Details</h4>
            
            {/* Contact Type Selection */}
            <div className="space-y-2">
              <Label>Contact Type</Label>
              <Select 
                value={formData.contact_type} 
                onValueChange={(v: "HR" | "Alumni" | "Other") => setFormData({ ...formData, contact_type: v, custom_designation: "" })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Alumni">Alumni</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Custom Designation (only for "Other") */}
            {formData.contact_type === "Other" && (
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input
                  value={formData.custom_designation}
                  onChange={(e) => setFormData({ ...formData, custom_designation: e.target.value })}
                  placeholder="e.g., Manager, Director, Recruiter"
                />
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Contact Name</Label>
                <Input
                  value={formData.hr_name}
                  onChange={(e) => setFormData({ ...formData, hr_name: e.target.value })}
                  placeholder="Contact person name"
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={formData.hr_phone}
                  onChange={(e) => setFormData({ ...formData, hr_phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={formData.hr_email}
                onChange={(e) => setFormData({ ...formData, hr_email: e.target.value })}
                placeholder="email@company.com"
              />
            </div>
          </div>

          {/* POC Selection */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>1st POC (Primary) *</Label>
              <Select value={formData.poc_1st} onValueChange={(v) => setFormData({ ...formData, poc_1st: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {POC_OPTIONS.map((poc) => (
                    <SelectItem key={poc} value={poc}>{poc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>2nd POC (Backup)</Label>
              <Select value={formData.poc_2nd || "none"} onValueChange={(v) => setFormData({ ...formData, poc_2nd: v === "none" ? "" : v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select backup POC" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {POC_OPTIONS.filter(p => p !== formData.poc_1st).map((poc) => (
                    <SelectItem key={poc} value={poc}>{poc}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add any notes about this company..."
              className="min-h-[80px]"
            />
          </div>

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={createCompany.isPending}>
            {createCompany.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Adding...
              </>
            ) : (
              "Add Company"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
