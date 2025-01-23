import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { supabase } from "~/utils/supabase.client";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Verificando...
        </h1>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Por favor espera mientras verificamos tu cuenta.
        </p>
      </div>
    </div>
  );
}
