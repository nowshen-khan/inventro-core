import PointOfSale from "./pages/PointOfSalePage";
import SalesPage from "./pages/SalesPage";
import SaleDetailsPage from "./pages/SaleDetailsPage";
import SaleReturnsPage from "@/features/commerce/sale-returns/pages/SaleReturnsPage";
import SaleReturnFormPage from "@/features/commerce/sale-returns/pages/SaleReturnFormPage";
import SaleReturnDetailsPage from "@/features/commerce/sale-returns/pages/SaleReturnDetailsPage";
import ProductExchangesPage from "@/features/commerce/product-exchanges/pages/ProductExchangesPage";
import ProductExchangeFormPage from "@/features/commerce/product-exchanges/pages/ProductExchangeFormPage";

export const salesRoutes = [
  {
    path: "sales",
    element: <SalesPage />,
  },
  {
    path: "sales/pos",
    element: <PointOfSale />,
  },
  {
    path: "sales/:id",
    element: <SaleDetailsPage />,
  },
  {
    path: "sale-returns",
    element: <SaleReturnsPage />,
  },
  {
    path: "sale-returns/new",
    element: <SaleReturnFormPage />,
  },
  {
    path: "sale-returns/:id",
    element: <SaleReturnDetailsPage />,
  },
  {
    path: "product-exchanges",
    element: <ProductExchangesPage />,
  },
  {
    path: "product-exchanges/new",
    element: <ProductExchangeFormPage />,
  },
];
