import { EntityTablePage } from "@/shared/components/EntityTablePage";
import { getLocations } from "../api/locations.api";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { useDeleteLocation } from "../hooks/useDeleteLocation";
import { toast } from "sonner";

const getColumns = (handleDelete: (id: string) => void): ColumnDef<any>[] => [
  { accessorKey: "name", header: "Name" },
  { accessorKey: "code", header: "Code" },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => {
      const type = row.original.type;

      return <span className="rounded px-2 py-1 border text-xs">{type}</span>;
    },
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (row.original.isActive ? "Active" : "Inactive"),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <Link to={`/locations/${row.original.id}/edit`}>
          <Button variant="outline" size="sm">
            Edit
          </Button>
        </Link>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDelete(row.original.id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
  },
];

export default function LocationsPage() {
  const deleteMutation = useDeleteLocation();

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this location?")) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        toast.success("Location deleted");
      },
      onError: () => {
        toast.error("Failed to delete location");
      },
    });
  };

  return (
    <EntityTablePage
      title="Locations"
      createPath="/locations/new"
      queryKey="locations"
      queryFn={getLocations}
      columns={getColumns(handleDelete)}
    />
  );
}
