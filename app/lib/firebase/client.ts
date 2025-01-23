import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let firebaseApp;
let firebaseAuth;
let firestore;

try {
  const firebaseConfig = {
    apiKey: "AIzaSyBIxMWu8-sCPWwDw79P-EULL3qwK_hlmlI",
    authDomain: "ecucondor-98244.firebaseapp.com",
    projectId: "ecucondor-98244",
    storageBucket: "ecucondor-98244.appspot.com", 
    messagingSenderId: "479082396257",
    appId: "1:479082396257:web:e34c48395dd387cf8dc820"
  };

  // Initialize Firebase
  firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  firebaseAuth = getAuth(firebaseApp);
  firestore = getFirestore(firebaseApp);

  // Configurar persistencia de autenticación solo en el cliente
  if (typeof window !== 'undefined') {
    setPersistence(firebaseAuth, browserLocalPersistence)
      .catch((error) => {
        console.error("Error setting auth persistence:", error);
      });
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
}

export { firebaseApp, firebaseAuth, firestore };
