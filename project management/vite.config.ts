import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "https://backend.flowspace.cloud", // Backend API base URL
        changeOrigin: true, // Ensure the host header matches the target
        secure: false, // Disable if backend has a self-signed SSL certificate
        rewrite: (path) => path.replace(/^\/api/, ""), // Optional: rewrite path
      },
    },
  },
});
