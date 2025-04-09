
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  
  // Define page titles for each route
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/app':
        return 'Tasks';
      case '/app/tree':
        return 'Your Tree';
      case '/app/community':
        return 'Community';
      default:
        return 'Alderan';
    }
  };

  // Get page color for each route
  const getPageColor = () => {
    switch (location.pathname) {
      case '/app':
        return 'text-primary';
      case '/app/tree':
        return 'text-alderan-green-light';
      case '/app/community':
        return 'text-alderan-blue';
      default:
        return 'text-foreground';
    }
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user || !user.username) return "U";
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <header className="border-b bg-card/80 backdrop-blur-md shadow-sm sticky top-0 z-40">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img 
              src="/lovable-uploads/e14b38a8-ba30-4f3a-9853-8b7ec0bb6fc7.png" 
              alt="Alderan Logo" 
              className="h-9 w-9 animate-pulse-glow" 
            />
            <div className="absolute -top-1 -right-1">
              <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            </div>
          </div>
          <h1 className={cn(
            "text-xl font-semibold tracking-tight bg-gradient-to-br bg-clip-text text-transparent transition-all duration-300",
            location.pathname === '/app' && "from-primary to-primary/70",
            location.pathname === '/app/tree' && "from-alderan-green-light to-alderan-green-dark",
            location.pathname === '/app/community' && "from-alderan-blue to-blue-700"
          )}>
            {getPageTitle()}
          </h1>
        </div>
        
        {user && (
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full overflow-hidden p-0 border-2 hover:border-alderan-green-light transition-all duration-300">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-to-br from-alderan-green-light to-alderan-green-dark text-primary-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.username}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-500 hover:text-red-600 hover:bg-red-50 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};
