import TransferFormPage from "./pages/TransferFormPage";
import TransfersPage from "./pages/TransfersPage";
import TransferDetailsPage from "./pages/TransferDetailsPage";

export const transferRoutes = [
  { path: "transfers", element: <TransfersPage /> },
  {
    path: "transfers/new",
    element: <TransferFormPage />,
  },
  // TODO: Add "transfers/:id/edit" for editable DRAFT transfers.
  {
    path: "transfers/:id",
    element: <TransferDetailsPage />,
  },
];
