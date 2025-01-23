import { useState, useEffect } from 'react';
import { ExchangeRate, subscribeToExchangeRates } from '~/lib/firebase/database';

export function useExchangeRates() {
  const [rates, setRates] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToExchangeRates((newRates) => {
      if (newRates) {
        setRates(newRates);
      } else {
        setError('Error al obtener tasas de cambio');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { rates, loading, error };
}
