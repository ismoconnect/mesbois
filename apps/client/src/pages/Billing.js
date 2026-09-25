import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { getUserOrders } from '../firebase/orders';
import { getRIB } from '../firebase/rib';
import { getPaypalInfo } from '../firebase/paypal';
import { auth } from '../firebase/config';
import { signInAnonymously } from 'firebase/auth';
import toast from 'react-hot-toast';
import { formatTransferRef } from '../utils/ref';
import { FaWhatsapp, FaUniversity, FaCopy, FaCheckCircle, FaTruck, FaShieldAlt } from 'react-icons/fa';
import { FiClock, FiAlertCircle } from 'react-icons/fi';

const PageWrapper = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 0 32px 0;
  @media (max-width: 600px) {
    padding: 0 4px 24px 4px;
  }
`;

const HeaderCard = styled.div`
  background: linear-gradient(135deg, #1b3820 0%, #2c5530 65%, #3d7243 100%);
  color: white;
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(27, 56, 32, 0.15);

  @media (max-width: 600px) {
    padding: 18px 16px;
    border-radius: 14px;
  }
`;

const HeaderBadges = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
`;

const TrustBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  color: #f1f8f3;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 600;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;
  @media (max-width: 600px) {
    font-size: 20px;
  }
`;

const Subtitle = styled.p`
  font-size: 14px;
  margin: 0;
  opacity: 0.9;
  line-height: 1.45;
  @media (max-width: 600px) {
    font-size: 13px;
  }
`;

const NoticeCard = styled.div`
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-left: 4px solid #16a34a;
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;

  @media (max-width: 600px) {
    padding: 12px 14px;
    gap: 10px;
  }
`;

const NoticeContent = styled.div`
  font-size: 13.5px;
  color: #166534;
  line-height: 1.5;
  strong {
    font-weight: 700;
  }
`;

const SectionTitle = styled.h2`
  font-size: 17px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  padding: 20px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    padding: 14px;
    border-radius: 12px;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 14px;
`;

const OrderRef = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 17px;
  font-weight: 800;
  color: #111827;
  span.ref-badge {
    background: #ecfdf5;
    color: #065f46;
    padding: 3px 8px;
    border-radius: 6px;
    border: 1px solid #a7f3d0;
    font-size: 13.5px;
    font-family: monospace;
  }
`;

const OrderAmount = styled.div`
  font-size: 20px;
  font-weight: 900;
  color: #166534;
  display: flex;
  align-items: baseline;
  gap: 4px;
  span.lbl {
    font-size: 12px;
    font-weight: 600;
    color: #6b7280;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
`;

const RIBGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  margin-top: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const RIBField = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px 12px;
  background: #f8fafc;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &.highlight {
    background: #f0fdf4;
    border: 1px solid #86efac;
    grid-column: 1 / -1;
  }

  .label {
    font-size: 11.5px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }

  .val-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
  }

  .val-text {
    font-weight: 700;
    color: #0f172a;
    font-size: 13.5px;
    word-break: break-all;
    font-family: ${props => props.$isMono ? 'monospace' : 'inherit'};
  }
`;

const CopyButton = styled.button`
  background: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  padding: 5px 8px;
  font-size: 11.5px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: #f1f5f9;
    border-color: #94a3b8;
    color: #0f172a;
  }
`;

const ActionRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
  justify-content: space-between;
  align-items: center;
`;

const PrimaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #2c5530;
  color: #fff;
  padding: 9px 15px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.2s ease;

  &:hover {
    background: #1e3a22;
  }
`;

const WhatsAppBtn = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #25D366;
  color: #fff;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(37, 211, 102, 0.25);
  transition: all 0.2s ease;

  &:hover {
    background: #20ba5a;
    transform: translateY(-1px);
  }
`;

const StepsBox = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  margin-top: 20px;
`;

const StepsList = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const StepItem = styled.div`
  display: flex;
  gap: 10px;
  align-items: flex-start;

  .num {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: #2c5530;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    flex-shrink: 0;
  }

  .text {
    font-size: 12.5px;
    color: #334155;
    line-height: 1.4;
    strong {
      color: #0f172a;
      display: block;
      font-size: 13px;
      margin-bottom: 2px;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 36px 20px;
  color: #475569;

  .icon {
    font-size: 40px;
    color: #16a34a;
    margin-bottom: 12px;
  }

  h3 {
    font-size: 17px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 6px 0;
  }

  p {
    font-size: 13.5px;
    margin: 0 0 18px 0;
    color: #64748b;
  }
`;

const Billing = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [rib, setRib] = useState({ holder: '', iban: '', bic: '', bank: '', enabled: true, whatsappNumber: '' });
  const [paypalInfo, setPaypalInfo] = useState({ email: '', instructions: '' });

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text || '');
      toast.success(`${label} copié !`, { duration: 1800, position: 'bottom-center' });
    } catch {
      toast.error('Erreur de copie');
    }
  };

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      try {
        if (!auth.currentUser) {
          await signInAnonymously(auth);
        }
      } catch { }

      const [ordersRes, ribRes, paypalRes] = await Promise.all([
        getUserOrders(user.uid),
        getRIB(),
        getPaypalInfo()
      ]);

      if (ordersRes.success) {
        const pending = (ordersRes.data || []).filter(o =>
          (o.payment?.method === 'bank' || o.payment?.method === 'paypal' || !o.payment?.method) &&
          (o.status !== 'paid' && o.status !== 'delivered' && o.status !== 'cancelled')
        );
        setOrders(pending);
      }

      if (ribRes.success) {
        setRib(ribRes.data);
      } else {
        setRib({
          holder: process.env.REACT_APP_RIB_HOLDER || 'Brennholzkaufen SAS',
          iban: process.env.REACT_APP_RIB_IBAN || '',
          bic: process.env.REACT_APP_RIB_BIC || '',
          bank: process.env.REACT_APP_RIB_BANK || 'Banque Officielle',
          enabled: true
        });
      }

      if (paypalRes.success) {
        setPaypalInfo(paypalRes.data);
      } else {
        setPaypalInfo({
          email: process.env.REACT_APP_PAYPAL_EMAIL || '',
          instructions: process.env.REACT_APP_PAYPAL_INSTRUCTIONS || ''
        });
      }

      setLoading(false);
    };
    load();
  }, [user]);

  if (!user) return null;

  const whatsappNum = (rib.whatsappNumber || '+49 1633637236').replace(/[^0-9]/g, '');

  return (
    <DashboardLayout>
      <PageWrapper>
        {/* Header Hero */}
        <HeaderCard>
          <HeaderBadges>
            <TrustBadge><FaShieldAlt size={12} /> Virement bancaire sécurisé</TrustBadge>
            <TrustBadge><FaTruck size={12} /> Livraison chariot tout-terrain</TrustBadge>
            <TrustBadge><FaWhatsapp size={12} /> Support WhatsApp 7j/7</TrustBadge>
          </HeaderBadges>
          <Title>Paiement & Facturation</Title>
          <Subtitle>
            Retrouvez les coordonnées officielles pour régler vos commandes de bois de chauffage et déclencher la livraison.
          </Subtitle>
        </HeaderCard>

        {/* Notice rassurante */}
        <NoticeCard>
          <FaCheckCircle size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
          <NoticeContent>
            <strong>Validation prioritaire de votre commande :</strong> dès exécution de votre virement bancaire avec la référence indiquée, votre stock de stères ou palettes est réservé et le transporteur vous contacte pour le rendez-vous.
          </NoticeContent>
        </NoticeCard>

        {/* Commandes en attente de paiement */}
        <SectionTitle>
          <FiClock size={18} color="#2c5530" />
          Commandes en attente de règlement
        </SectionTitle>

        {loading && (
          <Card>
            <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
              Chargement de vos informations de paiement…
            </div>
          </Card>
        )}

        {!loading && orders.length === 0 && (
          <Card>
            <EmptyState>
              <div className="icon">✓</div>
              <h3>Toutes vos commandes sont à jour !</h3>
              <p>Vous n'avez aucun paiement en attente. Votre bois est soit validé, soit déjà en cours de livraison.</p>
              <PrimaryLink to="/dashboard/boutique">
                Commander du bois ou des granulés →
              </PrimaryLink>
            </EmptyState>
          </Card>
        )}

        {!loading && orders.map((order) => {
          const ref = formatTransferRef(order.id);
          const isPaypal = order.payment?.method === 'paypal';
          const orderTotal = order.total ? Number(order.total).toFixed(2) : '0.00';

          return (
            <Card key={order.id}>
              <OrderHeader>
                <div>
                  <OrderRef>
                    <span>Commande</span>
                    <span className="ref-badge">{ref}</span>
                  </OrderRef>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                    {order.items?.length || 1} article(s) • Passée le {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : 'récemment'}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Badge>
                    <FiClock size={13} /> En attente de virement
                  </Badge>
                  <OrderAmount>
                    <span className="lbl">À régler :</span>
                    <span>{orderTotal} €</span>
                  </OrderAmount>
                </div>
              </OrderHeader>

              {/* Instructions RIB ou WhatsApp */}
              {(!rib.enabled || rib.enabled === 'false') ? (
                <div style={{ background: '#f0fdf4', border: '1.5px solid #22c55e', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: '#166534', fontWeight: 800, fontSize: '15px' }}>
                    <FaWhatsapp size={20} color="#25D366" />
                    Transmission officielle du RIB sur WhatsApp
                  </div>
                  <p style={{ fontSize: '13px', color: '#334155', margin: '0 0 12px 0', lineHeight: 1.5 }}>
                    Pour sécuriser votre transaction et planifier l'accès de votre allée pour notre <strong>chariot embarqué tout-terrain</strong>, nos coordonnées bancaires vous sont envoyées directement via notre compte WhatsApp Pro vérifié.
                  </p>
                  <WhatsAppBtn
                    href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                      `Bonjour Brennholzkaufen,

Je vous contacte pour ma commande #${ref} d'un montant de ${orderTotal} €.
Pourriez-vous me transmettre votre RIB / IBAN officiel afin que j'effectue le virement pour la livraison chariot tout-terrain ?
Merci !`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FaWhatsapp size={18} />
                    <span>Obtenir le RIB sur WhatsApp Pro →</span>
                  </WhatsAppBtn>
                </div>
              ) : isPaypal ? (
                <>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e3a22', marginBottom: '6px' }}>
                    Coordonnées de règlement PayPal :
                  </div>
                  <RIBGrid>
                    <RIBField>
                      <span className="label">Email de paiement</span>
                      <div className="val-row">
                        <span className="val-text">{paypalInfo.email}</span>
                        <CopyButton onClick={() => copy(paypalInfo.email, 'Email PayPal')}><FaCopy /> Copier</CopyButton>
                      </div>
                    </RIBField>
                    <RIBField className="highlight">
                      <span className="label">Référence obligatoire à joindre</span>
                      <div className="val-row">
                        <span className="val-text" style={{ color: '#166534' }}>{ref}</span>
                        <CopyButton onClick={() => copy(ref, 'Référence')}><FaCopy /> Copier</CopyButton>
                      </div>
                    </RIBField>
                  </RIBGrid>
                </>
              ) : (
                <>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1e3a22', marginBottom: '4px' }}>
                    Coordonnées bancaires pour effectuer le virement :
                  </div>
                  <RIBGrid>
                    <RIBField>
                      <span className="label">Titulaire du compte</span>
                      <div className="val-row">
                        <span className="val-text">{rib.holder || 'Brennholzkaufen SAS'}</span>
                        <CopyButton onClick={() => copy(rib.holder, 'Titulaire')}><FaCopy /> Copier</CopyButton>
                      </div>
                    </RIBField>
                    <RIBField>
                      <span className="label">Établissement bancaire</span>
                      <div className="val-row">
                        <span className="val-text">{rib.bank || 'Banque'}</span>
                        <CopyButton onClick={() => copy(rib.bank, 'Banque')}><FaCopy /> Copier</CopyButton>
                      </div>
                    </RIBField>
                    <RIBField className="highlight">
                      <span className="label">IBAN Officiel</span>
                      <div className="val-row">
                        <span className="val-text" style={{ letterSpacing: '0.5px' }}>{rib.iban}</span>
                        <CopyButton onClick={() => copy(rib.iban, 'IBAN')}><FaCopy /> Copier</CopyButton>
                      </div>
                    </RIBField>
                    <RIBField>
                      <span className="label">Code BIC / SWIFT</span>
                      <div className="val-row">
                        <span className="val-text">{rib.bic}</span>
                        <CopyButton onClick={() => copy(rib.bic, 'BIC')}><FaCopy /> Copier</CopyButton>
                      </div>
                    </RIBField>
                    <RIBField className="highlight">
                      <span className="label">Libellé / Motif obligatoire du virement</span>
                      <div className="val-row">
                        <span className="val-text" style={{ color: '#166534', fontSize: '15px' }}>{ref}</span>
                        <CopyButton onClick={() => copy(ref, 'Référence de virement')}><FaCopy /> Copier le code</CopyButton>
                      </div>
                    </RIBField>
                    <RIBField>
                      <span className="label">Montant exact à virer</span>
                      <div className="val-row">
                        <span className="val-text" style={{ color: '#166534', fontSize: '15px' }}>{orderTotal} €</span>
                        <CopyButton onClick={() => copy(orderTotal, 'Montant')}><FaCopy /> Copier</CopyButton>
                      </div>
                    </RIBField>
                  </RIBGrid>
                </>
              )}

              {/* Actions rapides pour cette commande */}
              <ActionRow>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <PrimaryLink to={`/dashboard/suivi/${order.id}`}>
                    <FaTruck size={14} /> Suivre l'avancement
                  </PrimaryLink>
                  <PrimaryLink to={`/dashboard/orders/${order.id}`} style={{ background: '#f8fafc', color: '#1e293b', border: '1px solid #cbd5e1' }}>
                    Voir le récapitulatif
                  </PrimaryLink>
                </div>
                <WhatsAppBtn
                  href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                    `Bonjour Brennholzkaufen,

Je viens d'initier le virement bancaire pour ma commande #${ref} d'un montant de ${orderTotal} €.
Voici mon justificatif de virement.
Merci de me confirmer la prise en compte pour la livraison !`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp size={16} />
                  <span>Envoyer mon justificatif sur WhatsApp</span>
                </WhatsAppBtn>
              </ActionRow>
            </Card>
          );
        })}

        {/* Étapes du processus de commande & livraison */}
        <StepsBox>
          <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaUniversity color="#2c5530" size={16} />
            Comment se déroule la validation & la livraison de votre bois ?
          </div>
          <StepsList>
            <StepItem>
              <div className="num">1</div>
              <div className="text">
                <strong>Virement bancaire</strong>
                Effectuez le virement avec le motif <code>#MB-...</code> depuis votre espace bancaire habituel.
              </div>
            </StepItem>
            <StepItem>
              <div className="num">2</div>
              <div className="text">
                <strong>Vérification & Préparation</strong>
                Nos équipes valident la réception sous 24h et préparent vos stères sur palette cerclée.
              </div>
            </StepItem>
            <StepItem>
              <div className="num">3</div>
              <div className="text">
                <strong>Livraison Chariot Embarqué</strong>
                Le chauffeur dépose vos palettes au plus près de votre zone de stockage (abri, garage, jardin).
              </div>
            </StepItem>
          </StepsList>
        </StepsBox>
      </PageWrapper>
    </DashboardLayout>
  );
};

export default Billing;
