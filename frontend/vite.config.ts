import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const commonConfig = {
    base: "/app",
    build: {
      target: "es2020",
    },
    optimizeDeps: {
      esbuildOptions: {
        target: "es2020",
      },
    },
    define: {
      global: 'globalThis',
    },
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src/"),
      }
    },
    plugins: [react()],
  };
  if (command === "serve") {
    return commonConfig
  } else {
    return {
      ...commonConfig,
      define: {
        global: (() => {
          let globalVariable = 'globalThis';
          try {
            // Try to import @safe-global/safe-apps-provider
            require.resolve('@safe-global/safe-apps-provider');
            // Try to import @safe-global/safe-apps-sdk
            require.resolve('@safe-global/safe-apps-sdk');
            // If both modules are found, return the custom global variable
            globalVariable = 'global';
          } catch (e) {
            // If either module is not found, fallback to globalThis
            globalVariable = 'globalThis';
          }
          return globalVariable;
        })()
      }
    }
  }
});
