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
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV),
      'process.env.FIREBASE_API_KEY': JSON.stringify(env.FIREBASE_API_KEY),
      'process.env.FIREBASE_AUTH_DOMAIN': JSON.stringify(env.FIREBASE_AUTH_DOMAIN),
      'process.env.FIREBASE_PROJECT_ID': JSON.stringify(env.FIREBASE_PROJECT_ID),
      'process.env.FIREBASE_STORAGE_BUCKET': JSON.stringify(env.FIREBASE_STORAGE_BUCKET),
      'process.env.FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(env.FIREBASE_MESSAGING_SENDER_ID),
      'process.env.FIREBASE_APP_ID': JSON.stringify(env.FIREBASE_APP_ID),
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
