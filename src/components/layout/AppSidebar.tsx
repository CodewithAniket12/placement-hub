import { NavLink } from "@/components/NavLink";
import { LayoutDashboard, Building2, Settings, GraduationCap } from "lucide-react";

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "All Companies", url: "/companies", icon: Building2 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
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
          {navItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/"}
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
              A
            </div>
            <div className="flex-1 truncate">
              <p className="text-sm font-medium text-sidebar-foreground">Aniket</p>
              <p className="text-xs text-sidebar-muted-foreground">Coordinator</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
