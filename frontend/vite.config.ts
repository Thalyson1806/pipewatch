import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // evita CORS em dev sem precisar configurar variáveis de ambiente
      "/api": "http://localhost:5000",
    },
  },
});
