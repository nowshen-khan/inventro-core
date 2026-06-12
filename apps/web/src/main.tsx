// import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import App from "@/app/app";
import { AppInitializer } from "./app/AppInitializer";
import { QueryProvider } from "./app/providers/query-provider";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryProvider>
    <AppInitializer />
    <App />
  </QueryProvider>,
  // </StrictMode>,
);
