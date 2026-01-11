import { useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateDateRequest } from "@/hooks/useDateRequests";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";
import { format } from "date-fns";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BlockedDateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
  requestedDate: Date;
  blockedReason: string;
}

export function BlockedDateRequestModal({ 
  isOpen, 
  onClose, 
  companyId,
  companyName,
  requestedDate,
  blockedReason 
}: BlockedDateRequestModalProps) {
  const { profile } = useAuth();
  const createDateRequest = useCreateDateRequest();
  
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!description.trim() || !profile?.display_name) {
      toast.error("Please provide a justification");
      return;
    }

    try {
      await createDateRequest.mutateAsync({
        requested_date: format(requestedDate, "yyyy-MM-dd"),
        company_id: companyId,
        coordinator_name: profile.display_name,
        description,
      });
      
      toast.success("Request submitted for admin approval");
      handleClose();
    } catch (error) {
      toast.error("Failed to submit request");
    }
  };

  const handleClose = () => {
    setDescription("");
    onClose();
  };

  const modalContent = (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] z-[100]">
        <DialogHeader>
          <DialogTitle>Request Blocked Date</DialogTitle>
          <DialogDescription>
            This date falls within a blocked period. Submit a request for admin approval.
          </DialogDescription>
        </DialogHeader>
        
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Blocked Period:</strong> {blockedReason}
          </AlertDescription>
        </Alert>

        <div className="bg-muted rounded-lg p-3 space-y-1 text-sm">
          <p><span className="text-muted-foreground">Company:</span> <strong>{companyName}</strong></p>
          <p><span className="text-muted-foreground">Requested Date:</span> <strong>{format(requestedDate, "EEEE, MMMM d, yyyy")}</strong></p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Why do you need this date? *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain why this specific date is necessary and cannot be rescheduled..."
              rows={4}
              required
            />
            <p className="text-xs text-muted-foreground">
              The admin will review your justification before approving or rejecting.
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDateRequest.isPending}>
              {createDateRequest.isPending ? "Submitting..." : "Submit Request"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return createPortal(modalContent, document.body);
}
