import { json } from "@remix-run/node";
import { useLoaderData, useRevalidator } from "@remix-run/react";
import { requireAuth } from "~/utils/auth.server";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { AlertCircle, Copy, Upload } from 'lucide-react';
import { Alert, AlertDescription } from "~/components/ui/alert";
import { useState, useEffect } from 'react';
import { firebaseAuth } from "~/lib/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { useNavigate } from "@remix-run/react";

export const loader = async ({ request }: { request: Request }) => {
  const { session, response } = await requireAuth(request);
  
  if (!session) {
    throw new Error("No session found");
  }

  const pairs = ['USDTBRL', 'USDTARS', 'USDTGBP'];
  const responses = await Promise.all(
    pairs.map(pair => 
      fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`)
        .catch(() => null)
    )
  );

  const rates = await Promise.all(
    responses.map(async (r) => {
      if (!r) return null;
      try {
        return await r.json();
      } catch {
        return null;
      }
    })
  );

  const formattedRates = {
    USDARS: rates[1]?.price || "1315",
    USDBRL: rates[0]?.price || "5.03",
    ARSBRL: "0.0038",
  };

  const headers = response.headers;
  return json({ 
    email: session.user.email,
    rates: formattedRates
  }, {
    headers
  });
};

export default function Exchange() {
  const { email, rates } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("ARS");
  const [includeCommission, setIncludeCommission] = useState(false);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<{
    error: string | null;
    success: string | null;
  }>({ error: null, success: null });
  const revalidator = useRevalidator();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setUploadStatus({ 
          error: "El archivo no debe superar los 5MB",
          success: null 
        });
        setSelectedFile(null);
        event.target.value = "";
      } else {
        setUploadStatus({ error: null, success: null });
        setSelectedFile(file);
        setUploadProgress(0);
      }
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile || !user) {
      setUploadStatus({
        error: "No se pudo inicializar el cliente de Supabase o no se seleccionó ningún archivo.",
        success: null
      });
      return;
    }

    try {
      setLoading(true);
      setUploadProgress(30);

      if (!['image/jpeg', 'image/png', 'application/pdf'].includes(selectedFile.type)) {
        setUploadStatus({
          error: "Formato de archivo no válido. Use JPG, PNG o PDF.",
          success: null
        });
        return;
      }

      if (!email) {
        setUploadStatus({
          error: "No se pudo obtener el correo electrónico del usuario.",
          success: null
        });
        return;
      }

      setUploadProgress(50);

      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${email.replace('@', '_')}_${Date.now()}.${fileExt}`;
      const filePath = `receipts/${fileName}`;

      const { error: uploadError } = await firebaseAuth.storage()
        .ref(filePath)
        .put(selectedFile);

      if (uploadError) {
        console.error('Error subiendo comprobante:', uploadError);
        setUploadStatus({
          error: "No se pudo subir el comprobante. Intente nuevamente.",
          success: null
        });
        return;
      }

      setUploadProgress(80);

      const { error: dbError } = await firebaseAuth.firestore()
        .collection('transactions')
        .add({
          user_id: email,
          type: 'exchange',
          amount: parseFloat(amount),
          currency: fromCurrency,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (dbError) {
        console.error('Error guardando metadatos:', dbError);
        setUploadStatus({
          error: "No se pudieron guardar los metadatos del comprobante.",
          success: null
        });
        return;
      }

      setUploadProgress(100);
      setSelectedFile(null);
      setUploadStatus({
        error: null,
        success: "Comprobante subido exitosamente"
      });
      
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
    } catch (err) {
      console.error('Error en handleFileUpload:', err);
      setUploadStatus({
        error: "Ocurrió un error inesperado",
        success: null
      });
    } finally {
      setLoading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
  };

  const calculateExchange = () => {
    if (!amount) {
      setError("Por favor ingrese un monto");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Por favor ingrese un monto válido");
      return;
    }

    setError("");
    let rate;
    let exchangeAmount;

    if (fromCurrency === "USD" && toCurrency === "ARS") {
      rate = parseFloat(rates.USDARS);
    } else if (fromCurrency === "USD" && toCurrency === "BRL") {
      rate = parseFloat(rates.USDBRL);
    } else if (fromCurrency === "ARS" && toCurrency === "BRL") {
      rate = parseFloat(rates.ARSBRL);
    } else {
      setError("Combinación de monedas no soportada");
      return;
    }

    exchangeAmount = numAmount * rate;

    if (includeCommission) {
      const commission = numAmount <= 15 ? 
        0.05 * 0.50 : 
        0.05;
      exchangeAmount = exchangeAmount * (1 - commission);
    }

    setResult(`${numAmount} ${fromCurrency} = ${exchangeAmount.toFixed(2)} ${toCurrency}`);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      revalidator.revalidate();
    }, 30000);
    return () => clearInterval(interval);
  }, [revalidator]);

  return (
    <div className="min-h-screen bg-[#0f1421] text-white p-6">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-blue-800/30 backdrop-blur-sm border-blue-700/50">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-white">ECUCONDOR - Sistema de transacciones de Divisas</CardTitle>
            <div className="flex flex-col items-center justify-center gap-2 text-lg font-semibold text-blue-200">
              <div>1 USD = {rates.USDARS} ARS</div>
              <div>1 USD = {rates.USDBRL} BRL</div>
              <div>1 ARS = {rates.ARSBRL} BRL</div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive" className="bg-red-900/50 border-red-700">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-4">
              <div>
                <Label className="text-blue-200">Monto</Label>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Ingrese el monto"
                  className="bg-blue-900/50 border-blue-700 text-white placeholder:text-blue-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-blue-200">De</Label>
                  <RadioGroup value={fromCurrency} onValueChange={setFromCurrency}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="USD" id="from-usd" className="border-blue-700" />
                      <Label htmlFor="from-usd" className="text-blue-200">USD</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ARS" id="from-ars" className="border-blue-700" />
                      <Label htmlFor="from-ars" className="text-blue-200">ARS</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-blue-200">A</Label>
                  <RadioGroup value={toCurrency} onValueChange={setToCurrency}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="ARS" id="to-ars" className="border-blue-700" />
                      <Label htmlFor="to-ars" className="text-blue-200">ARS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="BRL" id="to-brl" className="border-blue-700" />
                      <Label htmlFor="to-brl" className="text-blue-200">BRL</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="commission"
                  checked={includeCommission}
                  onCheckedChange={(checked) => setIncludeCommission(checked as boolean)}
                  className="border-blue-700"
                />
                <Label htmlFor="commission" className="text-blue-200">
                  Tasas de Transacción, Administrativas, Conversión, Plataforma (5%)
                </Label>
              </div>

              <Button 
                onClick={calculateExchange} 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                Calcular
              </Button>

              {result && (
                <div className="space-y-4">
                  <div className="relative">
                    <pre className="whitespace-pre-wrap p-4 bg-blue-900/50 rounded-lg text-blue-200">
                      {result}
                    </pre>
                    <Button
                      variant="outline"
                      size="icon"
                      className="absolute top-2 right-2 border-blue-700 text-blue-200 hover:bg-blue-700/50"
                      onClick={copyToClipboard}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              <div className="mt-6 p-4 border border-blue-700 rounded-lg space-y-4">
                <h3 className="text-lg font-semibold text-blue-200">Subir Comprobante de Pago</h3>
                
                <div className="space-y-2">
                  <Input
                    type="file"
                    onChange={handleFileSelect}
                    accept=".jpg,.jpeg,.png,.pdf"
                    className="bg-blue-900/50 border-blue-700 text-blue-200
                             file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 
                             file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  {selectedFile && (
                    <p className="text-sm text-blue-200">
                      Archivo seleccionado: {selectedFile.name}
                    </p>
                  )}
                </div>

                {uploadProgress > 0 && (
                  <div className="w-full bg-blue-900/50 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                {uploadStatus.error && (
                  <Alert variant="destructive" className="bg-red-900/50 border-red-700">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{uploadStatus.error}</AlertDescription>
                  </Alert>
                )}

                {uploadStatus.success && (
                  <Alert className="bg-green-900/50 border-green-700">
                    <AlertDescription className="text-green-200">{uploadStatus.success}</AlertDescription>
                  </Alert>
                )}

                <Button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || uploadProgress > 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Subir Comprobante
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
