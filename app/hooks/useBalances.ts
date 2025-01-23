import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Balance, getUserBalance, initializeUserBalance } from '~/lib/firebase/database';

interface Balances {
  USD: number;
  ARS: number;
  BRL: number;
}

export function useBalances(user: User | null) {
  const [balances, setBalances] = useState<Balances | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBalances(null);
      setLoading(false);
      return;
    }

    const unsubscribe = getUserBalance(user.uid, async (balance) => {
      if (!balance) {
        // Si no existe balance, inicializamos uno
        const success = await initializeUserBalance(user.uid);
        if (!success) {
          setError('Error al inicializar el balance');
        }
      } else {
        setBalances(balance as Balances);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  // Función para actualizar un balance
  const updateBalance = async (currency: keyof Balances, amount: number) => {
    if (!user || !balances) return;

    try {
      const userBalanceRef = await getUserBalance(user.uid);
      if (userBalanceRef) {
        await initializeUserBalance(user.uid, { ...userBalanceRef, [currency]: amount });
      }
    } catch (error) {
      console.error('Error al actualizar balance:', error);
      setError('Error al actualizar el balance');
    }
  };

  return { balances, loading, error, updateBalance };
}
