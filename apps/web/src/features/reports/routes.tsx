import ExpensesPage from "@/features/finance/expenses/pages/ExpensesPage";
import ReportsPage from "./pages/ReportsPage";

export const reportRoutes = [
  { path: "expenses", element: <ExpensesPage /> },
  { path: "reports", element: <ReportsPage /> },
];
