import { getFirestore, collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc, query, where, DocumentData, Timestamp, addDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { firebaseApp } from './client';

// Initialize Firestore
export const db = getFirestore(firebaseApp);

let storage;

try {
  if (typeof window !== 'undefined') {
    storage = getStorage(firebaseApp);
  }
} catch (error) {
  console.error('Error initializing Firebase Storage:', error);
}

export { storage };

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

export interface Transaction {
  userId: string;
  amount: number;
  fromCurrency: string;
  toCurrency: string;
  rate: number;
  commission: number;
  status: 'pending' | 'completed' | 'rejected';
  receiptUrl?: string;
  createdAt: Date;
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

// Funciones de transacciones
export async function createTransaction(transaction: Omit<Transaction, 'createdAt' | 'updatedAt'>) {
  try {
    const docRef = await addDoc(collection(db, 'transactions'), {
      ...transaction,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { id: docRef.id, success: true };
  } catch (error) {
    console.error('Error creating transaction:', error);
    return { success: false, error };
  }
}

export async function uploadReceipt(file: File, userId: string): Promise<{ url: string; path: string } | null> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${userId}_${Date.now()}.${fileExt}`;
    const filePath = `receipts/${fileName}`;
    const storageRef = ref(storage, filePath);
    
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload progress:', progress);
        },
        (error) => {
          console.error('Error uploading file:', error);
          reject(error);
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve({ url: downloadURL, path: filePath });
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(error);
          }
        }
      );
    });
  } catch (error) {
    console.error('Error in uploadReceipt:', error);
    return null;
  }
}
