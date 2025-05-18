import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      include: ["Buffer", "crypto"],
      exclude: ["fs"],
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
    }),
  ],
  publicDir: "public",
  assetsInclude: ["**/*.ttf"],
});
