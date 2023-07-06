import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/custom.scss";
import "bootstrap/dist/css/bootstrap.min.css";

import AppView from "./views/AppView";
import ErrorPage from "./components/ErrorPage";
import InvoiceMainView from "./views/InvoiceMainView";
import JsonMainView from "./views/JsonMainView";

const router = createBrowserRouter([
  {
    path: "/edit",
    element: <AppView />,
    children: [
      {
        path: "/edit/manual",
        element: <InvoiceMainView />,
      },
      {
        path: "/edit/json",
        element: <JsonMainView />,
      },
    ],
  },
  {
    path: "/",
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
