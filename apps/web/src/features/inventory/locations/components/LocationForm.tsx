import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import type { Location, CreateLocationDto } from "@repo/types/location";

interface Props {
  defaultValues?: Partial<Location>;
  onSubmit: (values: CreateLocationDto) => void;
  isLoading?: boolean;
}

export function LocationForm({ defaultValues, onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLocationDto>({
    defaultValues: {
      name: defaultValues?.name ?? "",
      code: defaultValues?.code ?? "",
      type: defaultValues?.type ?? "OUTLET",
      address: defaultValues?.address ?? "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div>
        <label className="mb-2 block text-sm font-medium">Location Name</label>

        <input
          {...register("name", {
            required: "Location name required",
          })}
          className="w-full rounded-lg border p-3"
        />

        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Location Code</label>

        <input
          {...register("code", {
            required: "Location code required",
          })}
          className="w-full rounded-lg border p-3"
        />

        {errors.code && (
          <p className="text-sm text-red-500">{errors.code.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Location Type</label>

        <select {...register("type")} className="w-full rounded-lg border p-3">
          <option value="LOCATION">Location</option>
          <option value="OUTLET">Outlet</option>
          <option value="TRANSIT">Transit</option>
        </select>

        {errors.type && (
          <p className="text-sm text-red-500">{errors.type.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Address</label>

        <textarea
          {...register("address")}
          className="w-full rounded-lg border p-3"
        />

        {errors.address && (
          <p className="text-sm text-red-500">{errors.address.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Location"}
      </Button>
    </form>
  );
}
