import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import IndexRoutes from "./routes/IndexRoutes.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { Toaster } from "sonner";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <React.StrictMode>
      <NextUIProvider>
        <IndexRoutes />
        <Toaster />
      </NextUIProvider>
    </React.StrictMode>
  </Provider>
);
