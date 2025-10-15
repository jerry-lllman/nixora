import ReactDOM from "react-dom/client";
import React from "react";
import PreviewApp from "./PreviewApp.tsx";
import "@nixora/ui/styles.css";

const rootElement = document.getElementById("preview-root");

if (!rootElement) {
  throw new Error("Preview root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <PreviewApp />
  </React.StrictMode>
);
