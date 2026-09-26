const fs = require('fs');
let code = fs.readFileSync('apps/client/src/pages/Billing.js', 'utf8');

const oldAmountBlock = `                        <RIBField>
                          <span className="label">{t('billing.ribBlock.amount', 'Montant exact à virer')}</span>
                          <div className="val-row">
                            <span className="val-text" style={{ color: '#166534', fontSize: '15px', fontWeight: 800 }}>{totalAmount} €</span>
                            <CopyButton onClick={() => copy(totalAmount, t('billing.ribBlock.amount', 'Montant'))}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>
                          </div>
                        </RIBField>`;

const newAmountBlock = `                        <RIBField>
                          <span className="label">{t('billing.ribBlock.amount', 'Montant exact à virer')}</span>
                          <div className="val-row">
                            <span className="val-text" style={{ color: '#166534', fontSize: orders.length > 1 ? '13px' : '15px', fontWeight: orders.length > 1 ? 500 : 800 }}>
                              {orders.length > 1 ? t('billing.ribBlock.multiple_amounts_note', 'Consultez le montant de votre commande ci-dessous') : \`\${totalAmount} €\`}
                            </span>
                            {orders.length === 1 && (
                              <CopyButton onClick={() => copy(totalAmount, t('billing.ribBlock.amount', 'Montant'))}>
                                <FaCopy /> {t('billing.ribBlock.copy', 'Copier')}
                              </CopyButton>
                            )}
                          </div>
                        </RIBField>`;

if (code.includes(oldAmountBlock)) {
  code = code.replace(oldAmountBlock, newAmountBlock);
} else {
  console.log("Could not find the exact amount block! Trying fallback.");
  // Let's use a safe split
  const lines = code.split('\\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes("Montant exact à virer")) {
      // replace the next few lines
      lines[i+2] = `                            <span className="val-text" style={{ color: '#166534', fontSize: orders.length > 1 ? '13px' : '15px', fontWeight: orders.length > 1 ? 500 : 800 }}>{orders.length > 1 ? t('billing.ribBlock.multiple_amounts_note', 'Consultez le montant de votre commande ci-dessous') : \`\${totalAmount} €\`}</span>`;
      lines[i+3] = `                            {orders.length === 1 && <CopyButton onClick={() => copy(totalAmount, t('billing.ribBlock.amount', 'Montant'))}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>}`;
    }
  }
  code = lines.join('\\n');
}

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
  // Try another replacement
  const altOldWa = `href={\`https://wa.me/\${whatsappNum}?text=\${encodeURIComponent(t('billing.whatsappProof', 'Bonjour, je viens d\\'effectuer le virement de') + ' ' + totalAmount + ' ?. ' + t('billing.whatsappProof2', 'Voici la preuve de paiement :'))}\`}`;
  code = code.replace(altOldWa, newWa);
}

fs.writeFileSync('apps/client/src/pages/Billing.js', code);
console.log("Safely updated amount");
