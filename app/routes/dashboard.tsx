import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, Link } from '@remix-run/react';
import { 
  ArrowUpDown, 
  SendHorizontal, History, DollarSign
} from 'lucide-react';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { StatCard } from '~/components/ui/stat-card';
import { ProtectedRoute } from "~/components/protected-route";
import { RealtimeBalances } from "~/components/realtime/balances";
import { RealtimeExchangeRates } from "~/components/realtime/exchange-rates";

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#0f1421] text-white">
        <main className="container mx-auto px-4 py-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <RealtimeBalances />
            <StatCard
              title="Transacciones 24h"
              value="0"
              icon={<ArrowUpDown className="h-6 w-6" />}
            />
          </div>

          <div className="grid gap-6 md:grid-cols-7">
            <RealtimeExchangeRates />

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
                      <p className="text-xs">Transacciones</p>
                    </div>
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2 h-auto py-4 text-blue-200 border-blue-700 hover:bg-blue-700/50">
                    <DollarSign className="h-5 w-5" />
                    <div className="text-left">
                      <p className="font-medium">Cotizaciones</p>
                      <p className="text-xs">En tiempo real</p>
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
