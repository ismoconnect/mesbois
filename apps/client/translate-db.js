const fs = require('fs');
require('dotenv').config({ path: '.env.local' });
const { initializeApp } = require('firebase/app');
const { getFirestore, doc, updateDoc } = require('firebase/firestore');
const https = require('https');

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Simple translate function using Google Translate unofficial API
function translateText(text) {
  if (!text) return Promise.resolve('');
  return new Promise((resolve, reject) => {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=fr&tl=de&dt=t&q=${encodeURIComponent(text)}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          let translated = '';
          if (json && json[0]) {
            json[0].forEach(item => {
              if (item[0]) translated += item[0];
            });
          }
          resolve(translated || text);
        } catch (e) {
          resolve(text);
        }
      });
    }).on('error', () => resolve(text));
  });
}

async function run() {
  const products = JSON.parse(fs.readFileSync('products_export.json', 'utf8'));
  console.log(`Starting translation of ${products.length} products...`);
  
  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    console.log(`Translating [${i+1}/${products.length}] ${p.name}...`);
    
    // Translate name and description
    const translatedName = await translateText(p.name);
    const translatedDesc = await translateText(p.description);
    
    // Update in Firestore
    try {
      const productRef = doc(db, 'products', p.id);
      await updateDoc(productRef, {
        name: translatedName,
        description: translatedDesc
      });
      console.log(`  -> ${translatedName}`);
    } catch (err) {
      console.error(`  Failed to update ${p.id}: ${err.message}`);
    }
    
    // Wait a little to avoid rate limit
    await new Promise(r => setTimeout(r, 500));
  }
  
  console.log('Database translation completed successfully!');
  process.exit(0);
}

run();
