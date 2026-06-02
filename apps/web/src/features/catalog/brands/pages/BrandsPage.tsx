import { Pencil, Trash2 } from "lucide-react";
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

export default function BrandsPage() {
  const { data, isLoading } = useBrands();

  const [open, setOpen] = useState(false);

  const createMutation = useCreateBrand();
  const [editOpen, setEditOpen] = useState(false);

  const [selectedBrand, setSelectedBrand] = useState<any>(null);

  const updateMutation = useUpdateBrand();

  const deleteMutation = useDeleteBrand();

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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brands</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Brand</Button>
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
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Name</th>

              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((brand: any) => (
              <tr key={brand.id} className="border-b">
                <td className="p-3">{brand.name}</td>
                <td className="p-3">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setSelectedBrand(brand);

                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(brand.id)}
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
