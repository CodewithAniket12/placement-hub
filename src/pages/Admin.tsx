import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCompanies } from "@/hooks/useCompanies";
import { useCoordinators } from "@/hooks/useCoordinators";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  DialogTrigger,
  DialogFooter,
  DialogClose,
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
import { Users, Building2, Plus, Trash2, Eye, Edit, Phone, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

export default function Admin() {
  const { coordinator } = useAuth();
  const navigate = useNavigate();
  const { data: companies = [], isLoading: companiesLoading } = useCompanies();
  const { data: coordinators = [], isLoading: coordinatorsLoading } = useCoordinators();
  const queryClient = useQueryClient();

  const [newCoordinator, setNewCoordinator] = useState({ name: "", phone: "" });
  const [isAddingCoordinator, setIsAddingCoordinator] = useState(false);

  // Redirect non-admin users
  if (coordinator?.name?.toLowerCase() !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
        <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
      </div>
    );
  }

  const handleAddCoordinator = async () => {
    if (!newCoordinator.name.trim() || !newCoordinator.phone.trim()) {
      toast({ title: "Error", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setIsAddingCoordinator(true);
    try {
      const { error } = await supabase.from("coordinators").insert({
        name: newCoordinator.name.trim(),
        phone: newCoordinator.phone.trim(),
      });

      if (error) throw error;

      toast({ title: "Success", description: "Coordinator added successfully" });
      setNewCoordinator({ name: "", phone: "" });
      queryClient.invalidateQueries({ queryKey: ["coordinators"] });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsAddingCoordinator(false);
    }
  };

  const handleDeleteCoordinator = async (id: string, name: string) => {
    try {
      const { error } = await supabase.from("coordinators").delete().eq("id", id);
      if (error) throw error;

      toast({ title: "Success", description: `${name} removed from coordinators` });
      queryClient.invalidateQueries({ queryKey: ["coordinators"] });
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

  // Group companies by coordinator
  const companiesByCoordinator = companies.reduce((acc, company) => {
    const poc = company.poc_1st || "Unassigned";
    if (!acc[poc]) acc[poc] = [];
    acc[poc].push(company);
    return acc;
  }, {} as Record<string, typeof companies>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-muted-foreground mt-1">Manage coordinators and oversee all companies</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Coordinators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{coordinators.length}</div>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Forms Submitted</CardTitle>
            <Building2 className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {companies.filter((c) => c.registration_status === "Submitted").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="coordinators" className="space-y-4">
        <TabsList>
          <TabsTrigger value="coordinators" className="gap-2">
            <Users className="h-4 w-4" />
            Coordinator Management
          </TabsTrigger>
          <TabsTrigger value="companies" className="gap-2">
            <Building2 className="h-4 w-4" />
            Company Oversight
          </TabsTrigger>
        </TabsList>

        {/* Coordinator Management Tab */}
        <TabsContent value="coordinators" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Coordinators</CardTitle>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Coordinator
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Coordinator</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Name</Label>
                      <Input
                        placeholder="Enter coordinator name"
                        value={newCoordinator.name}
                        onChange={(e) =>
                          setNewCoordinator((prev) => ({ ...prev, name: e.target.value }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone</Label>
                      <Input
                        placeholder="Enter phone number"
                        value={newCoordinator.phone}
                        onChange={(e) =>
                          setNewCoordinator((prev) => ({ ...prev, phone: e.target.value }))
                        }
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button onClick={handleAddCoordinator} disabled={isAddingCoordinator}>
                        {isAddingCoordinator ? "Adding..." : "Add Coordinator"}
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              {coordinatorsLoading ? (
                <p className="text-muted-foreground">Loading coordinators...</p>
              ) : coordinators.length === 0 ? (
                <p className="text-muted-foreground">No coordinators found</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Companies Assigned</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coordinators.map((coord) => (
                      <TableRow key={coord.id}>
                        <TableCell className="font-medium">{coord.name}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            {coord.phone}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {companiesByCoordinator[coord.name]?.length || 0} companies
                          </Badge>
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
                                  Are you sure you want to remove {coord.name}? This action cannot be
                                  undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteCoordinator(coord.id, coord.name)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Remove
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Oversight Tab */}
        <TabsContent value="companies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Companies</CardTitle>
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
                        <TableHead>Registration</TableHead>
                        <TableHead>POC (Primary)</TableHead>
                        <TableHead>POC (Secondary)</TableHead>
                        <TableHead>HR Contact</TableHead>
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
                            <Badge className={getRegistrationStatusColor(company.registration_status)}>
                              {company.registration_status}
                            </Badge>
                          </TableCell>
                          <TableCell>{company.poc_1st}</TableCell>
                          <TableCell>{company.poc_2nd || "-"}</TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <p>{company.hr_name || "-"}</p>
                              {company.hr_email && (
                                <p className="text-muted-foreground text-xs">{company.hr_email}</p>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/companies?view=${company.id}`)}
                            >
                              <Eye className="h-4 w-4" />
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
    </div>
  );
}
