// Firebase config for Admin app
// On aligne la configuration avec celle du client pour utiliser
// le même projet Firebase (mes-bois) quand les variables d'env
// ne sont pas définies.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAG1f99NeBA-_G8u88OJfDWUaRLcEix0ck',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'mes-bois.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'mes-bois',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'mes-bois.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '993486402269',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:993486402269:web:eff9d3975617f820e6a134'
};

const app = initializeApp(firebaseConfig);

// Comme sur le client, on permet de forcer le long polling si nécessaire
let dbInstance;
if (process.env.REACT_APP_FIRESTORE_FORCE_LONG_POLLING === 'true') {
  dbInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false
  });
} else {
  dbInstance = getFirestore(app);
}

export const auth = getAuth(app);
export const db = dbInstance;
