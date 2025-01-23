import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Link, useNavigate, Form, useActionData, useNavigation } from "@remix-run/react";
import { json, redirect } from "@remix-run/node";
import { validateEmail, validatePassword } from "~/lib/utils";
import { createUserSession } from "~/utils/auth.server";
import { firebaseAuth } from "~/lib/firebase/client";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useEffect } from "react";

interface ActionData {
  fieldErrors?: {
    email?: string;
    password?: string;
  };
  formError?: string;
}

export const action = async ({ request }: { request: Request }) => {
  const formData = await request.formData();
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;
  const redirectTo = formData.get("redirectTo") as string | null;

  const fieldErrors: ActionData["fieldErrors"] = {};
  if (!validateEmail(email)) {
    fieldErrors.email = "Email inválido";
  }
  if (!validatePassword(password)) {
    fieldErrors.password = "Contraseña muy corta";
  }

  if (Object.keys(fieldErrors).length) {
    return json<ActionData>(
      { fieldErrors },
      { status: 400 }
    );
  }

  if (!email || !password) {
    return json<ActionData>(
      { formError: "Por favor, rellena todos los campos." },
      { status: 400 }
    );
  }

  try {
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const user = userCredential.user;

    if (!user) {
      return json<ActionData>(
        { formError: "Error al iniciar sesión con Firebase." },
        { status: 500 }
      );
    }

    return createUserSession({
      request,
      userId: user.uid,
      remember: false,
      redirectTo: redirectTo || "/dashboard",
    });

  } catch (firebaseError: any) {
    console.error("Error de login con Firebase:", firebaseError);
    let errorMessage = "Error al iniciar sesión. Inténtalo de nuevo.";

    if (firebaseError.code === 'auth/user-not-found' || firebaseError.code === 'auth/wrong-password') {
      errorMessage = "Credenciales inválidas. Verifica tu email y contraseña.";
    } else if (firebaseError.code === 'auth/too-many-requests') {
      errorMessage = "Demasiados intentos fallidos. Intenta de nuevo más tarde.";
    }

    return json<ActionData>(
      { formError: errorMessage },
      { status: 401 }
    );
  }
};

export default function LoginRoute() {
  const actionData = useActionData<ActionData>();
  const navigation = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
      if (user) {
        navigate("/dashboard", { replace: true });
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Iniciar Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <Form method="post" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
              />
              {actionData?.fieldErrors?.email && (
                <p className="text-sm text-red-500">{actionData.fieldErrors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
              />
              {actionData?.fieldErrors?.password && (
                <p className="text-sm text-red-500">{actionData.fieldErrors.password}</p>
              )}
            </div>
            {actionData?.formError && (
              <p className="text-sm text-red-500">{actionData.formError}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={navigation.state === "submitting"}
            >
              {navigation.state === "submitting"
                ? "Iniciando sesión..."
                : "Iniciar Sesión"}
            </Button>
            <p className="text-sm text-center">
              ¿No tienes una cuenta?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Regístrate
              </Link>
            </p>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
