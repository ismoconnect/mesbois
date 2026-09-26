import i18n from '../i18n';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { getUserOrders } from '../firebase/orders';
import { getRIB } from '../firebase/rib';
import { formatTransferRef } from '../utils/ref';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { 
  FiPackage, 
  FiTruck, 
  FiFileText, 
  FiUser, 
  FiShoppingBag, 
  FiClock, 
  FiCheckCircle, 
  FiShield,
  FiChevronRight
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import routeMapping from '../utils/routeMapping.json';

// ========================================================
// STYLED COMPONENTS (RESPONSIVE, MODERN & PROPRE)
// ========================================================

const Shell = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 30px;
  box-sizing: border-box;

  @media (max-width: 768px) { 
    padding: 0 10px 24px; 
  }
`;

// En-tête Espace Client
const HeaderCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
  padding: 20px 22px;
  margin-bottom: 14px;

  @media (max-width: 640px) {
    border-radius: 12px;
    padding: 14px 12px;
    margin-bottom: 10px;
  }
`;

const WoodTag = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #ecfdf5;
  color: #166534;
  font-size: 11.5px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 8px;

  @media (max-width: 640px) {
    font-size: 10.5px;
    padding: 2px 8px;
    margin-bottom: 6px;
  }
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 4px 0;
  color: #1b4332;
  letter-spacing: -0.3px;

  @media (max-width: 640px) { 
    font-size: 18px; 
  }
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 13.5px;
  margin: 0;
  line-height: 1.45;

  @media (max-width: 640px) { 
    font-size: 11.5px; 
  }
`;

// Bannière Commande Active / Suivi Chariot Tout-Terrain
const ActiveOrderBanner = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border: 1.5px solid #86efac;
  border-radius: 14px;
  padding: 16px 18px;
  margin-bottom: 14px;
  box-shadow: 0 3px 12px rgba(22, 101, 52, 0.06);

  @media (max-width: 640px) {
    border-radius: 12px;
    padding: 12px 10px;
    margin-bottom: 10px;
  }
`;

const ActiveBannerHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 6px;
`;

const ActiveOrderRef = styled.div`
  font-size: 14px;
  font-weight: 800;
  color: #166534;
  display: flex;
  align-items: center;
  gap: 6px;

  @media (max-width: 640px) {
    font-size: 12.5px;
  }
`;

const ActiveStatusBadge = styled.span`
  background: ${props => props.bg || '#fef3c7'};
  color: ${props => props.color || '#92400e'};
  border: 1px solid ${props => props.border || '#fde68a'};
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 11.5px;
  font-weight: 700;
  white-space: nowrap;

  @media (max-width: 640px) {
    font-size: 10.5px;
    padding: 2px 7px;
  }
`;

const ActiveOrderInfo = styled.div`
  font-size: 12.5px;
  color: #374151;
  margin-bottom: 10px;

  strong {
    color: #111827;
  }

  @media (max-width: 640px) {
    font-size: 11px;
    margin-bottom: 8px;
  }
`;

const ActiveActionsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px;

  @media (max-width: 640px) {
    gap: 6px;
  }
`;

const ActiveButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
    padding: 7px 6px;
    font-size: 10.5px;
  }
`;

// Grille de KPI / Statistiques
const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 14px;

  @media (max-width: 860px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 10px;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }

  @media (max-width: 640px) {
    padding: 10px 10px;
    border-radius: 10px;
  }
`;

const StatTopRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 4px;
`;

const StatLabel = styled.div`
  font-size: 12px;
  color: #64748b;
  font-weight: 600;

  @media (max-width: 640px) {
    font-size: 10.5px;
  }
`;

const StatIcon = styled.div`
  font-size: 16px;
  color: ${props => props.color || '#2c5530'};
  display: flex;
  align-items: center;

  @media (max-width: 640px) {
    font-size: 14px;
  }
`;

const StatValue = styled.div`
  font-size: 22px;
  font-weight: 800;
  color: ${props => props.color || '#1b4332'};
  line-height: 1.1;

  @media (max-width: 640px) {
    font-size: 18px;
  }
`;

// Carte de Section (Actions rapides, Commandes)
const SectionCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 14px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);

  @media (max-width: 640px) {
    padding: 12px 10px;
    border-radius: 12px;
    margin-bottom: 10px;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  h2 {
    font-size: 16px;
    font-weight: 800;
    color: #1b4332;
    margin: 0;
  }

  a.view-all {
    font-size: 12px;
    font-weight: 700;
    color: #2c5530;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 3px;

    &:hover {
      text-decoration: underline;
    }
  }

  @media (max-width: 640px) {
    margin-bottom: 8px;
    h2 { font-size: 13.5px; }
    a.view-all { font-size: 10.5px; }
  }
`;

// Grille des Actions Rapides (6 boutons, 0 Panier)
const ActionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
`;

const ActionButton = styled(Link)`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #1e293b;
  gap: 6px;
  text-align: center;
  transition: all 0.15s ease;

  &:hover {
    background: #f0fdf4;
    border-color: #86efac;
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  }

  .act-icon {
    font-size: 22px;
    color: #2c5530;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span.act-label {
    font-size: 11.5px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  @media (max-width: 640px) {
    padding: 10px 4px;
    gap: 4px;
    border-radius: 8px;

    .act-icon {
      font-size: 18px;
    }

    span.act-label {
      font-size: 9.5px;
    }
  }
`;

const ActionAnchor = styled.a`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  color: #1e293b;
  gap: 6px;
  text-align: center;
  transition: all 0.15s ease;

  &:hover {
    background: #f0fdf4;
    border-color: #25D366;
    transform: translateY(-2px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  }

  .act-icon {
    font-size: 22px;
    color: #25D366;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  span.act-label {
    font-size: 11.5px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  @media (max-width: 640px) {
    padding: 10px 4px;
    gap: 4px;
    border-radius: 8px;

    .act-icon {
      font-size: 18px;
    }

    span.act-label {
      font-size: 9.5px;
    }
  }
`;

// Lignes de Commandes Récentes
const OrderItemRow = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 11px 14px;
  margin-bottom: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.15s ease;

  &:hover {
    background: #f0fdf4;
    border-color: #bbf7d0;
    transform: translateX(2px);
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 640px) {
    padding: 9px 10px;
    margin-bottom: 6px;
  }
`;

const OrderRowLeft = styled.div`
  min-width: 0;
  flex: 1;

  .order-ref {
    font-size: 13.5px;
    font-weight: 800;
    color: #166534;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .order-meta {
    font-size: 11.5px;
    color: #64748b;
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 640px) {
    .order-ref { font-size: 11.5px; }
    .order-meta { font-size: 10px; }
  }
`;

const OrderRowRight = styled.div`
  text-align: right;
  flex-shrink: 0;
  margin-left: 10px;

  .order-price {
    font-size: 14.5px;
    font-weight: 800;
    color: #111827;
  }

  @media (max-width: 640px) {
    .order-price { font-size: 12.5px; }
  }
`;

const OrderStatusPill = styled.span`
  display: inline-block;
  font-size: 10.5px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 999px;
  margin-top: 3px;
  background: ${props => props.bg || '#f3f4f6'};
  color: ${props => props.color || '#374151'};
  border: 1px solid ${props => props.border || '#e5e7eb'};

  @media (max-width: 640px) {
    font-size: 9px;
    padding: 1px 6px;
  }
`;

// Bandeau de Confiance
const TrustBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 6px;

  @media (max-width: 640px) {
    gap: 4px;
    margin-top: 4px;
  }
`;

const TrustItem = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 4px;
  text-align: center;
  font-size: 11px;
  font-weight: 600;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  svg {
    color: #166534;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    padding: 6px 2px;
    font-size: 8.5px;
    gap: 3px;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 28px 16px;
  color: #64748b;
  font-size: 13.5px;

  p { margin: 0 0 12px 0; }

  a.shop-link {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #2c5530;
    color: #ffffff;
    padding: 8px 16px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 700;
    font-size: 12.5px;

    &:hover { background: #1e3a22; }
  }

  @media (max-width: 640px) {
    padding: 20px 10px;
    font-size: 12px;
  }
`;

// Helper de statut adapté à la réalité du bois
function getStatusDetails(status, t) {
  switch (status) {
    case 'pending':
    case 'awaiting_payment':
      return { text: t('dashboard.status.awaiting_payment', 'En attente de virement'), bg: '#fef3c7', color: '#92400e', border: '#fde68a' };
    case 'processing':
      return { text: t('dashboard.status.processing', 'En préparation'), bg: '#e0f2fe', color: '#0369a1', border: '#bae6fd' };
    case 'shipped':
      return { text: t('dashboard.status.shipped', 'En cours de livraison'), bg: '#ecfdf5', color: '#15803d', border: '#bbf7d0' };
    case 'delivered':
      return { text: t('dashboard.status.delivered', 'Livré'), bg: '#f0fdf4', color: '#166534', border: '#86efac' };
    case 'cancelled':
      return { text: t('dashboard.status.cancelled', 'Annulé'), bg: '#fee2e2', color: '#991b1b', border: '#fecaca' };
    default:
      return { text: t('dashboard.status.registered', 'Commande enregistrée'), bg: '#f1f5f9', color: '#334155', border: '#cbd5e1' };
  }
}

const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const { user, userData } = useAuth();
  const { settings, loaded: settingsLoaded } = useSiteSettings();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState('+49 1633637236');
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0
  });

  const displayName = userData?.displayName || user?.displayName || user?.email?.split('@')[0] || 'Client';

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!user) return;
      setLoading(true);

      try {
        const [ordersRes, ribRes] = await Promise.all([
          getUserOrders(user.uid),
          getRIB()
        ]);

        if (isMounted) {
          if (ribRes && ribRes.success && ribRes.data?.whatsappNumber) {
            setWhatsappNumber(ribRes.data.whatsappNumber);
          }

          if (ordersRes.success) {
            const ordersData = ordersRes.data || [];
            setOrders(ordersData);

            // Tatsächliche Statistiken berechnen
            const totalOrders = ordersData.length;
            const pendingOrders = ordersData.filter(o => 
              o.status === 'pending' || 
              o.status === 'awaiting_payment' || 
              o.status === 'processing' || 
              o.status === 'shipped'
            ).length;
            const deliveredOrders = ordersData.filter(o => o.status === 'delivered').length;
            const totalSpent = ordersData.reduce((sum, o) => sum + (o.total || 0), 0);

            setStats({ totalOrders, pendingOrders, deliveredOrders, totalSpent });
          }
        }
      } catch (err) {
        console.error('Fehler beim Laden des Dashboards:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();
    return () => { isMounted = false; };
  }, [user]);

  // Erkennung der aktuellsten aktiven Bestellung
  const activeOrder = orders.find(o => 
    o.status === 'pending' || 
    o.status === 'awaiting_payment' || 
    o.status === 'processing' || 
    o.status === 'shipped'
  ) || (orders.length > 0 && orders[0].status !== 'cancelled' ? orders[0] : null);

  const cleanPhone = (whatsappNumber || '+49 1633637236').replace(/[^0-9]/g, '');
  const targetWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(`Hallo, ich bin ${displayName} und kontaktiere Sie aus meinem Brennholz-Kundenbereich.`)}`;

  return (
    <DashboardLayout>
      <Shell>
        {/* 1. CARTE EN-TÊTE BIENVENUE */}
        <HeaderCard>
          <WoodTag>🪵 {t('dashboard.wood_tag', 'Espace client Bois de Chauffage')}</WoodTag>
          <Title>{t('dashboard.main_title', 'Mon espace client')}</Title>
          <Subtitle>
            {t('dashboard.welcome_msg', 'Bienvenue')} {displayName}! {t('dashboard.welcome_sub', 'Suivez vos livraisons de bois de chauffage avec chariot embarqué et gérez vos commandes.')}
          </Subtitle>
        </HeaderCard>

        {/* 2. BANNIÈRE COMMANDE ACTIVE (si commande en cours ou récente) */}
        {activeOrder && activeOrder.status !== 'cancelled' && (
          <ActiveOrderBanner>
            <ActiveBannerHeader>
              <ActiveOrderRef>
                <FiPackage />
                <span>{t('dashboard.order', 'Commande')} #{formatTransferRef(activeOrder.id)}</span>
              </ActiveOrderRef>
              {(() => {
                const s = getStatusDetails(activeOrder.status, t);
                return (
                  <ActiveStatusBadge bg={s.bg} color={s.color} border={s.border}>
                    {s.text}
                  </ActiveStatusBadge>
                );
              })()}
            </ActiveBannerHeader>

            <ActiveOrderInfo>
              {t('dashboard.amount', 'Montant :')} <strong>{Number(activeOrder.total || 0).toFixed(2)} €</strong> • 🚜 {t('dashboard.forklift', 'Chariot élévateur inclus')}
            </ActiveOrderInfo>

            <ActiveActionsRow>
              <ActiveButton to={`/dashboard/suivi/${activeOrder.id}`} className="primary">
                <FiTruck />
                <span>{t('dashboard.track_delivery', 'Suivre la livraison')}</span>
              </ActiveButton>

              {activeOrder.status === 'pending' || activeOrder.status === 'awaiting_payment' ? (
                <ActiveButton to="/dashboard/billing" className="secondary">
                  <FiFileText />
                  <span>{t('dashboard.bank_details', 'Coordonnées bancaires (IBAN)')}</span>
                </ActiveButton>
              ) : (
                <ActiveButton to={`/dashboard/orders/${activeOrder.id}`} className="secondary">
                  <FiPackage />
                  <span>{t('dashboard.order_details', 'Détails de la commande')}</span>
                </ActiveButton>
              )}
            </ActiveActionsRow>
          </ActiveOrderBanner>
        )}

        {/* 3. STATISTIQUES / KPI CARDS */}
        <StatsGrid>
          <StatCard>
            <StatTopRow>
              <StatLabel>{t('dashboard.stats.orders', 'Commandes')}</StatLabel>
              <StatIcon color="#2c5530"><FiPackage /></StatIcon>
            </StatTopRow>
            <StatValue color="#1b4332">{stats.totalOrders}</StatValue>
          </StatCard>

          <StatCard>
            <StatTopRow>
              <StatLabel>{t('dashboard.stats.pending', 'En attente')}</StatLabel>
              <StatIcon color="#d97706"><FiClock /></StatIcon>
            </StatTopRow>
            <StatValue color="#d97706">{stats.pendingOrders}</StatValue>
          </StatCard>

          <StatCard>
            <StatTopRow>
              <StatLabel>{t('dashboard.stats.delivered', 'Livré')}</StatLabel>
              <StatIcon color="#166534"><FiCheckCircle /></StatIcon>
            </StatTopRow>
            <StatValue color="#166534">{stats.deliveredOrders}</StatValue>
          </StatCard>

          <StatCard>
            <StatTopRow>
              <StatLabel>{t('dashboard.stats.total_spent', 'Dépenses totales')}</StatLabel>
              <StatIcon color="#2c5530">€</StatIcon>
            </StatTopRow>
            <StatValue color="#2c5530" style={{ fontSize: stats.totalSpent > 999 ? '18px' : '22px' }}>
              {stats.totalSpent.toFixed(0)} €
            </StatValue>
          </StatCard>
        </StatsGrid>

        {/* 4. ACTIONS RAPIDES (SANS PANIER) */}
        <SectionCard>
          <SectionHeader>
            <h2>{t('dashboard.quick_access', 'Accès rapide')}</h2>
          </SectionHeader>

          <ActionGrid>
            <ActionButton to="/dashboard/orders">
              <span className="act-icon"><FiPackage /></span>
              <span className="act-label">{t('dashboard.nav.orders', 'Commandes')}</span>
            </ActionButton>

            <ActionButton to="/dashboard/suivi">
              <span className="act-icon"><FiTruck /></span>
              <span className="act-label">{t('dashboard.nav.tracking', 'Suivi chariot')}</span>
            </ActionButton>

            <ActionButton to="/dashboard/billing">
              <span className="act-icon"><FiFileText /></span>
              <span className="act-label">{t('dashboard.nav.invoices', 'Factures')}</span>
            </ActionButton>

            <ActionButton to={`/${i18n.language || 'fr'}/${routeMapping.products[i18n.language || 'fr']}`}>
              <span className="act-icon"><FiShoppingBag /></span>
              <span className="act-label">{t('dashboard.nav.shop', 'Boutique')}</span>
            </ActionButton>

            <ActionButton to="/dashboard/profile">
              <span className="act-icon"><FiUser /></span>
              <span className="act-label">{t('dashboard.nav.profile', 'Mon profil')}</span>
            </ActionButton>

            <ActionAnchor href={targetWhatsAppUrl} target="_blank" rel="noopener noreferrer">
              <span className="act-icon"><FaWhatsapp /></span>
              <span className="act-label">{t('dashboard.nav.whatsapp', 'WhatsApp 24/7')}</span>
            </ActionAnchor>
          </ActionGrid>
        </SectionCard>

        {/* 5. COMMANDES RÉCENTES */}
        <SectionCard>
          <SectionHeader>
            <h2>{t('dashboard.recent_orders', 'Dernières commandes')}</h2>
            {orders.length > 0 && (
              <Link to="/dashboard/orders" className="view-all">
                <span>{t('dashboard.view_all', 'Tout voir')}</span>
                <FiChevronRight size={13} />
              </Link>
            )}
          </SectionHeader>

          {loading && (
            <div style={{ textAlign: 'center', padding: '16px', color: '#64748b', fontSize: '13px' }}>
              {t('dashboard.loading_orders', 'Chargement de vos commandes...')}
            </div>
          )}

          {!loading && orders.length === 0 && (
            <EmptyState>
              <p>{t('dashboard.no_orders', "Vous n'avez pas encore passé de commande.")}</p>
              <Link to={`/${i18n.language || 'fr'}/${routeMapping.products[i18n.language || 'fr']}`} className="shop-link">
                <FiShoppingBag />
                <span>{t('dashboard.discover_shop', 'Découvrir la boutique de bois')}</span>
              </Link>
            </EmptyState>
          )}

          {!loading && orders.length > 0 && (
            <div>
              {orders.slice(0, 3).map((order) => {
                const s = getStatusDetails(order.status, t);
                const orderRef = formatTransferRef(order.id);
                const firstItem = Array.isArray(order.items) && order.items.length > 0 ? order.items[0] : null;
                const itemsCount = Array.isArray(order.items) ? order.items.length : 0;
                const itemLabel = firstItem
                  ? `${firstItem.quantity || 1}x ${firstItem.name || firstItem.title || t('dashboard.firewood', 'Bois de chauffage')}${itemsCount > 1 ? ` (+${itemsCount - 1})` : ''}`
                  : t('dashboard.firewood_order', 'Commande de bois');

                const dateStr = order.createdAt?.seconds 
                  ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                  : t('dashboard.current', 'Actuel');

                return (
                  <OrderItemRow key={order.id} to={`/dashboard/orders/${order.id}`}>
                    <OrderRowLeft>
                      <div className="order-ref">#{orderRef}</div>
                      <div className="order-meta">
                        {itemLabel} • {dateStr}
                      </div>
                    </OrderRowLeft>

                    <OrderRowRight>
                      <div className="order-price">
                        {Number(order.total || 0).toFixed(2)} €
                      </div>
                      <OrderStatusPill bg={s.bg} color={s.color} border={s.border}>
                        {s.text}
                      </OrderStatusPill>
                    </OrderRowRight>
                  </OrderItemRow>
                );
              })}
            </div>
          )}
        </SectionCard>

        {/* 6. BANDEAU DE CONFIANCE & ENGAGEMENTS */}
        <TrustBar>
          <TrustItem>
            <FiTruck />
            <span>{t('dashboard.trust.forklift', 'Chariot élévateur inclus')}</span>
          </TrustItem>
          <TrustItem>
            <FiShield />
            <span>{t('dashboard.trust.dry_wood', 'Bois sec &lt; 20%')}</span>
          </TrustItem>
          <TrustItem>
            <FiClock />
            <span>{t('dashboard.trust.support', 'Support &amp; WhatsApp 24/7')}</span>
          </TrustItem>
        </TrustBar>
      </Shell>
    </DashboardLayout>
  );
};

export default Dashboard;
