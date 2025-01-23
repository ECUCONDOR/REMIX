import { json } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utils/auth.server";
import { useState } from "react";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ success: false, message: "Método no permitido" }, { status: 405 });
  }

  try {
    const formData = await request.formData();
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const response = new Response();
    const supabase = createSupabaseServerClient({ request, response });

    if (!email || !password) {
      return json(
        { success: false, message: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    // Validaciones básicas
    if (password.length < 6) {
      return json(
        { success: false, message: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    if (!email.includes("@")) {
      return json(
        { success: false, message: "Por favor ingresa un email válido" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${new URL(request.url).origin}/auth/callback`,
        data: {
          email,
        }
      },
    });

    if (error) {
      console.error("Error de registro:", error);
      
      if (error.message.includes("unique constraint")) {
        return json(
          { success: false, message: "Este email ya está registrado" },
          { status: 400 }
        );
      }

      if (error.message.includes("Invalid API key")) {
        return json(
          { 
            success: false, 
            message: "Error de configuración del servidor. Por favor, contacte al administrador." 
          },
          { status: 500 }
        );
      }

      return json(
        { success: false, message: "Error al crear la cuenta: " + error.message },
        { status: 400 }
      );
    }

    // Configurar headers de la respuesta
    return json(
      {
        success: true,
        message: "Cuenta creada exitosamente. Por favor verifica tu email.",
        user: data.user
      },
      {
        status: 200,
        headers: response.headers
      }
    );

  } catch (error) {
    console.error("Error inesperado:", error);
    return json(
      { success: false, message: "Error interno del servidor" },
      { status: 500 }
    );
  }
};

export default function Register() {
  const actionData = useActionData<typeof action>();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Crear una cuenta
          </h2>
        </div>
        <Form 
          method="post" 
          className="mt-8 space-y-6" 
          onSubmit={() => setIsLoading(true)}
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          {actionData?.message && (
            <div
              className={`p-4 rounded-md ${
                actionData.success
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {actionData.message}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                ¿Ya tienes una cuenta? Inicia sesión
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                isLoading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Registrando...
                </span>
              ) : (
                "Registrarse"
              )}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
