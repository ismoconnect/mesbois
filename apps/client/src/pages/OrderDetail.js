import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiArrowLeft, FiPackage, FiTruck, FiCheckCircle, FiClock, FiXCircle, FiMapPin, FiCreditCard, FiPhone, FiMail, FiUser, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { getOrderById, cancelOrder } from '../firebase/orders';
import DashboardLayout from '../components/Layout/DashboardLayout';
import toast from 'react-hot-toast';

// Mobile-First Container
const OrderDetailContainer = styled.div`
  min-height: 100vh;
  background: #f8f9fa;
  margin: 0 -20px; /* Annule les marges du DashboardLayout sur mobile */
  
  @media (min-width: 768px) {
    max-width: 1000px;
    margin: 0 auto;
    padding: 40px 20px;
    background: transparent;
  }
`;

// Mobile Header avec navigation sticky
const MobileHeader = styled.div`
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  padding: 16px 20px;
  border-bottom: 1px solid #e9ecef;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  @media (min-width: 768px) {
    position: static;
    background: transparent;
    border: none;
    padding: 0;
    margin-bottom: 30px;
  }
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
  padding: 8px;
  border-radius: 8px;
  
  &:hover {
    background: #f8f9fa;
    color: #1e3a22;
  }
  
  @media (min-width: 768px) {
    padding: 0;
    margin-bottom: 30px;
  }
`;

// Status Badge Mobile
const MobileStatusBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 20px;
  font-size: 12px;
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
  
  @media (min-width: 768px) {
    display: none;
  }
`;

// Hero Section Mobile
const MobileHeroSection = styled.div`
  background: linear-gradient(135deg, #2c5530 0%, #1e3a22 100%);
  color: white;
  padding: 24px 20px;
  text-align: center;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileOrderTitle = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

const MobileOrderDate = styled.p`
  opacity: 0.9;
  font-size: 14px;
  margin-bottom: 16px;
`;

// Desktop Header (caché sur mobile)
const DesktopHeader = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: block;
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    padding: 30px;
    margin-bottom: 30px;
  }
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

// Mobile Content Layout
const MobileContent = styled.div`
  padding: 0 0 80px 0;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

// Desktop Content Layout
const DesktopContent = styled.div`
  display: none;
  
  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 30px;
  }
`;

// Mobile Cards - Très réduites
const MobileCard = styled.div`
  background: white;
  margin: 12px 32px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  width: calc(100% - 64px);
  max-width: 400px;
  
  @media (min-width: 768px) {
    display: none;
  }
`;

const MobileCardHeader = styled.div`
  padding: 14px 16px 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  
  h3 {
    font-size: 16px;
    font-weight: 700;
    color: #2c5530;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }
`;

const MobileCardContent = styled.div`
  padding: 16px;
`;

// Mobile Order Item - Plus compact
const MobileOrderItem = styled.div`
  display: flex;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f8f9fa;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
`;

const MobileItemImage = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 10px;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const MobileItemDetails = styled.div`
  flex: 1;
  
  .item-name {
    font-size: 14px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 3px;
    line-height: 1.3;
  }
  
  .item-description {
    font-size: 12px;
    color: #666;
    margin-bottom: 6px;
    line-height: 1.3;
  }
  
  .item-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    
    .quantity {
      color: #666;
    }
    
    .price {
      font-weight: 700;
      color: #2c5530;
    }
  }
`;

// Mobile Summary
const MobileSummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f8f9fa;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  &.total {
    font-size: 18px;
    font-weight: 700;
    color: #2c5530;
    border-top: 2px solid #e9ecef;
    padding-top: 16px;
    margin-top: 8px;
  }
  
  .label {
    color: #666;
    font-size: 14px;
  }
  
  .value {
    font-weight: 600;
    color: #2c5530;
  }
`;

// Mobile Info Row - Plus compact
const MobileInfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid #f8f9fa;
  
  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
  
  .icon {
    color: #2c5530;
    margin-top: 1px;
  }
  
  .content {
    flex: 1;
    
    .label {
      font-size: 12px;
      color: #666;
      margin-bottom: 3px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    
    .value {
      font-size: 14px;
      color: #2c5530;
      font-weight: 500;
      line-height: 1.3;
    }
  }
`;

// Mobile Action Button - Aligné avec les cartes très réduites
const MobileActionButton = styled.button`
  width: calc(100% - 64px);
  margin: 16px 32px;
  padding: 14px;
  border-radius: 10px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  max-width: 400px;
  
  &.primary {
    background: #2c5530;
    color: white;
    
    &:hover {
      background: #1e3a22;
    }
  }
  
  &.danger {
    background: #fff;
    color: #dc3545;
    border: 2px solid #dc3545;
    
    &:hover {
      background: #dc3545;
      color: white;
    }
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Desktop Components - Agrandis pour desktop
const OrderItems = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  padding: 40px;
  
  @media (min-width: 1200px) {
    padding: 50px;
    border-radius: 20px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 24px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 30px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (min-width: 1200px) {
    font-size: 28px;
    margin-bottom: 35px;
    gap: 15px;
  }
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (min-width: 1200px) {
    gap: 25px;
    padding: 30px 0;
  }
`;

const ItemImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 12px;
  
  @media (min-width: 1200px) {
    width: 120px;
    height: 120px;
    border-radius: 16px;
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  
  h4 {
    font-size: 18px;
    font-weight: 600;
    color: #2c5530;
    margin-bottom: 8px;
    
    @media (min-width: 1200px) {
      font-size: 20px;
      margin-bottom: 10px;
    }
  }
  
  .item-description {
    color: #666;
    font-size: 15px;
    margin-bottom: 12px;
    line-height: 1.5;
    
    @media (min-width: 1200px) {
      font-size: 16px;
      margin-bottom: 15px;
    }
  }
  
  .item-quantity {
    color: #666;
    font-size: 15px;
    
    @media (min-width: 1200px) {
      font-size: 16px;
    }
  }
`;

const ItemPrice = styled.div`
  text-align: right;
  
  .unit-price {
    color: #666;
    font-size: 15px;
    margin-bottom: 8px;
    
    @media (min-width: 1200px) {
      font-size: 16px;
      margin-bottom: 10px;
    }
  }
  
  .total-price {
    font-size: 20px;
    font-weight: 700;
    color: #2c5530;
    
    @media (min-width: 1200px) {
      font-size: 24px;
    }
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  padding: 40px;
  height: fit-content;
  
  @media (min-width: 1200px) {
    padding: 50px;
    border-radius: 20px;
  }
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 18px;
  color: #666;
  font-size: 16px;
  
  &.total {
    font-size: 20px;
    font-weight: 700;
    color: #2c5530;
    border-top: 2px solid #f0f0f0;
    padding-top: 20px;
    margin-top: 20px;
    
    @media (min-width: 1200px) {
      font-size: 24px;
      padding-top: 25px;
      margin-top: 25px;
    }
  }
  
  @media (min-width: 1200px) {
    font-size: 18px;
    margin-bottom: 20px;
  }
`;

const DeliveryInfo = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
  padding: 40px;
  margin-bottom: 40px;
  
  @media (min-width: 1200px) {
    padding: 50px;
    border-radius: 20px;
    margin-bottom: 50px;
  }
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

// Composant d'alerte personnalisé
const AlertOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const AlertBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #2c5530;
    margin-bottom: 15px;
    
    &.success {
      color: #28a745;
    }
    
    &.error {
      color: #dc3545;
    }
  }
  
  p {
    color: #666;
    margin-bottom: 25px;
    line-height: 1.5;
  }
  
  button {
    background: #2c5530;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
    
    &:hover {
      background: #1e3a22;
    }
    
    &.success {
      background: #28a745;
      
      &:hover {
        background: #218838;
      }
    }
    
    &.error {
      background: #dc3545;
      
      &:hover {
        background: #c82333;
      }
    }
  }
`;

// Composant de confirmation personnalisé
const ConfirmBox = styled.div`
  background: white;
  border-radius: 16px;
  padding: 30px;
  max-width: 400px;
  width: 100%;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  
  h3 {
    font-size: 20px;
    font-weight: 700;
    color: #2c5530;
    margin-bottom: 15px;
  }
  
  p {
    color: #666;
    margin-bottom: 25px;
    line-height: 1.5;
  }
  
  .button-group {
    display: flex;
    gap: 12px;
    justify-content: center;
    
    button {
      padding: 12px 24px;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s ease;
      border: none;
      min-width: 100px;
      
      &.confirm {
        background: #28a745;
        color: white;
        
        &:hover {
          background: #218838;
        }
      }
      
      &.cancel {
        background: #6c757d;
        color: white;
        
        &:hover {
          background: #5a6268;
        }
      }
    }
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
  const [alert, setAlert] = useState(null); // { type: 'success' | 'error', title: '', message: '' }
  const [showConfirm, setShowConfirm] = useState(false); // Pour la confirmation d'annulation

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
  }, [id, user, navigate]);

  const handleCancelOrder = () => {
    setShowConfirm(true);
  };

  const confirmCancelOrder = async () => {
    setShowConfirm(false);
    setCancelling(true);
    
    const result = await cancelOrder(id, 'Annulation client');
    
    if (result.success) {
      setAlert({
        type: 'success',
        title: 'Commande annulée',
        message: 'Votre commande a été annulée avec succès.'
      });
      fetchOrder();
    } else {
      setAlert({
        type: 'error',
        title: 'Erreur d\'annulation',
        message: 'Une erreur est survenue lors de l\'annulation de la commande. Veuillez réessayer.'
      });
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
        {/* Mobile Header Sticky */}
        <MobileHeader>
          <BackButton onClick={() => navigate('/orders')}>
            <FiArrowLeft size={18} />
            Retour
          </BackButton>
          <MobileStatusBadge status={order.status}>
            {getStatusIcon(order.status)}
            {getStatusText(order.status)}
          </MobileStatusBadge>
        </MobileHeader>

        {/* Mobile Hero Section */}
        <MobileHeroSection>
          <MobileOrderTitle>
            <FiPackage size={24} />
            Commande #{order.id.slice(-8)}
          </MobileOrderTitle>
          <MobileOrderDate>
            {new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </MobileOrderDate>
        </MobileHeroSection>

        {/* Desktop Header (caché sur mobile) */}
        <DesktopHeader>
          <BackButton onClick={() => navigate('/orders')}>
            <FiArrowLeft size={20} />
            Retour aux commandes
          </BackButton>
          
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
        </DesktopHeader>

        {/* Mobile Content */}
        <MobileContent>
          {/* Articles commandés - Mobile */}
          <MobileCard>
            <MobileCardHeader>
              <h3>
                <FiPackage size={20} />
                Articles commandés
              </h3>
            </MobileCardHeader>
            <MobileCardContent>
              {order.items.map((item, index) => (
                <MobileOrderItem key={index}>
                  <MobileItemImage>
                    {item.image ? (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        onError={(e) => {
                          e.target.src = '/placeholder-wood.jpg';
                        }}
                      />
                    ) : (
                      <FiPackage size={24} color="#2c5530" />
                    )}
                  </MobileItemImage>
                  <MobileItemDetails>
                    <div className="item-name">{item.name}</div>
                    {item.description && (
                      <div className="item-description">{item.description}</div>
                    )}
                    <div className="item-meta">
                      <span className="quantity">Qté: {item.quantity}</span>
                      <span className="price">{(item.price * item.quantity).toFixed(2)}€</span>
                    </div>
                  </MobileItemDetails>
                </MobileOrderItem>
              ))}
            </MobileCardContent>
          </MobileCard>

          {/* Résumé de commande - Mobile */}
          <MobileCard>
            <MobileCardHeader>
              <h3>
                <FiCreditCard size={20} />
                Résumé
              </h3>
            </MobileCardHeader>
            <MobileCardContent>
              <MobileSummaryRow>
                <span className="label">Sous-total</span>
                <span className="value">{(order.total - (order.delivery?.cost || 0)).toFixed(2)}€</span>
              </MobileSummaryRow>
              <MobileSummaryRow>
                <span className="label">Livraison</span>
                <span className="value">{(order.delivery?.cost || 0).toFixed(2)}€</span>
              </MobileSummaryRow>
              <MobileSummaryRow className="total">
                <span>Total</span>
                <span>{order.total.toFixed(2)}€</span>
              </MobileSummaryRow>
            </MobileCardContent>
          </MobileCard>

          {/* Informations de livraison - Mobile */}
          <MobileCard>
            <MobileCardHeader>
              <h3>
                <FiMapPin size={20} />
                Livraison
              </h3>
            </MobileCardHeader>
            <MobileCardContent>
              <MobileInfoRow>
                <FiUser className="icon" size={16} />
                <div className="content">
                  <div className="label">Destinataire</div>
                  <div className="value">
                    {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                  </div>
                </div>
              </MobileInfoRow>
              <MobileInfoRow>
                <FiMapPin className="icon" size={16} />
                <div className="content">
                  <div className="label">Adresse</div>
                  <div className="value">
                    {order.customerInfo?.address}<br />
                    {order.customerInfo?.postalCode} {order.customerInfo?.city}<br />
                    {order.customerInfo?.country}
                  </div>
                </div>
              </MobileInfoRow>
              <MobileInfoRow>
                <FiTruck className="icon" size={16} />
                <div className="content">
                  <div className="label">Mode de livraison</div>
                  <div className="value">
                    {order.delivery?.method === 'express' ? 'Livraison express' : 'Livraison standard'}
                  </div>
                </div>
              </MobileInfoRow>
            </MobileCardContent>
          </MobileCard>

          {/* Informations de contact - Mobile */}
          <MobileCard>
            <MobileCardHeader>
              <h3>
                <FiPhone size={20} />
                Contact
              </h3>
            </MobileCardHeader>
            <MobileCardContent>
              <MobileInfoRow>
                <FiMail className="icon" size={16} />
                <div className="content">
                  <div className="label">Email</div>
                  <div className="value">{order.customerInfo?.email || 'Non renseigné'}</div>
                </div>
              </MobileInfoRow>
              <MobileInfoRow>
                <FiPhone className="icon" size={16} />
                <div className="content">
                  <div className="label">Téléphone</div>
                  <div className="value">{order.customerInfo?.phone || 'Non renseigné'}</div>
                </div>
              </MobileInfoRow>
              <MobileInfoRow>
                <FiCreditCard className="icon" size={16} />
                <div className="content">
                  <div className="label">Paiement</div>
                  <div className="value">
                    {order.payment?.method === 'card' ? 'Carte bancaire' : 'PayPal'}
                  </div>
                </div>
              </MobileInfoRow>
            </MobileCardContent>
          </MobileCard>

          {/* Notes - Mobile */}
          {order.notes && (
            <MobileCard>
              <MobileCardHeader>
                <h3>
                  <FiCalendar size={20} />
                  Notes
                </h3>
              </MobileCardHeader>
              <MobileCardContent>
                <p style={{ color: '#666', lineHeight: '1.5' }}>{order.notes}</p>
              </MobileCardContent>
            </MobileCard>
          )}

          {/* Action Button - Mobile */}
          {(order.status === 'pending' || order.status === 'processing') && (
            <MobileActionButton 
              className="danger"
              onClick={handleCancelOrder}
              disabled={cancelling}
            >
              {cancelling ? 'Annulation...' : 'Annuler la commande'}
            </MobileActionButton>
          )}
        </MobileContent>

        {/* Desktop Content (layout existant) */}
        <DesktopContent>
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
        </DesktopContent>
      </OrderDetailContainer>
      
      {/* Confirmation d'annulation */}
      {showConfirm && (
        <AlertOverlay>
          <ConfirmBox>
            <h3>Confirmer l'annulation</h3>
            <p>Êtes-vous sûr de vouloir annuler cette commande ?</p>
            <div className="button-group">
              <button 
                className="confirm"
                onClick={confirmCancelOrder}
                disabled={cancelling}
              >
                {cancelling ? 'Annulation...' : 'OK'}
              </button>
              <button 
                className="cancel"
                onClick={() => setShowConfirm(false)}
                disabled={cancelling}
              >
                Annuler
              </button>
            </div>
          </ConfirmBox>
        </AlertOverlay>
      )}

      {/* Alerte personnalisée */}
      {alert && (
        <AlertOverlay>
          <AlertBox>
            <h3 className={alert.type}>{alert.title}</h3>
            <p>{alert.message}</p>
            <button 
              className={alert.type}
              onClick={() => setAlert(null)}
            >
              OK
            </button>
          </AlertBox>
        </AlertOverlay>
      )}
    </DashboardLayout>
  );
};

export default OrderDetail;
