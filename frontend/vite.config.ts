import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import fs from "fs";
import { ViteDevServer } from 'vite';
import { nodePolyfills } from "vite-plugin-node-polyfills";

const serveLocales = () => ({
  name: 'serve-locales',
  configureServer(server: ViteDevServer) {
    server.middlewares.use((req, res, next) => {
      const match = req.url?.match(/^\/locales\/(en|ru)\/([^\/]+)\.json$/);
      if (match) {
        const lang = match[1];
        const ns = match[2];
        const filePath = path.resolve(__dirname, '../shared/locales', lang, `${ns}.json`);
        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Type', 'application/json');
          res.end(fs.readFileSync(filePath));
        } else {
          res.statusCode = 404;
          res.end('Not found');
        }
        return;
      }
      next();
    });
  },
});

const copyLocales = () => ({
  name: 'copy-locales',
  writeBundle() {
    const languages = ['en', 'ru'];
    languages.forEach(lang => {
      const nsFiles = fs.readdirSync(path.resolve(__dirname, '../shared/locales', lang));
      nsFiles.forEach(nsFile => {
        const srcPath = path.resolve(__dirname, '../shared/locales', lang, nsFile);
        const destPath = path.resolve(__dirname, 'dist/locales', lang, nsFile);
        
        // Ensure destination directory exists
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        
        // Copy files
        fs.copyFileSync(srcPath, destPath);
      });
    });
  }
});

export default defineConfig({
  plugins: [
    nodePolyfills(),
    react(),
    serveLocales(), // Add the serveLocales plugin
    copyLocales()   // Add the copyLocales plugin
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
      '~locales': path.resolve(__dirname, '../shared/locales'),
    },
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          telegram: ['@telegram-apps/sdk', '@telegram-apps/sdk-react'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
          ton: ['@ton/core', '@ton/ton', '@tonconnect/ui-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
