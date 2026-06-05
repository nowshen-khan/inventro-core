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
import { CustomerForm } from "../components/CustomerForm";
import { useCreateCustomer } from "../hooks/useCreateCustomer";
import { useUpdateCustomer } from "../hooks/useUpdateCustomer";
import { useDeleteCustomer } from "../hooks/useDeleteCustomer";
import { useCustomers } from "../hooks/useCustomers";
import type {
  Customer,
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@repo/types/common";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { toast } from "sonner";

export default function CustomersPage() {
  const [search, setSearch] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useCustomers({
    search,
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });
  const [open, setOpen] = useState(false);
  const createMutation = useCreateCustomer();
  const [editOpen, setEditOpen] = useState(false);

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );

  const updateMutation = useUpdateCustomer();
  const deleteMutation = useDeleteCustomer();

  const handleCreate = async (values: CreateCustomerPayload) => {
    try {
      await createMutation.mutateAsync(values);

      toast.success("Customer created");

      setOpen(false);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ?? "Failed to create customer",
      );
      console.error(error);
    }
  };

  const handleUpdate = async (values: UpdateCustomerPayload) => {
    if (!selectedCustomer) return;
    try {
      await updateMutation.mutateAsync({
        id: selectedCustomer.id,

        data: values,
      });
      toast.success("Customer updated");
      setEditOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = confirm("Delete this customer?");

    if (!ok) return;

    try {
      await deleteMutation.mutateAsync(id);
      toast.success("Customer deleted");
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) {
    return <div className="rounded-2xl bg-white p-6">Loading customer...</div>;
  }

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Customer",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },

    {
      accessorKey: "email",
      header: "Email",
    },

    {
      accessorKey: "address",
      header: "Address",
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
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
              setSelectedCustomer(row.original);
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
          <h1 className="text-3xl font-bold">Customers</h1>
          <p className="text-sm text-slate-500">Manage customers</p>
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, phone, email"
          className="w-full max-w-sm rounded-lg border p-3"
        />
        <div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus size={16} />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogDescription className="sr-only">
              Create a new customer for ERP system.
            </DialogDescription>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create customer</DialogTitle>
              </DialogHeader>

              <CustomerForm
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
            <DialogTitle>Edit Customer</DialogTitle>
          </DialogHeader>

          {selectedCustomer && (
            <CustomerForm
              defaultValues={selectedCustomer}
              onSubmit={handleUpdate}
              isLoading={updateMutation.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
