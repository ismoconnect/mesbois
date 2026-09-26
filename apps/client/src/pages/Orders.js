import i18n from '../i18n';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiPackage, 
  FiTruck, 
  FiCheckCircle, 
  FiClock, 
  FiXCircle, 
  FiCreditCard, 
  FiArrowRight, 
  FiFileText,
  FiShoppingBag,
  FiChevronRight
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders, cancelOrder } from '../firebase/orders';
import { formatTransferRef } from '../utils/ref';
import DashboardLayout from '../components/Layout/DashboardLayout';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import routeMapping from '../utils/routeMapping.json';

// ========================================================
// STYLED COMPONENTS (RESPONSIVE & ADAPTÉ AU BOIS)
// ========================================================

const OrdersContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 16px 32px;
  box-sizing: border-box;

  @media (max-width: 640px) { 
    padding: 0 12px 24px; 
  }
`;

const HeaderCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  padding: 24px;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
`;

const WoodTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  color: #166534;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  margin-bottom: 12px;

  @media (max-width: 640px) {
    font-size: 10.5px;
    padding: 3px 10px;
    margin-bottom: 8px;
  }
`;

const OrdersTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #1b4332;
  margin: 0 0 8px 0;
  letter-spacing: -0.3px;

  @media (max-width: 640px) { 
    font-size: 20px; 
    margin: 0 0 4px 0;
  }
`;

const OrdersSubtitle = styled.p`
  color: #64748b;
  font-size: 15px;
  margin: 0;
  line-height: 1.5;

  @media (max-width: 640px) { 
    font-size: 12.5px; 
    line-height: 1.4;
  }
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;

  @media (max-width: 640px) {
    gap: 12px;
  }
`;

const OrderCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  padding: 24px;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  min-width: 0;
  overflow: hidden;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 640px) {
    padding: 16px;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 16px;
  
  @media (max-width: 640px) {
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding-bottom: 12px;
    margin-bottom: 12px;
  }
`;

const OrderInfo = styled.div`
  min-width: 0;

  .order-ref {
    font-size: 16px;
    font-weight: 800;
    color: #166534;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .order-date {
    color: #64748b;
    font-size: 13px;
    margin-top: 4px;
  }

  @media (max-width: 640px) {
    .order-ref { font-size: 14px; gap: 6px; }
    .order-date { font-size: 11.5px; margin-top: 2px; }
  }
`;

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${props => props.bg || '#f1f5f9'};
  color: ${props => props.color || '#334155'};
  border: 1px solid ${props => props.border || '#cbd5e1'};
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 11px;
    padding: 3px 8px;
    align-self: flex-start;
  }
`;

// Notice Virement bancaire pro
const PayNotice = styled.div`
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
  border: 1px solid #fde68a;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;

  .notice-left {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 13px;
    color: #92400e;
    font-weight: 600;
    line-height: 1.4;

    .icon {
      font-size: 20px;
      flex-shrink: 0;
    }
  }

  @media (max-width: 640px) {
    padding: 12px 14px;
    gap: 10px;
    .notice-left { 
      font-size: 12px; 
      .icon { font-size: 18px; }
    }
  }
`;

const PayNoticeButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #2c5530;
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: background-color 0.15s ease;

  &:hover {
    background: #1e3a22;
  }

  @media (max-width: 640px) {
    padding: 8px 14px;
    font-size: 11.5px;
    width: auto;
  }
`;

const DeliveryBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  padding: 10px 14px;
  border-radius: 10px;
  font-size: 13px;
  color: #166534;
  font-weight: 600;
  margin-bottom: 16px;

  svg {
    flex-shrink: 0;
    font-size: 16px;
  }

  @media (max-width: 640px) {
    font-size: 11.5px;
    padding: 8px 10px;
    margin-bottom: 12px;
    svg { font-size: 14px; }
  }
`;

const OrderItems = styled.div`
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 10px;
  padding: 12px 14px;
  gap: 12px;
  
  @media (max-width: 640px) {
    padding: 10px 12px;
    border-radius: 8px;
  }
`;

const ItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  flex: 1;

  .item-qty {
    background: #ecfdf5;
    color: #166534;
    font-weight: 800;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 6px;
    flex-shrink: 0;
  }

  .item-title {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 640px) {
    gap: 8px;
    .item-qty { font-size: 11px; padding: 2px 6px; }
    .item-title { font-size: 12px; white-space: normal; }
  }
`;

const ItemPrice = styled.div`
  font-weight: 700;
  font-size: 14px;
  color: #334155;
  flex-shrink: 0;

  @media (max-width: 640px) {
    font-size: 12.5px;
  }
`;

const OrderTotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  margin-bottom: 16px;
  font-size: 14px;
  color: #64748b;

  .total-amount {
    font-size: 18px;
    font-weight: 800;
    color: #1b4332;
  }

  @media (max-width: 640px) {
    padding-top: 12px;
    font-size: 12.5px;
    .total-amount { font-size: 16px; }
    margin-bottom: 12px;
  }
`;

const OrderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  @media (max-width: 640px) {
    gap: 8px;
  }
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s ease;

  &.primary {
    background: #2c5530;
    color: #ffffff;
    &:hover { background: #1e3a22; }
  }

  &.secondary {
    background: #ffffff;
    color: #2c5530;
    border: 1px solid #86efac;
    &:hover { background: #f0fdf4; }
  }

  @media (max-width: 640px) {
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 8px;
    flex: 1;
    white-space: nowrap;
  }
`;

const CancelButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  background: #ffffff;
  color: #dc2626;
  border: 1px solid #fecaca;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: #fee2e2;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 640px) {
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 8px;
    flex: 1;
    white-space: nowrap;
  }
`;

const EmptyOrders = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  text-align: center;
  padding: 48px 24px;
  color: #64748b;

  .empty-icon {
    font-size: 56px;
    color: #2c5530;
    margin-bottom: 16px;
  }

  h3 {
    font-size: 18px;
    font-weight: 800;
    color: #1b4332;
    margin: 0 0 6px 0;
  }

  p {
    font-size: 13.5px;
    margin: 0 0 16px 0;
  }
`;

const ShopButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #2c5530;
  color: #ffffff;
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 700;
  font-size: 13px;
  transition: background-color 0.15s ease;

  &:hover {
    background: #1e3a22;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 40px 20px;
  font-size: 14px;
  color: #64748b;
`;

// Helper de statut adapté à la réalité du bois
function getStatusDetails(status, t) {
  switch (status) {
    case 'pending':
    case 'awaiting_payment':
      return { 
        text: t('orders.status.pending', 'En attente de virement'), 
        bg: '#fef3c7', 
        color: '#92400e', 
        border: '#fde68a',
        icon: <FiClock size={13} />
      };
    case 'processing':
      return { 
        text: t('orders.status.processing', 'En préparation (Palette)'), 
        bg: '#e0f2fe', 
        color: '#0369a1', 
        border: '#bae6fd',
        icon: <FiPackage size={13} />
      };
    case 'shipped':
      return { 
        text: t('orders.status.shipped', 'En cours de livraison'), 
        bg: '#ecfdf5', 
        color: '#15803d', 
        border: '#bbf7d0',
        icon: <FiTruck size={13} />
      };
    case 'delivered':
      return { 
        text: t('orders.status.delivered', 'Livré'), 
        bg: '#f0fdf4', 
        color: '#166534', 
        border: '#86efac',
        icon: <FiCheckCircle size={13} />
      };
    case 'cancelled':
      return { 
        text: t('orders.status.cancelled', 'Annulé'), 
        bg: '#fee2e2', 
        color: '#991b1b', 
        border: '#fecaca',
        icon: <FiXCircle size={13} />
      };
    default:
      return { 
        text: t('orders.status.default', 'Enregistré'), 
        bg: '#f1f5f9', 
        color: '#334155', 
        border: '#cbd5e1',
        icon: <FiClock size={13} />
      };
  }
}

// ========================================================
// COMPOSANT ORDERS
// ========================================================

const Orders = () => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const showCenterAlert = (message, type = 'success') => {
    toast.dismiss('orders-alert');
    toast.custom((t) => (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 20000
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '18px 20px 16px',
            maxWidth: '90vw',
            width: 340,
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            textAlign: 'center',
            marginTop: '22vh',
            border: type === 'error' ? '1px solid #fca5a5' : '1px solid #bbf7d0'
          }}
        >
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              marginBottom: 12,
              color: type === 'error' ? '#b91c1c' : '#166534'
            }}
          >
            {message}
          </div>
          <button
            type="button"
            onClick={() => toast.dismiss(t.id)}
            style={{
              padding: '8px 16px',
              borderRadius: 999,
              border: 'none',
              background: '#2c5530',
              color: '#fff',
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            OK
          </button>
        </div>
      </div>
    ), {
      id: 'orders-alert',
      duration: 3000,
      position: 'top-center'
    });
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await getUserOrders(user.uid);

      if (result.success) {
        setOrders(result.data || []);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(t('orders.error.fetch', 'Erreur lors du chargement des commandes'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    setCancellingId(orderId);
    const result = await cancelOrder(orderId, t('orders.cancel.reason', 'Annulation par le client'));

    if (result.success) {
      showCenterAlert(t('orders.cancel.success', 'Commande annulée avec succès'));
      fetchOrders();
    } else {
      showCenterAlert(t('orders.cancel.error', 'Erreur lors de l\'annulation de la commande'), 'error');
    }
    setCancellingId(null);
    setConfirmId(null);
  };

  if (!user) return null;

  return (
    <DashboardLayout>
      <OrdersContainer>
        <HeaderCard>
          <WoodTag>🪵 {t('orders.header.woodTag', 'Espace client Bois de chauffage')}</WoodTag>
          <OrdersTitle>{t('orders.header.title', 'Mes commandes')}</OrdersTitle>
          <OrdersSubtitle>{t('orders.header.subtitle', 'Consultez votre historique et suivez vos livraisons de bois de chauffage.')}</OrdersSubtitle>
        </HeaderCard>

        {loading && <LoadingSpinner>{t('orders.loading', 'Chargement de vos commandes...')}</LoadingSpinner>}

        {error && (
          <EmptyOrders>
            <FiXCircle className="empty-icon" style={{ color: '#dc2626' }} />
            <h3>{t('orders.error.title', 'Erreur')}</h3>
            <p>{error}</p>
          </EmptyOrders>
        )}

        {!loading && !error && orders.length === 0 && (
          <EmptyOrders>
            <FiPackage className="empty-icon" />
            <h3>{t('orders.empty.title', 'Aucune commande pour le moment')}</h3>
            <p>{t('orders.empty.text', 'Retrouvez stères, palettes et granulés avec livraison par chariot embarqué dans la boutique.')}</p>
            <ShopButton to={`/${i18n.language || 'fr'}/${routeMapping.products[i18n.language || 'fr']}`}>
              <FiShoppingBag />
              <span>{t('orders.empty.button', 'Découvrir la boutique bois')}</span>
            </ShopButton>
          </EmptyOrders>
        )}

        {!loading && !error && orders.length > 0 && (
          <OrdersList>
            {orders.map((order) => {
              const s = getStatusDetails(order.status, t);
              const orderRef = formatTransferRef(order.id);
              const items = Array.isArray(order.items) ? order.items : [];
              const isPendingPayment = order.status === 'pending' || order.status === 'awaiting_payment';

              return (
                <OrderCard key={order.id}>
                  <OrderHeader>
                    <OrderInfo>
                      <div className="order-ref">
                        <FiPackage />
                        <span>{t('orders.orderCard.order', 'Commande')} #{orderRef}</span>
                      </div>
                      <div className="order-date">
                        {order.createdAt?.seconds 
                          ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('de-DE', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : t('orders.orderCard.dateUnknown', 'Date inconnue')}
                      </div>
                    </OrderInfo>

                    <StatusPill bg={s.bg} color={s.color} border={s.border}>
                      {s.icon}
                      <span>{s.text}</span>
                    </StatusPill>
                  </OrderHeader>

                  {/* Notice virement bancaire pour les commandes en attente */}
                  {isPendingPayment && (
                    <PayNotice>
                      <div className="notice-left">
                        <span className="icon">🏦</span>
                        <span>{t('orders.orderCard.pendingPayment', 'Virement en attente : Nos coordonnées bancaires officielles sont disponibles.')}</span>
                      </div>
                      <PayNoticeButton to="/dashboard/billing">
                        {t('orders.orderCard.showBankDetails', 'Afficher les coordonnées bancaires →')}
                      </PayNoticeButton>
                    </PayNotice>
                  )}

                  {/* Badge chariot tout-terrain */}
                  <DeliveryBadge>
                    <FiTruck />
                    <span>{t('orders.orderCard.forkliftDelivery', 'Livraison avec chariot embarqué incluse')}</span>
                  </DeliveryBadge>

                  {/* Liste des articles */}
                  <OrderItems>
                    {items.map((item, idx) => (
                      <OrderItem key={idx}>
                        <ItemLeft>
                          <span className="item-qty">{item.quantity || 1}x</span>
                          <span className="item-title">{item.name || item.title || t('orders.orderCard.firewood', 'Bois de chauffage')}</span>
                        </ItemLeft>
                        <ItemPrice>
                          {((item.price || 0) * (item.quantity || 1)).toFixed(2)} €
                        </ItemPrice>
                      </OrderItem>
                    ))}
                  </OrderItems>

                  {/* Total TTC */}
                  <OrderTotalRow>
                    <span>{t('orders.orderCard.total', 'Total (TTC) :')}</span>
                    <span className="total-amount">{Number(order.total || 0).toFixed(2)} €</span>
                  </OrderTotalRow>

                  {/* Actions rapides */}
                  <OrderActions>
                    <ActionButton to={`/dashboard/orders/${order.id}`} className="primary">
                      <FiPackage />
                      <span>{t('orders.orderCard.viewDetails', 'Voir les détails')}</span>
                    </ActionButton>

                    {(order.status === 'processing' || order.status === 'shipped') && (
                      <ActionButton to={`/dashboard/suivi/${order.id}`} className="secondary">
                        <FiTruck />
                        <span>{t('orders.orderCard.trackDelivery', 'Suivre la livraison')}</span>
                      </ActionButton>
                    )}

                    {order.status === 'delivered' && (
                      <ActionButton to={`/dashboard/orders/${order.id}/review`} className="secondary">
                        <span>{t('orders.orderCard.leaveReview', 'Laisser un avis')}</span>
                      </ActionButton>
                    )}

                    {isPendingPayment && (
                      <CancelButton
                        type="button"
                        onClick={() => setConfirmId(order.id)}
                        disabled={cancellingId === order.id}
                      >
                        {cancellingId === order.id ? t('orders.cancel.canceling', 'Annulation...') : t('orders.cancel.cancel', 'Annuler')}
                      </CancelButton>
                    )}
                  </OrderActions>
                </OrderCard>
              );
            })}
          </OrdersList>
        )}

        {/* Modal d'annulation confirmation */}
        {confirmId && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(0,0,0,0.35)',
              zIndex: 20000
            }}
            onClick={() => !cancellingId && setConfirmId(null)}
          >
            <div
              style={{
                background: '#fff',
                borderRadius: 14,
                padding: '20px 22px 18px',
                maxWidth: '90vw',
                width: 360,
                boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
                textAlign: 'center'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 8 }}>
                {t('orders.modal.title', 'Annuler la commande ?')}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 18, lineHeight: 1.4 }}>
                {t('orders.modal.text', 'Cette action est définitive. Votre commande de bois de chauffage sera marquée comme "Annulée".')}
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setConfirmId(null)}
                  disabled={!!cancellingId}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: '1px solid #e2e8f0',
                    background: '#f8fafc',
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  {t('orders.modal.no', 'Non, retour')}
                </button>
                <button
                  type="button"
                  onClick={() => handleCancelOrder(confirmId)}
                  disabled={!!cancellingId}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 8,
                    border: 'none',
                    background: '#dc2626',
                    color: '#fff',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t('orders.modal.yes', 'Oui, annuler')}
                </button>
              </div>
            </div>
          </div>
        )}
      </OrdersContainer>
    </DashboardLayout>
  );
};

export default Orders;
