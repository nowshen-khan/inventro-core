import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getSalesReport,
  getPurchaseReport,
  getInventoryReport,
  getProfitLoss,
} from "../api/reports.api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";

export default function ReportsPage() {
  const [tab, setTab] = useState("sales");
  const { data, isLoading } = useQuery({
    queryKey: ["report", tab],
    queryFn: () => {
      if (tab === "sales") return getSalesReport();
      if (tab === "purchases") return getPurchaseReport();
      if (tab === "inventory") return getInventoryReport();
      return getProfitLoss();
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="flex gap-2 mb-4">
        {["sales", "purchases", "inventory", "profit-loss"].map((t) => (
          <Button
            key={t}
            variant={tab === t ? "default" : "outline"}
            onClick={() => setTab(t)}
          >
            {t.replace("-", " ")}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{tab}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </CardContent>
      </Card>
    </div>
  );
}
