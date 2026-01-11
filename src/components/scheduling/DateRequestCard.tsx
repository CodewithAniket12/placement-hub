import { useState } from "react";
import { DateRequest, useUpdateDateRequest } from "@/hooks/useDateRequests";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Building2, CheckCircle, XCircle, Clock, User } from "lucide-react";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";

interface DateRequestCardProps {
  request: DateRequest;
}

export function DateRequestCard({ request }: DateRequestCardProps) {
  const { isAdmin } = useAuth();
  const updateRequest = useUpdateDateRequest();
  const [showResponse, setShowResponse] = useState(false);
  const [adminResponse, setAdminResponse] = useState("");
  
  const requestedDate = parseISO(request.requested_date);

  const handleApprove = async () => {
    try {
      await updateRequest.mutateAsync({
        id: request.id,
        status: "approved",
        admin_response: adminResponse || null,
        responded_at: new Date().toISOString(),
      });
      toast.success("Request approved");
      setShowResponse(false);
      setAdminResponse("");
    } catch (error) {
      toast.error("Failed to approve request");
    }
  };

  const handleReject = async () => {
    if (!adminResponse.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }
    try {
      await updateRequest.mutateAsync({
        id: request.id,
        status: "rejected",
        admin_response: adminResponse,
        responded_at: new Date().toISOString(),
      });
      toast.success("Request rejected");
      setShowResponse(false);
      setAdminResponse("");
    } catch (error) {
      toast.error("Failed to reject request");
    }
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  };

  const statusIcons = {
    pending: Clock,
    approved: CheckCircle,
    rejected: XCircle,
  };

  const StatusIcon = statusIcons[request.status];

  return (
    <Card className="transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className={cn(
            "p-2 rounded-full",
            request.status === "pending" && "bg-yellow-500/10",
            request.status === "approved" && "bg-green-500/10",
            request.status === "rejected" && "bg-red-500/10"
          )}>
            <StatusIcon className={cn(
              "h-5 w-5",
              request.status === "pending" && "text-yellow-500",
              request.status === "approved" && "text-green-500",
              request.status === "rejected" && "text-red-500"
            )} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  {request.company && (
                    <Badge variant="outline">
                      <Building2 className="h-3 w-3 mr-1" />
                      {request.company.name}
                    </Badge>
                  )}
                  <Badge className={statusColors[request.status]}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="font-medium text-foreground">
                    {format(requestedDate, "EEEE, MMMM d, yyyy")}
                  </span>
                </div>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-2">
              {request.description}
            </p>
            
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <User className="h-3 w-3" />
              Requested by {request.coordinator_name} on {format(parseISO(request.created_at), "MMM d, yyyy")}
            </div>

            {request.admin_response && (
              <div className={cn(
                "mt-3 p-3 rounded-lg text-sm",
                request.status === "approved" ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"
              )}>
                <p className="font-medium text-xs uppercase tracking-wide mb-1">
                  Admin Response
                </p>
                <p>{request.admin_response}</p>
              </div>
            )}

            {isAdmin && request.status === "pending" && (
              <div className="mt-4">
                {showResponse ? (
                  <div className="space-y-3">
                    <Textarea
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      placeholder="Add a response (required for rejection)..."
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleApprove}
                        disabled={updateRequest.isPending}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleReject}
                        disabled={updateRequest.isPending}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowResponse(false);
                          setAdminResponse("");
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowResponse(true)}
                  >
                    Respond to Request
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
