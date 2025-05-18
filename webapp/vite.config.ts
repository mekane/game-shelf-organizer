/// <reference types="vite/client" />
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig((configEnv) => ({
  envPrefix: "ENV",
  plugins: [react()],
  resolve: {
    // Note: these need to match the paths in tsconfig.app.json
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@config": path.resolve(__dirname, "src/config"),
      "@components": path.resolve(__dirname, "src/components"),
      "@context": path.resolve(__dirname, "src/context"),
      "@lib": path.resolve(__dirname, "lib"),
      "@pages": path.resolve(__dirname, "src/pages"),
      "@services": path.resolve(__dirname, "src/services"),
      "@themes": path.resolve(__dirname, "src/themes"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@src": path.resolve(__dirname, "src"),
    },
  },
  build: {
    sourcemap: configEnv.mode === "development",
  },
  test: {
    environment: "jsdom",
    root: "src/",
  },
}));
