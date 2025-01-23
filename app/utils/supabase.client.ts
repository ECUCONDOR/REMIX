import { createClient } from '@supabase/supabase-js';

declare global {
  interface Window {
    ENV: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
    };
  }
}

// Ensure we're in a browser context
const isBrowser = typeof window !== 'undefined';

let supabaseUrl = '';
let supabaseAnonKey = '';

if (isBrowser) {
  supabaseUrl = window.ENV?.SUPABASE_URL ?? '';
  supabaseAnonKey = window.ENV?.SUPABASE_ANON_KEY ?? '';

  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key length:', supabaseAnonKey?.length ?? 0);

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Error: Variables de entorno de Supabase no encontradas en el cliente.');
    console.error('Asegúrate de que las variables estén definidas en .env y expuestas correctamente en root.tsx');
  }
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  }
});
