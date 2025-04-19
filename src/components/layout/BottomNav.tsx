import { Link, useLocation } from "react-router-dom";
import { Home, FolderKanban, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    label: "Tasks",
    icon: Home,
    href: "/app/tasks"
  },
  {
    label: "Projects",
    icon: FolderKanban,
    href: "/app/projects"
  },
  {
    label: "Community",
    icon: Users,
    href: "/app/community"
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/app/settings"
  }
];

export const BottomNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t">
      <div className="flex justify-around items-center h-16">
        {NAV_ITEMS.map(item => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full",
                "text-muted-foreground hover:text-foreground transition-colors",
                isActive && "text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
