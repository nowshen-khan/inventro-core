import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  ArrowRightLeft,
  Boxes,
  Warehouse,
  Building2,
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
    to: "/warehouses",
    label: "Warehouses",
    icon: Warehouse,
    permission: "warehouse:view",
  },
  {
    to: "/branches",
    label: "Branches",
    icon: Building2,
    permission: "branch:view",
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

export function Sidebar() {
  const { data: permissions } = usePermissions();

  // for Production
  // const filteredItems = !permissions
  //   ? []
  //   : allNavItems.filter(
  //       (item) => !item.permission || permissions.includes(item.permission),
  //     );

  // dev
  const filteredItems =
    !permissions || permissions.length === 0
      ? allNavItems
      : allNavItems.filter(
          (item) => !item.permission || permissions.includes(item.permission),
        );

  console.log(permissions);

  return (
    <aside className="  border-r bg-[#0f172a] text-white lg:flex lg:flex-col  shrink-0">
      {/* className:" hidden" */}
      <div className="border-b border-slate-700 p-6 ">
        <h1 className="text-2xl font-bold">ERP System</h1>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all hover:bg-slate-700",
                  isActive && "bg-white text-black",
                )
              }
            >
              <Icon size={18} />
              <span> {item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
