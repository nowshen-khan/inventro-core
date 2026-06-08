import CustomersPage from "@/features/crm/customers/pages/CustomersPage";
import StockPage from "./stock/pages/StockPage";
import StockAdjustmentsPage from "./stock-adjustments/pages/StockAdjustmentsPage";
import StockAdjustmentFormPage from "./stock-adjustments/pages/StockAdjustmentFormPage";
import StockAdjustmentDetailsPage from "./stock-adjustments/pages/StockAdjustmentDetailsPage";
import LocationsPage from "./locations/pages/LocationsPage";
import BranchesPage from "@/features/settings/branches/pages/BranchesPage";
import CategoriesPage from "@/features/catalog/categories/pages/CategoriesPage";
import BrandsPage from "@/features/catalog/brands/pages/BrandsPage";
import SuppliersPage from "@/features/catalog/suppliers/pages/SuppliersPage";
import LocationFormPage from "./locations/pages/LocationFormPage";
import EditLocationPage from "./locations/pages/EditLocationPage";

export const inventoryRoutes = [
  { path: "inventory", element: <StockPage /> },
  { path: "locations", element: <LocationsPage /> },
  { path: "locations/new", element: <LocationFormPage /> },
  { path: "locations/:id/edit", element: <EditLocationPage /> },
  { path: "branches", element: <BranchesPage /> },
  { path: "categories", element: <CategoriesPage /> },
  { path: "brands", element: <BrandsPage /> },
  { path: "suppliers", element: <SuppliersPage /> },
  { path: "customers", element: <CustomersPage /> },
  {
    path: "stock-adjustments",
    element: <StockAdjustmentsPage />,
  },
  {
    path: "stock-adjustments/new",
    element: <StockAdjustmentFormPage />,
  },
  {
    path: "stock-adjustments/:id",
    element: <StockAdjustmentDetailsPage />,
  },
];
