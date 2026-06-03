import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { SalesChartData } from "@repo/types/dashboard";

interface Props {
  data: SalesChartData[];
}

export function SalesChart({ data }: Props) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis tickFormatter={(v) => `৳${v}`} />

          <Tooltip formatter={(value) => [`৳${value}`, "Sales"]} />

          <Line
            type="monotone"
            dataKey="sales"
            strokeWidth={3}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
