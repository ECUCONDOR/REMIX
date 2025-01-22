import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useRouteError,
} from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import "~/styles/app.css";
import { Navbar } from "~/components/navbar";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://rsms.me/" },
  { rel: "stylesheet", href: "https://rsms.me/inter/inter.css" },
];

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="relative flex min-h-screen flex-col">
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

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <html lang="es" className="h-full">
        <head>
          <title>{`Error ${error.status}`}</title>
          <Meta />
          <Links />
        </head>
        <body className="min-h-full">
          <div className="min-h-screen bg-background flex flex-col justify-center items-center">
            <div className="rounded-lg bg-card p-8 text-center shadow-xl">
              <h1 className="mb-4 text-4xl font-bold text-destructive">
                {error.status} {error.statusText}
              </h1>
              <p className="text-muted-foreground">Lo sentimos, ha ocurrido un error.</p>
            </div>
          </div>
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="es" className="h-full">
      <head>
        <title>Error Inesperado</title>
        <Meta />
        <Links />
      </head>
      <body className="min-h-full">
        <div className="min-h-screen bg-background flex flex-col justify-center items-center">
          <div className="rounded-lg bg-card p-8 text-center shadow-xl">
            <h1 className="mb-4 text-4xl font-bold text-destructive">
              Error Inesperado
            </h1>
            <p className="text-muted-foreground">Lo sentimos, ha ocurrido un error.</p>
          </div>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
