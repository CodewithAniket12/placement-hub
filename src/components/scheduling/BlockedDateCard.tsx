import { BlockedDate, useDeleteBlockedDate } from "@/hooks/useBlockedDates";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarX, Trash2 } from "lucide-react";
import { format, parseISO, isPast } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BlockedDateCardProps {
  blockedDate: BlockedDate;
}

export function BlockedDateCard({ blockedDate }: BlockedDateCardProps) {
  const deleteBlockedDate = useDeleteBlockedDate();
  
  const startDate = parseISO(blockedDate.start_date);
  const endDate = parseISO(blockedDate.end_date);
  const isExpired = isPast(endDate);

  const handleDelete = async () => {
    try {
      await deleteBlockedDate.mutateAsync(blockedDate.id);
      toast.success("Blocked date removed");
    } catch (error) {
      toast.error("Failed to remove blocked date");
    }
  };

  return (
    <Card className={cn(
      "transition-all hover:shadow-md",
      isExpired && "opacity-60"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <CalendarX className="h-5 w-5 text-destructive" />
            </div>
            
            <div>
              <h3 className="font-medium text-foreground">
                {blockedDate.reason}
              </h3>
              
              <p className="text-sm text-muted-foreground mt-1">
                {format(startDate, "MMM d, yyyy")} — {format(endDate, "MMM d, yyyy")}
              </p>
              
              <div className="flex items-center gap-2 mt-2">
                <Badge variant={isExpired ? "secondary" : "destructive"}>
                  {isExpired ? "Expired" : "Active"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Created by {blockedDate.created_by}
                </span>
              </div>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={deleteBlockedDate.isPending}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
