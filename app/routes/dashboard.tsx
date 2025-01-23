import { useEffect, useState } from "react";
import { firebaseAuth } from "~/lib/firebase/client";
import { onAuthStateChanged, User } from "firebase/auth";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Link } from "@remix-run/react";
import { 
  ArrowUpDown, 
  SendHorizontal, 
  History, 
  DollarSign 
} from "lucide-react";
import { useBalances } from "~/hooks/useBalances";
import { useExchangeRates } from "~/hooks/useExchangeRates";
import { StatCard } from "~/components/ui/stat-card";
import { ProtectedRoute } from "~/components/auth/protected-route";

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { balances, loading: balancesLoading } = useBalances(user);
  const { rates, loading: ratesLoading } = useExchangeRates();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // Función auxiliar para formatear números
  const formatNumber = (value: number | undefined | null, decimals: number = 2) => {
    if (value === undefined || value === null) return "0.00";
    return value.toFixed(decimals);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-red-500">Error</h2>
          <p>{error}</p>
        </Card>
      </div>
    );
  }

  if (!user || balancesLoading || ratesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f1421] text-white">
        <main className="container mx-auto px-4 py-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Balance USD"
              value={formatNumber(balances?.USD)}
              icon={<DollarSign className="h-6 w-6" />}
            />
            <StatCard
              title="Balance ARS"
              value={formatNumber(balances?.ARS)}
              icon={<DollarSign className="h-6 w-6" />}
            />
            <StatCard
              title="Balance BRL"
              value={formatNumber(balances?.BRL)}
              icon={<DollarSign className="h-6 w-6" />}
            />
            <StatCard
              title="Transacciones 24h"
              value="0"
              icon={<ArrowUpDown className="h-6 w-6" />}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-7">
            <Card variant="blur" className="col-span-4">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Tasas de Cambio</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>USD/ARS</span>
                    <span className="font-semibold">{formatNumber(rates?.USD_ARS)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>USD/BRL</span>
                    <span className="font-semibold">{formatNumber(rates?.USD_BRL)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ARS/BRL</span>
                    <span className="font-semibold">{formatNumber(rates?.ARS_BRL, 4)}</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card variant="blur" className="col-span-3">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-6">Acciones Rápidas</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" className="flex items-center gap-2 h-auto py-4 text-blue-200 border-blue-700 hover:bg-blue-700/50">
                    <SendHorizontal className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Transferir</p>
                      <p className="text-xs">Entre cuentas</p>
                    </div>
                  </Button>
                  <Link to="/exchange" className="w-full">
                    <Button variant="outline" className="w-full flex items-center gap-2 h-auto py-4 text-blue-200 border-blue-700 hover:bg-blue-700/50">
                      <ArrowUpDown className="h-5 w-5" />
                      <div className="text-left">
                        <p className="font-medium">Cambiar</p>
                        <p className="text-xs">Divisas</p>
                      </div>
                    </Button>
                  </Link>
                  <Button variant="outline" className="flex items-center gap-2 h-auto py-4 text-blue-200 border-blue-700 hover:bg-blue-700/50">
                    <History className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Historial</p>
                      <p className="text-xs">Movimientos</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 h-auto py-4 text-blue-200 border-blue-700 hover:bg-blue-700/50">
                    <DollarSign className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Depositar</p>
                      <p className="text-xs">Fondos</p>
                    </div>
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
