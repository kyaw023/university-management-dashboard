import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import IndexRoutes from "./route/indexRoutes.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import { Toaster } from "./components/ui/sonner.tsx";
import { CircleCheckBig, XCircle } from "lucide-react";
import { ThemeProvider } from "./components/theme-provider.tsx";
import { NextUIProvider } from "@nextui-org/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <NextUIProvider>
        <Provider store={store}>
          <IndexRoutes />
        </Provider>
        <Toaster
          className=" dark:bg-slate-900"
          toastOptions={{
            classNames: {
              error:
                " font-roboto ms-1 text-sm border border-red-500 text-red-500 bg-white dark:bg-slate-900",
              success:
                "border font-roboto text-sm ms-1 border-green-500 text-green-500 bg-white dark:bg-slate-900",
            },
          }}
          icons={{
            success: <CircleCheckBig size={20} />,

            error: <XCircle size={20} />,
          }}
        />
      </NextUIProvider>
    </ThemeProvider>
  </React.StrictMode>
);
