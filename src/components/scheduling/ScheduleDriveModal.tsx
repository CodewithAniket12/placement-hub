import { useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCampusDrive, useCampusDrives } from "@/hooks/useCampusDrives";
import { useBlockedDates } from "@/hooks/useBlockedDates";
import { BlockedDateRequestModal } from "@/components/scheduling/BlockedDateRequestModal";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CalendarIcon, AlertTriangle, Lock } from "lucide-react";
import { format, isWithinInterval, parseISO, isSameDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScheduleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  companyId: string;
  companyName: string;
}

export function ScheduleDriveModal({ isOpen, onClose, companyId, companyName }: ScheduleDriveModalProps) {
  const { profile } = useAuth();
  const createDrive = useCreateCampusDrive();
  const { data: blockedDates } = useBlockedDates();
  const { data: allDrives } = useCampusDrives();
  
  const [driveDate, setDriveDate] = useState<Date>();
  const [driveTime, setDriveTime] = useState("");
  const [venue, setVenue] = useState("");
  const [notes, setNotes] = useState("");
  const [showBlockedRequestModal, setShowBlockedRequestModal] = useState(false);

  // Get all scheduled/locked drives (excluding current company)
  const scheduledDrives = allDrives?.filter(d => 
    d.status === "scheduled" && d.company_id !== companyId
  ) || [];

  // Check if selected date falls within a blocked period
  const getBlockedDateConflict = (date: Date | undefined) => {
    if (!date || !blockedDates) return null;
    
    return blockedDates.find(blocked => 
      isWithinInterval(date, {
        start: parseISO(blocked.start_date),
        end: parseISO(blocked.end_date)
      })
    );
  };

  // Check if a date is already locked by another POC
  const getLockedDriveConflict = (date: Date | undefined) => {
    if (!date || !scheduledDrives) return null;
    
    return scheduledDrives.find(drive => 
      isSameDay(parseISO(drive.drive_date), date)
    );
  };

  const blockedConflict = getBlockedDateConflict(driveDate);
  const lockedConflict = getLockedDriveConflict(driveDate);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!driveDate || !profile?.display_name) {
      toast.error("Please select a date");
      return;
    }

    // If date is locked by another POC, show error
    if (lockedConflict) {
      toast.error(`This date is already locked by ${lockedConflict.coordinator_name}`);
      return;
    }

    // If date is blocked, show request modal instead
    if (blockedConflict) {
      setShowBlockedRequestModal(true);
      return;
    }

    try {
      await createDrive.mutateAsync({
        company_id: companyId,
        coordinator_name: profile.display_name,
        drive_date: format(driveDate, "yyyy-MM-dd"),
        drive_time: driveTime || null,
        venue: venue || null,
        notes: notes || null,
        min_cgpa: null,
        eligible_branches: null,
        registered_count: 0,
        appeared_count: 0,
        selected_count: 0,
        status: "scheduled",
      });
      
      toast.success("Drive scheduled and date locked successfully");
      handleClose();
    } catch (error) {
      toast.error("Failed to schedule drive");
    }
  };

  const handleClose = () => {
    setDriveDate(undefined);
    setDriveTime("");
    setVenue("");
    setNotes("");
    onClose();
  };

  // Check if a date is blocked (for calendar highlighting)
  const isDateBlocked = (date: Date) => {
    if (!blockedDates) return false;
    return blockedDates.some(blocked => 
      isWithinInterval(date, {
        start: parseISO(blocked.start_date),
        end: parseISO(blocked.end_date)
      })
    );
  };

  // Check if a date is already locked by another POC
  const isDateLocked = (date: Date) => {
    if (!scheduledDrives) return false;
    return scheduledDrives.some(drive => 
      isSameDay(parseISO(drive.drive_date), date)
    );
  };

  const modalContent = (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] z-[100]">
        <DialogHeader>
          <DialogTitle>Schedule Campus Drive</DialogTitle>
          <DialogDescription>
            Schedule a drive for {companyName}. The selected date will be locked.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Drive Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  type="button"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !driveDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {driveDate ? format(driveDate, "EEEE, MMMM d, yyyy") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 z-[110]" align="start">
                <Calendar
                  mode="single"
                  selected={driveDate}
                  onSelect={setDriveDate}
                  modifiers={{
                    blocked: isDateBlocked,
                    locked: isDateLocked,
                  }}
                  modifiersStyles={{
                    blocked: { backgroundColor: 'hsl(var(--destructive) / 0.1)', color: 'hsl(var(--destructive))' },
                    locked: { backgroundColor: 'hsl(var(--primary) / 0.2)', color: 'hsl(var(--primary))', fontWeight: 'bold' }
                  }}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
                <div className="px-3 pb-3 text-xs text-muted-foreground space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-destructive/10 border border-destructive/30" />
                    <span>Blocked period (needs admin approval)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-primary/20 border border-primary/30" />
                    <span>Already locked by another POC</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {blockedConflict && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This date is in a blocked period: <strong>{blockedConflict.reason}</strong>. 
                You'll need admin approval to schedule on this date.
              </AlertDescription>
            </Alert>
          )}

          {lockedConflict && (
            <Alert>
              <Lock className="h-4 w-4" />
              <AlertDescription>
                This date is already locked by <strong>{lockedConflict.coordinator_name}</strong> for <strong>{lockedConflict.company?.name || "a company"}</strong>.
                Please choose another date.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Time (Optional)</Label>
              <Input
                type="time"
                value={driveTime}
                onChange={(e) => setDriveTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Venue (Optional)</Label>
              <Input
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="e.g., Seminar Hall"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any additional details..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createDrive.isPending || !!lockedConflict}
            >
              {blockedConflict 
                ? "Request Approval" 
                : createDrive.isPending 
                  ? "Scheduling..." 
                  : "Lock Date & Schedule"
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );

  return (
    <>
      {createPortal(modalContent, document.body)}
      
      {driveDate && blockedConflict && (
        <BlockedDateRequestModal
          isOpen={showBlockedRequestModal}
          onClose={() => {
            setShowBlockedRequestModal(false);
            handleClose();
          }}
          companyId={companyId}
          companyName={companyName}
          requestedDate={driveDate}
          blockedReason={blockedConflict.reason}
        />
      )}
    </>
  );
}
