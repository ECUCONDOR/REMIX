import { useState, useEffect } from 'react';
import { supabase } from '~/utils/supabase.client';
import { StatCard } from '~/components/ui/stat-card';
import { Wallet } from 'lucide-react';
import { Skeleton } from '~/components/ui/skeleton';

interface Balance {
  currency: string;
  balance: number;
  updated_at: string;
}

interface RealtimeBalancesProps {
  trendValue?: number;
  trendLabel?: string;
}

export function RealtimeBalances({ trendValue = 0, trendLabel = 'desde ayer' }: RealtimeBalancesProps) {
  const [balances, setBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  useEffect(() => {
    let mounted = true;

    const fetchInitialBalances = async () => {
      if (!mounted) return;
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Iniciando carga de balances...');
        
        const { data, error: initialError } = await supabase
          .from('balances')
          .select('*')
          .order('currency', { ascending: true });

        if (!mounted) return;

        if (initialError) {
          console.error('Error al cargar balances:', initialError);
          setError(`Error al cargar balances: ${initialError.message}`);
          return;
        }

        if (!data) {
          console.warn('No se encontraron datos de balances');
          setBalances([]);
          return;
        }

        console.log('Balances cargados:', data);
        setBalances(data);
      } catch (e) {
        if (!mounted) return;
        console.error('Error inesperado:', e);
        setError(e instanceof Error ? e.message : 'Error inesperado al cargar balances');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    // Intentar cargar los balances
    fetchInitialBalances();

    // Configurar suscripción en tiempo real
    const channel = supabase
      .channel('balances_channel')
      .on(
        'postgres_changes',
        { 
          event: '*', 
          schema: 'public', 
          table: 'balances' 
        },
        (payload) => {
          console.log('Cambio en tiempo real recibido:', payload);
          
          if (!mounted) return;

          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const updatedBalance = payload.new as Balance;
            setBalances((prevBalances) => {
              const existingBalanceIndex = prevBalances.findIndex(b => b.currency === updatedBalance.currency);
              if (existingBalanceIndex !== -1) {
                const newBalances = [...prevBalances];
                newBalances[existingBalanceIndex] = updatedBalance;
                return newBalances;
              } else {
                return [...prevBalances, updatedBalance].sort((a, b) => a.currency.localeCompare(b.currency));
              }
            });
          } else if (payload.eventType === 'DELETE') {
            const deletedBalance = payload.old as Balance;
            setBalances((prevBalances) => 
              prevBalances.filter(b => b.currency !== deletedBalance.currency)
            );
          }
        }
      )
      .subscribe((status) => {
        console.log('Estado de suscripción:', status);
        if (status === 'SUBSCRIBED') {
          console.log('Suscrito exitosamente al canal de balances');
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Error en la suscripción del canal');
          setError('Error en la conexión en tiempo real');
        }
      });

    return () => {
      mounted = false;
      console.log('Limpiando suscripción de balances...');
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <>
        {['ARS', 'BRL', 'USD'].map((currency) => (
          <div key={currency} className="p-6 bg-blue-900/20 rounded-lg animate-pulse">
            <div className="h-6 w-1/3 bg-blue-900/50 rounded mb-4"></div>
            <div className="h-8 w-2/3 bg-blue-900/50 rounded"></div>
          </div>
        ))}
      </>
    );
  }

  if (error) {
    return (
      <div className="col-span-3 p-6 bg-red-900/20 rounded-lg">
        <p className="text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Reintentar
        </button>
      </div>
    );
  }

  const currencies = ['ARS', 'BRL', 'USD'];
  
  return (
    <>
      {currencies.map((currency) => {
        const balance = balances.find(b => b.currency === currency);
        return (
          <StatCard
            key={currency}
            title={`Balance ${currency}`}
            value={formatCurrency(balance?.balance || 0, currency)}
            icon={<Wallet className="h-6 w-6" />}
            trend={{ value: trendValue, label: trendLabel }}
          />
        );
      })}
    </>
  );
}
