
import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { BottomNav } from "./BottomNav";

export const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 container pb-16 pt-4">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
};
