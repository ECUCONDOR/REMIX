import { json } from "@remix-run/node";
import { Links, LiveReload, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import { getSession } from "~/utils/auth.server";

export const loader = async ({ request }: { request: Request }) => {
  const sessionData = await getSession(request);
  const remixSession = sessionData?.remixSession;
  const firebaseUser = sessionData?.firebaseUser;

  const isLoggedIn = !!firebaseUser;
  const email = firebaseUser?.email || null;

  return json({
    isLoggedIn,
    email,
  });
};

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
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}
