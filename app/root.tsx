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
import { createBrowserClient } from "@supabase/auth-helpers-remix";
import { useState } from "react";
import { createServerClient } from "@supabase/auth-helpers-remix";
import "~/styles/app.css";
import { Navbar } from "~/components/navbar";

declare global {
  interface Window {
    ENV: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    };
  }
}

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://rsms.me/" },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const env = {
    SUPABASE_URL: process.env.SUPABASE_URL!,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY!,
  };

  const response = new Response();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      request,
      response,
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const headers = response.headers;

  return json(
    {
      env,
      session,
    },
    {
      headers,
    }
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <html>
        <head>
          <title>¡Oops! - {error.status}</title>
          <Meta />
          <Links />
        </head>
        <body className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              {error.status} - {error.statusText}
            </h1>
            <p className="text-gray-600 mb-4">{error.data}</p>
            <a
              href="/"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Volver al inicio
            </a>
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html>
      <head>
        <title>¡Oops! - Error Inesperado</title>
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Error Inesperado
          </h1>
          <p className="text-gray-600 mb-4">
            Lo sentimos, ha ocurrido un error. Por favor, inténtalo de nuevo.
          </p>
          <a
            href="/"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Volver al inicio
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const { env, session } = useLoaderData<typeof loader>();
  const [supabase] = useState(() =>
    createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY)
  );

  return (
    <html lang="es" suppressHydrationWarning>
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
            <Outlet context={{ supabase, session }} />
          </div>
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify({
              SUPABASE_URL: env.SUPABASE_URL,
              SUPABASE_ANON_KEY: env.SUPABASE_ANON_KEY,
            })}`,
          }}
        />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
