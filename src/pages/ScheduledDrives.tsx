import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCampusDrives, useDeleteCampusDrive } from "@/hooks/useCampusDrives";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Calendar, Building2, MapPin, Clock, Trash2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { format, parseISO, isPast, isFuture, isToday } from "date-fns";
import { toast } from "sonner";

export default function ScheduledDrives() {
  const { profile } = useAuth();
  const { data: drives, isLoading } = useCampusDrives();
  const deleteDrive = useDeleteCampusDrive();
  
  const [activeTab, setActiveTab] = useState("upcoming");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedDriveId, setSelectedDriveId] = useState<string | null>(null);

  const coordinatorName = profile?.display_name || "";

  // Filter drives by coordinator name
  const myDrives = drives?.filter(
    (d) => d.company?.name && d.coordinator_name === coordinatorName
  ) || [];

  // Categorize drives
  const upcomingDrives = myDrives.filter((d) => {
    const driveDate = parseISO(d.drive_date);
    return isFuture(driveDate) || isToday(driveDate);
  });

  const pastDrives = myDrives.filter((d) => {
    const driveDate = parseISO(d.drive_date);
    return isPast(driveDate) && !isToday(driveDate);
  });

  const filteredDrives = activeTab === "upcoming" ? upcomingDrives : pastDrives;

  const getStatusBadge = (drive: typeof myDrives[0]) => {
    const driveDate = parseISO(drive.drive_date);
    
    if (drive.status === "cancelled") {
      return <Badge variant="destructive">Cancelled</Badge>;
    }
    if (drive.status === "completed") {
      return <Badge className="bg-green-500">Completed</Badge>;
    }
    if (isToday(driveDate)) {
      return <Badge className="bg-orange-500">Today</Badge>;
    }
    if (isFuture(driveDate)) {
      return <Badge className="bg-blue-500">Scheduled</Badge>;
    }
    return <Badge variant="secondary">Past</Badge>;
  };

  const handleDeleteClick = (driveId: string) => {
    setSelectedDriveId(driveId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedDriveId) return;
    
    try {
      await deleteDrive.mutateAsync(selectedDriveId);
      toast.success("Drive cancelled successfully");
    } catch (error) {
      toast.error("Failed to cancel drive");
    } finally {
      setDeleteDialogOpen(false);
      setSelectedDriveId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Scheduled Drives</h1>
        <p className="text-muted-foreground mt-1">
          View all campus drives scheduled for your assigned companies
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-500/10">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{upcomingDrives.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {pastDrives.filter(d => d.status === "completed").length}
                </p>
                <p className="text-sm text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-muted">
                <Clock className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{myDrives.length}</p>
                <p className="text-sm text-muted-foreground">Total Drives</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Drives Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">
            Upcoming ({upcomingDrives.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            Past ({pastDrives.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
          ) : filteredDrives.length === 0 ? (
            <Card className="bg-muted/50">
              <CardContent className="text-center py-8">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No {activeTab} drives found
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Schedule a drive from the company details panel
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredDrives.map((drive) => (
                <Card key={drive.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-primary/10">
                          <Building2 className="h-6 w-6 text-primary" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">
                            {drive.company?.name || "Unknown Company"}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {format(parseISO(drive.drive_date), "EEEE, MMMM d, yyyy")}
                            </span>
                            {drive.drive_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {drive.drive_time}
                              </span>
                            )}
                          </div>
                          {drive.venue && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <MapPin className="h-4 w-4" />
                              {drive.venue}
                            </div>
                          )}
                          {drive.notes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              "{drive.notes}"
                            </p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {getStatusBadge(drive)}
                        {activeTab === "upcoming" && drive.status !== "cancelled" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                            onClick={() => handleDeleteClick(drive.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Scheduled Drive?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the scheduled drive from the calendar. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Drive</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Cancel Drive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
