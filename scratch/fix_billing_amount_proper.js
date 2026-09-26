const fs = require('fs');
let code = fs.readFileSync('apps/client/src/pages/Billing.js', 'utf8');

const lines = code.split('\n');
let replaced = false;

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes("t('billing.ribBlock.amount',")) {
    // Found the amount block!
    // The next lines should be:
    // <div className="val-row">
    //   <span className="val-text" style={{ color: '#166534', fontSize: '15px', fontWeight: 800 }}>{totalAmount} €</span>
    //   <CopyButton onClick={() => copy(totalAmount, t('billing.ribBlock.amount', 'Montant'))}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>
    // </div>
    
    // So lines[i+1] is <div className="val-row">
    // lines[i+2] is <span ...>{totalAmount} ...</span>
    // lines[i+3] is <CopyButton ...>
    
    if (lines[i+2] && lines[i+2].includes('totalAmount')) {
       lines[i+2] = `                            <span className="val-text" style={{ color: '#166534', fontSize: orders.length > 1 ? '13px' : '15px', fontWeight: orders.length > 1 ? 500 : 800 }}>{orders.length > 1 ? t('billing.ribBlock.multiple_amounts_note', 'Consultez le montant de votre commande ci-dessous') : \`\${totalAmount} €\`}</span>`;
       lines[i+3] = `                            {orders.length === 1 && <CopyButton onClick={() => copy(totalAmount, t('billing.ribBlock.amount', 'Montant'))}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>}`;
       replaced = true;
       break;
    }
  }
}

if (!replaced) {
  console.error("Could not find the lines to replace for AMOUNT!");
  process.exit(1);
}

code = lines.join('\n');

// Update WhatsApp Message
const oldWa = `href={\`https://wa.me/\${whatsappNum}?text=\${encodeURIComponent(t('billing.whatsappProof', 'Bonjour, je viens d\\'effectuer le virement de') + ' ' + totalAmount + ' €. ' + t('billing.whatsappProof2', 'Voici la preuve de paiement :'))}\`}`;
const newWa = `href={\`https://wa.me/\${whatsappNum}?text=\${encodeURIComponent(
                            orders.length > 1 
                              ? t('billing.whatsappProof_multiple', 'Bonjour, je viens d\\'effectuer un virement pour ma commande. Voici la preuve de paiement :')
                              : t('billing.whatsappProof', 'Bonjour, je viens d\\'effectuer le virement de') + ' ' + totalAmount + ' €. ' + t('billing.whatsappProof2', 'Voici la preuve de paiement :')
                          )}\`}`;

if (code.includes(oldWa)) {
  code = code.replace(oldWa, newWa);
} else {
  // Sometimes € becomes ? due to powershell
  const altOldWa = "Voici la preuve de paiement :'))}`}";
  if (code.includes(altOldWa)) {
      // Just manually search and replace the href line using split
      const codeLines = code.split('\n');
      for (let j = 0; j < codeLines.length; j++) {
        if (codeLines[j].includes('href={`https://wa.me/${whatsappNum}?text=')) {
          codeLines[j] = `                          href={\`https://wa.me/\${whatsappNum}?text=\${encodeURIComponent(orders.length > 1 ? t('billing.whatsappProof_multiple', 'Bonjour, je viens d\\'effectuer un virement pour ma commande. Voici la preuve de paiement :') : t('billing.whatsappProof', 'Bonjour, je viens d\\'effectuer le virement de') + ' ' + totalAmount + ' €. ' + t('billing.whatsappProof2', 'Voici la preuve de paiement :'))}\`}`;
        }
      }
      code = codeLines.join('\n');
  }
}

fs.writeFileSync('apps/client/src/pages/Billing.js', code);
console.log("Safely updated amount properly");
