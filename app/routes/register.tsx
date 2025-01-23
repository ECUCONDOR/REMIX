import { useNavigate, Link } from "@remix-run/react";
import { useState } from "react";
import { firebaseAuth } from "~/lib/firebase/client";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { Checkbox } from "~/components/ui/checkbox";

export default function RegisterRoute() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [acceptedPolicies, setAcceptedPolicies] = useState(false);

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

    if (!acceptedPolicies) {
      setError("Debes aceptar los términos y condiciones para continuar");
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
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);
      await sendEmailVerification(userCredential.user);

      setSuccess(true);
      setError(null);
      console.log("Usuario registrado exitosamente");

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err: any) {
      console.error("Error al registrar usuario:", err);
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo electrónico ya está registrado");
      } else {
        setError("Error al crear la cuenta. Por favor, intenta nuevamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Crear Cuenta</CardTitle>
          <CardDescription className="text-center">
            Ingresa tus datos para registrarte en ECUCONDOR
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Correo Electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="w-full"
                placeholder="tu@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="w-full"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                required
                className="w-full"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="policies"
                checked={acceptedPolicies}
                onCheckedChange={(checked) => setAcceptedPolicies(checked as boolean)}
              />
              <Label htmlFor="policies" className="text-sm">
                He leído y acepto los{" "}
                <Link to="/politicas" className="text-blue-600 hover:text-blue-800">
                  términos y condiciones
                </Link>
              </Label>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert>
                <AlertDescription>
                  ¡Cuenta creada exitosamente! Serás redirigido al inicio de sesión...
                </AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !acceptedPolicies}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-600">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Inicia sesión
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
