import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiMapPin, FiCreditCard } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getOrderById, cancelOrder } from '../firebase/orders';
import DashboardLayout from '../components/Layout/DashboardLayout';
import toast from 'react-hot-toast';

const OrderDetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #2c5530;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 30px;
  
  &:hover {
    color: #1e3a22;
  }
`;

const OrderHeader = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const OrderTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OrderInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const InfoItem = styled.div`
  h4 {
    font-size: 14px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 5px;
  }
  
  p {
    color: #666;
    font-size: 14px;
  }
`;

const OrderStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px 20px;
  border-radius: 8px;
  font-size: 16px;
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

const OrderContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 30px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const OrderItems = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 16px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 5px;
  }
  
  .item-description {
    color: #666;
    font-size: 14px;
    margin-bottom: 10px;
  }
  
  .item-quantity {
    color: #666;
    font-size: 14px;
  }
`;

const ItemPrice = styled.div`
  text-align: right;
  
  .unit-price {
    color: #666;
    font-size: 14px;
    margin-bottom: 5px;
  }
  
  .total-price {
    font-size: 18px;
    font-weight: 700;
    color: #2c5530;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  height: fit-content;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #666;
  
  &.total {
    font-size: 18px;
    font-weight: 700;
    color: #2c5530;
    border-top: 2px solid #f0f0f0;
    padding-top: 15px;
    margin-top: 15px;
  }
`;

const DeliveryInfo = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
`;

const DeliveryAddress = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 15px;
  margin-bottom: 20px;
  
  svg {
    color: #2c5530;
    margin-top: 5px;
  }
  
  div {
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #2c5530;
      margin-bottom: 5px;
    }
    
    p {
      color: #666;
      line-height: 1.5;
    }
  }
`;

const PaymentInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  
  svg {
    color: #2c5530;
  }
  
  div {
    h4 {
      font-size: 16px;
      font-weight: 600;
      color: #2c5530;
      margin-bottom: 5px;
    }
    
    p {
      color: #666;
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #2c5530;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #e74c3c;
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
  }
`;

const CancelButton = styled.button`
  width: 100%;
  padding: 15px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  background: #fff;
  color: #dc3545;
  border: 2px solid #dc3545;
  cursor: pointer;
  margin-top: 20px;
  
  &:hover {
    background: #dc3545;
    color: #fff;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending': return <FiClock size={20} />;
    case 'processing': return <FiPackage size={20} />;
    case 'shipped': return <FiTruck size={20} />;
    case 'delivered': return <FiCheckCircle size={20} />;
    case 'cancelled': return <FiXCircle size={20} />;
    default: return <FiClock size={20} />;
  }
};

const getStatusText = (status) => {
  switch (status) {
    case 'pending': return 'En attente de traitement';
    case 'processing': return 'En cours de traitement';
    case 'shipped': return 'Expédié';
    case 'delivered': return 'Livré';
    case 'cancelled': return 'Annulé';
    default: return 'Statut inconnu';
  }
};

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const result = await getOrderById(id);
      
      if (result.success) {
        setOrder(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Erreur lors du chargement de la commande');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user, navigate]);

  const handleCancelOrder = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      return;
    }

    setCancelling(true);
    const result = await cancelOrder(id, 'Annulation client');
    
    if (result.success) {
      toast.success('Commande annulée avec succès');
      // Recharger la commande
      fetchOrder();
    } else {
      toast.error('Erreur lors de l\'annulation de la commande');
    }
    setCancelling(false);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <OrderDetailContainer>
          <LoadingSpinner>Chargement de la commande...</LoadingSpinner>
        </OrderDetailContainer>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <OrderDetailContainer>
          <ErrorMessage>
            <h3>Erreur</h3>
            <p>{error}</p>
          </ErrorMessage>
        </OrderDetailContainer>
      </DashboardLayout>
    );
  }

  if (!order) {
    return (
      <DashboardLayout>
        <OrderDetailContainer>
          <ErrorMessage>
            <h3>Commande non trouvée</h3>
            <p>Cette commande n'existe pas ou vous n'y avez pas accès.</p>
          </ErrorMessage>
        </OrderDetailContainer>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <OrderDetailContainer>
        <BackButton onClick={() => navigate('/orders')}>
          <FiArrowLeft size={20} />
          Retour aux commandes
        </BackButton>
        
        <OrderHeader>
          <OrderTitle>
            <FiPackage size={28} />
            Commande #{order.id.slice(-8)}
          </OrderTitle>
          
          <OrderInfo>
            <InfoItem>
              <h4>Date de commande</h4>
              <p>
                {new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </InfoItem>
            
            <InfoItem>
              <h4>Numéro de commande</h4>
              <p>{order.id}</p>
            </InfoItem>
            
            <InfoItem>
              <h4>Mode de livraison</h4>
              <p>
                {order.delivery?.method === 'express' ? 'Livraison express' : 'Livraison standard'}
              </p>
            </InfoItem>
          </OrderInfo>
          
          <OrderStatus status={order.status}>
            {getStatusIcon(order.status)}
            {getStatusText(order.status)}
          </OrderStatus>
        </OrderHeader>
        
        <OrderContent>
          <div>
            <OrderItems>
              <SectionTitle>
                <FiPackage size={20} />
                Articles commandés
              </SectionTitle>
              
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
                    <div className="item-description">{item.description}</div>
                    <div className="item-quantity">Quantité: {item.quantity}</div>
                  </ItemInfo>
                  <ItemPrice>
                    <div className="unit-price">{item.price}€ / unité</div>
                    <div className="total-price">{(item.price * item.quantity).toFixed(2)}€</div>
                  </ItemPrice>
                </OrderItem>
              ))}
            </OrderItems>
            
            <DeliveryInfo>
              <SectionTitle>
                <FiMapPin size={20} />
                Informations de livraison
              </SectionTitle>
              
              <DeliveryAddress>
                <FiMapPin size={20} />
                <div>
                  <h4>Adresse de livraison</h4>
                  <p>
                    {order.customerInfo?.firstName} {order.customerInfo?.lastName}<br />
                    {order.customerInfo?.address}<br />
                    {order.customerInfo?.postalCode} {order.customerInfo?.city}<br />
                    {order.customerInfo?.country}
                  </p>
                </div>
              </DeliveryAddress>
              
              <PaymentInfo>
                <FiCreditCard size={20} />
                <div>
                  <h4>Mode de paiement</h4>
                  <p>
                    {order.payment?.method === 'card' ? 'Carte bancaire' : 'PayPal'}
                  </p>
                </div>
              </PaymentInfo>
            </DeliveryInfo>
          </div>
          
          <OrderSummary>
            <SectionTitle>Résumé</SectionTitle>
            
            <SummaryRow>
              <span>Sous-total</span>
              <span>{(order.total - (order.delivery?.cost || 0)).toFixed(2)}€</span>
            </SummaryRow>
            
            <SummaryRow>
              <span>Livraison</span>
              <span>{(order.delivery?.cost || 0).toFixed(2)}€</span>
            </SummaryRow>
            
            <SummaryRow className="total">
              <span>Total</span>
              <span>{order.total.toFixed(2)}€</span>
            </SummaryRow>
            
            {order.notes && (
              <div style={{ marginTop: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#2c5530', marginBottom: '5px' }}>
                  Notes
                </h4>
                <p style={{ color: '#666', fontSize: '14px' }}>{order.notes}</p>
              </div>
            )}
            
            {(order.status === 'pending' || order.status === 'processing') && (
              <CancelButton 
                onClick={handleCancelOrder}
                disabled={cancelling}
              >
                {cancelling ? 'Annulation...' : 'Annuler la commande'}
              </CancelButton>
            )}
          </OrderSummary>
        </OrderContent>
      </OrderDetailContainer>
    </DashboardLayout>
  );
};

export default OrderDetail;
