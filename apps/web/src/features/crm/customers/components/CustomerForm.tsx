import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import type { Customer, CreateCustomerPayload } from "@repo/types/common";
// import { toast } from "sonner";

interface Props {
  defaultValues?: Partial<Customer>;
  onSubmit: (values: CreateCustomerPayload) => void;
  isLoading?: boolean;
}

export function CustomerForm({ defaultValues, onSubmit, isLoading }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateCustomerPayload>({
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
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
        <input
          {...register("name", { required: "Customer name required" })}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Phone</label>
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone.message}</p>
        )}
        <input
          {...register("phone", {
            required: "Customer phone required",
            pattern: {
              value: /^01[3-9]\d{8}$/,
              message: "Invalid phone number",
            },
          })}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Email</label>

        <input
          {...register("email")}
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
        {isLoading ? "Saving..." : "Save Customer"}
      </Button>
    </form>
  );
}
