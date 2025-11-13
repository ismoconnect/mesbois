/*
 Script: test-mapping-ids.js
 Vérifie que chaque document de `products` a une clé correspondante dans `settings/productImages`.
 Usage: node scripts/test-mapping-ids.js
*/

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs } = require('firebase/firestore');

// Config with fallbacks
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAG1f99NeBA-_G8u88OJfDWUaRLcEix0ck',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'mes-bois.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'mes-bois',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'mes-bois.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '993486402269',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:993486402269:web:eff9d3975617f820e6a134'
};

async function run() {
  console.log('🔎 Démarrage du test de mapping IDs -> productImages');
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const productsSnap = await getDocs(collection(db, 'products'));
    const totalProducts = productsSnap.size;
    console.log(`📦 Total produits: ${totalProducts}`);

    const settingsRef = doc(db, 'settings', 'productImages');
    const settingsSnap = await getDoc(settingsRef);
    if (!settingsSnap.exists()) {
      console.error('❌ settings/productImages introuvable');
      process.exit(1);
    }
    const imagesMap = settingsSnap.data().images || {};
    const imageKeys = Object.keys(imagesMap);
    console.log(`🖼️  Total images centralisées: ${imageKeys.length}`);

    const missingInImages = [];
    const presentInImages = [];

    productsSnap.docs.forEach((p) => {
      const id = p.id;
      if (imagesMap.hasOwnProperty(id)) {
        presentInImages.push(id);
      } else {
        missingInImages.push(id);
      }
    });

    console.log(`\n✅ Produits mappés: ${presentInImages.length}`);
    console.log(`⚠️  Produits manquants dans settings/productImages: ${missingInImages.length}`);

    if (missingInImages.length > 0) {
      console.log('\nListe des IDs manquants (10 premiers):');
      missingInImages.slice(0, 10).forEach((id, idx) => console.log(`  ${idx + 1}. ${id}`));
    }

    // Also check for images keys that don't have a matching product document
    const productIdsSet = new Set(productsSnap.docs.map(d => d.id));
    const orphanImageKeys = imageKeys.filter(k => !productIdsSet.has(k));
    console.log(`\n🔍 Clés d'images orphelines (images sans produit): ${orphanImageKeys.length}`);
    if (orphanImageKeys.length > 0) {
      console.log('Exemples (10 premiers):');
      orphanImageKeys.slice(0, 10).forEach((k, i) => console.log(`  ${i + 1}. ${k}`));
    }

    // Summary and suggestion
    console.log('\n📌 Résumé:');
    console.log(`  • products: ${totalProducts}`);
    console.log(`  • productImages keys: ${imageKeys.length}`);
    console.log(`  • missing mappings: ${missingInImages.length}`);
    console.log(`  • orphan image keys: ${orphanImageKeys.length}`);

    if (missingInImages.length === 0 && orphanImageKeys.length === 0) {
      console.log('\n🎉 Tous les produits sont correctement mappés aux images centralisées.');
    } else {
      console.log('\n🔧 Actions recommandées:');
      if (missingInImages.length > 0) console.log(' - Importer les images manquantes via l\'admin ou utiliser le script d\'import.');
      if (orphanImageKeys.length > 0) console.log(' - Nettoyer les clés d\'images orphelines si nécessaire.');
    }

  } catch (e) {
    console.error('Erreur:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
}

run();
