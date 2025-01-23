import { useNavigate } from "@remix-run/react";
import { useState } from "react";
import { supabase } from "~/utils/supabase.client";

export default function RegisterRoute() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    setSuccess(false);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!email || !password || !confirmPassword) {
      setError("Todos los campos son requeridos");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    try {
      console.log("Intentando registrar usuario...");
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: email.split('@')[0],
          }
        },
      });

      if (signUpError) {
        console.error("Error de registro:", signUpError);
        if (signUpError.message.includes("unique constraint")) {
          setError("Ya existe una cuenta con este email.");
        } else if (signUpError.message.includes("valid email")) {
          setError("Por favor ingresa un email válido.");
        } else {
          setError(`Error al crear la cuenta: ${signUpError.message}`);
        }
        return;
      }

      if (data?.user) {
        console.log("Usuario registrado exitosamente:", data.user);
        setSuccess(true);
        // No redirigimos inmediatamente para mostrar el mensaje de confirmación
      } else {
        setError("No se pudo crear la cuenta. Por favor intenta de nuevo.");
      }
    } catch (err) {
      console.error("Error inesperado:", err);
      setError("Error interno del servidor. Por favor intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight">
          Crear Cuenta
        </h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        {success ? (
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Registro exitoso
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>
                    Se ha enviado un correo de confirmación a tu email.
                    Por favor, revisa tu bandeja de entrada y sigue las instrucciones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6"
              >
                Email
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6"
              >
                Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Mínimo 6 caracteres
              </p>
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium leading-6"
              >
                Confirmar Contraseña
              </label>
              <div className="mt-2">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-destructive/15 p-3">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-destructive">
                      {error}
                    </h3>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold leading-6 text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? "Creando cuenta..." : "Crear Cuenta"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
