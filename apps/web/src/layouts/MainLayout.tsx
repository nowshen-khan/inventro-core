import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/shared/components/layout/Sidebar";
import { Topbar } from "@/shared/components/layout/Topbar";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen  bg-slate-100  text-slate-900">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex flex-1  flex-col overflow-hidden">
        <Topbar />

        <main className="flex-1 overflow-y-auto  p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
