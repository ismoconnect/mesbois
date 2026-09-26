const fs = require('fs');

let bankTransferContent = fs.readFileSync('apps/client/src/pages/BankTransfer.js', 'utf8');

bankTransferContent = bankTransferContent.replace(
  "Validation de votre commande…",
  "{t('bank_transfer.validating_order', 'Validation de votre commande…')}"
);

fs.writeFileSync('apps/client/src/pages/BankTransfer.js', bankTransferContent);
console.log('Fixed ellipsis');
