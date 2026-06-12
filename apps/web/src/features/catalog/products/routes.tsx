import ProductsPage from "./pages/ProductsPage";

import ProductForm from "./pages/ProductFormPage";
import ProductAuditLogsPage from "./pages/ProductAuditLogsPage";

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

  {
    path: "products/:id/audit-logs",
    element: <ProductAuditLogsPage />,
  },
];
