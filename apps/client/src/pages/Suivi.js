import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';
import { getUserOrders } from '../firebase/orders';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  @media (max-width: 600px) { padding: 20px 12px; }
`;

const Title = styled.h1`
  font-size: 28px;
  margin-bottom: 8px;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 20px;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 16px;
  @media (max-width: 600px) { padding: 12px; }
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const FollowButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #2c5530;
  color: #fff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 14px;
  &:hover { background: #1e3a22; }
`;

const Status = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 13px;
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

function iconFor(status) {
  switch (status) {
    case 'pending': return <FiClock size={14} />;
    case 'processing': return <FiPackage size={14} />;
    case 'shipped': return <FiTruck size={14} />;
    case 'delivered': return <FiCheckCircle size={14} />;
    case 'cancelled': return <FiXCircle size={14} />;
    default: return <FiClock size={14} />;
  }
}

function textFor(status) {
  switch (status) {
    case 'pending': return 'En attente';
    case 'processing': return 'En cours';
    case 'shipped': return 'Expédié';
    case 'delivered': return 'Livré';
    case 'cancelled': return 'Annulé';
    default: return 'Inconnu';
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
      if (res.success) setOrders(res.data || []);
      setLoading(false);
    };
    load();
  }, [user]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <Container>
        <Title>Suivi de commande</Title>
        <Subtitle>Consultez en temps réel l'état de vos commandes.</Subtitle>
        {loading && <Card>Chargement…</Card>}
        {!loading && orders.length === 0 && (
          <Card>Aucune commande à afficher.</Card>
        )}
        {!loading && orders.length > 0 && (
          <List>
            {orders.map((o) => (
              <Card key={o.id}>
                <Row>
                  <strong>Commande #{o.id.slice(-8)}</strong>
                  {o.status === 'pending' ? (
                    <FollowButton to={`/suivi/${o.id}`}>
                      <FiTruck /> Suivre
                    </FollowButton>
                  ) : (
                    <Status status={o.status}>
                      {iconFor(o.status)} {textFor(o.status)}
                    </Status>
                  )}
                </Row>
              </Card>
            ))}
          </List>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Suivi;
