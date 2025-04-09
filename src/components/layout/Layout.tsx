
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";
import { useIsMobile } from "@/hooks/use-mobile";

export const Layout = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className={`flex-1 container mx-auto ${isMobile ? 'px-2 pb-20 pt-2' : 'px-4 pb-16 pt-4'} max-w-6xl`}>
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
