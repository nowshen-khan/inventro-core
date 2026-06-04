import { useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
} from "@repo/types/common";

interface Props {
  defaultValues?: UpdateCategoryPayload;

  onSubmit: (values: CreateCategoryPayload | UpdateCategoryPayload) => void;

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
      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>

        <textarea
          {...register("description")}
          className="w-full rounded-lg border p-3"
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Category"}
      </Button>
    </form>
  );
}
