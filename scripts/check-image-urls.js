/*
 Script: check-image-urls.js
 Vérifie l'accessibilité (HTTP status + content-type) des URLs dans settings/productImages.
 Usage: node scripts/check-image-urls.js [--sample N]
*/

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, getDoc } = require('firebase/firestore');
const http = require('http');
const https = require('https');
const { URL } = require('url');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || 'AIzaSyAG1f99NeBA-_G8u88OJfDWUaRLcEix0ck',
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || 'mes-bois.firebaseapp.com',
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || 'mes-bois',
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || 'mes-bois.appspot.com',
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || '993486402269',
  appId: process.env.REACT_APP_FIREBASE_APP_ID || '1:993486402269:web:eff9d3975617f820e6a134'
};

function headRequest(url, timeout = 8000) {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const lib = parsed.protocol === 'https:' ? https : http;
      const options = {
        method: 'HEAD',
        timeout,
        headers: {
          'User-Agent': 'mesbois-checker/1.0'
        }
      };
      const req = lib.request(parsed, options, (res) => {
        resolve({ status: res.statusCode, headers: res.headers });
      });
      req.on('error', (e) => resolve({ error: e.message }));
      req.on('timeout', () => {
        req.destroy();
        resolve({ error: 'timeout' });
      });
      req.end();
    } catch (e) {
      resolve({ error: e.message });
    }
  });
}

async function run() {
  console.log('🔎 Vérification des URLs d\'images (settings/productImages)');
  try {
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    const ref = doc(db, 'settings', 'productImages');
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      console.error('❌ Document settings/productImages introuvable');
      process.exit(1);
    }
    const images = snap.data().images || {};
    const keys = Object.keys(images);
    console.log(`🖼️  ${keys.length} URLs trouvées`);

    // sample option
    const args = process.argv.slice(2);
    const sampleArgIndex = args.indexOf('--sample');
    let sample = 20;
    if (sampleArgIndex !== -1 && args.length > sampleArgIndex + 1) {
      sample = parseInt(args[sampleArgIndex + 1], 10) || sample;
    }

    const toCheck = keys.slice(0, sample);
    console.log(`🔢 Vérification d'un échantillon de ${toCheck.length} URLs (premiers éléments)`);

    const results = [];
    for (const k of toCheck) {
      const url = images[k];
      process.stdout.write(`  • ${k} -> `);
      const res = await headRequest(url);
      if (res.error) {
        console.log(`ERROR: ${res.error}`);
        results.push({ id: k, url, ok: false, error: res.error });
      } else {
        const contentType = (res.headers && (res.headers['content-type'] || res.headers['Content-Type'])) || 'unknown';
        const ok = res.status && res.status >= 200 && res.status < 400;
        console.log(`${res.status} - ${contentType}`);
        results.push({ id: k, url, ok, status: res.status, contentType });
      }
    }

    const failed = results.filter(r => !r.ok);
    console.log('\n📊 Résumé:');
    console.log(`  • vérifiées: ${results.length}`);
    console.log(`  • réussies : ${results.length - failed.length}`);
    console.log(`  • échouées : ${failed.length}`);
    if (failed.length > 0) {
      console.log('\nÉchecs détaillés:');
      failed.forEach((f) => console.log(`  - ${f.id}: ${f.error || `${f.status} ${f.contentType}`}`));
    }

    process.exit(0);
  } catch (e) {
    console.error('❌ Erreur:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
}

run();
