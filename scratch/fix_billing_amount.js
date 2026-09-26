const fs = require('fs');
let code = fs.readFileSync('apps/client/src/pages/Billing.js', 'utf8');

// We need to modify the Amount field in the RIBGrid
/*
                        <RIBField>
                          <span className="label">{t('billing.ribBlock.amount', 'Montant exact à virer')}</span>
                          <div className="val-row">
                            <span className="val-text" style={{ color: '#166534', fontSize: '15px', fontWeight: 800 }}>{totalAmount} €</span>
                            <CopyButton onClick={() => copy(totalAmount, t('billing.ribBlock.amount', 'Montant'))}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>
                          </div>
                        </RIBField>
*/

code = code.replace(
  /<RIBField>[\s\S]*?<span className="label">\{t\('billing\.ribBlock\.amount'[\s\S]*?<\/RIBField>/,
  `<RIBField>
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
                        </RIBField>`
);

// We also need to modify the WhatsApp message.
// Currently it's:
// href={\`https://wa.me/\${whatsappNum}?text=\${encodeURIComponent(t('billing.whatsappProof', 'Bonjour, je viens d\\'effectuer le virement de') + ' ' + totalAmount + ' €. ' + t('billing.whatsappProof2', 'Voici la preuve de paiement :'))}\`}

code = code.replace(
  /href=\{`https:\/\/wa\.me\/\$\{whatsappNum\}\?text=\$\{encodeURIComponent\(t\('billing\.whatsappProof', 'Bonjour, je viens d\\'effectuer le virement de'\) \+ ' ' \+ totalAmount \+ ' €\. ' \+ t\('billing\.whatsappProof2', 'Voici la preuve de paiement :'\)\)\}`\}/,
  `href={\`https://wa.me/\${whatsappNum}?text=\${encodeURIComponent(
                            orders.length > 1 
                              ? t('billing.whatsappProof_multiple', 'Bonjour, je viens d\\'effectuer un virement pour ma commande. Voici la preuve de paiement :')
                              : t('billing.whatsappProof', 'Bonjour, je viens d\\'effectuer le virement de') + ' ' + totalAmount + ' €. ' + t('billing.whatsappProof2', 'Voici la preuve de paiement :')
                          )}\`}`
);

fs.writeFileSync('apps/client/src/pages/Billing.js', code);
console.log("Billing updated for amount");
