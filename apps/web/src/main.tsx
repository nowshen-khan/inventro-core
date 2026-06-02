import React from "react";
import ReactDOM from "react-dom/client";

import "@/app/index.css";
import App from "@/app/app";
import { AppInitializer } from "./app/AppInitializer";
import { QueryProvider } from "./app/providers/query-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <AppInitializer />
      <App />
    </QueryProvider>
  </React.StrictMode>,
);
