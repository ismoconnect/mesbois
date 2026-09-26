const fs = require('fs');

const path = 'apps/client/src/pages/BankTransfer.js';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(
  `<strong>Sécurité bancaire & accès chariot tout-terrain :</strong> nos coordonnées bancaires vous sont transmises directement sur WhatsApp par notre conseiller.`,
  `<strong>{t('bank_transfer.security_title', 'Sécurité bancaire & accès chariot tout-terrain :')}</strong> {t('bank_transfer.security_text', 'nos coordonnées bancaires vous sont transmises directement sur WhatsApp par notre conseiller.')}`
);

content = content.replace(
  `<div className="step-sub">1 clic conseiller</div>`,
  `<div className="step-sub">{t('bank_transfer.step_click', '1 clic conseiller')}</div>`
);

fs.writeFileSync(path, content);
console.log('Fixed additional French text.');

const frPath = 'apps/client/src/locales/fr/translation.json';
let frJson = JSON.parse(fs.readFileSync(frPath, 'utf8'));
frJson.bank_transfer.security_title = "Sécurité bancaire & accès chariot tout-terrain :";
frJson.bank_transfer.security_text = "nos coordonnées bancaires vous sont transmises directement sur WhatsApp par notre conseiller.";
frJson.bank_transfer.step_click = "1 clic conseiller";
fs.writeFileSync(frPath, JSON.stringify(frJson, null, 2));

const dePath = 'apps/client/src/locales/de/translation.json';
let deJson = JSON.parse(fs.readFileSync(dePath, 'utf8'));
deJson.bank_transfer.security_title = "Banksicherheit & Geländestapler-Zugang:";
deJson.bank_transfer.security_text = "unsere Bankdaten werden Ihnen direkt über WhatsApp von unserem Berater übermittelt.";
deJson.bank_transfer.step_click = "1 Berater-Klick";
fs.writeFileSync(dePath, JSON.stringify(deJson, null, 2));
