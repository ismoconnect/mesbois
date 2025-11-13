import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { getOrderById } from '../firebase/orders';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  @media (max-width: 600px) { padding: 20px 12px; }
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #2c5530;
  text-decoration: none;
  margin-bottom: 20px;
  font-weight: 600;
  &:hover { text-decoration: underline; }
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 30px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 24px;
  margin-bottom: 20px;
  @media (max-width: 600px) { padding: 16px; }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-bottom: 20px;
  border-bottom: 1px solid #e0e0e0;
  margin-bottom: 20px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const Label = styled.span`
  color: #666;
  font-size: 14px;
`;

const Value = styled.span`
  font-weight: 600;
  font-size: 16px;
`;

const Timeline = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-left: 40px;
  margin-top: 20px;
`;

const TimelineItem = styled.div`
  position: relative;
  padding-bottom: 30px;
  
  &:last-child {
    padding-bottom: 0;
  }
  
  &::before {
    content: '';
    position: absolute;
    left: -29px;
    top: 10px;
    bottom: -20px;
    width: 2px;
    background: ${props => props.active ? '#2c5530' : '#e0e0e0'};
    display: ${props => props.isLast ? 'none' : 'block'};
  }
`;

const TimelineIcon = styled.div`
  position: absolute;
  left: -40px;
  top: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.active ? '#2c5530' : '#e0e0e0'};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
`;

const TimelineContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimelineTitle = styled.div`
  font-weight: 600;
  font-size: 16px;
  color: ${props => props.active ? '#2c5530' : '#999'};
`;

const TimelineDate = styled.div`
  font-size: 13px;
  color: #666;
`;

const TimelineDescription = styled.div`
  font-size: 14px;
  color: #666;
  margin-top: 4px;
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 700;
  background: ${props => {
    switch (props.status) {
      case 'pending': return '#fff3cd';
      case 'processing': return '#d1ecf1';
      case 'shipped': return '#d4edda';
      case 'delivered': return '#d4edda';
      case 'cancelled': return '#f8d7da';
      default: return '#e2e3e5';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'pending': return '#856404';
      case 'processing': return '#0c5460';
      case 'shipped': return '#155724';
      case 'delivered': return '#155724';
      case 'cancelled': return '#721c24';
      default: return '#6c757d';
    }
  }};
`;

function getStatusText(status) {
  switch (status) {
    case 'pending': return 'En attente';
    case 'processing': return 'En cours de traitement';
    case 'shipped': return 'Expédié';
    case 'delivered': return 'Livré';
    case 'cancelled': return 'Annulé';
    default: return 'Inconnu';
  }
}

function getTimelineSteps(order) {
  const steps = [
    {
      id: 'pending',
      title: 'Commande reçue',
      icon: <FiClock />,
      description: 'Votre commande a été enregistrée avec succès',
      date: order?.createdAt ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR') : '',
    },
    {
      id: 'awaiting_payment',
      title: 'En attente de votre paiement',
      icon: <FiCreditCard />,
      description: 'Votre paiement est en cours de validation',
      date: order?.awaitingPaymentDate ? new Date(order.awaitingPaymentDate.seconds * 1000).toLocaleDateString('fr-FR') : '',
    },
    {
      id: 'processing',
      title: 'Préparation en cours',
      icon: <FiPackage />,
      description: 'Votre commande est en cours de préparation',
      date: order?.processingDate ? new Date(order.processingDate.seconds * 1000).toLocaleDateString('fr-FR') : '',
    },
    {
      id: 'shipped',
      title: 'Expédié',
      icon: <FiTruck />,
      description: 'Votre commande est en cours de livraison',
      date: order?.shippedDate ? new Date(order.shippedDate.seconds * 1000).toLocaleDateString('fr-FR') : '',
    },
    {
      id: 'delivered',
      title: 'Livré',
      icon: <FiCheckCircle />,
      description: 'Votre commande a été livrée avec succès',
      date: order?.deliveredDate ? new Date(order.deliveredDate.seconds * 1000).toLocaleDateString('fr-FR') : '',
    },
  ];

  const statusOrder = ['pending', 'awaiting_payment', 'processing', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(order?.status || 'pending');

  return steps.map((step, index) => ({
    ...step,
    active: index <= currentIndex,
    isLast: index === steps.length - 1,
  }));
}

const SuiviItinerary = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    const load = async () => {
      setLoading(true);
      const res = await getOrderById(id);
      if (res.success) {
        setOrder(res.data);
      }
      setLoading(false);
    };
    load();
  }, [user, id]);

  if (!user) return null;

  const timelineSteps = order ? getTimelineSteps(order) : [];

  return (
    <DashboardLayout>
      <Container>
        <BackLink to="/suivi">
          <FiArrowLeft /> Retour au suivi
        </BackLink>
        
        <Title>Détails de suivi</Title>
        <Subtitle>Suivez en temps réel l'évolution de votre commande</Subtitle>

        {loading && <Card>Chargement des informations...</Card>}

        {!loading && !order && (
          <Card>Commande introuvable.</Card>
        )}

        {!loading && order && (
          <>
            <Card>
              <OrderInfo>
                <InfoRow>
                  <Label>Numéro de commande</Label>
                  <Value>#{order.id.slice(-8)}</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Date de commande</Label>
                  <Value>
                    {order.createdAt 
                      ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })
                      : 'N/A'}
                  </Value>
                </InfoRow>
                <InfoRow>
                  <Label>Montant total</Label>
                  <Value>{order.total?.toFixed(2) || '0.00'} €</Value>
                </InfoRow>
                <InfoRow>
                  <Label>Statut</Label>
                  <Status status={order.status}>
                    {getStatusText(order.status)}
                  </Status>
                </InfoRow>
              </OrderInfo>

              {order.shippingAddress && (
                <div>
                  <Label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <FiMapPin size={16} /> Adresse de livraison
                  </Label>
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <div>{order.shippingAddress.fullName}</div>
                    <div>{order.shippingAddress.address}</div>
                    <div>
                      {order.shippingAddress.postalCode} {order.shippingAddress.city}
                    </div>
                    {order.shippingAddress.phone && (
                      <div>Tél: {order.shippingAddress.phone}</div>
                    )}
                  </div>
                </div>
              )}
            </Card>

            <Card>
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Historique de livraison</h2>
              <Timeline>
                {timelineSteps.map((step) => (
                  <TimelineItem key={step.id} active={step.active} isLast={step.isLast}>
                    <TimelineIcon active={step.active}>
                      {step.icon}
                    </TimelineIcon>
                    <TimelineContent>
                      <TimelineTitle active={step.active}>{step.title}</TimelineTitle>
                      {step.date && <TimelineDate>{step.date}</TimelineDate>}
                      <TimelineDescription>{step.description}</TimelineDescription>
                    </TimelineContent>
                  </TimelineItem>
                ))}
              </Timeline>
            </Card>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default SuiviItinerary;
