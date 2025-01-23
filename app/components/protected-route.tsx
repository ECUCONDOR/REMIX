import { useOutletContext, Navigate } from '@remix-run/react';
import type { SupabaseClient, Session } from '@supabase/supabase-js';

type ContextType = {
  supabase: SupabaseClient;
  session: Session | null;
};

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { session } = useOutletContext<ContextType>();

  if (!session) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
