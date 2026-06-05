import { EntityTablePage } from "@/shared/components/EntityTablePage";
import { getWarehouses } from "../api/warehouses.api";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";

const columns: ColumnDef<any>[] = [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code" },
  {
    header: "Branch",
    cell: ({ row }) => row.original.branch?.name,
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link to={`/warehouses/${row.original.id}/edit`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];

export default function WarehousesPage() {
  return (
    <EntityTablePage
      title="Warehouses"
      createPath="/warehouses/new"
      queryKey="warehouses"
      queryFn={getWarehouses}
      columns={columns}
    />
  );
}
