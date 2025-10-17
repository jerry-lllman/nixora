import ReactDOM from "react-dom/client";
import React from "react";
import RendererApp from "./RendererApp.tsx";

const rootElement = document.getElementById("renderer-root");

if (!rootElement) {
  throw new Error("Renderer root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RendererApp />
  </React.StrictMode>
);
