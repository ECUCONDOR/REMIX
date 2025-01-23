import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { supabase } from "~/utils/supabase.client";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error("Error al cerrar sesión:", error);
      }
      
      navigate("/");
    };

    handleLogout();
  }, [navigate]);

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Cerrando sesión...
        </h1>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Por favor espera mientras cerramos tu sesión.
        </p>
      </div>
    </div>
  );
}
