const fs = require('fs');

const replaceInFile = (path, replacements) => {
  let content = fs.readFileSync(path, 'utf8');
  for (const [search, replace] of replacements) {
    if (content.includes(search)) {
      content = content.replace(search, replace);
    } else {
      console.warn(`Warning: Could not find "${search}" in ${path}`);
    }
  }
  fs.writeFileSync(path, content);
};

// Checkout.js
replaceInFile('apps/client/src/pages/Checkout.js', [
  [
    '<span className="step-label">1. Livraison</span>', 
    `<span className="step-label">{t('checkout.step1', '1. Livraison')}</span>`
  ],
  [
    '<span className="step-label">2. Paiement & Total</span>', 
    `<span className="step-label">{t('checkout.step2', '2. Paiement & Total')}</span>`
  ],
  [
    `<div>Livraison : <strong>{formData.firstName || 'Client'} {formData.lastName}</strong></div>`, 
    `<div>{t('checkout.delivery', 'Livraison')} : <strong>{formData.firstName || 'Client'} {formData.lastName}</strong></div>`
  ]
]);

// BankTransfer.js
replaceInFile('apps/client/src/pages/BankTransfer.js', [
  [
    `{isRibPublic ? 'Commande enregistrée avec succès' : 'Votre commande a bien été enregistrée !'}`,
    `{isRibPublic ? t('bank_transfer.success_public', 'Commande enregistrée avec succès') : t('bank_transfer.success_private', 'Votre commande a bien été enregistrée !')}`
  ],
  [
    `<strong>Conseil rapide :</strong> Privilégiez un `,
    `<strong>{t('bank_transfer.quick_tip', 'Conseil rapide :')}</strong> {t('bank_transfer.tip_prefix', 'Privilégiez un ')}`
  ],
  [
    `<span>Consulter ma commande dans mon espace client</span>`,
    `<span>{t('bank_transfer.view_in_client_area', 'Consulter ma commande dans mon espace client')}</span>`
  ]
]);

// French Translations
const frPath = 'apps/client/src/locales/fr/translation.json';
let frJson = JSON.parse(fs.readFileSync(frPath, 'utf8'));
if (!frJson.checkout) frJson.checkout = {};
frJson.checkout.step1 = "1. Livraison";
frJson.checkout.step2 = "2. Paiement & Total";
frJson.checkout.delivery = "Livraison";

if (!frJson.bank_transfer) frJson.bank_transfer = {};
frJson.bank_transfer.success_public = "Commande enregistrée avec succès";
frJson.bank_transfer.success_private = "Votre commande a bien été enregistrée !";
frJson.bank_transfer.quick_tip = "Conseil rapide :";
frJson.bank_transfer.tip_prefix = "Privilégiez un ";
frJson.bank_transfer.view_in_client_area = "Consulter ma commande dans mon espace client";

fs.writeFileSync(frPath, JSON.stringify(frJson, null, 2));

// German Translations
const dePath = 'apps/client/src/locales/de/translation.json';
let deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));
if (!deJson.checkout) deJson.checkout = {};
deJson.checkout.step1 = "1. Lieferung";
deJson.checkout.step2 = "2. Zahlung & Gesamtbetrag";
deJson.checkout.delivery = "Lieferung";

if (!deJson.bank_transfer) deJson.bank_transfer = {};
deJson.bank_transfer.success_public = "Bestellung erfolgreich registriert";
deJson.bank_transfer.success_private = "Ihre Bestellung wurde erfolgreich registriert!";
deJson.bank_transfer.quick_tip = "Kurzer Tipp:";
deJson.bank_transfer.tip_prefix = "Bevorzugen Sie eine ";
deJson.bank_transfer.view_in_client_area = "Meine Bestellung im Kundenbereich ansehen";

fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));

console.log('Translations updated successfully.');
