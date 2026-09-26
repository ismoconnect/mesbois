const fs = require('fs');

const frPath = 'apps/client/src/locales/fr/translation.json';
let frJson = JSON.parse(fs.readFileSync(frPath, 'utf8'));

frJson.billing.ribBlock.multiple_amounts_note = "Consultez le montant de votre commande ci-dessous";
frJson.billing.whatsappProof_multiple = "Bonjour, je viens d'effectuer un virement pour ma commande. Voici la preuve de paiement :";

fs.writeFileSync(frPath, JSON.stringify(frJson, null, 2));

const dePath = 'apps/client/src/locales/de/translation.json';
let deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));

deJson.billing.ribBlock.multiple_amounts_note = "Bitte entnehmen Sie den Betrag Ihrer Bestellung weiter unten";
deJson.billing.whatsappProof_multiple = "Guten Tag, ich habe soeben eine Überweisung für meine Bestellung getätigt. Hier ist der Zahlungsbeleg:";

fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));

console.log("Translations updated");
