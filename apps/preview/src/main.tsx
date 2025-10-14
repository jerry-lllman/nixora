import React from "react";
import ReactDOM from "react-dom/client";
import { PreviewApp } from "./PreviewApp";
import "@nixora/ui/styles.css";
import "./styles.css";

const rootElement = document.getElementById("preview-root");

if (!rootElement) {
  throw new Error("Preview root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PreviewApp />
  </React.StrictMode>
);
