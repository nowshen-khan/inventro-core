import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import type { Warehouse, CreateWarehouseDto } from "@repo/types/warehouse";

import { useBranches } from "@/features/settings/branches/hooks/useBranches";

interface Props {
  defaultValues?: Partial<Warehouse>;
  onSubmit: (values: CreateWarehouseDto) => void;
  isLoading?: boolean;
}

export function WarehouseForm({ defaultValues, onSubmit, isLoading }: Props) {
  const { data: branches } = useBranches();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateWarehouseDto>({
    defaultValues: {
      name: "",
      code: "",
      branchId: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <div>
        <label className="mb-2 block text-sm font-medium">Warehouse Name</label>

        <input
          {...register("name", {
            required: "Warehouse name required",
          })}
          className="w-full rounded-lg border p-3"
        />

        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Warehouse Code</label>

        <input
          {...register("code", {
            required: "Warehouse code required",
          })}
          className="w-full rounded-lg border p-3"
        />

        {errors.code && (
          <p className="text-sm text-red-500">{errors.code.message}</p>
        )}
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Branch</label>

        <select
          {...register("branchId", {
            required: "Branch required",
          })}
          className="w-full rounded-lg border p-3"
        >
          <option value="">Select Branch</option>

          {branches?.items?.map((branch) => (
            <option key={branch.id} value={branch.id}>
              {branch.name}
            </option>
          ))}
        </select>

        {errors.branchId && (
          <p className="text-sm text-red-500">{errors.branchId.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Warehouse"}
      </Button>
    </form>
  );
}
