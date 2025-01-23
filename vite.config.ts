import { defineConfig, loadEnv } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno basadas en el modo (development/production)
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  
  return {
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
    define: {
      'process.env.SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL),
      'process.env.SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY),
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
  };
});
