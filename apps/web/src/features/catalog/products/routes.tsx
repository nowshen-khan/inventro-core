import ProductsPage from "./pages/ProductsPage";

import ProductForm from "./pages/ProductFormPage";

export const productRoutes = [
  {
    path: "products",
    element: <ProductsPage />,
  },

  {
    path: "products/new",
    element: <ProductForm />,
  },

  {
    path: "products/:id/edit",
    element: <ProductForm />,
  },
];
