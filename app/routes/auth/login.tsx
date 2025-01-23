import { json, redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { createSupabaseServerClient } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    const { email, password } = await request.json();
    const response = new Response();
    const supabase = createSupabaseServerClient({ request, response });

    if (!email || !password) {
      return json(
        { message: "Email y contraseña son requeridos" },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes("Invalid login credentials")) {
        return json(
          { message: "Credenciales inválidas. Verifica tu email y contraseña." },
          { 
            status: 401,
            headers: response.headers,
          }
        );
      }
      return json(
        { message: "Error al iniciar sesión. Inténtalo de nuevo." },
        { 
          status: 500,
          headers: response.headers,
        }
      );
    }

    return redirect("/dashboard", {
      headers: response.headers,
    });
  } catch (error) {
    console.error("Error en login:", error);
    return json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
};
