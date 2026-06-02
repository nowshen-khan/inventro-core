import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

import { cn } from "@/shared/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  type?: "default" | "warning" | "danger" | "success";
}

export function StatCard({ title, value, type = "default" }: StatCardProps) {
  const colorClasses = {
    default: "text-slate-900 dark:text-white",
    warning: "text-orange-500 dark:text-orange-400",
    danger: "text-red-500 dark:text-red-400",
    success: "text-emerald-500 dark:text-green-400",
  };

  return (
    <Card className="rounded-2xl border bg-white shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-slate-500 dark:text-gray-400">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className={cn("text-3xl font-bold", colorClasses[type])}>{value}</p>
      </CardContent>
    </Card>
  );
}
