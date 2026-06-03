import { Bell, Search, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useAuthStore } from "@/features/auth/stores/authStore";

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
    <header className="flex flex-col gap-4 border-b bg-white px-4 py-4  md:flex-row md:items-center md:justify-between md:px-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex w-full items-center gap-3 rounded-xl border  bg-slate-50  dark:border-slate-700 px-4 py-2 dark:bg-slate-800 md:max-w-md">
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

        <div className="hidden text-right sm:block">
          <p className="max-w-[140px] truncate font-semibold"> {user?.name} </p>

          <p className="text-sm text-slate-500">{user?.role}</p>
        </div>

        <Button
          onClick={handleLogout}
          variant="destructive"
          className="flex items-center gap-2"
        >
          <LogOut size={16} />

          <span className="hidden sm:inline">Logout</span>
        </Button>
      </div>
    </header>
  );
}
