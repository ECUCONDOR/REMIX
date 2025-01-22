import { useState, useEffect } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';

interface Transaction {
  id: string;
  created_at: string;
  user_id: string;
  type: 'exchange' | 'transfer';
  from_currency: string;
  to_currency: string;
  amount_from: number;
  amount_to: number;
  status: 'pending' | 'completed' | 'failed';
  rate: number;
}

interface ExchangeRate {
  from_currency: string;
  to_currency: string;
  rate: number;
  last_updated: string;
}

interface Balances {
  ARS: number;
  BRL: number;
  USD: number;
}

export function useRealtimeData(supabase: SupabaseClient, userId: string) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [rates, setRates] = useState<ExchangeRate[]>([]);
  const [balances, setBalances] = useState<Balances>({ ARS: 0, BRL: 0, USD: 0 });
  const [transactions24h, setTransactions24h] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transactions
        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData);

        // Fetch exchange rates
        const { data: ratesData, error: ratesError } = await supabase
          .from('exchange_rates')
          .select('*');

        if (ratesError) throw ratesError;
        setRates(ratesData);

        // Fetch balances
        const { data: balancesData, error: balancesError } = await supabase
          .from('balances')
          .select('*')
          .eq('user_id', userId)
          .single();

        if (balancesError) throw balancesError;
        setBalances(balancesData);

        // Calculate 24h transactions
        const oneDayAgo = new Date();
        oneDayAgo.setDate(oneDayAgo.getDate() - 1);
        
        const recentTransactions = transactionsData.filter(
          (t: Transaction) => new Date(t.created_at) >= oneDayAgo
        );
        setTransactions24h(recentTransactions.length);

        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchData();

    // Set up realtime subscriptions
    const transactionsSubscription = supabase
      .channel('transactions')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'transactions',
        filter: `user_id=eq.${userId}`,
      }, (payload) => {
        fetchData(); // Refresh all data when there's a change
      })
      .subscribe();

    const ratesSubscription = supabase
      .channel('rates')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'exchange_rates',
      }, (payload) => {
        fetchData(); // Refresh all data when there's a change
      })
      .subscribe();

    return () => {
      transactionsSubscription.unsubscribe();
      ratesSubscription.unsubscribe();
    };
  }, [supabase, userId]);

  return {
    transactions,
    rates,
    balances,
    transactions24h,
    loading,
    error,
  };
}
