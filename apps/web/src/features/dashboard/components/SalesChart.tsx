import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface Props {
  data: {
    name: string;

    sales: number;
  }[];
}

export function SalesChart({ data }: Props) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line type="monotone" dataKey="sales" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
