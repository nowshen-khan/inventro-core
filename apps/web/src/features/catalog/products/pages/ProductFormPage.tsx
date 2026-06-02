import { useNavigate, useParams } from "react-router-dom";
import { ProductForm } from "../components/ProductForm";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useProduct } from "../hooks/useProduct";

export default function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const { data: product, isLoading } = useProduct(id);
  const createMutation = useCreateProduct();
  const updateMutation = useUpdateProduct();

  const handleSubmit = async (values: any) => {
    try {
      if (isEdit) {
        await updateMutation.mutateAsync({
          id,
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
        defaultValues={product}
        onSubmit={handleSubmit}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />
    </div>
  );
}
