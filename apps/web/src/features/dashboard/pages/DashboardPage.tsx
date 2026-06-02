import { DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { SalesChart } from "../components/SalesChart";
import { useSalesTrend } from "../hooks/useSalesTrend";

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  const { data: trendData } = useSalesTrend();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const stats = [
    {
      title: "Today Sales",

      value: `৳${data?.todaySales || 0}`,

      icon: DollarSign,
    },

    {
      title: "Monthly Sales",

      value: `৳${data?.monthlySales || 0}`,

      icon: ShoppingCart,
    },

    {
      title: "Today Purchases",

      value: `৳${data?.todayPurchases || 0}`,

      icon: Package,
    },

    {
      title: "Products",

      value: data?.totalProducts || 0,

      icon: Package,
    },

    {
      title: "Customers",

      value: data?.totalCustomers || 0,

      icon: Users,
    },
  ];

  return (
    <div className="space-y-6">
      {/* STATS */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <Card key={index} className="rounded-2xl border-0 shadow-sm">
              <CardContent className="flex items-center justify-between p-6">
                <div>
                  <p className="text-sm text-slate-500">{stat.title}</p>

                  <h2 className="mt-2 text-2xl font-bold">{stat.value}</h2>
                </div>

                <div className="rounded-xl bg-slate-100 p-3">
                  <Icon size={24} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* TABLES */}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* RECENT SALES */}

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="mb-6 text-lg font-semibold">Recent Sales</h2>

            <div className="space-y-4">
              {data?.recentSales?.map((sale: any) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-medium">{sale.invoiceNo}</p>

                    <p className="text-sm text-slate-500">
                      {sale.customer?.name || "Walk-in Customer"}
                    </p>
                  </div>

                  <div className="font-semibold">৳{sale.totalAmount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* LOW STOCK */}

        <Card className="rounded-2xl border-0 shadow-sm">
          <CardContent className="p-6">
            <h2 className="mb-6 text-lg font-semibold">Low Stock</h2>

            <div className="space-y-4">
              {data?.lowStock?.map((stock: any) => (
                <div
                  key={stock.id}
                  className="flex items-center justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-medium">
                      {stock.variant?.product?.name}
                    </p>

                    <p className="text-sm text-slate-500">
                      {stock.variant?.sku}
                    </p>
                  </div>

                  <div className="font-semibold text-red-500">
                    {stock.quantity}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border-0 shadow-sm">
        <CardContent className="p-6">
          <h2 className="mb-6 text-lg font-semibold">Sales Trend</h2>

          <SalesChart data={trendData || []} />
        </CardContent>
      </Card>
    </div>
  );
}
