import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBlockedDates } from "@/hooks/useBlockedDates";
import { useDateRequests } from "@/hooks/useDateRequests";
import { BlockedDateCard } from "@/components/scheduling/BlockedDateCard";
import { DateRequestCard } from "@/components/scheduling/DateRequestCard";
import { AddBlockedDateModal } from "@/components/scheduling/AddBlockedDateModal";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, CalendarX, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Tasks() {
  const { isAdmin } = useAuth();
  const { data: blockedDates, isLoading: loadingBlocked } = useBlockedDates();
  const { data: dateRequests, isLoading: loadingRequests } = useDateRequests();
  
  const [isAddBlockedModalOpen, setIsAddBlockedModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");

  const pendingRequests = dateRequests?.filter(r => r.status === "pending") || [];
  const approvedRequests = dateRequests?.filter(r => r.status === "approved") || [];
  const rejectedRequests = dateRequests?.filter(r => r.status === "rejected") || [];

  const filteredRequests = 
    activeTab === "pending" ? pendingRequests :
    activeTab === "approved" ? approvedRequests :
    activeTab === "rejected" ? rejectedRequests :
    dateRequests;

  const isLoading = loadingBlocked || loadingRequests;

  // Only admins can access this page now - coordinators request via company scheduling
  if (!isAdmin) {
    return (
      <div className="text-center py-12">
        <CalendarX className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
        <h2 className="text-xl font-semibold mb-2">Admin Only</h2>
        <p className="text-muted-foreground">
          This page is for admins to manage blocked dates and approve special requests.
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          To request a date during a blocked period, go to the company page and schedule a drive.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Scheduling</h1>
          <p className="text-muted-foreground mt-1">
            Manage blocked dates and approve special date requests
          </p>
        </div>
        <Button onClick={() => setIsAddBlockedModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Block Dates
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-destructive/10">
              <CalendarX className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{blockedDates?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Blocked Periods</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-yellow-500/10">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{pendingRequests.length}</p>
              <p className="text-sm text-muted-foreground">Pending Requests</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{approvedRequests.length}</p>
              <p className="text-sm text-muted-foreground">Approved</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-500/10">
              <XCircle className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{rejectedRequests.length}</p>
              <p className="text-sm text-muted-foreground">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Blocked Dates Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Blocked Date Ranges</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Coordinators cannot schedule drives during these periods without your approval.
        </p>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : blockedDates?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg">
            <CalendarX className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No blocked dates</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setIsAddBlockedModalOpen(true)}
            >
              Block a date range
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {blockedDates?.map((blocked) => (
              <BlockedDateCard key={blocked.id} blockedDate={blocked} />
            ))}
          </div>
        )}
      </div>

      {/* Date Requests Section */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Special Date Requests</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Requests from coordinators who need to schedule drives during blocked periods.
        </p>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingRequests.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedRequests.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedRequests.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value={activeTab} className="mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : filteredRequests?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/50 rounded-lg">
                <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No {activeTab} requests</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests?.map((request) => (
                  <DateRequestCard key={request.id} request={request} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <AddBlockedDateModal 
        isOpen={isAddBlockedModalOpen} 
        onClose={() => setIsAddBlockedModalOpen(false)} 
      />
    </div>
  );
}
