import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "@remix-run/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { firebaseAuth } from "~/lib/firebase/client";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Card } from "~/components/ui/card";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Si ya está autenticado, redirigir
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
      if (user) {
        navigate(decodeURIComponent(redirectTo));
      }
    });

    return () => unsubscribe();
  }, [navigate, redirectTo]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signInWithEmailAndPassword(firebaseAuth, email, password);
      // La redirección se manejará en el useEffect
    } catch (err: any) {
      console.error("Error en login:", err);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1421] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 bg-[#1a2332] border-blue-500/20">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Iniciar Sesión</h2>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded p-3 mb-4 text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0f1421] border-blue-500/20 focus:border-blue-400"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
              Contraseña
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0f1421] border-blue-500/20 focus:border-blue-400"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                Ingresando...
              </div>
            ) : (
              "Ingresar"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
