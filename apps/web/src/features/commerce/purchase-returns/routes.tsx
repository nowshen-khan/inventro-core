import PurchaseReturnsPage from "./pages/PurchaseReturnsPage";
import PurchaseReturnFormPage from "./pages/PurchaseReturnFormPage";
import PurchaseReturnDetailsPage from "./pages/PurchaseReturnDetailsPage";

export const purchaseReturnRoutes = [
  { path: "purchase-returns", element: <PurchaseReturnsPage /> },
  { path: "purchase-returns/new", element: <PurchaseReturnFormPage /> },
  { path: "purchase-returns/:id", element: <PurchaseReturnDetailsPage /> },
];
