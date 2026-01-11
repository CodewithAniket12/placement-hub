import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Clock, LogOut, XCircle } from "lucide-react";

export default function Pending() {
  const { profile, isApproved, isPending, signOut, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
    if (!isLoading && isApproved) {
      navigate("/");
    }
  }, [isApproved, isLoading, user, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isRejected = profile?.status === "rejected";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-8 w-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">PlaceCell</CardTitle>
          <CardDescription>Coordinator Portal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {isPending ? (
            <>
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                  <Clock className="h-8 w-8 text-amber-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold">Access Pending</h3>
                <p className="text-muted-foreground mt-2">
                  Your request is being reviewed by an administrator. You'll be notified once approved.
                </p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {profile?.display_name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Username:</span> {profile?.username}
                </p>
              </div>
            </>
          ) : isRejected ? (
            <>
              <div className="flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                  <XCircle className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-600">Access Denied</h3>
                <p className="text-muted-foreground mt-2">
                  Your access request has been rejected. Please contact an administrator for more information.
                </p>
              </div>
            </>
          ) : null}
          
          <Button variant="outline" className="w-full gap-2" onClick={handleSignOut}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
