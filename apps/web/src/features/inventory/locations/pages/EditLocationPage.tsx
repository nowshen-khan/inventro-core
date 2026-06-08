import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { LocationForm } from "../components/LocationForm";

import { useLocation } from "../hooks/useLocation";
import { useUpdateLocation } from "../hooks/useUpdateLocation";

export default function EditLocationPage() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data, isLoading } = useLocation(id!);

  const mutation = useUpdateLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Location</h1>

      <LocationForm
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
                toast.success("Location updated");

                navigate("/locations");
              },

              onError: (error: any) => {
                toast.error(
                  error?.response?.data?.message || "Failed to update location",
                );
              },
            },
          )
        }
      />
    </div>
  );
}
