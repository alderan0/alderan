
import { Link, useLocation } from "react-router-dom";
import { Home, FolderKanban, Trees, Users, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavItem = {
  label: string;
  icon: React.ElementType;
  href: string;
};

const NAV_ITEMS: NavItem[] = [
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
    label: "Tree",
    icon: Trees,
    href: "/app/tree"
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

interface AppNavProps {
  className?: string;
}

export const AppNav = ({ className }: AppNavProps) => {
  const location = useLocation();

  return (
    <nav className={cn("fixed bottom-0 left-0 right-0 bg-background border-t z-40", className)}>
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
