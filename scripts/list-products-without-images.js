const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAG1f99NeBA-_G8u88OJfDWUaRLcEix0ck',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'mes-bois.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'mes-bois',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'mes-bois.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '993486402269',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:993486402269:web:eff9d3975617f820e6a134'
};

function isValidUrl(u) {
  return typeof u === 'string' && (u.startsWith('http://') || u.startsWith('https://')) && u.length > 10;
}

async function run() {
  try {
    console.log('🔎 Listing products without images (centralized or in product.image)\n');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    // load centralized mapping
    const mappingRef = doc(db, 'settings', 'productImages');
    const mappingSnap = await getDoc(mappingRef);
    const mapping = mappingSnap.exists() ? (mappingSnap.data().images || {}) : {};
    const mappingCount = Object.keys(mapping).length;
    console.log(`📦 images centralisées: ${mappingCount}`);

    // load products
    const productsSnap = await getDocs(collection(db, 'products'));
    console.log(`🧾 produits total: ${productsSnap.size}`);

    const missing = [];
    const partial = []; // has image but invalid URL

    for (const pDoc of productsSnap.docs) {
      const p = pDoc.data();
      const id = pDoc.id;
      const centralized = mapping[id];
      const fieldImage = p.image;

      const hasCentralized = isValidUrl(centralized);
      const hasField = isValidUrl(fieldImage);

      if (!hasCentralized && !hasField) {
        missing.push({ id, name: p.name || '(no name)' });
      } else if ((centralized && !hasCentralized) || (fieldImage && !hasField)) {
        partial.push({ id, name: p.name || '(no name)', centralized: centralized || null, fieldImage: fieldImage || null });
      }
    }

    console.log(`\n❗ Produits sans image détectés: ${missing.length}`);
    if (missing.length > 0) {
      console.log('Exemples (jusqu\'à 50):');
      missing.slice(0, 50).forEach((m, i) => console.log(`  ${i + 1}. ${m.id} - ${m.name}`));
    }

    console.log(`\n⚠️  Produits avec image mais URL invalide: ${partial.length}`);
    if (partial.length > 0) {
      console.log('Exemples (jusqu\'à 50):');
      partial.slice(0, 50).forEach((m, i) => console.log(`  ${i + 1}. ${m.id} - ${m.name}\n     centralized: ${m.centralized}\n     fieldImage: ${m.fieldImage}`));
    }

    console.log('\n✅ Fin du scan.');
    process.exit(0);
  } catch (e) {
    console.error('❌ Erreur:', e && e.message ? e.message : e);
    process.exit(1);
  }
}

run();
