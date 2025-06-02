import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    proxy: {
      "/api": {
        target: "http://localhost:3001",
      },
      "/ws": {
        target: "ws://localhost:3001",
      },
    },
  },
});
