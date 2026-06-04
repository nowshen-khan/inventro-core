import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { DataTable } from "@/shared/components/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { SupplierForm } from "../components/SupplierForm";
import { useCreateSupplier } from "../hooks/useCreateSupplier";
import { useUpdateSupplier } from "../hooks/useUpdateSupplier";
import { useDeleteSupplier } from "../hooks/useDeleteSupplier";
import { useSuppliers } from "../hooks/useSuppliers";
import type {
  Supplier,
  CreateSupplierDto,
  UpdateSupplierDto,
} from "@repo/types/supplier";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";

export default function SuppliersPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useSuppliers({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  const [open, setOpen] = useState(false);
  const createMutation = useCreateSupplier();
  const [editOpen, setEditOpen] = useState(false);

  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null,
  );

  const updateMutation = useUpdateSupplier();
  const deleteMutation = useDeleteSupplier();

  const handleCreate = async (values: CreateSupplierDto) => {
    try {
      await createMutation.mutateAsync(values);

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (values: UpdateSupplierDto) => {
    if (!selectedSupplier) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedSupplier.id,

        data: values,
      });

      setEditOpen(false);
      setSelectedSupplier(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this supplier?");

    if (!ok) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-6">Loading suppliers...</div>;
  }

  const columns: ColumnDef<Supplier>[] = [
    {
      accessorKey: "name",
      header: "Supplier",
    },

    {
      accessorKey: "email",
      header: "Email",
    },

    {
      accessorKey: "phone",
      header: "Phone",
    },

    {
      accessorKey: "address",
      header: "Address",
    },

    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setSelectedSupplier(row.original);
              setEditOpen(true);
            }}
          >
            <Pencil className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            variant="destructive"
            onClick={() => handleDelete(row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-sm text-slate-500">Manage product suppliers</p>
        </div>

        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Add Supplier
              </Button>
            </DialogTrigger>
            <DialogDescription className="sr-only">
              Create a new supplier for ERP system.
            </DialogDescription>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Supplier</DialogTitle>
              </DialogHeader>

              <SupplierForm
                onSubmit={handleCreate}
                isLoading={createMutation.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="overflow-x-auto">
        <DataTable
          columns={columns}
          data={data?.items || []}
          pagination={pagination}
          pageCount={data?.meta?.totalPages || 1}
          onPaginationChange={setPagination}
        />
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Supplier</DialogTitle>
          </DialogHeader>

          {selectedSupplier && (
            <SupplierForm
              defaultValues={selectedSupplier}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
