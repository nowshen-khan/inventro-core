import { Bell, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/shared/components/ui/sheet";
import { Button } from "../ui/button";
import { useAuthStore } from "@/features/auth/stores/authStore";
import { SidebarContent } from "./SidebarContent";

export function Topbar() {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);

  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    try {
      await logout();

      navigate("/login");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header className="flex items-center justify-between border-b bg-white px-4 py-3 ">
      {/* Hambarger Menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent
          side="left"
          className="w-[85vw] max-w-[300px] border-none  bg-[#020617] p-0 text-white"
        >
          <SidebarContent mobile />
        </SheetContent>
      </Sheet>

      <div className="hidden md:flex md:max-w-md md:flex-1 items-center gap-3 rounded-xl border bg-slate-50 px-4 py-2">
        <Search size={18} className="text-slate-500" />

        <input
          placeholder="Search..."
          className="bg-transparent outline-none"
        />
      </div>

      <div className="flex items-center justify-between gap-3 md:gap-5">
        <Button
          size="icon"
          variant="ghost"
          className="relative rounded-full p-2 hover:bg-slate-100"
        >
          <Bell size={20} />
        </Button>

        <div className=" text-right ">
          <p className="max-w-[120px] truncate text-sm font-semibold">
            {user?.name}
          </p>

          <p className="text-xs  text-slate-500">{user?.role}</p>
        </div>

        <Button
          onClick={handleLogout}
          variant="destructive"
          size="sm"
          className="flex items-center gap-2"
        >
          <LogOut size={16} />

          <span className="hidden xl:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
