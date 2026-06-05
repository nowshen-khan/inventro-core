import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { WarehouseForm } from "../components/WarehouseForm";

import { useWarehouse } from "../hooks/useWarehouse";
import { useUpdateWarehouse } from "../hooks/useUpdateWarehouse";

export default function EditWarehousePage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data, isLoading } = useWarehouse(id!);

  const mutation = useUpdateWarehouse();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Warehouse</h1>

      <WarehouseForm
        defaultValues={data}
        isLoading={mutation.isPending}
        onSubmit={(values) =>
          mutation.mutate(
            {
              id: id!,
              data: values,
            },
            {
              onSuccess: () => {
                toast.success("Warehouse updated");

                navigate("/warehouses");
              },

              onError: (error: any) => {
                toast.error(
                  error?.response?.data?.message ||
                    "Failed to update warehouse",
                );
              },
            },
          )
        }
      />
    </div>
  );
}
