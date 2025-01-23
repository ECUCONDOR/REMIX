import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBIxMWu8-sCPWwDw79P-EULL3qwK_hlmlI",
  authDomain: "ecucondor-98244.firebaseapp.com",
  projectId: "ecucondor-98244",
  storageBucket: "ecucondor-98244.firebasestorage.app",
  messagingSenderId: "479082396257",
  appId: "1:479082396257:web:e34c48395dd387cf8dc820"
};

// Inicializar Firebase App
const app = initializeApp(firebaseConfig);

// Inicializar Firebase Authentication
export const firebaseAuth = getAuth(app);
