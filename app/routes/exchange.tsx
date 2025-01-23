import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { ProtectedRoute } from "~/components/auth/protected-route";
import { ExchangeForm } from "~/components/exchange/exchange-form";
import { FileUpload } from "~/components/exchange/file-upload";
import { ExchangeRates } from "~/components/exchange/exchange-rates";
import { Card } from "~/components/ui/card";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";

export const loader = async () => {
  return json({
    rates: {
      USD: 1,
      EUR: 0.92,
      BRL: 4.93,
      ARS: 823.45,
    }
  });
};

export default function Exchange() {
  const { rates } = useLoaderData<typeof loader>();
  const [error, setError] = useState<string | null>(null);
  const [confirmationMessage, setConfirmationMessage] = useState("");

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            Realizar Transacción
          </h1>
          
          {error && (
            <Alert variant="destructive" className="mb-6 bg-red-900/50 border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {confirmationMessage && (
            <Alert className="mb-6 bg-green-900/50 border-green-700">
              <AlertDescription className="text-green-200">{confirmationMessage}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Tasas de Cambio Actuales</h2>
              <ExchangeRates rates={rates} />
            </Card>

            <Card className="p-6 bg-gray-800/50 backdrop-blur-lg border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-6">Formulario de Transacción</h2>
              <ExchangeForm 
                rates={rates}
                onError={setError}
                onSuccess={setConfirmationMessage}
              />
              <div className="mt-6">
                <FileUpload />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}