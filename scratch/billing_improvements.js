const fs = require('fs');
let code = fs.readFileSync('apps/client/src/pages/Billing.js', 'utf8');

// 1. We need to find the RIBGrid rendering and modify the Reference field
// Currently it is:
/*
<RIBField className="highlight">
  <span className="label">{t('billing.ribBlock.ref', 'Référence de virement')}</span>
  <div className="val-row">
    <span className="val-text" style={{ color: '#166534', fontSize: '15px', fontWeight: 800 }}>{refs}</span>
    <CopyButton onClick={() => copy(refs, t('billing.ribBlock.ref', 'Référence'))}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>
  </div>
</RIBField>
*/

// Let's replace the whole RIBField for the reference
const oldRibField = `                        <RIBField className="highlight">
                          <span className="label">{t('billing.ribBlock.ref', 'Référence de virement')}</span>
                          <div className="val-row">
                            <span className="val-text" style={{ color: '#166534', fontSize: '15px', fontWeight: 800 }}>{refs}</span>
                            <CopyButton onClick={() => copy(refs, t('billing.ribBlock.ref', 'Référence'))}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>
                          </div>
                        </RIBField>`;
// Since there could be encoding issues, let's use regex to replace it
code = code.replace(/<RIBField className="highlight">[\s\S]*?<\/RIBField>/, 
`                        <RIBField className="highlight">
                          <span className="label">{t('billing.ribBlock.ref', 'Référence de virement')}</span>
                          <div className="val-row">
                            <span className="val-text" style={{ color: '#166534', fontSize: orders.length > 1 ? '13px' : '15px', fontWeight: orders.length > 1 ? 500 : 800 }}>
                              {orders.length > 1 ? t('billing.ribBlock.multiple_refs_note', 'Veuillez utiliser la référence de la commande que vous souhaitez régler.') : formatTransferRef(orders[0].id)}
                            </span>
                            {orders.length === 1 && (
                              <CopyButton onClick={() => copy(formatTransferRef(orders[0].id), t('billing.ribBlock.ref', 'Référence'))}>
                                <FaCopy /> {t('billing.ribBlock.copy', 'Copier')}
                              </CopyButton>
                            )}
                          </div>
                        </RIBField>`);

// 2. Add WhatsApp button to send receipt
// We'll add it right after </RIBGrid>
// The current code is:
/*
                      </RIBGrid>
                    );
                  })()}
*/
const whatsappButtonHtml = `
                      </RIBGrid>
                      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                        <WhatsAppBtn
                          className="big-btn"
                          style={{ padding: '12px 20px', fontSize: '14px', borderRadius: '8px' }}
                          href={\`https://wa.me/\${whatsappNum}?text=\${encodeURIComponent(t('billing.whatsappProof', 'Bonjour, je viens d\\'effectuer le virement de') + ' ' + totalAmount + ' €. ' + t('billing.whatsappProof2', 'Voici la preuve de paiement :'))}\`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp size={20} />
                          {t('billing.send_proof', 'Envoyer la preuve de virement')}
                        </WhatsAppBtn>
                      </div>
`;
code = code.replace(/<\/RIBGrid>/, whatsappButtonHtml);

// 3. Fix the 'refs' definition if needed (although we bypass it now, it's used for WhatsApp contact button above)
// We will just leave refs as it is for the first whatsapp contact button

fs.writeFileSync('apps/client/src/pages/Billing.js', code);
console.log("Billing updated");
