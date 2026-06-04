import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { DataTable } from "@/shared/components/DataTable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useCategories } from "../hooks/useCategories";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { CategoryForm } from "../components/CategoryForm";
import type {
  Category,
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@repo/types/common";

import type { ColumnDef, PaginationState } from "@tanstack/react-table";

export default function CategoriesPage() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [open, setOpen] = useState(false);
  const createMutation = useCreateCategory();
  const [editOpen, setEditOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const { data, isLoading } = useCategories({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  const handleCreate = async (values: CreateCategoryPayload) => {
    try {
      await createMutation.mutateAsync(values);

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (values: UpdateCategoryPayload) => {
    try {
      if (!selectedCategory) return;

      await updateMutation.mutateAsync({
        id: selectedCategory.id,
        data: values,
      });

      setEditOpen(false);

      setSelectedCategory(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this category?");

    if (!ok) return;

    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-white p-6">Loading categories...</div>
    );
  }

  const columns: ColumnDef<Category>[] = [
    {
      accessorKey: "name",
      header: "Category",
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
              setSelectedCategory(row.original);
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
          <h1 className="text-3xl font-bold">Categories</h1>
          <p className="text-sm text-slate-500">Manage product categories</p>
        </div>

        <div className="flex gap-3">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Add Category
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Create Category</DialogTitle>
              </DialogHeader>

              <CategoryForm
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
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>

          {selectedCategory && (
            <CategoryForm
              defaultValues={selectedCategory}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
