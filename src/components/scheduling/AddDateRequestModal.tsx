import { useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateDateRequest } from "@/hooks/useDateRequests";
import { useBlockedDates } from "@/hooks/useBlockedDates";
import { useCompanies } from "@/hooks/useCompanies";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CalendarIcon, AlertTriangle } from "lucide-react";
import { format, isWithinInterval, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AddDateRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddDateRequestModal({ isOpen, onClose }: AddDateRequestModalProps) {
  const { profile } = useAuth();
  const { data: companies } = useCompanies();
  const { data: blockedDates } = useBlockedDates();
  const createDateRequest = useCreateDateRequest();
  
  const [requestedDate, setRequestedDate] = useState<Date>();
  const [companyId, setCompanyId] = useState("");
  const [description, setDescription] = useState("");

  // Check if selected date falls within a blocked period
  const getBlockedDateConflict = () => {
    if (!requestedDate || !blockedDates) return null;
    
    return blockedDates.find(blocked => 
      isWithinInterval(requestedDate, {
        start: parseISO(blocked.start_date),
        end: parseISO(blocked.end_date)
      })
    );
  };

  const blockedConflict = getBlockedDateConflict();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!requestedDate || !companyId || !description || !profile?.display_name) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await createDateRequest.mutateAsync({
        requested_date: format(requestedDate, "yyyy-MM-dd"),
        company_id: companyId === "none" ? null : companyId,
        coordinator_name: profile.display_name,
        description,
      });
      
      toast.success("Date request submitted for approval");
      handleClose();
    } catch (error) {
      toast.error("Failed to submit date request");
    }
  };

  const handleClose = () => {
    setRequestedDate(undefined);
    setCompanyId("");
    setDescription("");
    onClose();
  };

  // Disable blocked dates in the calendar
  const isDateBlocked = (date: Date) => {
    if (!blockedDates) return false;
    return blockedDates.some(blocked => 
      isWithinInterval(date, {
        start: parseISO(blocked.start_date),
        end: parseISO(blocked.end_date)
      })
    );
  };

  const modalContent = (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] z-[100]">
        <DialogHeader>
          <DialogTitle>Request Drive Date</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Company *</Label>
            <Select value={companyId} onValueChange={setCompanyId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent className="z-[110]">
                {companies?.map((company) => (
                  <SelectItem key={company.id} value={company.id}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Requested Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !requestedDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {requestedDate ? format(requestedDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[110]" align="start">
                <Calendar
                  mode="single"
                  selected={requestedDate}
                  onSelect={setRequestedDate}
                  disabled={isDateBlocked}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          {blockedConflict && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This date falls within a blocked period: <strong>{blockedConflict.reason}</strong> ({format(parseISO(blockedConflict.start_date), "MMM d")} - {format(parseISO(blockedConflict.end_date), "MMM d")})
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="description">Justification *</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explain why this date is needed and any important details for the admin..."
              rows={4}
              required
            />
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
