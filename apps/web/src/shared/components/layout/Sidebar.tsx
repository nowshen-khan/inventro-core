import { ChevronRight, ChevronLeft } from "lucide-react";

import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { SidebarContent } from "./SidebarContent";
import { cn } from "@/shared/lib/utils";
import { Button } from "../ui/button";

type SidebarProps = {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
};

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
  const { isLoading } = usePermissions();

  if (isLoading) {
    return (
      <aside
        className={cn(
          "hidden border-r border-slate-800 bg-[#020617] lg:flex ",
          collapsed ? "w-[80px]" : "w-[260px]",
        )}
      >
        <div className="animate-pulse p-6">
          <div className="mb-8 h-10 rounded-xl bg-slate-800" />

          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-12 rounded-xl bg-slate-800" />
            ))}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside
      className={cn(
        "hidden border-r border-slate-800 bg-[#020617] text-white transition-all duration-300 lg:flex lg:flex-col",
        collapsed ? "w-[80px]" : "w-[260px]",
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <ChevronRight /> : <ChevronLeft />}
      </Button>
      <SidebarContent collapsed={collapsed} />
    </aside>
  );
}
