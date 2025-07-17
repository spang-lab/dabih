import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import pages from "vite-plugin-pages";

export default defineConfig({
  plugins: [react(), tailwindcss(), pages()],
  build: {
    outDir: "./dist",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    proxy: {
      "/api": "http://localhost:3001",
    },
  },
});
