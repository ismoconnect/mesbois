import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query, updateDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiPackage, FiClock, FiTruck, FiCheckCircle, FiXCircle, FiEye, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

const Page = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 16px;
  padding: 16px 10px 24px;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    gap: 24px;
    padding: 24px 16px 32px;
  }
  
  @media (max-width: 767px) {
    overflow-x: hidden;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const Title = styled.h1`
  margin: 0;
  color: #2c5530;
  font-size: 22px;
  font-weight: 800;
  
  @media (min-width: 768px) {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  margin: 4px 0 0 0;
  color: #6b7c6d;
  font-size: 12px;
  
  @media (min-width: 768px) {
    font-size: 14px;
  }
`;

// plus de filtre de statut: on retire le Select et on garde seulement le titre et les stats

const StatsBar = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  width: 100%;
  padding: 0 2px;
  box-sizing: border-box;
  
  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    padding: 0;
  }
`;

const StatCard = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 10px;
  padding: 14px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (min-width: 768px) {
    border-radius: 12px;
    padding: 16px;
    gap: 12px;
  }
`;

const StatIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: ${p => p.bg || '#f5f7f6'};
  color: ${p => p.color || '#2c5530'};
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    width: 40px;
    height: 40px;
    border-radius: 10px;
  }
`;

const StatInfo = styled.div`
  min-width: 0;
  h4 { 
    margin: 0; 
    font-size: 18px; 
    font-weight: 800; 
    color: #2c5530;
    @media (min-width: 768px) {
      font-size: 20px;
    }
  }
  span { 
    font-size: 11px; 
    color: #6b7c6d;
    @media (min-width: 768px) {
      font-size: 12px;
    }
  }
`;

const TableWrapper = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  overflow-x: auto;
  box-shadow: 0 4px 16px rgba(0,0,0,0.04);
  
  @media (min-width: 768px) {
    border-radius: 16px;
  }
  
  @media (max-width: 767px) {
    background: transparent;
    border: none;
    box-shadow: none;
    overflow-x: hidden;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  @media (max-width: 767px) {
    display: none;
  }
  
  th, td {
    padding: 8px 6px;
    text-align: left;
    
    @media (min-width: 768px) {
      padding: 16px;
    }
  }
  
  thead {
    background: #f5f7f6;
    
    th {
      font-weight: 700;
      color: #2c5530;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      white-space: nowrap;
      
      @media (min-width: 768px) {
        font-size: 13px;
        letter-spacing: 0.5px;
      }
    }
  }
  
  tbody tr {
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s;
    
    &:hover {
      background: #f9faf9;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
  
  td {
    font-size: 11px;
    color: #1f2d1f;
    
    @media (min-width: 768px) {
      font-size: 14px;
    }
  }
`;

// eslint-disable-next-line no-unused-vars
const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
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
`;

const ActionButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 6px;
  background: #2c5530;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  font-size: 11px;
  transition: background 0.2s;
  white-space: nowrap;
  
  @media (min-width: 768px) {
    gap: 6px;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
  }
  
  &:hover {
    background: #1e3a22;
  }
`;

// eslint-disable-next-line no-unused-vars
const StatusSelect = styled.select`
  padding: 3px 4px;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  font-size: 9px;
  cursor: pointer;
  width: 100%;
  min-width: 65px;
  
  @media (min-width: 768px) {
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 12px;
    width: auto;
  }
  
  &:focus {
    outline: none;
    border-color: #2c5530;
  }
`;

const DeleteButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 6px;
  background: #fff0f0;
  color: #c0392b;
  border: 1px solid #f5c6c6;
  font-weight: 600;
  font-size: 11px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
    gap: 6px;
  }
  
  &:hover {
    background: #c0392b;
    color: #fff;
    border-color: #c0392b;
  }
`;

const DeleteAllButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 8px;
  background: #fff0f0;
  color: #c0392b;
  border: 1.5px solid #f5c6c6;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #c0392b;
    color: #fff;
    border-color: #c0392b;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 16px;
`;

const ModalBox = styled.div`
  background: #fff;
  border-radius: 16px;
  padding: 28px 24px 24px;
  max-width: 420px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,0.15);
  display: grid;
  gap: 16px;
`;

const ModalIcon = styled.div`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #fff0f0;
  color: #c0392b;
  display: grid;
  place-items: center;
  margin: 0 auto;
`;

const ModalTitle = styled.h3`
  margin: 0;
  text-align: center;
  color: #1f2d1f;
  font-size: 18px;
`;

const ModalText = styled.p`
  margin: 0;
  text-align: center;
  color: #6b7c6d;
  font-size: 14px;
  line-height: 1.5;
`;

const ModalActions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  margin-top: 4px;
`;

const BtnCancel = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1.5px solid #e0e0e0;
  background: #fff;
  color: #444;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #f5f5f5; }
`;

const BtnConfirmDelete = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: #c0392b;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.2s;
  &:hover { background: #a93226; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7c6d;
  
  svg {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.3;
  }
  
  h3 {
    margin: 0 0 8px 0;
    color: #2c5530;
  }
`;

// Mobile Cards
const MobileOrdersList = styled.div`
  display: none;
  
  @media (max-width: 767px) {
    display: grid;
    gap: 12px;
  }
`;

const MobileOrderCard = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
`;

const MobileCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
`;

const MobileOrderId = styled.div`
  font-size: 13px;
  font-weight: 800;
  color: #2c5530;
`;

const MobileOrderAmount = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #2c5530;
`;

const MobileCardBody = styled.div`
  display: grid;
  gap: 10px;
`;

const MobileCardRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
`;

const MobileCardLabel = styled.div`
  font-size: 11px;
  color: #6b7c6d;
  font-weight: 600;
  flex-shrink: 0;
`;

const MobileCardValue = styled.div`
  font-size: 12px;
  color: #1f2d1f;
  text-align: right;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const MobileCardActions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
`;

// eslint-disable-next-line no-unused-vars
function getStatusIcon(status) {
  switch (status) {
    case 'delivered': return <FiCheckCircle size={14} />;
    case 'shipped': return <FiTruck size={14} />;
    case 'processing': return <FiPackage size={14} />;
    case 'cancelled': return <FiXCircle size={14} />;
    default: return <FiClock size={14} />;
  }
}

// eslint-disable-next-line no-unused-vars
function getStatusText(status) {
  switch (status) {
    case 'pending': return 'En attente';
    case 'processing': return 'En cours';
    case 'shipped': return 'Expédiée';
    case 'delivered': return 'Livrée';
    case 'cancelled': return 'Annulée';
    default: return status || 'Inconnu';
  }
}

const Orders = () => {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [userIndex, setUserIndex] = useState({}); // index des utilisateurs par uid
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    delivered: 0
  });
  // Modal de confirmation de suppression
  // type: 'group' | 'all'  |  group: objet groupe utilisateur
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const col = collection(db, 'orders');
      const qr = query(col, orderBy('createdAt', 'desc'));
      const snap = await getDocs(qr);
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // Trier les commandes par UID (userId) pour les regrouper par client
      const sortedByUser = [...list].sort((a, b) => {
        const ua = (a.userId || '').toString();
        const ub = (b.userId || '').toString();
        return ua.localeCompare(ub);
      });
      
      setOrders(sortedByUser);
      
      // Calculer les stats
      setStats({
        total: list.length,
        pending: list.filter(o => o.status === 'pending').length,
        processing: list.filter(o => o.status === 'processing').length,
        delivered: list.filter(o => o.status === 'delivered').length
      });
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Charger les infos de base des utilisateurs pour afficher un nom lisible dans le tableau
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const snap = await getDocs(collection(db, 'users'));
        const index = {};
        snap.docs.forEach(d => {
          const data = d.data() || {};
          index[d.id] = {
            displayName: data.displayName || '',
            email: data.email || '',
          };
        });
        setUserIndex(index);
      } catch (e) {
        setUserIndex({});
      }
    };

    loadUsers();
  }, []);

  // eslint-disable-next-line no-unused-vars
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        status: newStatus,
        updatedAt: new Date()
      });
      // Recharger les commandes
      fetchOrders();
    } catch (error) {
      
    }
  };

  // Supprimer toutes les commandes d'un groupe (utilisateur)
  const handleDeleteGroup = async (group) => {
    setDeleting(true);
    try {
      const batch = writeBatch(db);
      group.orders.forEach(order => {
        batch.delete(doc(db, 'orders', order.id));
      });
      await batch.commit();
      setDeleteModal(null);
      fetchOrders();
    } catch (error) {
      console.error('Erreur suppression:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Supprimer TOUTES les commandes
  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      const batch = writeBatch(db);
      orders.forEach(order => {
        batch.delete(doc(db, 'orders', order.id));
      });
      await batch.commit();
      setDeleteModal(null);
      fetchOrders();
    } catch (error) {
      console.error('Erreur suppression totale:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Plus de filtre UI: on affiche toutes les commandes
  const filteredOrders = orders;

  // Regrouper les commandes par utilisateur (userId)
  const userOrderGroups = (() => {
    const byUser = {};
    const groups = [];
    filteredOrders.forEach(order => {
      const key = order.userId || 'unknown';
      if (!byUser[key]) {
        byUser[key] = {
          userId: key,
          orders: [],
          totalAmount: 0,
          lastOrder: null,
        };
        groups.push(byUser[key]);
      }
      const group = byUser[key];
      group.orders.push(order);
      group.totalAmount += order.total || 0;
      const curTs = order.createdAt?.seconds || 0;
      const lastTs = group.lastOrder?.createdAt?.seconds || 0;
      if (curTs >= lastTs) {
        group.lastOrder = order;
      }
    });
    return groups;
  })();

  return (
    <Page>
      {/* Modal de confirmation */}
      {deleteModal && (
        <ModalOverlay onClick={() => !deleting && setDeleteModal(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalIcon><FiAlertTriangle size={26} /></ModalIcon>
            <ModalTitle>
              {deleteModal.type === 'all'
                ? 'Supprimer toutes les commandes ?'
                : `Supprimer les commandes de ce client ?`}
            </ModalTitle>
            <ModalText>
              {deleteModal.type === 'all'
                ? `Cette action supprimera définitivement les ${orders.length} commande${orders.length > 1 ? 's' : ''} de la base de données. Cette action est irréversible.`
                : `Cette action supprimera définitivement ${deleteModal.group.orders.length} commande${deleteModal.group.orders.length > 1 ? 's' : ''} pour ce client. Cette action est irréversible.`}
            </ModalText>
            <ModalActions>
              <BtnCancel onClick={() => setDeleteModal(null)} disabled={deleting}>
                Annuler
              </BtnCancel>
              <BtnConfirmDelete
                disabled={deleting}
                onClick={() => deleteModal.type === 'all' ? handleDeleteAll() : handleDeleteGroup(deleteModal.group)}
              >
                {deleting ? 'Suppression...' : 'Confirmer la suppression'}
              </BtnConfirmDelete>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      <Header>
        <div>
          <Title>Gestion des commandes</Title>
          <Subtitle>{orders.length} commande{orders.length > 1 ? 's' : ''} au total</Subtitle>
        </div>
        {orders.length > 0 && (
          <DeleteAllButton onClick={() => setDeleteModal({ type: 'all' })}>
            <FiTrash2 size={16} /> Tout supprimer
          </DeleteAllButton>
        )}
      </Header>

      <StatsBar>
        <StatCard>
          <StatIcon bg="#eaf4ee" color="#2c5530"><FiPackage size={20} /></StatIcon>
          <StatInfo>
            <h4>{stats.total}</h4>
            <span>Total</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#fff3cd" color="#856404"><FiClock size={20} /></StatIcon>
          <StatInfo>
            <h4>{stats.pending}</h4>
            <span>En attente</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#d1ecf1" color="#0c5460"><FiTruck size={20} /></StatIcon>
          <StatInfo>
            <h4>{stats.processing}</h4>
            <span>En cours</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#d4edda" color="#155724"><FiCheckCircle size={20} /></StatIcon>
          <StatInfo>
            <h4>{stats.delivered}</h4>
            <span>Livrées</span>
          </StatInfo>
        </StatCard>
      </StatsBar>

      <TableWrapper>
        {/* Desktop Table : une ligne par utilisateur */}
        <Table>
          <thead>
            <tr>
              <th>Client</th>
              <th>Nb commandes</th>
              <th>Montant total</th>
              <th>Dernière commande</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>Chargement...</td></tr>
            ) : userOrderGroups.length === 0 ? (
              <tr>
                <td colSpan="5">
                  <EmptyState>
                    <FiPackage />
                    <h3>Aucune commande trouvée</h3>
                    <p>Essayez de modifier vos filtres</p>
                  </EmptyState>
                </td>
              </tr>
            ) : (
              userOrderGroups.map(group => {
                const order = group.lastOrder || group.orders[0];
                const firstName = order.customerInfo?.firstName;
                const lastName = order.customerInfo?.lastName;
                const emailFromOrder = order.customerInfo?.email;
                const fullNameFromOrder = firstName && lastName
                  ? `${firstName} ${lastName}`
                  : firstName || lastName || '';

                const userInfo = userIndex[group.userId] || {};
                const primary = userInfo.displayName
                  ? userInfo.displayName
                  : fullNameFromOrder || userInfo.email || emailFromOrder || group.userId || 'Utilisateur';
                const secondarySource = userInfo.email || emailFromOrder;
                const secondary = secondarySource && secondarySource !== primary ? secondarySource : '';

                return (
                  <tr key={group.userId}>
                    <td style={{ minWidth: '140px', maxWidth: '220px' }}>
                      <div style={{ 
                        fontSize: '11px', 
                        fontWeight: '600',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {primary}
                      </div>
                      {secondary && (
                        <div style={{ 
                          fontSize: '9px', 
                          color: '#6b7c6d',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {secondary}
                        </div>
                      )}
                    </td>
                    <td style={{ width: '80px', fontSize: '12px', fontWeight: 600 }}>
                      {group.orders.length}
                    </td>
                    <td style={{ width: '90px' }}>
                      <strong style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {group.totalAmount.toFixed(0)} €
                      </strong>
                    </td>
                    <td style={{ width: '90px' }}>
                      <div style={{ fontSize: '10px', whiteSpace: 'nowrap' }}>
                        {order.createdAt?.seconds 
                          ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit'
                            })
                          : 'N/A'
                        }
                      </div>
                      <div style={{ fontSize: '9px', color: '#6b7c6d' }}>
                        {order.createdAt?.seconds 
                          ? new Date(order.createdAt.seconds * 1000).toLocaleTimeString('fr-FR', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : ''
                        }
                      </div>
                    </td>
                    <td style={{ width: '120px', padding: '8px 4px' }}>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <ActionButton
                          to={group.userId !== 'unknown' ? `/users/${group.userId}` : `/orders/${order.id}`}
                          style={{ padding: '6px 8px', fontSize: '10px' }}
                        >
                          <FiEye size={12} />
                          <span style={{ display: 'none' }}>Gérer les commandes</span>
                        </ActionButton>
                        <DeleteButton
                          onClick={() => setDeleteModal({ type: 'group', group })}
                          style={{ padding: '6px 8px', fontSize: '10px' }}
                          title="Supprimer les commandes de ce client"
                        >
                          <FiTrash2 size={12} />
                        </DeleteButton>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>

        {/* Mobile Cards : une carte par utilisateur */}
        <MobileOrdersList>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>Chargement...</div>
          ) : userOrderGroups.length === 0 ? (
            <EmptyState>
              <FiPackage />
              <h3>Aucune commande trouvée</h3>
              <p>Essayez de modifier vos filtres</p>
            </EmptyState>
          ) : (
            userOrderGroups.map(group => {
              const order = group.lastOrder || group.orders[0];
              const firstName = order.customerInfo?.firstName;
              const lastName = order.customerInfo?.lastName;
              const emailFromOrder = order.customerInfo?.email;
              const fullNameFromOrder = firstName && lastName
                ? `${firstName} ${lastName}`
                : firstName || lastName || '';

              const userInfo = userIndex[group.userId] || {};
              const primary = userInfo.displayName
                ? userInfo.displayName
                : fullNameFromOrder || userInfo.email || emailFromOrder || group.userId || 'Utilisateur';
              const secondarySource = userInfo.email || emailFromOrder;
              const secondary = secondarySource && secondarySource !== primary ? secondarySource : '';

              return (
                <MobileOrderCard key={group.userId}>
                  <MobileCardHeader>
                    <MobileOrderId>{primary}</MobileOrderId>
                    <MobileOrderAmount>{group.totalAmount.toFixed(2)} €</MobileOrderAmount>
                  </MobileCardHeader>

                  <MobileCardBody>
                    {secondary && (
                      <MobileCardRow>
                        <MobileCardLabel>Email</MobileCardLabel>
                        <MobileCardValue>{secondary}</MobileCardValue>
                      </MobileCardRow>
                    )}

                    <MobileCardRow>
                      <MobileCardLabel>Nb commandes</MobileCardLabel>
                      <MobileCardValue>{group.orders.length}</MobileCardValue>
                    </MobileCardRow>

                    <MobileCardRow>
                      <MobileCardLabel>Dernière commande</MobileCardLabel>
                      <MobileCardValue>
                        {order.createdAt?.seconds
                          ? new Date(order.createdAt.seconds * 1000).toLocaleDateString('fr-FR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : 'N/A'}
                      </MobileCardValue>
                    </MobileCardRow>
                  </MobileCardBody>

                  <MobileCardActions>
                    <ActionButton
                      to={group.userId !== 'unknown' ? `/users/${group.userId}` : `/orders/${order.id}`}
                      style={{ flex: 1, justifyContent: 'center' }}
                    >
                      <FiEye size={14} /> Voir
                    </ActionButton>
                    <DeleteButton
                      onClick={() => setDeleteModal({ type: 'group', group })}
                      style={{ padding: '8px 14px' }}
                    >
                      <FiTrash2 size={14} /> Supprimer
                    </DeleteButton>
                  </MobileCardActions>
                </MobileOrderCard>
              );
            })
          )}
        </MobileOrdersList>
      </TableWrapper>
    </Page>
  );
};

export default Orders;
