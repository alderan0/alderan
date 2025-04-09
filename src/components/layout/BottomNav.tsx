
import { Link, useLocation } from "react-router-dom";
import { Calendar, Users } from "lucide-react";
import { cn } from "@/lib/utils";

export const BottomNav = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card border-t shadow-lg">
      <div className="container flex h-16 items-center justify-around">
        <Link 
          to="/app" 
          className={cn(
            "flex flex-col items-center justify-center w-1/3 h-full",
            location.pathname === '/app' ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Calendar size={24} />
          <span className="text-xs mt-1">Tasks</span>
        </Link>
        
        <Link 
          to="/app/tree" 
          className={cn(
            "flex flex-col items-center justify-center w-1/3 h-full",
            location.pathname === '/app/tree' ? "text-alderan-green-light" : "text-muted-foreground"
          )}
        >
          <TreeIcon size={24} />
          <span className="text-xs mt-1">Tree</span>
        </Link>
        
        <Link 
          to="/app/community" 
          className={cn(
            "flex flex-col items-center justify-center w-1/3 h-full",
            location.pathname === '/app/community' ? "text-alderan-blue" : "text-muted-foreground"
          )}
        >
          <Users size={24} />
          <span className="text-xs mt-1">Community</span>
        </Link>
      </div>
    </nav>
  );
};

// Custom tree icon component
const TreeIcon = ({ size = 24, className }: { size?: number, className?: string }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22v-7l-2-2" />
      <path d="M17 8v0a5 5 0 0 0-5-5v0a5 5 0 0 0-5 5v0" />
      <path d="M17 8H7" />
      <path d="M12 8v6" />
      <path d="M7 8a5 5 0 0 0 5 5 5 5 0 0 0 5-5" />
    </svg>
  );
};
