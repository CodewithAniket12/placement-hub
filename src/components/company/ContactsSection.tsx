import { useState } from "react";
import { 
  useCompanyContacts, 
  useCreateCompanyContact, 
  useUpdateCompanyContact, 
  useDeleteCompanyContact,
  useSetPrimaryContact,
  CompanyContact 
} from "@/hooks/useCompanyContacts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  UserPlus, 
  Pencil, 
  Trash2, 
  Star, 
  StarOff,
  X,
  Check,
  Loader2,
  Users
} from "lucide-react";
import { toast } from "sonner";
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

interface ContactsSectionProps {
  companyId: string;
}

interface ContactFormData {
  name: string;
  designation: string;
  phone: string;
  email: string;
}

const emptyForm: ContactFormData = {
  name: "",
  designation: "",
  phone: "",
  email: "",
};

export function ContactsSection({ companyId }: ContactsSectionProps) {
  const { data: contacts, isLoading } = useCompanyContacts(companyId);
  const createContact = useCreateCompanyContact();
  const updateContact = useUpdateCompanyContact();
  const deleteContact = useDeleteCompanyContact();
  const setPrimary = useSetPrimaryContact();

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ContactFormData>(emptyForm);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      await createContact.mutateAsync({
        company_id: companyId,
        name: form.name.trim(),
        designation: form.designation.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
        is_primary: contacts?.length === 0, // First contact is primary
      });
      toast.success("Contact added");
      setForm(emptyForm);
      setIsAdding(false);
    } catch (error) {
      toast.error("Failed to add contact");
    }
  };

  const handleUpdate = async (contact: CompanyContact) => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      await updateContact.mutateAsync({
        id: contact.id,
        company_id: companyId,
        name: form.name.trim(),
        designation: form.designation.trim() || null,
        phone: form.phone.trim() || null,
        email: form.email.trim() || null,
      });
      toast.success("Contact updated");
      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      toast.error("Failed to update contact");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteContact.mutateAsync({ id, company_id: companyId });
      toast.success("Contact deleted");
      setDeleteConfirm(null);
    } catch (error) {
      toast.error("Failed to delete contact");
    }
  };

  const handleSetPrimary = async (id: string) => {
    try {
      await setPrimary.mutateAsync({ id, company_id: companyId });
      toast.success("Primary contact updated");
    } catch (error) {
      toast.error("Failed to set primary contact");
    }
  };

  const startEdit = (contact: CompanyContact) => {
    setEditingId(contact.id);
    setForm({
      name: contact.name,
      designation: contact.designation || "",
      phone: contact.phone || "",
      email: contact.email || "",
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setForm(emptyForm);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
          <Users className="h-4 w-4" />
          Contacts ({contacts?.length || 0})
        </h3>
        {!isAdding && !editingId && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => {
              setIsAdding(true);
              setForm(emptyForm);
            }}
            className="text-xs"
          >
            <UserPlus className="h-3 w-3 mr-1" />
            Add
          </Button>
        )}
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Name *</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Contact name"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Designation</Label>
              <Input
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                placeholder="e.g., HR Manager"
                className="h-9"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs">Phone</Label>
              <Input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Phone number"
                className="h-9"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@company.com"
                className="h-9"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button size="sm" onClick={handleAdd} disabled={createContact.isPending}>
              {createContact.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={cancelEdit}>
              <X className="h-3 w-3 mr-1" />
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Contacts List */}
      <div className="space-y-2">
        {contacts?.length === 0 && !isAdding && (
          <p className="text-sm text-muted-foreground italic text-center py-4">
            No contacts added yet
          </p>
        )}

        {contacts?.map((contact) => (
          <div 
            key={contact.id} 
            className="rounded-xl border border-border bg-muted/50 p-4"
          >
            {editingId === contact.id ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Name *</Label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Designation</Label>
                    <Input
                      value={form.designation}
                      onChange={(e) => setForm({ ...form, designation: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Phone</Label>
                    <Input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="h-9"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Email</Label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-9"
                    />
                  </div>
                </div>
                <div className="flex gap-2 pt-1">
                  <Button size="sm" onClick={() => handleUpdate(contact)} disabled={updateContact.isPending}>
                    {updateContact.isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3 mr-1" />}
                    Save
                  </Button>
                  <Button size="sm" variant="outline" onClick={cancelEdit}>
                    <X className="h-3 w-3 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-card-foreground">{contact.name}</span>
                    {contact.is_primary && (
                      <Badge className="bg-primary/10 text-primary border-0 text-xs">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Primary
                      </Badge>
                    )}
                  </div>
                  {contact.designation && (
                    <p className="text-sm text-muted-foreground mb-2">{contact.designation}</p>
                  )}
                  <div className="space-y-1">
                    {contact.phone && (
                      <a href={`tel:${contact.phone}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                        <Phone className="h-3 w-3" />
                        {contact.phone}
                      </a>
                    )}
                    {contact.email && (
                      <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                        <Mail className="h-3 w-3" />
                        {contact.email}
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  {!contact.is_primary && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary"
                      onClick={() => handleSetPrimary(contact.id)}
                      title="Set as primary"
                    >
                      <StarOff className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => startEdit(contact)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => setDeleteConfirm(contact.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Contact?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The contact will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
