const fs = require('fs');
const path = 'apps/client/src/pages/Checkout.js';
let content = fs.readFileSync(path, 'utf8');

// I will match any character before Connecté
content = content.replace(/✓ Connecté en tant que/g, `✓ {t('checkout.logged_in_as', 'Connecté en tant que')}`);
// Just in case it's actually 'V Connecté'
content = content.replace(/V Connecté en tant que/g, `✓ {t('checkout.logged_in_as', 'Connecté en tant que')}`);
content = content.replace(/Connecté en tant que/g, `{t('checkout.logged_in_as', 'Connecté en tant que')}`);

// Also fix "Se connecter et continuer"
content = content.replace(/<span>Se connecter et continuer<\/span>/g, `<span>{t('checkout.login_and_continue', 'Se connecter et continuer')}</span>`);

fs.writeFileSync(path, content);
console.log('Fixed again');

const frPath = 'apps/client/src/locales/fr/translation.json';
let frJson = JSON.parse(fs.readFileSync(frPath, 'utf8'));
frJson.checkout.login_and_continue = "Se connecter et continuer";
fs.writeFileSync(frPath, JSON.stringify(frJson, null, 2));

const dePath = 'apps/client/src/locales/de/translation.json';
let deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));
deJson.checkout.login_and_continue = "Einloggen und fortfahren";
fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));
