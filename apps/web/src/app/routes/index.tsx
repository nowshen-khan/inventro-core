import { createBrowserRouter } from "react-router-dom";
import ProtectedLayout from "./protected-layout";
import { authRoutes } from "../../features/auth/routes";
import { dashboardRoutes } from "../../features/dashboard/routes";
import { productRoutes } from "../../features/catalog/products/routes";
import { salesRoutes } from "../../features/commerce/sales/routes";
import { purchaseRoutes } from "../../features/commerce/purchases/routes";
import { transferRoutes } from "../../features/inventory/transfers/routes";
import { inventoryRoutes } from "../../features/inventory/routes";
import { iamRoutes } from "../../features/iam/routes";
import { reportRoutes } from "../../features/reports/routes";

export const router = createBrowserRouter([
  ...authRoutes,

  {
    path: "/",

    element: <ProtectedLayout />,

    children: [
      ...dashboardRoutes,

      ...productRoutes,

      ...salesRoutes,

      ...purchaseRoutes,

      ...transferRoutes,

      ...inventoryRoutes,

      ...iamRoutes,

      ...reportRoutes,
    ],
  },
]);
