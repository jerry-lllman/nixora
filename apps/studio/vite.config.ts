import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// import tailwindcss from "@tailwindcss/vite"

export default defineConfig({
  plugins: [react(),
    //  tailwindcss()
    ],
  server: {
    port: 5173
  },
  define: {
    'API_BASE_URL': JSON.stringify(process.env.VITE_API_URL ?? "http://localhost:3333")
  }
});
