import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [nodePolyfills(), react()],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "esnext",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          telegram: ["@telegram-apps/sdk", "@telegram-apps/sdk-react"],
          ui: ["@radix-ui/react-dialog", "@radix-ui/react-dropdown-menu"],
          ton: ["@ton/core", "@ton/ton", "@tonconnect/ui-react"],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
