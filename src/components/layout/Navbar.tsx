
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export const Navbar = () => {
  const location = useLocation();
  
  // Define page titles for each route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Tasks';
      case '/tree':
        return 'Your Tree';
      case '/community':
        return 'Community';
      default:
        return 'Alderan';
    }
  };

  return (
    <header className="border-b bg-card shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/e14b38a8-ba30-4f3a-9853-8b7ec0bb6fc7.png" 
            alt="Alderan Logo" 
            className="h-8 w-8" 
          />
          <h1 className={cn(
            "text-xl font-semibold tracking-tight",
            location.pathname === '/' && "text-primary",
            location.pathname === '/tree' && "text-alderan-green-light",
            location.pathname === '/community' && "text-alderan-blue"
          )}>
            {getPageTitle()}
          </h1>
        </div>
      </div>
    </header>
  );
};
