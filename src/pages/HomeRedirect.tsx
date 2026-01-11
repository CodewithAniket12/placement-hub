import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export default function HomeRedirect() {
  const { isAdmin } = useAuth();
  return <Navigate to={isAdmin ? "/admin" : "/dashboard"} replace />;
}
