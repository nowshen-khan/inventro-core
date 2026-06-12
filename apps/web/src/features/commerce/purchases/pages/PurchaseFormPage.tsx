import { useNavigate } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useCreatePurchase } from "../hooks/useCreatePurchase";
import { useSuppliers } from "@/features/catalog/suppliers/hooks/useSuppliers";
import { useProducts } from "@/features/catalog/products/hooks/useProducts";
import { useLocations } from "@/features/inventory/locations/hooks/useLocations";

export default function PurchaseFormPage() {
  const navigate = useNavigate();

  const createMutation = useCreatePurchase();

  const { register, control, handleSubmit, watch } = useForm({
    defaultValues: {
      invoiceNo: "",
      supplierId: "",
      locationId: "",
      paidAmount: 0,
      items: [
        {
          productVariantId: "",
          quantity: 1,
          costPrice: 0,
          totalPrice: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const { data: suppliersData } = useSuppliers();
  const suppliers = suppliersData?.items ?? [];

  const { data: products } = useProducts({
    limit: 100,
  });

  const { data: locationsData } = useLocations();
  const locations = locationsData?.items ?? [];

  const items = watch("items");
  const onSubmit = async (values: any) => {
    try {
      const payload = {
        ...values,

        items: values.items.map((item: any) => ({
          ...item,
          totalPrice: item.quantity * item.costPrice,
        })),
      };
      await createMutation.mutateAsync(payload);

      navigate("/purchases");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 rounded-2xl bg-white p-6 shadow-sm"
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Input placeholder="Invoice No" {...register("invoiceNo")} />

        <select {...register("supplierId")} className="rounded-lg border p-3">
          <option value="">Select Supplier</option>

          {suppliers.map((supplier: any) => (
            <option key={supplier.id} value={supplier.id}>
              {supplier.name}
            </option>
          ))}
        </select>

        <select {...register("locationId")} className="rounded-lg border p-3">
          <option value="">Select Location</option>

          {locations.map((location: any) => (
            <option key={location.id} value={location.id}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-4"
          >
            <select
              {...register(`items.${index}.productVariantId`)}
              className="rounded-lg border p-3"
            >
              <option value="">Select Variant</option>

              {products?.items?.flatMap((product: any) =>
                product.variants.map((variant: any) => (
                  <option key={variant.id} value={variant.id}>
                    {product.name}
                    {" - "}
                    {variant.color}
                    {" - "}
                    {variant.size}
                  </option>
                )),
              )}
            </select>

            <Input
              type="number"
              placeholder="Quantity"
              {...register(`items.${index}.quantity`, {
                valueAsNumber: true,
              })}
            />

            <Input
              type="number"
              placeholder="Cost Price"
              {...register(`items.${index}.costPrice`, {
                valueAsNumber: true,
              })}
            />

            <Input
              type="number"
              readOnly
              value={
                (items[index]?.quantity || 0) * (items[index]?.costPrice || 0)
              }
              placeholder="Total Price"
            />

            <Button
              type="button"
              variant="destructive"
              disabled={fields.length === 1}
              onClick={() => remove(index)}
            >
              Remove
            </Button>
          </div>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              productVariantId: "",

              quantity: 1,

              costPrice: 0,

              totalPrice: 0,
            })
          }
        >
          Add Item
        </Button>
      </div>

      <Button type="submit">Create Purchase</Button>
    </form>
  );
}
