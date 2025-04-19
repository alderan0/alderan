
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { AppNav } from "./AppNav";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

export const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className={cn(
        "flex-1 container mx-auto transition-all duration-200",
        isMobile ? 'px-3 pb-24 pt-3' : 'px-6 pb-8 pt-6',
        "max-w-7xl"
      )}>
        <div className="h-full rounded-lg">
          <Outlet />
        </div>
      </main>
      {isMobile && <AppNav />}
    </div>
  );
};
