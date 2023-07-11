import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/custom.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import AppView from "./views/AppView";
import ErrorPage from "./components/ErrorPage";
import InvoiceMainView from "./views/InvoiceMainView";
import JsonMainView from "./views/JsonMainView";
import TermsView from "./views/TermsView";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppView />,
    children: [
      {
        path: "/manual",
        element: <InvoiceMainView />,
      },
      {
        path: "/json",
        element: <JsonMainView />,
      },
      {
        path: "/terms",
        element: <TermsView />,
      },
    ],
    errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
