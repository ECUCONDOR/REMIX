import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { firebaseAuth } from "~/lib/firebase/client";
import { User } from 'firebase/auth';

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET no está configurada en las variables de entorno.");
}

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function createUserSession({
  request,
  userId,
  remember,
  redirectTo,
}: {
  request: Request;
  userId: string;
  remember: boolean;
  redirectTo: string;
}) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: remember
          ? 60 * 60 * 24 * 7
          : undefined,
      }),
    },
  });
}

async function getUserSession(request: Request) {
  return sessionStorage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getUserSession(request);
  return session.get("userId");
}

export async function getUser(request: Request): Promise<{ id: string } | null> {
  const userId = await getUserId(request);
  if (!userId) return null;
  return { id: userId };
}

export async function requireAuth(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return { userId };
}

async function logout(request: Request) {
  const session = await getUserSession(request);
  return sessionStorage.destroySession(session);
}

export async function destroyUserSession(request: Request, redirectTo: string) {
  await firebaseAuth.signOut();

  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await logout(request),
    },
  });
}

export async function getSession(request: Request) {
  const remixSession = await getUserSession(request);
  const userId = remixSession.get("userId");

  let firebaseUser: User | null = null;
  if (userId) {
    firebaseUser = firebaseAuth.currentUser;
  }

  return {
    remixSession,
    firebaseUser,
  };
}
