import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { LocationForm } from "../components/LocationForm";
import { useCreateLocation } from "../hooks/useCreateLocation";

export default function LocationFormPage() {
  const navigate = useNavigate();

  const mutation = useCreateLocation();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create Location</h1>

      <LocationForm
        isLoading={mutation.isPending}
        onSubmit={(values) =>
          mutation.mutate(values, {
            onSuccess: () => {
              toast.success("Location created");

              navigate("/locations");
            },

            onError: (error: any) => {
              toast.error(
                error?.response?.data?.message || "Failed to create location",
              );
            },
          })
        }
      />
    </div>
  );
}
