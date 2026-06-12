import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createProductSchema,
  type CreateProductInput,
  type UpdateProductInput,
} from "../schemas/product.schema";

import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Textarea } from "@/shared/components/ui/textarea";
import { useCategories } from "../../categories/hooks/useCategories";
import { useBrands } from "../../brands/hooks/useBrands";
import { useSuppliers } from "../../suppliers/hooks/useSuppliers";

interface Props {
  defaultValues?: Partial<UpdateProductInput>;
  onSubmit: (values: CreateProductInput) => void;
  isLoading?: boolean;
}

type ProductFormValues = CreateProductInput;

const emptyVariant = {
  sku: "",
  barcode: "",
  color: "",
  size: "",
  gender: "MALE" as const,
  costPrice: 0,
  sellingPrice: 0,
  mrp: 0,
  reorderLevel: 10,
};

const toList = <T,>(value: { items?: T[] } | T[] | undefined | null): T[] =>
  Array.isArray(value) ? value : (value?.items ?? []);

export function ProductForm({ defaultValues, onSubmit, isLoading }: Props) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(createProductSchema) as any,

    defaultValues: {
      name: "",
      styleCode: "",
      description: "",
      categoryId: "",
      brandId: undefined,
      supplierId: undefined,
      imageUrls: [],
      variants: [emptyVariant],
    },
  });

  const { register, control, handleSubmit, reset } = form;

  useEffect(() => {
    if (defaultValues) {
      reset({
        ...defaultValues,

        variants: defaultValues.variants?.map((variant: any) => ({
          ...variant,
          barcode: variant.barcode ?? "",
          color: variant.color ?? "",
          size: variant.size ?? "",
          costPrice: Number(variant.costPrice) || 0,
          sellingPrice: Number(variant.sellingPrice) || 0,
          mrp: Number(variant.mrp) || Number(variant.sellingPrice) || 0,
          reorderLevel: Number(variant.reorderLevel) || 10,
        })) || [emptyVariant],
      } as ProductFormValues);
    }
  }, [defaultValues, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const { data: categories } = useCategories();
  const { data: brands } = useBrands();
  const { data: suppliers } = useSuppliers();
  const categoryOptions = toList(categories);
  const brandOptions = toList(brands);
  const supplierOptions = toList(suppliers);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      {/* PRODUCT INFO */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Product Name</label>
          <Input
            {...register("name")}
            className="w-full rounded-lg border p-3"
            placeholder="Mens Corduroy Pant"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Style Code</label>

          <Input
            {...register("styleCode")}
            className="w-full rounded-lg border p-3"
            placeholder="01-2016-R-RQ1001"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>

        <Textarea
          {...register("description")}
          className="w-full rounded-lg border p-3"
          rows={4}
        />
      </div>

      {/* CATEGORY / BRAND / SUPPLIER */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>

          <select
            {...register("categoryId")}
            className="w-full rounded-lg border p-3"
          >
            <option value="">Select Category</option>

            {categoryOptions.map((category: any) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Brand</label>

          <select
            {...register("brandId", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
            className="w-full rounded-lg border p-3"
          >
            <option value="">Select Brand</option>

            {brandOptions.map((brand: any) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">Supplier</label>

          <select
            {...register("supplierId", {
              setValueAs: (value) => (value === "" ? undefined : value),
            })}
            className="w-full rounded-lg border p-3"
          >
            <option value="">Select Supplier</option>

            {supplierOptions.map((supplier: any) => (
              <option key={supplier.id} value={supplier.id}>
                {supplier.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VARIANTS */}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Product Variants</h2>

          <Button
            type="button"
            variant="outline"
            onClick={() =>
              append({
                sku: "",
                barcode: "",
                color: "",
                size: "",
                gender: "MALE",
                costPrice: 0,
                sellingPrice: 0,
                mrp: 0,
                reorderLevel: 10,
              })
            }
          >
            Add Variant
          </Button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="space-y-4 rounded-2xl border p-5">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input
                {...register(`variants.${index}.sku`)}
                placeholder="SKU"
                className="rounded-lg border p-3"
              />

              <Input
                {...register(`variants.${index}.barcode`)}
                placeholder="Barcode"
                className="rounded-lg border p-3"
              />

              <Input
                {...register(`variants.${index}.color`)}
                placeholder="Color"
                className="rounded-lg border p-3"
              />

              <Input
                {...register(`variants.${index}.size`)}
                placeholder="Size"
                className="rounded-lg border p-3"
              />

              <select
                {...register(`variants.${index}.gender`)}
                className="rounded-lg border p-3"
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="UNISEX">Unisex</option>
                <option value="BOYS">Boys</option>
                <option value="GIRLS">Girls</option>
                <option value="KIDS">Kids</option>
              </select>

              <Input
                type="number"
                step="0.01"
                {...register(`variants.${index}.costPrice`, {
                  valueAsNumber: true,
                })}
                placeholder="Cost Price"
                className="rounded-lg border p-3"
              />

              <Input
                type="number"
                step="0.01"
                {...register(`variants.${index}.sellingPrice`, {
                  valueAsNumber: true,
                })}
                placeholder="Selling Price"
                className="rounded-lg border p-3"
              />

              <Input
                type="number"
                step="0.01"
                {...register(`variants.${index}.mrp`, {
                  valueAsNumber: true,
                })}
                placeholder="MRP"
                className="rounded-lg border p-3"
              />

              <Input
                type="number"
                {...register(`variants.${index}.reorderLevel`, {
                  valueAsNumber: true,
                })}
                placeholder="Reorder Level"
                className="rounded-lg border p-3"
              />
            </div>

            <Button
              type="button"
              variant="destructive"
              disabled={fields.length === 1}
              onClick={() => remove(index)}
            >
              Remove Variant
            </Button>
          </div>
        ))}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
