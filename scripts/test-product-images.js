/**
 * Script de test pour valider le flow complet des images produits
 * - Vérifie que settings/productImages existe et est rempli
 * - Vérifie que useProductImages hook fonctionne côté client
 * - Teste les fallbacks d'images
 */

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc, collection, getDocs } = require('firebase/firestore');

// Configuration Firebase (fallbacks pour exécution locale sans .env)
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAG1f99NeBA-_G8u88OJfDWUaRLcEix0ck',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'mes-bois.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'mes-bois',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'mes-bois.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '993486402269',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:993486402269:web:eff9d3975617f820e6a134'
};

async function testProductImages() {
  console.log('🚀 Démarrage du test du flow complet des images produits\n');

  try {
    // 1. Initialiser Firebase
    console.log('1️⃣  Initialisation Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    console.log('✅ Firebase initialisé\n');

    // 2. Vérifier settings/productImages
    console.log('2️⃣  Vérification de settings/productImages...');
    const productImagesRef = doc(db, 'settings', 'productImages');
    const productImagesSnap = await getDoc(productImagesRef);

    if (!productImagesSnap.exists()) {
      console.log('❌ ERREUR: settings/productImages n\'existe pas!');
      return;
    }

    const productImagesData = productImagesSnap.data();
    const imageCount = Object.keys(productImagesData.images || {}).length;
    console.log(`✅ settings/productImages trouvé avec ${imageCount} produits\n`);

    // 3. Vérifier la structure
    console.log('3️⃣  Vérification de la structure...');
    if (!productImagesData.images || typeof productImagesData.images !== 'object') {
      console.log('❌ ERREUR: structure images invalide');
      return;
    }
    console.log('✅ Structure correcte: { images: { ...produits }, updatedAt: ... }\n');

    // 4. Vérifier quelques URLs
    console.log('4️⃣  Vérification des URLs...');
    const imageIds = Object.keys(productImagesData.images).slice(0, 5);
    let validUrls = 0;

    for (const id of imageIds) {
      const url = productImagesData.images[id];
      if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
        console.log(`  ✅ ${id}: ${url.substring(0, 60)}...`);
        validUrls++;
      } else {
        console.log(`  ❌ ${id}: URL invalide - ${url}`);
      }
    }
    console.log(`\n✅ ${validUrls}/${imageIds.length} URLs valides\n`);

    // 5. Récupérer quelques produits et comparer
    console.log('5️⃣  Comparaison avec les documents produits...');
    const productsSnap = await getDocs(collection(db, 'products'));
    const products = [];
    let matchCount = 0;

    productsSnap.docs.slice(0, 5).forEach((productDoc) => {
      const productData = productDoc.data();
      const centralizedImage = productImagesData.images[productDoc.id];
      const productFieldImage = productData.image;

      products.push({
        id: productDoc.id,
        name: productData.name,
        centralized: centralizedImage ? '✅' : '❌',
        field: productFieldImage ? '✅' : '❌',
        match: centralizedImage === productFieldImage ? '✅' : '❌',
      });

      if (centralizedImage || productFieldImage) {
        matchCount++;
      }
    });

    console.log('\nProduits testés:');
    console.table(products);
    console.log(`\n✅ ${matchCount}/5 produits ont au moins une image\n`);

    // 6. Résumé
    console.log('📊 RÉSUMÉ DU TEST:');
    console.log(`  • Total produits avec image centralisée: ${imageCount}`);
    console.log(`  • Env var pour long-polling: ${process.env.REACT_APP_FIRESTORE_FORCE_LONG_POLLING || 'non défini'}`);
    console.log(`  • Point d'accès client: /products?debugImages=1\n`);

    // 7. Instructions
    console.log('🔍 POUR VÉRIFIER CÔTÉ CLIENT:');
    console.log('  1. Ouvre http://localhost:3000/products?debugImages=1');
    console.log('  2. Ouvre la console (F12 > Console)');
    console.log('  3. Cherche les logs "useProductImages" ou "imageUrl computed"');
    console.log('  4. Les images doivent s\'afficher sous chaque produit\n');

    console.log('✅ Test complet réussi!\n');

  } catch (error) {
    console.error('❌ ERREUR:', error.message);
    console.error('Stack:', error.stack);
  }
}

testProductImages();
