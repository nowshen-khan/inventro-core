import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  ArrowRightLeft,
  Boxes,
  Warehouse,
  Tags,
  BadgeDollarSign,
  Users,
  UserRound,
  Shield,
  Receipt,
  FileBarChart2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { usePermissions } from "@/features/auth/hooks/usePermissions";
import { cn } from "@/shared/lib/utils"; // shadcn utility

type Props = {
  mobile?: boolean;
  collapsed?: boolean;
};

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  permission?: string;
};

const allNavItems: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    permission: "dashboard:view",
  },
  {
    to: "/products",
    label: "Products",
    icon: Package,
    permission: "product:view",
  },
  { to: "/sales", label: "Sales", icon: ShoppingCart, permission: "sale:view" },
  {
    to: "/purchases",
    label: "Purchases",
    icon: Truck,
    permission: "purchase:view",
  },
  {
    to: "/purchase-returns",
    label: "Purchase Returns",
    icon: Truck,
    permission: "purchase:view",
  },
  {
    to: "/transfers",
    label: "Transfers",
    icon: ArrowRightLeft,
    permission: "transfer:view",
  },
  {
    to: "/inventory",
    label: "Inventory",
    icon: Boxes,
    permission: "inventory:view",
  },
  {
    to: "/locations",
    label: "Locations",
    icon: Warehouse,
    permission: "location:view",
  },
  {
    to: "/categories",
    label: "Categories",
    icon: Tags,
    permission: "category:view",
  },
  {
    to: "/brands",
    label: "Brands",
    icon: BadgeDollarSign,
    permission: "brand:view",
  },
  {
    to: "/suppliers",
    label: "Suppliers",
    icon: Users,
    permission: "supplier:view",
  },
  {
    to: "/customers",
    label: "Customers",
    icon: UserRound,
    permission: "customer:view",
  },
  { to: "/users", label: "Users", icon: Users, permission: "user:view" },
  { to: "/roles", label: "Roles", icon: Shield, permission: "role:view" },
  {
    to: "/expenses",
    label: "Expenses",
    icon: Receipt,
    permission: "expense:view",
  },
  {
    to: "/reports",
    label: "Reports",
    icon: FileBarChart2,
    permission: "report:view",
  },
];

export function SidebarContent({ mobile, collapsed }: Props) {
  const { data: permissions } = usePermissions();

  const filteredItems = !permissions
    ? []
    : allNavItems.filter(
        (item) => !item.permission || permissions.includes(item.permission),
      );

  return (
    <div className="flex h-full flex-col bg-[#020617] text-white">
      {/* Logo */}

      <div className="border-b border-slate-800 px-5 py-6">
        <div className="flex items-center  gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-lg font-black text-black shadow-lg">
            I
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-2xl font-black tracking-tight">Inventro</h1>

              <p className="text-xs text-slate-400">Smart ERP Management</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1.5">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 rounded-xl py-2.5 text-sm font-medium transition-all duration-200 ",
                    collapsed ? "justify-center px-0" : "gap-3 px-3",
                    isActive
                      ? "bg-white text-black "
                      : "text-slate-300 hover:bg-slate-900 ",
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-xl transition-all",
                        isActive
                          ? "bg-slate-100 text-black"
                          : "bg-slate-900 text-slate-400 group-hover:bg-slate-800 group-hover:text-white",
                      )}
                    >
                      <Icon size={18} />
                    </div>
                    {!collapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      {!collapsed && !mobile && (
        <div
          className={cn(
            "border-t border-slate-800 px-6 py-4",
            mobile && "hidden",
          )}
        >
          <div className="rounded-2xl bg-slate-900 p-4">
            <p className="text-sm font-semibold text-white">Inventro ERP</p>

            <p className="mt-1 text-xs text-slate-400">
              Manage inventory, sales & operations smarter.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
