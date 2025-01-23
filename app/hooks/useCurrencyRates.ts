import { useState, useEffect } from 'react';

interface ExchangeRates {
  USDARS: string;
  USDBRL: string;
  ARSBRL: string;
}

export function useCurrencyRates() {
  const [rates, setRates] = useState<ExchangeRates>({
    USDARS: "1315",
    USDBRL: "5.03",
    ARSBRL: "0.0038",
  });
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        setLoading(true);
        setRates({
          USDARS: "1315",
          USDBRL: "5.03",
          ARSBRL: "0.0038",
        });
        setLastUpdate(new Date().toLocaleString());
        setError(null);
      } catch (err) {
        setError("Error al obtener tasas de cambio");
        console.error("Error fetching rates:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
    const interval = setInterval(fetchRates, 30000);
    return () => clearInterval(interval);
  }, []);

  return { rates, lastUpdate, loading, error };
}
