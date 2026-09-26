import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
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
  box-sizing: border-box;
  
  @media (max-width: 600px) {
    padding: 0 12px 28px 12px;
  }
`;

const HeaderCard = styled.div`
  background: linear-gradient(135deg, #1b3820 0%, #2c5530 65%, #3d7243 100%);
  color: white;
  border-radius: 16px;
  padding: 24px 28px;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px rgba(27, 56, 32, 0.15);
  box-sizing: border-box;
  width: 100%;

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
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
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
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 600;
  
  @media (max-width: 600px) {
    padding: 8px 12px;
    font-size: 12.5px;
    justify-content: flex-start;
  }
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
  border-radius: 12px;
  padding: 14px 18px;
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  box-sizing: border-box;
  width: 100%;

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

  @media (max-width: 600px) {
    font-size: 15px;
    gap: 6px;
    white-space: normal;
  text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  padding: 20px;
  margin-bottom: 20px;
  box-sizing: border-box;
  width: 100%;

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
  white-space: normal;
  text-align: center;

  &:hover {
    background: #20ba5a;
    transform: translateY(-1px);
  }

  &.big-btn {
    padding: 14px 28px;
    font-size: 15px;

    @media (max-width: 600px) {
      padding: 12px 16px;
      font-size: 14px;
    }
  }
`;

const StepsBox = styled.div`
  background: #f8fafc;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid #e2e8f0;
  margin-top: 20px;
  box-sizing: border-box;
  width: 100%;
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
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [rib, setRib] = useState({ holder: '', iban: '', bic: '', bank: '', enabled: true, whatsappNumber: '' });
  const [paypalInfo, setPaypalInfo] = useState({ email: '', instructions: '' });

  const copy = async (text, label) => {
    try {
      await navigator.clipboard.writeText(text || '');
      toast.success(`${label} ${t('billing.copySuccess', 'copié !')}`, { duration: 1800, position: 'bottom-center' });
    } catch {
      toast.error(t('billing.copyError', 'Erreur de copie'));
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
            <TrustBadge><FaShieldAlt size={12} /> {t('billing.badges.secureTransfer', 'Transfert bancaire sécurisé')}</TrustBadge>
            <TrustBadge><FaTruck size={12} /> {t('billing.badges.forklift', 'Livraison avec chariot embarqué')}</TrustBadge>
            <TrustBadge><FaWhatsapp size={12} /> {t('billing.badges.whatsappSupport', 'Support WhatsApp 7j/7')}</TrustBadge>
          </HeaderBadges>
          <Title>{t('billing.title', 'Facturation & RIB')}</Title>
          <Subtitle>
            {t('billing.subtitle', 'Voici les coordonnées officielles pour payer vos commandes de bois de chauffage et déclencher la livraison.')}
          </Subtitle>
        </HeaderCard>

        {/* Notice rassurante */}
        <NoticeCard>
          <FaCheckCircle size={20} color="#16a34a" style={{ flexShrink: 0, marginTop: 2 }} />
          <NoticeContent>
            <strong>{t('billing.notice.title', 'Confirmation prioritaire de votre commande:')}</strong> {t('billing.notice.text', 'Dès que vous effectuez votre virement bancaire avec la référence indiquée, votre bois est réservé et le transporteur vous contacte pour un rendez-vous de livraison.')}
          </NoticeContent>
        </NoticeCard>

        {/* Commandes en attente de paiement */}
        <SectionTitle>
          <FiClock size={18} color="#2c5530" />
          {t('billing.pendingOrders', 'Commandes en attente')}
        </SectionTitle>

        {loading && (
          <Card>
            <div style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
              {t('billing.loading', 'Chargement des informations de paiement...')}
            </div>
          </Card>
        )}

        {!loading && orders.length === 0 && (
          <Card>
            <EmptyState>
              <div className="icon">✓</div>
              <h3>{t('billing.empty.title', 'Toutes vos commandes sont à jour !')}</h3>
              <p>{t('billing.empty.text', 'Vous n\'avez aucun paiement en attente. Votre bois est soit confirmé, soit déjà en cours de livraison.')}</p>
              <PrimaryLink to="/dashboard/boutique">
                {t('billing.empty.button', 'Commander du bois ou des granulés →')}
              </PrimaryLink>
            </EmptyState>
          </Card>
        )}

        {!loading && orders.length > 0 && (
          <>
            {!rib.enabled ? (
              <>
                {/* Bloc WhatsApp Unique et Centralisé */}
            <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '14px', padding: '24px', textAlign: 'center', margin: '0 0 24px 0', boxShadow: '0 4px 12px rgba(22, 163, 74, 0.08)' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', marginBottom: '16px' }}>
                <FaShieldAlt size={28} />
              </div>
              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#166534', fontWeight: 800 }}>
                {t('billing.whatsappCard.title', 'Obtenir les coordonnées bancaires')}
              </h3>
              <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#334155', lineHeight: 1.5, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
                {t('billing.whatsappCard.text', 'Pour des raisons de sécurité, nos coordonnées bancaires officielles vous seront communiquées uniquement via notre canal WhatsApp vérifié. Cliquez ci-dessous pour les demander.')}
              </p>
              {(() => {
                const totalAmount = orders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2);
                const refs = orders.length > 1 ? t('billing.ribBlock.multiple_refs', 'Indiquez l\'une de vos références au choix') : (orders.length === 1 ? formatTransferRef(orders[0].id) : '');
                const message = `${t('billing.whatsappCard.message.part1', 'Bonjour, je souhaite obtenir les coordonnées bancaires pour payer ma/mes commande(s) en attente :')} ${refs} ${t('billing.whatsappCard.message.part2', 'pour un montant total de')} ${totalAmount} €.\n${t('billing.whatsappCard.message.part3', 'Merci !')}`;
                
                return (
                  <WhatsAppBtn
                    className="big-btn"
                    href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(message)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ width: '100%', justifyContent: 'center', maxWidth: '350px' }}
                  >
                    <FaWhatsapp size={20} />
                    <span>{t('billing.whatsappCard.button', 'Demander les coordonnées via WhatsApp')}</span>
                  </WhatsAppBtn>
                );
              })()}
            </div>
              </>
            ) : (
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '24px', margin: '0 0 24px 0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ fontWeight: 800, fontSize: '16px', color: '#1e293b', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FaUniversity color="#334155" size={20} />
                  {t('billing.ribBlock.title', 'Coordonnées bancaires pour le virement')}
                </div>
                {(() => {
                  const totalAmount = orders.reduce((sum, o) => sum + (o.total || 0), 0).toFixed(2);
                  const refs = orders.length > 1 ? t('billing.ribBlock.multiple_refs', 'Indiquez l\'une de vos références au choix') : (orders.length === 1 ? formatTransferRef(orders[0].id) : '');
                  return (
                      <>
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
                      <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                        <WhatsAppBtn
                          className="big-btn"
                          style={{ padding: '12px 20px', fontSize: '14px', borderRadius: '8px' }}
                          href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(t('billing.whatsappProof', 'Bonjour, je viens d\'effectuer le virement de') + ' ' + totalAmount + ' €. ' + t('billing.whatsappProof2', 'Voici la preuve de paiement :'))}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <FaWhatsapp size={20} />
                          {t('billing.send_proof', 'Envoyer la preuve de virement')}
                        </WhatsAppBtn>
                      </div>
                      </>
                    );
                  })()}
              </div>
            )}

            {/* Liste des commandes simplifiées */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => {
                const ref = formatTransferRef(order.id);
                const orderTotal = order.total ? Number(order.total).toFixed(2) : '0.00';

                return (
                  <Card key={order.id} style={{ marginBottom: 0 }}>
                    <OrderHeader style={{ borderBottom: 'none', paddingBottom: 0, marginBottom: 0 }}>
                      <div>
                        <OrderRef>
                          <span>{t('billing.orderCard.order', 'Commande')}</span>
                          <span className="ref-badge">{ref}</span>
                        </OrderRef>
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                          {order.items?.length || 1} {t('billing.orderCard.items', 'articles')} • {t('billing.orderCard.orderedOn', 'Commandé le')} {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('de-DE') : t('billing.orderCard.recently', 'récemment')}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <OrderAmount>
                          <span className="lbl">{t('billing.orderCard.toPay', 'À payer :')}</span>
                          <span>{orderTotal} €</span>
                        </OrderAmount>
                      </div>
                    </OrderHeader>

                    {/* Actions rapides pour cette commande (centrées ou empilées selon la taille) */}
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', width: '100%', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
                      <PrimaryLink to={`/dashboard/suivi/${order.id}`} style={{ flex: 1, justifyContent: 'center' }}>
                        <FaTruck size={14} /> {t('billing.orderCard.track', 'Suivre')}
                      </PrimaryLink>
                      <PrimaryLink to={`/dashboard/orders/${order.id}`} style={{ flex: 1, justifyContent: 'center', background: '#f8fafc', color: '#1e293b', border: '1px solid #cbd5e1' }}>
                        {t('billing.orderCard.details', 'Détails')}
                      </PrimaryLink>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}

        {/* Étapes du processus de commande & livraison */}
        <StepsBox>
          <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FaUniversity color="#2c5530" size={16} />
            {t('billing.steps.title', 'Comment se passe la confirmation et la livraison de votre bois ?')}
          </div>
          <StepsList>
            <StepItem>
              <div className="num">1</div>
              <div className="text">
                <strong>{t('billing.steps.step1.title', 'Virement bancaire')}</strong>
                {t('billing.steps.step1.text1', 'Effectuez le virement avec la référence')} <code>#MB-...</code> {t('billing.steps.step1.text2', 'depuis votre espace bancaire.')}
              </div>
            </StepItem>
            <StepItem>
              <div className="num">2</div>
              <div className="text">
                <strong>{t('billing.steps.step2.title', 'Vérification & Préparation')}</strong>
                {t('billing.steps.step2.text', 'Notre équipe confirme la réception du paiement sous 24h et prépare vos palettes.')}
              </div>
            </StepItem>
            <StepItem>
              <div className="num">3</div>
              <div className="text">
                <strong>{t('billing.steps.step3.title', 'Livraison avec chariot')}</strong>
                {t('billing.steps.step3.text', 'Le chauffeur dépose vos palettes au plus près de votre lieu de stockage (carport, garage, jardin).')}
              </div>
            </StepItem>
          </StepsList>
        </StepsBox>
      </PageWrapper>
    </DashboardLayout>
  );
};

export default Billing;
