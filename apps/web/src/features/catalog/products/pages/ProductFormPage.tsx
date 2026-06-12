import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ProductForm } from "../components/ProductForm";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useProduct } from "../hooks/useProduct";
import type { CreateProductInput } from "../schemas/product.schema";

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { data: product, isLoading } = useProduct(id);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const formDefaults = useMemo<Partial<CreateProductInput> | undefined>(() => {
    if (!product) return undefined;

    return {
      name: product.name,
      styleCode: product.styleCode,
      description: product.description ?? "",
      categoryId: product.categoryId,
      brandId: product.brandId ?? undefined,
      supplierId: product.supplierId ?? undefined,
      imageUrls: product.images?.map((image) => image.url) ?? [],
      variants: product.variants?.map((variant) => ({
        sku: variant.sku,
        barcode: variant.barcode ?? "",
        color: variant.color ?? "",
        size: variant.size ?? "",
        gender: variant.gender ?? "MALE",
        costPrice: Number(variant.costPrice) || 0,
        sellingPrice: Number(variant.sellingPrice) || 0,
        mrp: Number(variant.mrp) || Number(variant.sellingPrice) || 0,
        reorderLevel: Number(variant.reorderLevel) || 10,
      })),
    };
  }, [product]);

  const handleSubmit = async (values: CreateProductInput) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id: id!,
          data: values,
        });
      } else {
        await createMutation.mutateAsync(values);
      }

      navigate("/products");
    } catch (error) {
      console.error(error);
    }
  };

  if (isEdit && isLoading) {
    return <div> Loading... </div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {isEdit ? "Edit Product" : "Create Product"}
      </h1>

      <ProductForm
        defaultValues={formDefaults}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
