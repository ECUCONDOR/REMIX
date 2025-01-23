import { createCookieSessionStorage } from '@remix-run/node';

if (!process.env.SESSION_SECRET) {
  throw new Error('SESSION_SECRET must be set');
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: '__supabase_session', // A more specific cookie name
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
    // Add explicit serialization/deserialization for JSON
    serialize: (value) => JSON.stringify(value),
    parse: (value) => {
      try {
        return JSON.parse(value);
      } catch {
        return {}; // Return empty object if parsing fails
      }
    },
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;
