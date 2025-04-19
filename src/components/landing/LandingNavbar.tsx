
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export const LandingNavbar = () => {
  const { isAuthenticated } = useAuth();
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/e14b38a8-ba30-4f3a-9853-8b7ec0bb6fc7.png" 
            alt="Alderan Logo" 
            className="h-9 w-9 animate-bounce-slow" 
          />
          <span className="font-bold text-2xl bg-gradient-to-r from-alderan-green-dark to-alderan-green-light bg-clip-text text-transparent">
            Alderan
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link>
          <Link to="/#about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
          <Link to="/#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
          <Link to="/#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
        </nav>
        
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Button asChild className="bg-alderan-green-light hover:bg-alderan-green-dark text-white rounded-full px-6">
              <Link to="/app">Go to App</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-alderan-green-dark hover:text-alderan-green-light">
                <Link to="/auth">Login</Link>
              </Button>
              <Button asChild className="bg-alderan-green-light hover:bg-alderan-green-dark text-white rounded-full px-6">
                <Link to="/auth">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
