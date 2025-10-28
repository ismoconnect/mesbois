import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getUserOrders } from '../firebase/orders';

const OrdersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
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
`;

const OrderActions = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled(Link)`
  padding: 10px 20px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  
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

  useEffect(() => {
    if (!user) return;

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

    fetchOrders();
  }, [user]);

  if (!user) {
    return (
      <OrdersContainer>
        <EmptyOrders>
          <FiPackage size={64} />
          <h3>Connexion requise</h3>
          <p>Vous devez être connecté pour voir vos commandes</p>
          <ShopButton to="/login">Se connecter</ShopButton>
        </EmptyOrders>
      </OrdersContainer>
    );
  }

  if (loading) {
    return (
      <OrdersContainer>
        <LoadingSpinner>Chargement de vos commandes...</LoadingSpinner>
      </OrdersContainer>
    );
  }

  if (error) {
    return (
      <OrdersContainer>
        <EmptyOrders>
          <FiXCircle size={64} />
          <h3>Erreur</h3>
          <p>{error}</p>
        </EmptyOrders>
      </OrdersContainer>
    );
  }

  if (orders.length === 0) {
    return (
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
    );
  }

  return (
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
            
            <OrderItems>
              {order.items.map((item, index) => (
                <OrderItem key={index}>
                  <ItemImage 
                    src={item.image || '/placeholder-wood.jpg'} 
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = '/placeholder-wood.jpg';
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
            </OrderActions>
          </OrderCard>
        ))}
      </OrdersList>
    </OrdersContainer>
  );
};

export default Orders;

