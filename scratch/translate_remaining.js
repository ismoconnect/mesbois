const fs = require('fs');
const path = 'apps/client/src/pages/Checkout.js';
let content = fs.readFileSync(path, 'utf8');

// Replacements
content = content.replace(/V Connecté en tant que/g, `✓ {t('checkout.logged_in_as', 'Connecté en tant que')}`);
content = content.replace(/placeholder="Code promo"/g, `placeholder={t('checkout.promo_code', 'Code promo')}`);
content = content.replace(/'Appliquer'/g, `t('checkout.apply', 'Appliquer')`);
content = content.replace(/<span>Modifier mes coordonnées & adresse<\/span>/g, `<span>{t('checkout.edit_address', 'Modifier mes coordonnées & adresse')}</span>`);
content = content.replace(/<span>Adresse de livraison enregistrée<\/span>/g, `<span>{t('checkout.registered_address', 'Adresse de livraison enregistrée')}</span>`);
content = content.replace(/<span>Modifier<\/span>/g, `<span>{t('checkout.edit', 'Modifier')}</span>`);
content = content.replace(/<span>Continuer vers le paiement \(Étape 2\/2\)<\/span>/g, `<span>{t('checkout.continue_to_payment', 'Continuer vers le paiement (Étape 2/2)')}</span>`);

fs.writeFileSync(path, content);
console.log('Fixed additional French text in Checkout.js');

const frPath = 'apps/client/src/locales/fr/translation.json';
let frJson = JSON.parse(fs.readFileSync(frPath, 'utf8'));
frJson.checkout.logged_in_as = "Connecté en tant que";
frJson.checkout.promo_code = "Code promo";
frJson.checkout.apply = "Appliquer";
frJson.checkout.edit_address = "Modifier mes coordonnées & adresse";
frJson.checkout.registered_address = "Adresse de livraison enregistrée";
frJson.checkout.edit = "Modifier";
frJson.checkout.continue_to_payment = "Continuer vers le paiement (Étape 2/2)";
fs.writeFileSync(frPath, JSON.stringify(frJson, null, 2));

const dePath = 'apps/client/src/locales/de/translation.json';
let deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));
deJson.checkout.logged_in_as = "Eingeloggt als";
deJson.checkout.promo_code = "Gutscheincode";
deJson.checkout.apply = "Anwenden";
deJson.checkout.edit_address = "Meine Kontaktdaten & Adresse bearbeiten";
deJson.checkout.registered_address = "Gespeicherte Lieferadresse";
deJson.checkout.edit = "Bearbeiten";
deJson.checkout.continue_to_payment = "Weiter zur Zahlung (Schritt 2/2)";
fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));
