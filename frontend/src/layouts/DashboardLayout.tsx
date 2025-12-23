import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./components/Sidebar/Sidebar";
import { Navbar } from "./components/Navbar/Navbar";
import { MobileOverlay } from "./components/MobileOverlay";
import { useNavigation } from "./hooks/useNavigation";

export default function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useNavigation();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar 
        isMobileOpen={isMobileMenuOpen} 
        onCloseMobile={() => setIsMobileMenuOpen(false)} 
      />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        <Navbar 
          onMenuClick={() => setIsMobileMenuOpen(true)} 
          user={user} 
        />

        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-gray-100">
          <Outlet />
        </div>
      </main>

      <MobileOverlay 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </div>
  );
}