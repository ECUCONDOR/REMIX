import { createServerClient } from '@supabase/auth-helpers-remix';
import { createClient } from '@supabase/supabase-js';
import { redirect } from '@remix-run/node';
import type { Session } from '@supabase/supabase-js';

// Use development defaults if environment variables are not set
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xyzcompany.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhtdHBrdnBzc2NqaHp2YmNqeHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU4NzU1NjgsImV4cCI6MjAyMTQ1MTU2OH0.gqsM_hKwxqjw3zwk7FNkbX9pqZB9FFOZXLhPwDnLD_M';

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

export async function requireAuth(request: Request) {
  const response = new Response();
  const supabaseClient = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    { request, response }
  );

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  if (!session) {
    throw redirect('/login');
  }

  return {
    supabase: supabaseClient,
    headers: response.headers,
    user: session.user,
  };
}

export async function getSession(request: Request): Promise<Session | null> {
  const response = new Response();
  const supabaseClient = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    { request, response }
  );

  const {
    data: { session },
  } = await supabaseClient.auth.getSession();

  return session;
}

export async function signOut(request: Request) {
  const response = new Response();
  const supabaseClient = createServerClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY,
    { request, response }
  );

  const { error } = await supabaseClient.auth.signOut();

  if (error) {
    console.error('Error signing out:', error.message);
    throw new Error('Error signing out');
  }

  return redirect('/login', {
    headers: response.headers,
  });
}
