import React from "react";
import ReactDOM from "react-dom/client";
import "./custom.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./Header";
import InvoiceMainView from "./InvoiceMainView";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Header />
    <InvoiceMainView />
  </React.StrictMode>
);
