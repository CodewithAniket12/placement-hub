import { NavLink } from "@/components/NavLink";
import { useAuth } from "@/contexts/AuthContext";
import { Building2, GraduationCap, Mail, LogOut, ListTodo, Shield, LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { title: "Admin Panel", url: "/", icon: Shield, adminOnly: true },
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard, adminOnly: false },
  { title: "All Companies", url: "/companies", icon: Building2, adminOnly: false },
  { title: "Tasks", url: "/tasks", icon: ListTodo, adminOnly: false },
  { title: "Email History", url: "/email-history", icon: Mail, adminOnly: false },
];

export function AppSidebar() {
  const { profile, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  // Filter nav items based on admin status
  const visibleNavItems = isAdmin 
    ? navItems 
    : navItems.filter(item => !item.adminOnly);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-border bg-sidebar">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary">
            <GraduationCap className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-sidebar-foreground">PlaceCell</h1>
            <p className="text-xs text-sidebar-muted-foreground">Coordinator Portal</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-4">
          {visibleNavItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/" || item.url === "/dashboard"}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-sidebar-muted-foreground transition-all hover:bg-sidebar-muted hover:text-sidebar-foreground"
              activeClassName="bg-primary/10 text-primary hover:bg-primary/10 hover:text-primary"
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-xl bg-sidebar-muted px-4 py-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {profile?.display_name?.charAt(0) || "?"}
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-sidebar-foreground">{profile?.display_name || "Unknown"}</p>
              <p className="text-xs text-sidebar-muted-foreground">
                {isAdmin ? "Administrator" : "Coordinator"}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="h-8 w-8 text-sidebar-muted-foreground hover:text-sidebar-foreground"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
