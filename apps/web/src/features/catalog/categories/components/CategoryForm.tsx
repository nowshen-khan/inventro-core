import { useForm } from "react-hook-form";

import { Button } from "@/shared/components/ui/button";

interface Props {
  defaultValues?: any;

  onSubmit: (values: any) => void;

  isLoading?: boolean;
}

export function CategoryForm({
  defaultValues,

  onSubmit,

  isLoading,
}: Props) {
  const {
    register,

    handleSubmit,
  } = useForm({
    defaultValues: {
      name: "",

      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium">Category Name</label>

        <input {...register("name")} className="w-full rounded-lg border p-3" />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Category"}
      </Button>
    </form>
  );
}
