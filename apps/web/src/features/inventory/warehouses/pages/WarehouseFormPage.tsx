import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { WarehouseForm } from "../components/WarehouseForm";
import { useCreateWarehouse } from "../hooks/useCreateWarehouse";

export default function WarehouseFormPage() {
  const navigate = useNavigate();

  const mutation = useCreateWarehouse();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Warehouse</h1>

      <WarehouseForm
        isLoading={mutation.isPending}
        onSubmit={(values) =>
          mutation.mutate(values, {
            onSuccess: () => {
              toast.success("Warehouse created");

              navigate("/warehouses");
            },

            onError: (error: any) => {
              toast.error(
                error?.response?.data?.message || "Failed to create warehouse",
              );
            },
          })
        }
      />
    </div>
  );
}
