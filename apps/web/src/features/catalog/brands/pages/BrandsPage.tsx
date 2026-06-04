import { Pencil, Trash2, Plus } from "lucide-react";
import { useUpdateBrand } from "../hooks/useUpdateBrand";
import { useDeleteBrand } from "../hooks/useDeleteBrand";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useBrands } from "../hooks/useBrands";
import { useCreateBrand } from "../hooks/useCreateBrand";
import { BrandForm } from "../components/BrandForm";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import type {
  Brand,
  CreateBrandPayload,
  UpdateBrandPayload,
} from "@repo/types/common";
import { DataTable } from "@/shared/components/DataTable";

export default function BrandsPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const { data, isLoading } = useBrands({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  const [open, setOpen] = useState(false);
  const createMutation = useCreateBrand();
  const [editOpen, setEditOpen] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);

  const updateMutation = useUpdateBrand();
  const deleteMutation = useDeleteBrand();

  const handleCreate = async (values: CreateBrandPayload) => {
    try {
      await createMutation.mutateAsync(values);

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (values: UpdateBrandPayload) => {
    try {
      if (!selectedBrand) return;
      await updateMutation.mutateAsync({
        id: selectedBrand.id,
        data: values,
      });

      setEditOpen(false);

      setSelectedBrand(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this brand?");

    if (!ok) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  const columns: ColumnDef<Brand>[] = [
    {
      accessorKey: "name",
      header: "Brand",
    },

    {
      accessorKey: "description",
      header: "Description",

      cell: ({ row }) => (
        <span className="text-slate-500">
          {row.original.description || "-"}
        </span>
      ),
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
              setSelectedBrand(row.original);
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

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-6">Loading brands...</div>;
  }
  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Brands</h1>

          <p className="text-sm text-slate-500">Manage product brands</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 w-auto self-start md:self-auto">
              <Plus size={16} /> Add Brand
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Brand</DialogTitle>
            </DialogHeader>

            <BrandForm
              onSubmit={handleCreate}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
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
            <DialogTitle>Edit Brand</DialogTitle>
          </DialogHeader>

          {selectedBrand && (
            <BrandForm
              defaultValues={selectedBrand}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
