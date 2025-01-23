import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
  useLoaderData,
} from "@remix-run/react";
import { json, type LinksFunction, type LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "~/utils/auth.server";
import "~/styles/app.css";
import "./tailwind.css";
import "./styles/animations.css";
import { Navbar } from "~/components/navbar";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://rsms.me/" },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const sessionData = await getSession(request);
  const firebaseUser = sessionData?.firebaseUser;

  return json({
    ENV: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
    },
    isLoggedIn: !!firebaseUser,
    email: firebaseUser?.email || null,
  });
}

export function ErrorBoundary() {
  const error = useRouteError();

  let errorMessage = "Lo sentimos, ha ocurrido un error inesperado.";
  let errorTitle = "Error";

  if (isRouteErrorResponse(error)) {
    errorMessage = error.data?.message || error.statusText;
    errorTitle = `Error ${error.status}`;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html>
      <head>
        <title>Error!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen bg-[#0f1421] text-white flex items-center justify-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md w-full mx-4">
            <h1 className="text-xl font-semibold text-red-400 mb-2">{errorTitle}</h1>
            <p className="text-gray-300">{errorMessage}</p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="min-h-screen bg-background font-sans antialiased">
          <Navbar />
          <div className="flex-1">
            <Outlet />
          </div>
        </div>
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
