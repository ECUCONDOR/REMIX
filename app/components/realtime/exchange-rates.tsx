import { useState, useEffect } from 'react';
import { supabase } from '~/utils/supabase.client';
import { Card } from '~/components/ui/card';
import { Button } from '~/components/ui/button';
import { Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ExchangeRate {
  id: string;
  from_currency: string;
  to_currency: string;
  rate: number;
  last_updated: string;
  change_24h?: number;
}

export function RealtimeExchangeRates() {
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');

  useEffect(() => {
    const fetchInitialRates = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error: initialError } = await supabase
          .from('exchange_rates')
          .select('*')
          .order('from_currency', { ascending: true });

        if (initialError) {
          console.error('Error al cargar tipos de cambio:', initialError);
          setError('Error al cargar tipos de cambio.');
          return;
        }

        if (data) {
          setRates(data);
        }
      } catch (e) {
        console.error('Error inesperado al cargar tipos de cambio:', e);
        setError('Error inesperado al cargar tipos de cambio.');
      } finally {
        setLoading(false);
      }
    };

    fetchInitialRates();

    const channel = supabase
      .channel('public:exchange_rates')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'exchange_rates' 
        },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const updatedRate = payload.new as ExchangeRate;
            setRates((prevRates) => {
              const existingRateIndex = prevRates.findIndex(r => r.id === updatedRate.id);
              if (existingRateIndex !== -1) {
                const newRates = [...prevRates];
                newRates[existingRateIndex] = updatedRate;
                return newRates;
              } else {
                return [...prevRates, updatedRate].sort((a, b) => 
                  `${a.from_currency}${a.to_currency}`.localeCompare(`${b.from_currency}${b.to_currency}`)
                );
              }
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedRate = payload.old as ExchangeRate;
            setRates((prevRates) => prevRates.filter(r => r.id !== deletedRate.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Suscrito al canal de tipos de cambio en tiempo real');
        } else if (status === 'CLOSED') {
          console.log('Desconectado del canal de tipos de cambio');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error en el canal de tipos de cambio');
          setError('Error en la conexión en tiempo real');
        }
      });

    return () => {
      console.log('Limpiando suscripción de tipos de cambio...');
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredRates = rates.filter(rate => 
    filter === '' || 
    rate.from_currency.toLowerCase().includes(filter.toLowerCase()) ||
    rate.to_currency.toLowerCase().includes(filter.toLowerCase())
  );

  if (loading) {
    return (
      <Card variant="blur" className="col-span-4">
        <div className="p-6 space-y-4">
          <div className="flex justify-between items-center">
            <div className="h-8 w-1/4 bg-blue-900/50 rounded animate-pulse"></div>
            <div className="h-10 w-24 bg-blue-900/50 rounded animate-pulse"></div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-blue-900/50 rounded animate-pulse"></div>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card variant="blur" className="col-span-4">
        <div className="p-6">
          <div className="bg-red-900/20 text-red-400 p-4 rounded-lg">
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Reintentar
            </button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="blur" className="col-span-4">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white">Tipos de Cambio</h3>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Filtrar..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 bg-blue-900/50 border border-blue-700 rounded text-blue-200 placeholder-blue-400"
            />
            <Button variant="outline" className="border-blue-700 text-blue-200 hover:bg-blue-700/50">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="space-y-4">
          <AnimatePresence>
            {filteredRates.map((rate) => (
              <motion.div
                key={`${rate.from_currency}-${rate.to_currency}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-between items-center p-4 bg-blue-900/50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-blue-200">
                    {rate.from_currency}/{rate.to_currency}
                  </span>
                  <span className="text-sm text-blue-200">
                    1 {rate.from_currency} = {rate.rate.toLocaleString('es-AR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 4
                    })} {rate.to_currency}
                  </span>
                  {rate.change_24h !== undefined && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      rate.change_24h > 0 
                        ? 'text-green-400' 
                        : rate.change_24h < 0 
                        ? 'text-red-400' 
                        : 'text-blue-400'
                    }`}>
                      {rate.change_24h > 0 ? '↑' : rate.change_24h < 0 ? '↓' : '→'}
                      {Math.abs(rate.change_24h).toFixed(2)}%
                    </span>
                  )}
                </div>
                <div className="text-sm text-blue-200">
                  Actualizado {new Date(rate.last_updated).toLocaleTimeString()}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredRates.length === 0 && (
            <div className="text-center text-blue-400 py-4">
              No se encontraron tipos de cambio
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
