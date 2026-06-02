import PurchasesPage from "./pages/PurchasesPage";
import PurchaseFormPage from "./pages/PurchaseFormPage";
import PurchaseDetailsPage from "./pages/PurchaseDetailsPage";

export const purchaseRoutes = [
  { path: "purchases", element: <PurchasesPage /> },
  { path: "purchases/new", element: <PurchaseFormPage /> },
  { path: "purchases/:id", element: <PurchaseDetailsPage /> },
];
