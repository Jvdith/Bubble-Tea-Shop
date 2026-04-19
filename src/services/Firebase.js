import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBD42LGaSoMx3Z1ZgCCbjoqnXTqFXT-iDY",
  authDomain: "bubbly-369ad.firebaseapp.com",
  projectId: "bubbly-369ad",
  storageBucket: "bubbly-369ad.firebasestorage.app",
  messagingSenderId: "593511706553",
  appId: "1:593511706553:web:f8a656441d670a2ef95068"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();