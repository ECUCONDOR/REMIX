import { getFirestore, collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, where, DocumentData } from 'firebase/firestore';
import { firebaseApp } from './client';

// Initialize Firestore
export const db = getFirestore(firebaseApp);

// Tipos de datos
export interface Balance {
  USD: number;
  ARS: number;
  BRL: number;
  userId: string;
  updatedAt: Date;
}

export interface ExchangeRate {
  USD_ARS: number;
  USD_BRL: number;
  ARS_BRL: number;
  updatedAt: Date;
}

// Funciones de utilidad para Firestore
export const createDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: T
) => {
  try {
    await setDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error creating document:', error);
    return false;
  }
};

export const updateDocument = async <T extends DocumentData>(
  collectionName: string,
  docId: string,
  data: Partial<T>
) => {
  try {
    await updateDoc(doc(db, collectionName, docId), {
      ...data,
      updatedAt: new Date(),
    });
    return true;
  } catch (error) {
    console.error('Error updating document:', error);
    return false;
  }
};

export const deleteDocument = async (
  collectionName: string,
  docId: string
) => {
  try {
    await deleteDoc(doc(db, collectionName, docId));
    return true;
  } catch (error) {
    console.error('Error deleting document:', error);
    return false;
  }
};

// Funciones específicas para balances
export const getUserBalance = (userId: string, callback: (balance: Balance | null) => void) => {
  const unsubscribe = onSnapshot(
    doc(db, 'balances', userId),
    (doc) => {
      if (doc.exists()) {
        callback(doc.data() as Balance);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error getting balance:', error);
      callback(null);
    }
  );

  return unsubscribe;
};

// Funciones específicas para tasas de cambio
export const subscribeToExchangeRates = (callback: (rates: ExchangeRate | null) => void) => {
  const unsubscribe = onSnapshot(
    doc(db, 'exchangeRates', 'current'),
    (doc) => {
      if (doc.exists()) {
        callback(doc.data() as ExchangeRate);
      } else {
        callback(null);
      }
    },
    (error) => {
      console.error('Error getting exchange rates:', error);
      callback(null);
    }
  );

  return unsubscribe;
};

// Funciones de inicialización
export const initializeUserBalance = async (userId: string) => {
  const initialBalance: Balance = {
    USD: 0,
    ARS: 0,
    BRL: 0,
    userId,
    updatedAt: new Date(),
  };

  return createDocument('balances', userId, initialBalance);
};

export const updateUserBalance = async (userId: string, newBalance: Partial<Balance>) => {
  return updateDocument('balances', userId, newBalance);
};

export const updateExchangeRates = async (rates: Partial<ExchangeRate>) => {
  return updateDocument('exchangeRates', 'current', rates);
};
