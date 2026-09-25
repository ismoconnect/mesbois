import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { getUserOrders } from '../firebase/orders';
import { formatTransferRef } from '../utils/ref';
import {
  FiPackage, FiTruck, FiCheckCircle, FiClock, FiCreditCard,
  FiMapPin, FiCalendar, FiChevronRight, FiFileText
} from 'react-icons/fi';
import { FaWhatsapp, FaShieldAlt, FaTruck } from 'react-icons/fa';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 0 0 36px 0;
  word-break: break-word;
  overflow-wrap: break-word;
  @media (max-width: 600px) {
    padding: 0 4px 28px 4px;
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

const OrderCard = styled.div`
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
  padding: 22px;
  margin-bottom: 18px;

  @media (max-width: 600px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding-bottom: 14px;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 16px;
`;

const RefBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16.5px;
  font-weight: 800;
  color: #111827;

  span.ref-pill {
    background: #ecfdf5;
    color: #065f46;
    padding: 3px 8px;
    border-radius: 6px;
    border: 1px solid #a7f3d0;
    font-size: 13.5px;
    font-family: monospace;
  }
`;

const StatusPill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 700;
  background: ${props => {
    switch (props.$status) {
      case 'pending': return '#fffbeb';
      case 'awaiting_payment': return '#fef3c7';
      case 'processing': return '#eff6ff';
      case 'shipped': return '#f0fdf4';
      case 'delivered': return '#dcfce7';
      case 'cancelled': return '#fef2f2';
      default: return '#f1f5f9';
    }
  }};
  color: ${props => {
    switch (props.$status) {
      case 'pending': return '#b45309';
      case 'awaiting_payment': return '#92400e';
      case 'processing': return '#1d4ed8';
      case 'shipped': return '#15803d';
      case 'delivered': return '#166534';
      case 'cancelled': return '#b91c1c';
      default: return '#475569';
    }
  }};
  border: 1px solid ${props => {
    switch (props.$status) {
      case 'pending': return '#fde68a';
      case 'awaiting_payment': return '#fcd34d';
      case 'processing': return '#bfdbfe';
      case 'shipped': return '#86efac';
      case 'delivered': return '#4ade80';
      case 'cancelled': return '#fecaca';
      default: return '#cbd5e1';
    }
  }};
`;

const Stepper = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin: 16px 0;
  position: relative;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 10px;
    padding-left: 24px;
    border-left: 2px solid #e2e8f0;
  }
`;

const StepNode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;

  @media (max-width: 600px) {
    flex-direction: row;
    text-align: left;
    gap: 10px;
    position: relative;
  }

  .circle {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    background: ${props => props.$done ? '#2c5530' : props.$current ? '#eab308' : '#e2e8f0'};
    color: ${props => (props.$done || props.$current) ? '#fff' : '#94a3b8'};
    font-weight: 700;
    transition: all 0.2s ease;
    box-shadow: ${props => props.$current ? '0 0 0 4px rgba(234, 179, 8, 0.2)' : 'none'};

    @media (max-width: 600px) {
      position: absolute;
      left: -39px;
      width: 26px;
      height: 26px;
    }
  }

  .label {
    font-size: 12px;
    font-weight: ${props => (props.$done || props.$current) ? '700' : '500'};
    color: ${props => props.$done ? '#1e293b' : props.$current ? '#854d0e' : '#94a3b8'};
    line-height: 1.3;
  }
`;

const DetailsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  background: #f8fafc;
  padding: 12px 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  margin-top: 14px;

  .loc {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    color: #475569;
    strong {
      color: #0f172a;
    }
  }

  .total {
    font-size: 15px;
    font-weight: 800;
    color: #166534;
  }
`;

const ActionsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid #f1f5f9;
`;

const PrimaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: #2c5530;
  color: #fff;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: #1e3a22;
  }
`;

const SecondaryBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  color: #334155;
  border: 1px solid #cbd5e1;
  padding: 9px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    background: #f8fafc;
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #64748b;

  .icon {
    font-size: 40px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 17px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 6px 0;
  }

  p {
    font-size: 13.5px;
    margin: 0 0 16px 0;
  }
`;

function getStatusDetails(status) {
  switch (status) {
    case 'pending':
      return { text: 'Enregistrée', icon: <FiClock size={13} />, step: 1 };
    case 'awaiting_payment':
      return { text: 'En attente de virement', icon: <FiCreditCard size={13} />, step: 1 };
    case 'processing':
      return { text: 'Préparation palettes', icon: <FiPackage size={13} />, step: 2 };
    case 'shipped':
      return { text: 'En route (Chariot embarqué)', icon: <FiTruck size={13} />, step: 3 };
    case 'delivered':
      return { text: 'Livré & Déposé', icon: <FiCheckCircle size={13} />, step: 4 };
    case 'cancelled':
      return { text: 'Annulée', icon: <FiClock size={13} />, step: 0 };
    default:
      return { text: 'Traitement', icon: <FiClock size={13} />, step: 1 };
  }
}

const Suivi = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setLoading(true);
      const res = await getUserOrders(user.uid);
      if (res.success) {
        setOrders(res.data || []);
      }
      setLoading(false);
    };
    load();
  }, [user]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <Container>
        {/* Header Hero */}
        <HeaderCard>
          <HeaderBadges>
            <TrustBadge><FaTruck size={12} /> Chariot tout-terrain à bord</TrustBadge>
            <TrustBadge><FaShieldAlt size={12} /> Traçabilité bois PEFC</TrustBadge>
            <TrustBadge><FaWhatsapp size={12} /> Chauffeur joignable le jour J</TrustBadge>
          </HeaderBadges>
          <Title>Suivi de Livraison en Direct</Title>
          <Subtitle>
            Visualisez l'état d'avancement de vos palettes et le détail d'acheminement jusqu'à votre abri à bois.
          </Subtitle>
        </HeaderCard>

        {loading && (
          <OrderCard style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
            Chargement de vos suivis de livraison…
          </OrderCard>
        )}

        {!loading && orders.length === 0 && (
          <OrderCard>
            <EmptyState>
              <div className="icon">🪵</div>
              <h3>Aucune commande en cours d'acheminement</h3>
              <p>Commandez du bois de chauffage dur ou des granulés certifiés pour suivre votre livraison ici.</p>
              <PrimaryBtn to="/dashboard/boutique">
                Commander mon bois →
              </PrimaryBtn>
            </EmptyState>
          </OrderCard>
        )}

        {!loading && orders.map((order) => {
          const ref = formatTransferRef(order.id);
          const st = getStatusDetails(order.status);
          const currentStep = st.step;
          const orderDate = order.createdAt?.seconds
            ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR')
            : 'Date récente';

          return (
            <OrderCard key={order.id}>
              <CardTop>
                <div>
                  <RefBlock>
                    <span>Commande</span>
                    <span className="ref-pill">{ref}</span>
                  </RefBlock>
                  <div style={{ fontSize: '12px', color: '#64748b', marginTop: '3px' }}>
                    Passée le {orderDate} • {order.items?.length || 1} référence(s) de bois
                  </div>
                </div>
                <StatusPill $status={order.status}>
                  {st.icon} {st.text}
                </StatusPill>
              </CardTop>

              {/* Stepper 4 étapes adaptées au bois */}
              <Stepper>
                <StepNode $done={currentStep > 1} $current={currentStep === 1}>
                  <div className="circle">{currentStep > 1 ? '✓' : '1'}</div>
                  <div className="label">Validation & Virement</div>
                </StepNode>
                <StepNode $done={currentStep > 2} $current={currentStep === 2}>
                  <div className="circle">{currentStep > 2 ? '✓' : '2'}</div>
                  <div className="label">Préparation Palettes</div>
                </StepNode>
                <StepNode $done={currentStep > 3} $current={currentStep === 3}>
                  <div className="circle">{currentStep > 3 ? '✓' : '3'}</div>
                  <div className="label">Camion Chariot Embarqué</div>
                </StepNode>
                <StepNode $done={currentStep >= 4} $current={currentStep === 4}>
                  <div className="circle">{currentStep >= 4 ? '✓' : '4'}</div>
                  <div className="label">Déposé chez vous</div>
                </StepNode>
              </Stepper>

              {/* Détails rapides de dépose */}
              <DetailsRow>
                <div className="loc">
                  <FiMapPin size={15} color="#2c5530" />
                  <span>
                    Livraison à : <strong>{order.shippingAddress?.city ? `${order.shippingAddress.postalCode || ''} ${order.shippingAddress.city}` : 'Adresse enregistrée'}</strong>
                  </span>
                </div>
                <div className="total">
                  Total : {order.total ? Number(order.total).toFixed(2) : '0.00'} €
                </div>
              </DetailsRow>

              {/* Actions */}
              <ActionsRow>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <PrimaryBtn to={`/dashboard/suivi/${order.id}`}>
                    <FiTruck size={14} /> Suivi détaillé & Facture PDF
                  </PrimaryBtn>
                  <SecondaryBtn to={`/dashboard/orders/${order.id}`}>
                    <FiFileText size={14} /> Voir la commande
                  </SecondaryBtn>
                </div>
                {order.status === 'awaiting_payment' && (
                  <Link
                    to="/dashboard/billing"
                    style={{
                      fontSize: '12.5px',
                      color: '#b45309',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FiCreditCard size={13} /> Régler par virement →
                  </Link>
                )}
              </ActionsRow>
            </OrderCard>
          );
        })}
      </Container>
    </DashboardLayout>
  );
};

export default Suivi;
