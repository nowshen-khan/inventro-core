import { Pencil, Trash2 } from "lucide-react";
import { useUpdateCategory } from "../hooks/useUpdateCategory";
import { useDeleteCategory } from "../hooks/useDeleteCategory";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import { useCategories } from "../hooks/useCategories";
import { useCreateCategory } from "../hooks/useCreateCategory";
import { CategoryForm } from "../components/CategoryForm";

export default function CategoriesPage() {
  const { data, isLoading } = useCategories();

  const [open, setOpen] = useState(false);

  const createMutation = useCreateCategory();
  const [editOpen, setEditOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  const updateMutation = useUpdateCategory();

  const deleteMutation = useDeleteCategory();

  const handleCreate = async (values: any) => {
    try {
      await createMutation.mutateAsync(values);

      setOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdate = async (values: any) => {
    try {
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
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Category</Button>
          </DialogTrigger>

          <DialogContent>
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
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Name</th>

              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((category: any) => (
              <tr key={category.id} className="border-b">
                <td className="p-3">{category.name}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory(category);

                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
