const fs = require('fs');

const path = 'apps/client/src/pages/Checkout.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `V Connecté en tant que {formData.firstName ? \`\${formData.firstName} \${formData.lastName}\` : (userData?.displayName || user.email)}`,
  `✓ {t('checkout.logged_in_as', 'Connecté en tant que')} {formData.firstName ? \`\${formData.firstName} \${formData.lastName}\` : (userData?.displayName || user.email)}`
);

fs.writeFileSync(path, content);

const frPath = 'apps/client/src/locales/fr/translation.json';
let frJson = JSON.parse(fs.readFileSync(frPath, 'utf8'));
frJson.checkout.logged_in_as = "Connecté en tant que";
fs.writeFileSync(frPath, JSON.stringify(frJson, null, 2));

const dePath = 'apps/client/src/locales/de/translation.json';
let deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));
deJson.checkout.logged_in_as = "Eingeloggt als";
fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));

console.log('Fixed logged in as text.');
