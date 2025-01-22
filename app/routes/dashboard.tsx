import { json, redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData, Link, Form } from '@remix-run/react';
import { 
  Wallet, ArrowUpDown, 
  Settings, ArrowUpRight, ArrowDownRight,
  SendHorizontal, History, DollarSign, Filter
} from 'lucide-react';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    label: string;
  };
}

function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card variant="blur">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="bg-blue-900/50 p-3 rounded-lg text-blue-200">
            {icon}
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              trend.value >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {trend.value >= 0 ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className="mt-4">
          <p className="text-blue-200">{title}</p>
          <p className="text-2xl font-semibold text-white mt-1">{value}</p>
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const mockRates = [
    { from_currency: 'USD', to_currency: 'ARS', rate: 850.50, last_updated: new Date().toISOString() },
    { from_currency: 'USD', to_currency: 'BRL', rate: 4.90, last_updated: new Date().toISOString() },
    { from_currency: 'EUR', to_currency: 'USD', rate: 1.08, last_updated: new Date().toISOString() },
  ];

  return (
    <div className="min-h-screen bg-[#0f1421] text-white">
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Balance ARS"
            value={formatCurrency(125000, 'ARS')}
            icon={<Wallet className="h-6 w-6" />}
            trend={{ value: 2.5, label: 'desde ayer' }}
          />
          <StatCard
            title="Balance BRL"
            value={formatCurrency(5000, 'BRL')}
            icon={<Wallet className="h-6 w-6" />}
            trend={{ value: -1.2, label: 'desde ayer' }}
          />
          <StatCard
            title="Balance USD"
            value={formatCurrency(1000, 'USD')}
            icon={<Wallet className="h-6 w-6" />}
            trend={{ value: 0.8, label: 'desde ayer' }}
          />
          <StatCard
            title="Transacciones 24h"
            value="23"
            icon={<ArrowUpDown className="h-6 w-6" />}
          />
        </div>

        <div className="grid gap-6 md:grid-cols-7">
          <Card variant="blur" className="col-span-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-white">Tipos de Cambio</h3>
                <Button variant="outline" className="border-blue-700 text-blue-200 hover:bg-blue-700/50">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                </Button>
              </div>
              <div className="space-y-4">
                {mockRates.map((rate) => (
                  <div key={`${rate.from_currency}-${rate.to_currency}`} className="flex justify-between items-center p-4 bg-blue-900/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-200">{rate.from_currency}/{rate.to_currency}</span>
                      <span className="text-sm text-blue-200">1 {rate.from_currency} = {rate.rate} {rate.to_currency}</span>
                    </div>
                    <div className="text-sm text-blue-200">
                      Actualizado {new Date(rate.last_updated).toLocaleTimeString()}
                    </div>
                  </div>
                ))}
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
  );
}
