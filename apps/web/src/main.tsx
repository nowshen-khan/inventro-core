import React from "react";
import ReactDOM from "react-dom/client";

import "@/app/index.css";
import App from "@/app/app";

import { QueryProvider } from "./app/providers/query-provider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryProvider>
      <App />
    </QueryProvider>
  </React.StrictMode>,
);
