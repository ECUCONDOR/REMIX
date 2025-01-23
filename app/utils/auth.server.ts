import { createServerClient, type CookieOptions } from '@supabase/auth-helpers-remix';
import { redirect } from '@remix-run/node';
import { getSession, commitSession, destroySession } from './cookies.server';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY must be set');
}

export const getSupabaseClient = (request: Request, response?: Response) => {
  return createServerClient(supabaseUrl, supabaseKey, {
    request,
    response: response ?? new Response(),
    cookieOptions: {
      name: '__supabase_session',
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    }
  });
};

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
  const session = await getSession(request);
  session.set('userId', userId);

  return redirect(redirectTo, {
    headers: {
      'Set-Cookie': await commitSession(session, {
        maxAge: remember ? 60 * 60 * 24 * 7 : undefined,
      }),
    },
  });
}

export async function getUserSession(request: Request) {
  return getSession(request);
}

export async function getUserId(request: Request): Promise<string | undefined> {
  const session = await getUserSession(request);
  return session.get('userId');
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;
  return { id: userId };
}

export async function requireAuth(request: Request) {
  const response = new Response();
  const supabase = getSupabaseClient(request, response);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    throw redirect('/login');
  }

  return { session, response };
}

async function logout(request: Request) {
  const response = new Response();
  const supabase = getSupabaseClient(request, response);
  await supabase.auth.signOut();
  
  const session = await getSession(request);
  return redirect('/', {
    headers: {
      'Set-Cookie': await destroySession(session),
    },
  });
}

export async function destroyUserSession(request: Request, redirectTo: string) {
  return await logout(request);
}

export async function getSupabaseSession(request: Request) {
  const supabase = getSupabaseClient(request);
  return await supabase.auth.getSession();
}
