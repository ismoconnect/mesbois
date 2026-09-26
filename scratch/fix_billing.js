const fs = require('fs');

// 1. Update BankTransfer.js
let bankTransferContent = fs.readFileSync('apps/client/src/pages/BankTransfer.js', 'utf8');
bankTransferContent = bankTransferContent.replace(
  "Validation de votre commande...",
  "{t('bank_transfer.validating_order', 'Validation de votre commande...')}"
);
bankTransferContent = bankTransferContent.replace(
  "Sécurisation des coordonnées et synchronisation logistique",
  "{t('bank_transfer.securing_details', 'Sécurisation des coordonnées et synchronisation logistique')}"
);
fs.writeFileSync('apps/client/src/pages/BankTransfer.js', bankTransferContent);

// 2. Update Billing.js
let billingContent = fs.readFileSync('apps/client/src/pages/Billing.js', 'utf8');
// Fix the refs concatenation
billingContent = billingContent.replace(
  "const refs = orders.map(o => formatTransferRef(o.id)).join(', ');",
  "const refs = orders.length > 1 ? t('billing.ribBlock.multiple_refs', 'Indiquez l\\'une de vos références au choix') : (orders.length === 1 ? formatTransferRef(orders[0].id) : '');"
);
// In case it occurs twice (once for WhatsApp message, once for RIB Block):
billingContent = billingContent.replace(
  "const refs = orders.map(o => formatTransferRef(o.id)).join(', ');",
  "const refs = orders.length > 1 ? t('billing.ribBlock.multiple_refs', 'Indiquez l\\'une de vos références au choix') : (orders.length === 1 ? formatTransferRef(orders[0].id) : '');"
);

// We should also check for any missing t() for TITULAIRE, etc.
// In the grep output I saw: <span className="label">TITULAIRE DU COMPTE</span> or similar. Let's make sure they are translated.
billingContent = billingContent.replace(
  /<span className="label">TITULAIRE DU COMPTE<\/span>/g,
  `<span className="label">{t('billing.ribBlock.holder', 'TITULAIRE DU COMPTE')}</span>`
);
billingContent = billingContent.replace(
  /<span className="label">ÉTABLISSEMENT BANCAIRE<\/span>/g,
  `<span className="label">{t('billing.ribBlock.bank', 'ÉTABLISSEMENT BANCAIRE')}</span>`
);
billingContent = billingContent.replace(
  /<span className="label">IBAN OFFICIEL<\/span>/g,
  `<span className="label">{t('billing.ribBlock.iban', 'IBAN OFFICIEL')}</span>`
);
billingContent = billingContent.replace(
  /<span className="label">CODE BIC \/ SWIFT<\/span>/g,
  `<span className="label">{t('billing.ribBlock.bic', 'CODE BIC / SWIFT')}</span>`
);
billingContent = billingContent.replace(
  /<span className="label">RÉFÉRENCE DE VIREMENT<\/span>/g,
  `<span className="label">{t('billing.ribBlock.ref', 'RÉFÉRENCE DE VIREMENT')}</span>`
);
billingContent = billingContent.replace(
  /<span className="label">MONTANT EXACT À VIRER<\/span>/g,
  `<span className="label">{t('billing.ribBlock.amount', 'MONTANT EXACT À VIRER')}</span>`
);

fs.writeFileSync('apps/client/src/pages/Billing.js', billingContent);

// 3. Update French Translations
const frPath = 'apps/client/src/locales/fr/translation.json';
let frJson = JSON.parse(fs.readFileSync(frPath, 'utf8'));

if (!frJson.bank_transfer) frJson.bank_transfer = {};
frJson.bank_transfer.validating_order = "Validation de votre commande...";
frJson.bank_transfer.securing_details = "Sécurisation des coordonnées et synchronisation logistique";

if (!frJson.billing) frJson.billing = {};
if (!frJson.billing.ribBlock) frJson.billing.ribBlock = {};
frJson.billing.ribBlock.multiple_refs = "Indiquez l'une de vos références au choix";
frJson.billing.ribBlock.title = "Coordonnées bancaires pour le virement";
frJson.billing.ribBlock.holder = "TITULAIRE DU COMPTE";
frJson.billing.ribBlock.bank = "ÉTABLISSEMENT BANCAIRE";
frJson.billing.ribBlock.iban = "IBAN OFFICIEL";
frJson.billing.ribBlock.bic = "CODE BIC / SWIFT";
frJson.billing.ribBlock.ref = "RÉFÉRENCE DE VIREMENT";
frJson.billing.ribBlock.amount = "MONTANT EXACT À VIRER";
frJson.billing.ribBlock.copy = "Copier";
fs.writeFileSync(frPath, JSON.stringify(frJson, null, 2));

// 4. Update German Translations
const dePath = 'apps/client/src/locales/de/translation.json';
let deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));

if (!deJson.bank_transfer) deJson.bank_transfer = {};
deJson.bank_transfer.validating_order = "Überprüfung Ihrer Bestellung...";
deJson.bank_transfer.securing_details = "Sicherung der Daten und logistische Synchronisation";

if (!deJson.billing) deJson.billing = {};
if (!deJson.billing.ribBlock) deJson.billing.ribBlock = {};
deJson.billing.ribBlock.multiple_refs = "Geben Sie eine Ihrer Bestellnummern an";
deJson.billing.ribBlock.title = "Bankverbindung für die Überweisung";
deJson.billing.ribBlock.holder = "KONTOINHABER";
deJson.billing.ribBlock.bank = "BANKINSTITUT";
deJson.billing.ribBlock.iban = "OFFIZIELLE IBAN";
deJson.billing.ribBlock.bic = "BIC / SWIFT CODE";
deJson.billing.ribBlock.ref = "VERWENDUNGSZWECK";
deJson.billing.ribBlock.amount = "GENAUER ÜBERWEISUNGSBETRAG";
deJson.billing.ribBlock.copy = "Kopieren";
fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));

console.log('Update completed');
