import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import type { Supplier, CreateSupplierDto } from "@repo/types/supplier";

interface Props {
  defaultValues?: Partial<Supplier>;
  onSubmit: (values: CreateSupplierDto) => void;
  isLoading?: boolean;
}

export function SupplierForm({ defaultValues, onSubmit, isLoading }: Props) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Name</label>

        <input {...register("name")} className="w-full rounded-lg border p-3" />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>

        <input
          {...register("email")}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Phone</label>

        <input
          {...register("phone")}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Address</label>

        <textarea
          {...register("address")}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Supplier"}
      </Button>
    </form>
  );
}
