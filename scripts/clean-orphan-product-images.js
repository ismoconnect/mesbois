/*
 Script: clean-orphan-product-images.js
 Supprime les clés d'images orphelines (présentes dans settings/productImages mais sans produit correspondant)
 - Crée une sauvegarde du document original sous settings/productImages_backup_<timestamp>
 - Met à jour settings/productImages en supprimant les clés orphelines
 Usage: node scripts/clean-orphan-product-images.js
*/

const { initializeApp } = require('firebase/app');
const {
  getFirestore,
  doc,
  getDoc,
  collection,
  getDocs,
  updateDoc,
  setDoc,
  serverTimestamp,
} = require('firebase/firestore');

// Config with safe fallbacks
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAG1f99NeBA-_G8u88OJfDWUaRLcEix0ck',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'mes-bois.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'mes-bois',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'mes-bois.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '993486402269',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:993486402269:web:eff9d3975617f820e6a134'
};

async function run() {
  console.log('🧹 Nettoyage des clés orphelines dans settings/productImages');
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  try {
    const settingsRef = doc(db, 'settings', 'productImages');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      console.log('⚠️  Document settings/productImages introuvable. Rien à faire.');
      return;
    }

    const settingsData = settingsSnap.data() || {};
    const imagesMap = settingsData.images || {};
    const imageKeys = Object.keys(imagesMap);
    console.log(`🖼️  Clés dans productImages: ${imageKeys.length}`);

    const productsSnap = await getDocs(collection(db, 'products'));
    const productIds = new Set(productsSnap.docs.map(d => d.id));
    console.log(`📦 Total produits: ${productsSnap.size}`);

    const orphanKeys = imageKeys.filter(k => !productIds.has(k));
    console.log(`⚠️  Clés orphelines détectées: ${orphanKeys.length}`);

    if (orphanKeys.length === 0) {
      console.log('✅ Aucun nettoyage nécessaire.');
      return;
    }

    // Backup original document
    const backupId = `productImages_backup_${Date.now()}`;
    const backupRef = doc(db, 'settings', backupId);
    await setDoc(backupRef, { ...settingsData, backedAt: serverTimestamp() });
    console.log(`💾 Sauvegarde créée: settings/${backupId}`);

    // Remove orphan keys
    const newImages = { ...imagesMap };
    orphanKeys.forEach(k => delete newImages[k]);

    await updateDoc(settingsRef, { images: newImages, updatedAt: serverTimestamp() });
    console.log(`✅ Suppression effectuée: ${orphanKeys.length} clé(s) supprimée(s).`);

    console.log('Clés supprimées (exemples jusqu\'à 20):');
    orphanKeys.slice(0, 20).forEach((k, i) => console.log(`  ${i + 1}. ${k}`));

  } catch (e) {
    console.error('❌ Erreur:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
}

run();
