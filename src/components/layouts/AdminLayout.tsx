import { useState } from "react";
import Sidebar from "@/components/common/sidebar";
import Topbar from "@/components/common/topbar";
import { useAppSelector } from "@/hooks/useAppSelector";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  const { user } = useAppSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
      {user && (
        <aside className="md:w-64 lg:w-1/6 h-screen bg-slate-500 shrink-0 z-50">
          <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setIsOpen(true)} />
        
        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;