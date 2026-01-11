import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanies, useUpdateCompany } from "@/hooks/useCompanies";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users, Building2, UserPlus, Trash2, Eye, Check, X, Clock, ExternalLink, UserCog } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";

interface PendingUser {
  id: string;
  user_id: string;
  username: string;
  display_name: string;
  status: string;
  created_at: string;
}

export default function Admin() {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const updateCompany = useUpdateCompany();
  const queryClient = useQueryClient();
  
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);
  const [selectedPoc1, setSelectedPoc1] = useState<string>("");
  const [selectedPoc2, setSelectedPoc2] = useState<string>("");

  // Fetch pending users
  const { data: pendingUsers = [], isLoading: pendingLoading } = useQuery({
    queryKey: ["pending-users"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("status", ["pending", "rejected"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PendingUser[];
    },
  });

  // Fetch approved coordinators
  const { data: approvedCoordinators = [], isLoading: coordinatorsLoading } = useQuery({
    queryKey: ["approved-coordinators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("status", "approved")
        .order("display_name");

      if (error) throw error;
      return data as PendingUser[];
    },
  });

  // Redirect non-admin users
  if (!authLoading && !isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
        <Button onClick={() => navigate("/dashboard")}>Go to Dashboard</Button>
      </div>
    );
  }

  const handleApproveUser = async (userId: string, profileId: string, displayName: string) => {
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ status: "approved" })
        .eq("id", profileId);

      if (profileError) throw profileError;

      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: userId, role: "coordinator" });

      if (roleError && !roleError.message.includes("duplicate")) throw roleError;

      toast({ title: "Success", description: `${displayName} has been approved` });
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
      queryClient.invalidateQueries({ queryKey: ["approved-coordinators"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleRejectUser = async (profileId: string, displayName: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ status: "rejected" })
        .eq("id", profileId);

      if (error) throw error;

      toast({ title: "User Rejected", description: `${displayName}'s access has been denied` });
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleRemoveCoordinator = async (userId: string, profileId: string, displayName: string) => {
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ status: "rejected" })
        .eq("id", profileId);

      if (profileError) throw profileError;

      const { error: roleError } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId)
        .eq("role", "coordinator");

      if (roleError) throw roleError;

      toast({ title: "Success", description: `${displayName} has been removed` });
      queryClient.invalidateQueries({ queryKey: ["approved-coordinators"] });
      queryClient.invalidateQueries({ queryKey: ["pending-users"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const handleOpenAssignModal = (company: any) => {
    setSelectedCompany(company);
    setSelectedPoc1(company.poc_1st || "");
    setSelectedPoc2(company.poc_2nd || "");
    setAssignModalOpen(true);
  };

  const handleAssignPoc = async () => {
    if (!selectedCompany || !selectedPoc1) {
      toast({ title: "Error", description: "Please select at least the primary POC", variant: "destructive" });
      return;
    }

    try {
      await updateCompany.mutateAsync({
        id: selectedCompany.id,
        poc_1st: selectedPoc1,
        poc_2nd: selectedPoc2 || null,
      });

      toast({ title: "Success", description: `POC assigned to ${selectedCompany.name}` });
      setAssignModalOpen(false);
      setSelectedCompany(null);
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "Blacklisted":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const getRegistrationStatusColor = (status: string) => {
    switch (status) {
      case "Submitted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  const pendingRequests = pendingUsers.filter(u => u.status === "pending");

  // Get coordinator names for POC selection
  const coordinatorNames = approvedCoordinators.map(c => c.display_name);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Manage coordinators and assign companies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Coordinators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedCoordinators.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Companies</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Companies</CardTitle>
            <Building2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.filter((c) => c.status === "Active").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="requests" className="space-y-4">
        <TabsList>
          <TabsTrigger value="requests" className="gap-2">
            <UserPlus className="h-4 w-4" />
            Access Requests
            {pendingRequests.length > 0 && (
              <Badge variant="destructive" className="ml-1">
                {pendingRequests.length}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="coordinators" className="gap-2">
            <Users className="h-4 w-4" />
            Coordinators
          </TabsTrigger>
          <TabsTrigger value="companies" className="gap-2">
            <Building2 className="h-4 w-4" />
            Assign Companies
          </TabsTrigger>
        </TabsList>

        {/* Access Requests Tab */}
        <TabsContent value="requests" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Access Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingLoading ? (
                <p className="text-muted-foreground">Loading requests...</p>
              ) : pendingRequests.length === 0 ? (
                <p className="text-muted-foreground">No pending requests</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Requested On</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingRequests.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.display_name}</TableCell>
                        <TableCell>@{user.username}</TableCell>
                        <TableCell>
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleApproveUser(user.user_id, user.id, user.display_name)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleRejectUser(user.id, user.display_name)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Coordinators Tab */}
        <TabsContent value="coordinators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Coordinators</CardTitle>
            </CardHeader>
            <CardContent>
              {coordinatorsLoading ? (
                <p className="text-muted-foreground">Loading coordinators...</p>
              ) : approvedCoordinators.length === 0 ? (
                <p className="text-muted-foreground">No coordinators found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Companies Assigned</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {approvedCoordinators.map((coord) => {
                      const assignedCompanies = companies.filter(
                        c => c.poc_1st === coord.display_name || c.poc_2nd === coord.display_name
                      ).length;
                      return (
                        <TableRow key={coord.id}>
                          <TableCell className="font-medium">{coord.display_name}</TableCell>
                          <TableCell>@{coord.username}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{assignedCompanies}</Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(coord.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-right">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Remove Coordinator?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to remove {coord.display_name}? They will lose access to the system.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRemoveCoordinator(coord.user_id, coord.id, coord.display_name)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    Remove
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Assign Companies Tab */}
        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assign Companies to Coordinators</CardTitle>
            </CardHeader>
            <CardContent>
              {companiesLoading ? (
                <p className="text-muted-foreground">Loading companies...</p>
              ) : companies.length === 0 ? (
                <p className="text-muted-foreground">No companies found</p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Company</TableHead>
                        <TableHead>Industry</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>POC (Primary)</TableHead>
                        <TableHead>POC (Secondary)</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {companies.map((company) => (
                        <TableRow key={company.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{company.name}</span>
                              {company.website && (
                                <a
                                  href={company.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-muted-foreground hover:text-primary"
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{company.industry || "-"}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(company.status)}>
                              {company.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{company.poc_1st}</Badge>
                          </TableCell>
                          <TableCell>
                            {company.poc_2nd ? (
                              <Badge variant="outline">{company.poc_2nd}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenAssignModal(company)}
                            >
                              <UserCog className="h-4 w-4 mr-1" />
                              Assign POC
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Assign POC Modal */}
      <Dialog open={assignModalOpen} onOpenChange={setAssignModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign POC to {selectedCompany?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Primary POC (Required)</Label>
              <Select value={selectedPoc1} onValueChange={setSelectedPoc1}>
                <SelectTrigger>
                  <SelectValue placeholder="Select primary coordinator" />
                </SelectTrigger>
                <SelectContent>
                  {coordinatorNames.map((name) => (
                    <SelectItem key={name} value={name}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Secondary POC (Optional)</Label>
              <Select value={selectedPoc2} onValueChange={setSelectedPoc2}>
                <SelectTrigger>
                  <SelectValue placeholder="Select secondary coordinator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {coordinatorNames
                    .filter((name) => name !== selectedPoc1)
                    .map((name) => (
                      <SelectItem key={name} value={name}>
                        {name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAssignPoc} disabled={updateCompany.isPending}>
              {updateCompany.isPending ? "Saving..." : "Assign POC"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
