
import { Link, useLocation } from "react-router-dom";
import { Calendar, Users, Sparkles, FolderKanban } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTree } from "@/context/TreeContext";
import { useState, useEffect } from "react";

export const BottomNav = () => {
  const location = useLocation();
  const [level, setLevel] = useState(1);
  
  // Try to use the tree context, but fallback gracefully if it's not available
  let treeContext;
  try {
    treeContext = useTree();
  } catch (error) {
    // If we're outside the TreeProvider context, we'll use the default level
    console.log("Tree context not available in this route");
  }
  
  useEffect(() => {
    // Update level from context when available
    if (treeContext?.tree) {
      setLevel(treeContext.tree.level);
    }
  }, [treeContext?.tree]);
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t shadow-lg">
      <div className="container mx-auto flex h-16 items-center justify-around max-w-6xl">
        <Link 
          to="/app" 
          className={cn(
            "flex flex-col items-center justify-center w-1/4 h-full relative transition-all duration-300",
            location.pathname === '/app' 
              ? "text-primary scale-110" 
              : "text-muted-foreground hover:text-primary/80"
          )}
        >
          {location.pathname === '/app' && (
            <span className="absolute -top-1 right-1/4">
              <Sparkles size={12} className="text-yellow-400 animate-pulse" />
            </span>
          )}
          <Calendar size={24} className={cn(
            "transition-transform",
            location.pathname === '/app' && "animate-bounce-slow"
          )} />
          <span className="text-xs mt-1 font-medium">Tasks</span>
        </Link>

        <Link 
          to="/app/projects" 
          className={cn(
            "flex flex-col items-center justify-center w-1/4 h-full relative transition-all duration-300",
            location.pathname === '/app/projects' 
              ? "text-amber-500 scale-110" 
              : "text-muted-foreground hover:text-amber-500/80"
          )}
        >
          {location.pathname === '/app/projects' && (
            <span className="absolute -top-1 right-1/4">
              <Sparkles size={12} className="text-yellow-400 animate-pulse" />
            </span>
          )}
          <FolderKanban size={24} className={cn(
            "transition-transform",
            location.pathname === '/app/projects' && "animate-bounce-slow"
          )} />
          <span className="text-xs mt-1 font-medium">Projects</span>
        </Link>
        
        <Link 
          to="/app/tree" 
          className={cn(
            "flex flex-col items-center justify-center w-1/4 h-full relative transition-all duration-300",
            location.pathname === '/app/tree' 
              ? "text-alderan-green-light scale-110" 
              : "text-muted-foreground hover:text-alderan-green-light/80"
          )}
        >
          {location.pathname === '/app/tree' && (
            <span className="absolute -top-1 right-1/4">
              <Sparkles size={12} className="text-yellow-400 animate-pulse" />
            </span>
          )}
          <TreeIcon size={24} className={cn(
            "transition-transform",
            location.pathname === '/app/tree' && "animate-bounce-slow"
          )} />
          <span className="text-xs mt-1 font-medium">
            Tree L{level}
          </span>
        </Link>
        
        <Link 
          to="/app/community" 
          className={cn(
            "flex flex-col items-center justify-center w-1/4 h-full relative transition-all duration-300",
            location.pathname === '/app/community' 
              ? "text-alderan-blue scale-110" 
              : "text-muted-foreground hover:text-alderan-blue/80"
          )}
        >
          {location.pathname === '/app/community' && (
            <span className="absolute -top-1 right-1/4">
              <Sparkles size={12} className="text-yellow-400 animate-pulse" />
            </span>
          )}
          <Users size={24} className={cn(
            "transition-transform",
            location.pathname === '/app/community' && "animate-bounce-slow"
          )} />
          <span className="text-xs mt-1 font-medium">Community</span>
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
