import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/.*"],
      serverModuleFormat: "esm",
    }),
    tsconfigPaths()
  ],
  css: {
    postcss: true,
  },
  server: {
    fs: {
      allow: ["../"],
    },
    port: 3000,
    host: "localhost",
  },
  optimizeDeps: {
    exclude: ["@remix-run/dev/server-build"],
  },
});
