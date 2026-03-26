import { useState } from "react";
import Sidebar from "@/components/common/sidebar";
import Topbar from "@/components/common/topbar";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-full bg-gray-100 overflow-hidden">
      <header className="w-full shrink-0 z-50">
        <Topbar onMenuClick={() => setIsOpen(prev=>!prev)} isMenuOpen={isOpen} />
      </header>
      <div className="flex flex-1 overflow-hidden">

        {user && (
          <aside className="md:w-64 lg:w-1/6 h-fullshrink-0 z-40">
            <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
          </aside>
        )}
        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;