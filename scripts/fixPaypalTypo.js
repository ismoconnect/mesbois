const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

try {
    const envPath = path.resolve(__dirname, '../.env.local');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [key, value] = line.split('=');
            if (key && value) {
                process.env[key.trim()] = value.trim();
            }
        });
    }
} catch (e) {
    console.warn('Could not load .env.local');
}

(async () => {
    try {
        if (!admin.apps.length) {
            const projectId = process.env.FIREBASE_PROJECT_ID;
            const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
            let privateKey = process.env.FIREBASE_PRIVATE_KEY;
            if (projectId && clientEmail && privateKey) {
                privateKey = privateKey.replace(/\\n/g, '\n');
                admin.initializeApp({
                    credential: admin.credential.cert({ projectId, clientEmail, privateKey })
                });
            } else {
                admin.initializeApp({
                    credential: admin.credential.applicationDefault(),
                });
            }
        }
        const db = admin.firestore();

        const ref = db.collection('paypal').doc('default');
        const doc = await ref.get();

        if (!doc.exists) {
            console.log('Document paypal/default does not exist.');
            process.exit(0);
        }

        const data = doc.data();
        let instructions = data.instructions || '';

        if (instructions.includes('2448h')) {
            instructions = instructions.replace('2448h', '24h à 48h');
            await ref.update({ instructions });
            console.log('✔ Typo fixed: "2448h" -> "24h à 48h"');
        } else {
            console.log('No typo found or already fixed.');
        }

        process.exit(0);
    } catch (e) {
        console.error('✖ Failed to fix typo:', e);
        process.exit(1);
    }
})();
