#!/usr/bin/env node

import admin from 'firebase-admin';

function requireEnv(pathVar = 'GOOGLE_APPLICATION_CREDENTIALS') {
  const p = process.env[pathVar];
  if (!p) {
    console.error(`[ERROR] ${pathVar} environment variable is not set. Set it to your service account JSON path.`);
    process.exit(1);
  }
  return p;
}

async function main() {
  // Assure que la variable d'environnement est bien définie
  requireEnv();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  const db = admin.firestore();

  console.log('=== Vérification des images produits ===');

  // 1. Lire le mapping centralisé settings/productImages
  const productImagesRef = db.doc('settings/productImages');
  const productImagesSnap = await productImagesRef.get();

  if (!productImagesSnap.exists) {
    console.error("[ERROR] Le document 'settings/productImages' n'existe pas.");
    process.exit(1);
  }

  const productImagesData = productImagesSnap.data() || {};
  const centralImages = productImagesData.images || {};

  console.log(`- Images centralisées trouvées pour ${Object.keys(centralImages).length} produit(s).`);

  // 2. Lire tous les produits
  const productsSnap = await db.collection('products').get();
  const products = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
  console.log(`- Produits trouvés: ${products.length}`);

  let sameCount = 0;
  let diffCount = 0;
  let missingInCentral = 0;
  let missingInProduct = 0;

  const diffs = [];

  for (const product of products) {
    const id = product.id;
    const centralUrl = centralImages[id] || null;
    const productUrl = product.image || null;

    if (!centralUrl && !productUrl) {
      // aucun des deux - on note juste comme manquant
      missingInCentral++;
      missingInProduct++;
      diffs.push({ id, type: 'both-missing' });
      continue;
    }

    if (centralUrl && !productUrl) {
      missingInProduct++;
      diffs.push({ id, type: 'product-missing', centralUrl });
      continue;
    }

    if (!centralUrl && productUrl) {
      missingInCentral++;
      diffs.push({ id, type: 'central-missing', productUrl });
      continue;
    }

    if (centralUrl === productUrl) {
      sameCount++;
    } else {
      diffCount++;
      diffs.push({ id, type: 'different', centralUrl, productUrl });
    }
  }

  console.log('\n=== Résumé ===');
  console.log(`Images identiques (centralisées vs produit.image): ${sameCount}`);
  console.log(`Images différentes: ${diffCount}`);
  console.log(`Manquantes dans centralisé (mais présentes dans produit.image ou les deux vides): ${missingInCentral}`);
  console.log(`Manquantes dans produit.image: ${missingInProduct}`);

  if (diffs.length > 0) {
    console.log('\n=== Détails des différences (limité à 50) ===');
    diffs.slice(0, 50).forEach(({ id, type, centralUrl, productUrl }) => {
      console.log(`- Produit ${id} [${type}]`);
      if (centralUrl) console.log(`    centralisé: ${centralUrl}`);
      if (productUrl) console.log(`    produit   : ${productUrl}`);
    });
    if (diffs.length > 50) {
      console.log(`... (${diffs.length - 50} différences supplémentaires non affichées)`);
    }
  } else {
    console.log('\nAucune différence détectée entre settings/productImages.images et products.image.');
  }

  console.log('\nVérification terminée.');
}

main().catch(err => {
  console.error('[ERROR] Échec de la vérification des images produits:', err?.message || err);
  process.exit(1);
});
