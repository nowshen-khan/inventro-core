import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
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
import type { Supplier, CreateSupplierDto } from "@repo/types/supplier";

export default function SuppliersPage() {
  const { data, isLoading } = useSuppliers();

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

  const handleUpdate = async (values: CreateSupplierDto) => {
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
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Suppliers</h1>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Add Supplier</Button>
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

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b text-left">
              <th className="p-3">Name</th>

              <th className="p-3">Email</th>

              <th className="p-3">Phone</th>

              <th className="p-3">Address</th>

              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data?.map((supplier: Supplier) => (
              <tr key={supplier.id} className="border-b">
                <td className="p-3 whitespace-nowrap">{supplier.name}</td>

                <td className="p-3 whitespace-nowrap">{supplier.email}</td>

                <td className="p-3 whitespace-nowrap">{supplier.phone}</td>

                <td className="p-3 whitespace-nowrap">{supplier.address}</td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        setSelectedSupplier(supplier);

                        setEditOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      size="icon"
                      variant="destructive"
                      onClick={() => handleDelete(supplier.id)}
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
