import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FiArrowLeft, FiPackage, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiCreditCard } from 'react-icons/fi';

const Page = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 24px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  
  @media (min-width: 768px) {
    gap: 16px;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  border: 2px solid #e6eae7;
  color: #2c5530;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  @media (min-width: 768px) {
    gap: 8px;
    padding: 10px 16px;
    border-radius: 10px;
    font-size: 14px;
  }
  
  &:hover {
    background: #f5f7f6;
    border-color: #2c5530;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #2c5530;
  font-size: 20px;
  font-weight: 800;
  flex: 1;
  
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const StatusBadge = styled.div`
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: ${p => {
    if (p.status === 'delivered') return '#d4edda';
    if (p.status === 'shipped') return '#d1ecf1';
    if (p.status === 'processing') return '#fff3cd';
    if (p.status === 'cancelled') return '#f8d7da';
    return '#e2e3e5';
  }};
  color: ${p => {
    if (p.status === 'delivered') return '#155724';
    if (p.status === 'shipped') return '#0c5460';
    if (p.status === 'processing') return '#856404';
    if (p.status === 'cancelled') return '#721c24';
    return '#6c757d';
  }};
  
  @media (min-width: 768px) {
    padding: 8px 16px;
    font-size: 13px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  
  @media (min-width: 900px) {
    grid-template-columns: 2fr 1fr;
    gap: 24px;
  }
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 18px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  
  @media (min-width: 768px) {
    border-radius: 16px;
    padding: 24px;
  }
`;

const CardTitle = styled.h3`
  margin: 0 0 16px 0;
  color: #2c5530;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  
  @media (min-width: 768px) {
    margin-bottom: 20px;
    font-size: 18px;
    gap: 10px;
  }
`;

const InfoGrid = styled.div`
  display: grid;
  gap: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  background: #f9faf9;
  border-radius: 10px;
  
  svg {
    color: #2c5530;
    margin-top: 2px;
  }
`;

const InfoLabel = styled.div`
  font-size: 12px;
  color: #6b7c6d;
  margin-bottom: 4px;
`;

const InfoValue = styled.div`
  font-size: 14px;
  color: #1f2d1f;
  font-weight: 600;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
  
  @media (min-width: 768px) {
    margin-top: 16px;
  }
  
  th, td {
    padding: 10px;
    text-align: left;
    
    @media (min-width: 768px) {
      padding: 14px;
    }
  }
  
  thead {
    background: #f5f7f6;
    
    th {
      font-weight: 700;
      color: #2c5530;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      @media (min-width: 768px) {
        font-size: 12px;
      }
    }
  }
  
  tbody tr {
    border-bottom: 1px solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    font-size: 13px;
    color: #1f2d1f;
    
    @media (min-width: 768px) {
      font-size: 14px;
    }
  }
`;

const ProductImage = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: #f5f7f6;
  display: grid;
  place-items: center;
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    width: 50px;
    height: 50px;
    border-radius: 8px;
  }
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
    
    @media (min-width: 768px) {
      border-radius: 8px;
    }
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #eaf4ee;
  border-radius: 8px;
  margin-top: 12px;
  gap: 8px;
  
  @media (min-width: 768px) {
    padding: 16px;
    border-radius: 10px;
    margin-top: 16px;
  }
  
  span:first-child {
    font-size: 14px;
    font-weight: 700;
    color: #2c5530;
    
    @media (min-width: 768px) {
      font-size: 16px;
    }
  }
  
  span:last-child {
    font-size: 20px;
    font-weight: 800;
    color: #2c5530;
    
    @media (min-width: 768px) {
      font-size: 24px;
    }
  }
`;

const Select = styled.select`
  width: 100%;
  border: 2px solid #e6eae7;
  border-radius: 10px;
  padding: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #2c5530;
  cursor: pointer;
  transition: border-color 0.2s;
  
  &:focus {
    outline: none;
    border-color: #2c5530;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 14px;
  background: #2c5530;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 16px;
  
  &:hover {
    background: #1e3a22;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const LoadingState = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  text-align: center;
  padding: 60px 20px;
  color: #6b7c6d;
`;

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const run = async () => {
      const ref = doc(db, 'orders', id);
      const snap = await getDoc(ref);
      setOrder(snap.exists() ? { id, ...snap.data() } : null);
    };
    run();
  }, [id]);

  const updateStatus = async (status) => {
    if (!order) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'orders', id), { 
        status,
        updatedAt: new Date()
      });
      setOrder(o => ({ ...o, status }));
    } catch (error) {
      
    } finally {
      setSaving(false);
    }
  };

  if (!order) {
    return (
      <LoadingState>
        <h3>Chargement de la commande...</h3>
      </LoadingState>
    );
  }

  return (
    <Page>
      <Header>
        <BackButton onClick={() => navigate('/orders')}>
          <FiArrowLeft size={18} /> Retour
        </BackButton>
        <Title>Commande #{id.slice(-8)}</Title>
        <StatusBadge status={order.status}>
          {order.status === 'pending' && 'En attente'}
          {order.status === 'processing' && 'En cours'}
          {order.status === 'shipped' && 'Expédiée'}
          {order.status === 'delivered' && 'Livrée'}
          {order.status === 'cancelled' && 'Annulée'}
        </StatusBadge>
      </Header>

      <Grid>
        <div style={{ display: 'grid', gap: '24px' }}>
          {/* Informations client */}
          <Card>
            <CardTitle>
              <FiUser size={20} /> Informations client
            </CardTitle>
            <InfoGrid>
              <InfoRow>
                <FiUser size={18} />
                <div style={{ flex: 1 }}>
                  <InfoLabel>Nom complet</InfoLabel>
                  <InfoValue>
                    {order.customerInfo?.firstName} {order.customerInfo?.lastName}
                  </InfoValue>
                </div>
              </InfoRow>
              <InfoRow>
                <FiMail size={18} />
                <div style={{ flex: 1 }}>
                  <InfoLabel>Email</InfoLabel>
                  <InfoValue>{order.customerInfo?.email || 'N/A'}</InfoValue>
                </div>
              </InfoRow>
              <InfoRow>
                <FiPhone size={18} />
                <div style={{ flex: 1 }}>
                  <InfoLabel>Téléphone</InfoLabel>
                  <InfoValue>{order.customerInfo?.phone || 'N/A'}</InfoValue>
                </div>
              </InfoRow>
              <InfoRow>
                <FiMapPin size={18} />
                <div style={{ flex: 1 }}>
                  <InfoLabel>Adresse de livraison</InfoLabel>
                  <InfoValue>
                    {order.shippingAddress?.street}<br />
                    {order.shippingAddress?.city}, {order.shippingAddress?.postalCode}<br />
                    {order.shippingAddress?.country}
                  </InfoValue>
                </div>
              </InfoRow>
            </InfoGrid>
          </Card>

          {/* Articles commandés */}
          <Card>
            <CardTitle>
              <FiPackage size={20} /> Articles commandés
            </CardTitle>
            <Table>
              <thead>
                <tr>
                  <th>Produit</th>
                  <th>Quantité</th>
                  <th>Prix unitaire</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {(order.items || []).length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>
                      Aucun article
                    </td>
                  </tr>
                ) : (
                  (order.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <ProductImage>
                            {item.image ? (
                              <img src={item.image} alt={item.name} />
                            ) : (
                              <FiPackage size={24} color="#6b7c6d" />
                            )}
                          </ProductImage>
                          <div>
                            <div style={{ fontWeight: '600' }}>{item.name || 'Produit'}</div>
                            {item.description && (
                              <div style={{ fontSize: '12px', color: '#6b7c6d' }}>
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>{item.quantity || 1}</td>
                      <td>{item.price?.toFixed(2) || '0.00'} €</td>
                      <td>
                        <strong>
                          {((item.price || 0) * (item.quantity || 1)).toFixed(2)} €
                        </strong>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <TotalRow>
              <span>Total de la commande</span>
              <span>{order.total?.toFixed(2) || '0.00'} €</span>
            </TotalRow>
          </Card>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'grid', gap: '24px', alignContent: 'start' }}>
          {/* Gestion du statut */}
          <Card>
            <CardTitle>
              <FiPackage size={20} /> Statut de la commande
            </CardTitle>
            <Select 
              value={order.status || 'pending'} 
              onChange={(e) => updateStatus(e.target.value)}
              disabled={saving}
            >
              <option value="pending">En attente</option>
              <option value="processing">En cours</option>
              <option value="shipped">Expédiée</option>
              <option value="delivered">Livrée</option>
              <option value="cancelled">Annulée</option>
            </Select>
            <ActionButton disabled={saving}>
              {saving ? 'Enregistrement...' : 'Sauvegarder les modifications'}
            </ActionButton>
          </Card>

          {/* Informations commande */}
          <Card>
            <CardTitle>
              <FiCalendar size={20} /> Détails
            </CardTitle>
            <InfoGrid>
              <InfoRow>
                <FiCalendar size={16} />
                <div style={{ flex: 1 }}>
                  <InfoLabel>Date de commande</InfoLabel>
                  <InfoValue>
                    {order.createdAt?.seconds
                      ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'N/A'
                    }
                  </InfoValue>
                </div>
              </InfoRow>
              <InfoRow>
                <FiCreditCard size={16} />
                <div style={{ flex: 1 }}>
                  <InfoLabel>Mode de paiement</InfoLabel>
                  <InfoValue>{order.paymentMethod || 'Carte bancaire'}</InfoValue>
                </div>
              </InfoRow>
              <InfoRow>
                <FiPackage size={16} />
                <div style={{ flex: 1 }}>
                  <InfoLabel>Nombre d'articles</InfoLabel>
                  <InfoValue>{order.items?.length || 0}</InfoValue>
                </div>
              </InfoRow>
            </InfoGrid>
          </Card>
        </div>
      </Grid>
    </Page>
  );
};

export default OrderDetail;
