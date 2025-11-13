/*
 Script: clean-orphan-product-images-admin.js
 Utilise le SDK admin Firebase (admin privileges) pour supprimer les clés orphelines.
 Usage:
 1. Installer dépendance (si nécessaire):
    npm install firebase-admin
 2. Exporter la variable d'environnement pointant vers le fichier de compte de service JSON:
    $env:GOOGLE_APPLICATION_CREDENTIALS = 'C:\path\to\serviceAccount.json'
 3. Exécuter:
    node scripts/clean-orphan-product-images-admin.js
*/

const admin = require('firebase-admin');
const fs = require('fs');

async function run() {
  try {
    const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    if (!credPath || !fs.existsSync(credPath)) {
      console.error('❌ GOOGLE_APPLICATION_CREDENTIALS non défini ou fichier introuvable.');
      console.error("Définis l\'env var 'GOOGLE_APPLICATION_CREDENTIALS' avec le chemin absolu du fichier JSON du compte de service.");
      process.exit(1);
    }

    const serviceAccount = require(credPath);
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    const db = admin.firestore();

    console.log('🧹 Nettoyage (admin) des clés orphelines dans settings/productImages');

    const settingsRef = db.collection('settings').doc('productImages');
    const settingsSnap = await settingsRef.get();
    if (!settingsSnap.exists) {
      console.log('⚠️  settings/productImages introuvable. Rien à faire.');
      return;
    }

    const settingsData = settingsSnap.data() || {};
    const imagesMap = settingsData.images || {};
    const imageKeys = Object.keys(imagesMap);
    console.log(`🖼️  Clés dans productImages: ${imageKeys.length}`);

    const productsSnap = await db.collection('products').get();
    const productIds = new Set(productsSnap.docs.map(d => d.id));
    console.log(`📦 Total produits: ${productsSnap.size}`);

    const orphanKeys = imageKeys.filter(k => !productIds.has(k));
    console.log(`⚠️  Clés orphelines détectées: ${orphanKeys.length}`);

    if (orphanKeys.length === 0) {
      console.log('✅ Aucun nettoyage nécessaire.');
      return;
    }

    // Backup original doc
    const backupId = `productImages_backup_${Date.now()}`;
    await db.collection('settings').doc(backupId).set({ ...settingsData, backedAt: admin.firestore.FieldValue.serverTimestamp() });
    console.log(`💾 Sauvegarde créée: settings/${backupId}`);

    const newImages = { ...imagesMap };
    orphanKeys.forEach(k => delete newImages[k]);

    await settingsRef.update({ images: newImages, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
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
