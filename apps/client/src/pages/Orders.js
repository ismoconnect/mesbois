import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders, cancelOrder } from '../firebase/orders';
import DashboardLayout from '../components/Layout/DashboardLayout';
import toast from 'react-hot-toast';

const OrdersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  @media (max-width: 600px) { padding: 20px 12px; }
`;

const OrdersHeader = styled.div`
  margin-bottom: 40px;
`;

const OrdersTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OrdersSubtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const OrdersList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const OrderCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
  
  @media (max-width: 600px) {
    padding: 18px;
  }
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const OrderInfo = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 5px;
  }
  
  .order-date {
    color: #666;
    font-size: 14px;
  }
`;

const OrderStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
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

const OrderItems = styled.div`
  margin-bottom: 20px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
`;

const ItemInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 5px;
  }
  
  .item-quantity {
    color: #666;
    font-size: 14px;
  }
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #2c5530;
`;

const OrderTotal = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 20px;
  border-top: 2px solid #f0f0f0;
  font-size: 18px;
  font-weight: 700;
  color: #2c5530;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
`;

const OrderActions = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const PayNotice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: #fff8e1;
  border: 1px solid #ffe7a3;
  color: #8a6d3b;
  border-radius: 10px;
  padding: 12px 14px;
  margin: 12px 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

const PayNoticeButton = styled(Link)`
  flex: 0 0 auto;
  background: #2c5530;
  color: #fff;
  text-decoration: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 700;
  &:hover { background: #1e3a22; }
  
  @media (max-width: 600px) {
    width: 100%;
    text-align: center;
  }
`;

const ActionButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  display: inline-block;
  text-align: center;
  border: none;
  cursor: pointer;
  
  &.primary {
    background: #2c5530;
    color: white;
    
    &:hover {
      background: #1e3a22;
    }
  }
  
  &.secondary {
    background: #f8f9fa;
    color: #2c5530;
    border: 2px solid #e0e0e0;
    
    &:hover {
      background: #e9ecef;
    }
  }
`;

const CancelButton = styled.button`
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #fff;
  color: #dc3545;
  border: 2px solid #dc3545;
  cursor: pointer;
  
  &:hover {
    background: #dc3545;
    color: #fff;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const EmptyOrders = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  svg {
    font-size: 64px;
    color: #ccc;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #2c5530;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 30px;
  }
`;

const ShopButton = styled(Link)`
  display: inline-block;
  background: #2c5530;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #1e3a22;
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #2c5530;
`;

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return <FiClock size={16} />;
    case 'processing': return <FiPackage size={16} />;
    case 'shipped': return <FiTruck size={16} />;
    case 'delivered': return <FiCheckCircle size={16} />;
    case 'cancelled': return <FiXCircle size={16} />;
    default: return <FiClock size={16} />;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'En attente';
    case 'processing': return 'En cours de traitement';
    case 'shipped': return 'Expédié';
    case 'delivered': return 'Livré';
    case 'cancelled': return 'Annulé';
    default: return 'Inconnu';
  }
};

const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const result = await getUserOrders(user.uid);
      
      if (result.success) {
        setOrders(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    fetchOrders();
  }, [user]);

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      return;
    }

    setCancellingId(orderId);
    const result = await cancelOrder(orderId, 'Annulation client');
    
    if (result.success) {
      toast.success('Commande annulée avec succès');
      // Recharger les commandes
      fetchOrders();
    } else {
      toast.error('Erreur lors de l\'annulation de la commande');
    }
    setCancellingId(null);
  };

  if (!user) return null;

  if (loading) {
    return (
      <DashboardLayout>
        <OrdersContainer>
          <LoadingSpinner>Chargement de vos commandes...</LoadingSpinner>
        </OrdersContainer>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <OrdersContainer>
          <EmptyOrders>
            <FiXCircle size={64} />
            <h3>Erreur</h3>
            <p>{error}</p>
          </EmptyOrders>
        </OrdersContainer>
      </DashboardLayout>
    );
  }

  if (orders.length === 0) {
    return (
      <DashboardLayout>
        <OrdersContainer>
          <OrdersHeader>
            <OrdersTitle>
              <FiPackage size={32} />
              Mes Commandes
            </OrdersTitle>
            <OrdersSubtitle>Historique de vos commandes</OrdersSubtitle>
          </OrdersHeader>
          
          <EmptyOrders>
            <FiPackage size={64} />
            <h3>Aucune commande</h3>
            <p>Vous n'avez pas encore passé de commande</p>
            <ShopButton to="/products">Commencer mes achats</ShopButton>
          </EmptyOrders>
        </OrdersContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <OrdersContainer>
        <OrdersHeader>
          <OrdersTitle>
            <FiPackage size={32} />
            Mes Commandes
          </OrdersTitle>
          <OrdersSubtitle>Historique de vos commandes</OrdersSubtitle>
        </OrdersHeader>
        
        <OrdersList>
          {orders.map(order => (
            <OrderCard key={order.id}>
              <OrderHeader>
                <OrderInfo>
                  <h3>Commande #{order.id.slice(-8)}</h3>
                  <div className="order-date">
                    {new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </OrderInfo>
                
                <OrderStatus status={order.status}>
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </OrderStatus>
              </OrderHeader>
              {(order?.payment?.method === 'bank') && (order.status !== 'paid' && order.status !== 'delivered') && (
                <PayNotice>
                  <span style={{ display:'inline-flex', alignItems:'center', gap:8 }}>
                    <FiCreditCard /> Payez par virement: retrouvez le RIB dans Facturation pour valider votre commande.
                  </span>
                  <PayNoticeButton to="/billing">Aller au RIB</PayNoticeButton>
                </PayNotice>
              )}
              
              <OrderItems>
                {order.items.map((item, index) => (
                  <OrderItem key={index}>
                    <ItemImage 
                      src={item.image || 'https://picsum.photos/seed/fallback/60/60'} 
                      alt={item.name}
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/seed/fallback/60/60';
                      }}
                    />
                    <ItemInfo>
                      <h4>{item.name}</h4>
                      <div className="item-quantity">Quantité: {item.quantity}</div>
                    </ItemInfo>
                    <ItemPrice>{(item.price * item.quantity).toFixed(2)}€</ItemPrice>
                  </OrderItem>
                ))}
              </OrderItems>
              
              <OrderTotal>
                <span>Total</span>
                <span>{order.total.toFixed(2)}€</span>
              </OrderTotal>
              
              <OrderActions>
                <ActionButton to={`/orders/${order.id}`} className="primary">
                  Voir les détails
                </ActionButton>
                {order.status === 'delivered' && (
                  <ActionButton to={`/orders/${order.id}/review`} className="secondary">
                    Laisser un avis
                  </ActionButton>
                )}
                {(order.status === 'pending' || order.status === 'processing') && (
                  <CancelButton 
                    onClick={() => handleCancelOrder(order.id)}
                    disabled={cancellingId === order.id}
                  >
                    {cancellingId === order.id ? 'Annulation...' : 'Annuler la commande'}
                  </CancelButton>
                )}
              </OrderActions>
            </OrderCard>
          ))}
        </OrdersList>
      </OrdersContainer>
    </DashboardLayout>
  );
};

export default Orders;

