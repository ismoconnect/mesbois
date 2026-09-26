const fs = require('fs');

const path = 'apps/client/src/pages/Billing.js';
let code = fs.readFileSync(path, 'utf8');

// Fix WhatsAppBtn style
code = code.replace(
  /white-space: nowrap;/g,
  `white-space: normal;\n  text-align: center;`
);

// We need to find the start of the WhatsApp block and replace it with a conditional.
const startSearch = `{/* Bloc WhatsApp Unique et Centralisé */}`;
const endSearch = `</div>\r\n\r\n            {/* Liste des commandes simplifiées */}`; // This matches the end of the WhatsApp block

const startIdx = code.indexOf(startSearch);
// Because CRLF or LF, let's just find the end more robustly:
const endIdxStr = `{/* Liste des commandes simplifiées */}`;
const endIdx = code.indexOf(endIdxStr);

if (startIdx === -1 || endIdx === -1) {
  console.log("Could not find blocks!");
  process.exit(1);
}

const beforeBlock = code.substring(0, startIdx);
const whatsappBlock = code.substring(startIdx, endIdx);
const afterBlock = code.substring(endIdx);

const newBlock = `{!rib.enabled ? (
              <>
                ${whatsappBlock.trim()}
              </>
            ) : (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', margin: '0 0 24px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaUniversity color="#334155" size={20} />
                  {t('billing.ribBlock.title', 'Coordonnées bancaires pour le virement')}
                </div>
                {(() => {
                  const totalAmount = orders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2);
                  const refs = orders.map(o => formatTransferRef(o.id)).join(', ');
                  return (
                    <RIBGrid>
                      <RIBField>
                        <span className="label">{t('billing.ribBlock.holder', 'Titulaire du compte')}</span>
                        <div className="val-row">
                          <span className="val-text">{rib.holder || 'Brennholzkaufen SAS'}</span>
                          <CopyButton onClick={() => copy(rib.holder, t('billing.ribBlock.holder', 'Titulaire'))}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>
                        </div>
                      </RIBField>
                      <RIBField>
                        <span className="label">{t('billing.ribBlock.bank', 'Établissement bancaire')}</span>
                        <div className="val-row">
                          <span className="val-text">{rib.bank || 'Banque'}</span>
                          <CopyButton onClick={() => copy(rib.bank, t('billing.ribBlock.bank', 'Banque'))}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>
                        </div>
                      </RIBField>
                      <RIBField className="highlight">
                        <span className="label">{t('billing.ribBlock.iban', 'IBAN Officiel')}</span>
                        <div className="val-row">
                          <span className="val-text" style={{ letterSpacing: '0.5px' }}>{rib.iban}</span>
                          <CopyButton onClick={() => copy(rib.iban, 'IBAN')}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>
                        </div>
                      </RIBField>
                      <RIBField>
                        <span className="label">{t('billing.ribBlock.bic', 'Code BIC / SWIFT')}</span>
                        <div className="val-row">
                          <span className="val-text">{rib.bic}</span>
                          <CopyButton onClick={() => copy(rib.bic, 'BIC')}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>
                        </div>
                      </RIBField>
                      <RIBField className="highlight">
                        <span className="label">{t('billing.ribBlock.ref', 'Référence de virement')}</span>
                        <div className="val-row">
                          <span className="val-text" style={{ color: '#166534', fontSize: '15px', fontWeight: 800 }}>{refs}</span>
                          <CopyButton onClick={() => copy(refs, t('billing.ribBlock.ref', 'Référence'))}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>
                        </div>
                      </RIBField>
                      <RIBField>
                        <span className="label">{t('billing.ribBlock.amount', 'Montant exact à virer')}</span>
                        <div className="val-row">
                          <span className="val-text" style={{ color: '#166534', fontSize: '15px', fontWeight: 800 }}>{totalAmount} €</span>
                          <CopyButton onClick={() => copy(totalAmount, t('billing.ribBlock.amount', 'Montant'))}><FaCopy /> {t('billing.ribBlock.copy', 'Copier')}</CopyButton>
                        </div>
                      </RIBField>
                    </RIBGrid>
                  );
                })()}
              </div>
            )}\n\n            `;

code = beforeBlock + newBlock + afterBlock;
fs.writeFileSync(path, code);
console.log("File updated successfully.");
