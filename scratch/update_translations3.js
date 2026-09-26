const fs = require('fs');

const frPath = 'apps/client/src/locales/fr/translation.json';
let frJson = JSON.parse(fs.readFileSync(frPath, 'utf8'));

frJson.billing.ribBlock.multiple_refs_note = "Veuillez utiliser la référence de la commande que vous souhaitez régler.";
frJson.billing.whatsappProof = "Bonjour, je viens d'effectuer le virement de";
frJson.billing.whatsappProof2 = "Voici la preuve de paiement :";
frJson.billing.send_proof = "Envoyer la preuve de virement";

fs.writeFileSync(frPath, JSON.stringify(frJson, null, 2));

const dePath = 'apps/client/src/locales/de/translation.json';
let deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));

deJson.billing.ribBlock.multiple_refs_note = "Bitte verwenden Sie die Bestellnummer der Bestellung, die Sie bezahlen möchten.";
deJson.billing.whatsappProof = "Guten Tag, ich habe soeben die Überweisung in Höhe von";
deJson.billing.whatsappProof2 = "getätigt. Hier ist der Zahlungsbeleg:";
deJson.billing.send_proof = "Zahlungsbeleg senden";

fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));

console.log("Translations updated");
