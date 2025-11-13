import { initializeApp } from 'firebase/app';
import { getFirestore, initializeFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyAG1f99NeBA-_G8u88OJfDWUaRLcEix0ck",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mes-bois.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mes-bois",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mes-bois.appspot.com",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "993486402269",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:993486402269:web:eff9d3975617f820e6a134"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Initialiser les services Firebase
// Si l'application tourne dans un réseau qui bloque/filtre WebChannel/streams,
// vous pouvez forcer l'utilisation du long-polling en définissant la variable
// d'environnement `REACT_APP_FIRESTORE_FORCE_LONG_POLLING=true`.
let dbInstance;
if (process.env.REACT_APP_FIRESTORE_FORCE_LONG_POLLING === 'true') {
  // initializeFirestore permet de passer des options comme experimentalForceLongPolling
  // et useFetchStreams. Cela aide souvent dans les environnements d'entreprise où
  // WebChannel transport échoue (ERR_NAME_NOT_RESOLVED / blocked).
  dbInstance = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    useFetchStreams: false
  });
} else {
  dbInstance = getFirestore(app);
}

export const db = dbInstance;
export const auth = getAuth(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

export default app;

