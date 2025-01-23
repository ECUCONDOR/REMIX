/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  ignoredRouteFiles: ["**/.*"],
  serverModuleFormat: "cjs",
  tailwind: true,
  serverDependenciesToBundle: [
    /^firebase.*/,
    "@firebase/app",
    "@firebase/auth",
    "@firebase/firestore",
    /^remix-utils.*/,
    // If you installed is-ip optional dependency you will need these too
    "is-ip",
    "ip-regex",
  ],
  // Exponer variables de entorno al cliente
  serverEnv: {
    FIREBASE_API_KEY: true,
    FIREBASE_AUTH_DOMAIN: true,
    FIREBASE_PROJECT_ID: true,
    FIREBASE_STORAGE_BUCKET: true,
    FIREBASE_MESSAGING_SENDER_ID: true,
    FIREBASE_APP_ID: true,
  },
  // Asegurarse de que los módulos de Firebase se manejen correctamente
  future: {
    v2_dev: true,
    v2_errorBoundary: true,
    v2_headers: true,
    v2_meta: true,
    v2_normalizeFormMethod: true,
    v2_routeConvention: true,
  }
};
