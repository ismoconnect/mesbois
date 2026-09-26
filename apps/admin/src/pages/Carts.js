import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '../firebase/config';
import { FiShoppingCart, FiPackage, FiCalendar, FiEye, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

const Page = styled.div`
  max-width: 1200px;
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
  gap: 8px;
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


const StatsBar = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  
  @media (min-width: 600px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 10px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (min-width: 768px) {
    border-radius: 12px;
    padding: 20px;
    gap: 14px;
  }
`;

const StatIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  background: ${p => p.bg || '#f5f7f6'};
  color: ${p => p.color || '#2c5530'};
  flex-shrink: 0;
  
  @media (min-width: 768px) {
    width: 48px;
    height: 48px;
    border-radius: 12px;
  }
`;

const StatInfo = styled.div`
  min-width: 0;
  h4 { 
    margin: 0; 
    font-size: 20px; 
    font-weight: 800; 
    color: #2c5530;
    @media (min-width: 768px) {
      font-size: 24px;
    }
  }
  span { 
    font-size: 12px; 
    color: #6b7c6d;
    @media (min-width: 768px) {
      font-size: 13px;
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
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 600px;
  
  th, td {
    padding: 14px;
    text-align: left;
    
    @media (min-width: 768px) {
      padding: 18px;
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
      white-space: nowrap;
      
      @media (min-width: 768px) {
        font-size: 13px;
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
    font-size: 13px;
    color: #1f2d1f;
    
    @media (min-width: 768px) {
      font-size: 14px;
    }
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  
  @media (min-width: 768px) {
    gap: 8px;
  }
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
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
  }
  
  &:hover {
    background: #1e3a22;
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
  
  @media (min-width: 768px) {
    gap: 6px;
    padding: 8px 12px;
    border-radius: 8px;
    font-size: 12px;
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

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  background: #eaf4ee;
  color: #2c5530;
  white-space: nowrap;
  
  @media (min-width: 768px) {
    gap: 6px;
    padding: 6px 12px;
    font-size: 12px;
  }
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

const Carts = () => {
  const [carts, setCarts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    withItems: 0,
    totalItems: 0
  });
  // Modal : type = 'single' | 'all'  |  cartId pour 'single'
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const col = collection(db, 'carts');
      const qr = query(col, orderBy('updatedAt', 'desc'));
      const snap = await getDocs(qr);
      const cartsList = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      const sortedByUser = [...cartsList].sort((a, b) => {
        const ua = (a.id || '').toString();
        const ub = (b.id || '').toString();
        return ua.localeCompare(ub);
      });
      
      setCarts(sortedByUser);
      
      const withItems = cartsList.filter(c => c.items?.length > 0).length;
      const totalItems = cartsList.reduce((sum, c) => sum + (c.items?.length || 0), 0);
      
      setStats({
        total: cartsList.length,
        withItems,
        totalItems
      });
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarts();
  }, []);

  // Supprimer un seul panier
  const handleDeleteSingle = async (cartId) => {
    setDeleting(true);
    try {
      await deleteDoc(doc(db, 'carts', cartId));
      setDeleteModal(null);
      fetchCarts();
    } catch (error) {
      console.error('Erreur suppression panier:', error);
    } finally {
      setDeleting(false);
    }
  };

  // Supprimer tous les paniers
  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      const batch = writeBatch(db);
      carts.forEach(cart => {
        batch.delete(doc(db, 'carts', cart.id));
      });
      await batch.commit();
      setDeleteModal(null);
      fetchCarts();
    } catch (error) {
      console.error('Erreur suppression totale:', error);
    } finally {
      setDeleting(false);
    }
  };

  const filteredCarts = carts;

  return (
    <Page>
      {/* Modal de confirmation */}
      {deleteModal && (
        <ModalOverlay onClick={() => !deleting && setDeleteModal(null)}>
          <ModalBox onClick={e => e.stopPropagation()}>
            <ModalIcon><FiAlertTriangle size={26} /></ModalIcon>
            <ModalTitle>
              {deleteModal.type === 'all'
                ? 'Supprimer tous les paniers ?'
                : 'Supprimer ce panier ?'}
            </ModalTitle>
            <ModalText>
              {deleteModal.type === 'all'
                ? `Cette action supprimera définitivement les ${carts.length} panier${carts.length > 1 ? 's' : ''} de la base de données. Cette action est irréversible.`
                : 'Ce panier sera définitivement supprimé de la base de données. Cette action est irréversible.'}
            </ModalText>
            <ModalActions>
              <BtnCancel onClick={() => setDeleteModal(null)} disabled={deleting}>
                Annuler
              </BtnCancel>
              <BtnConfirmDelete
                disabled={deleting}
                onClick={() =>
                  deleteModal.type === 'all'
                    ? handleDeleteAll()
                    : handleDeleteSingle(deleteModal.cartId)
                }
              >
                {deleting ? 'Suppression...' : 'Confirmer la suppression'}
              </BtnConfirmDelete>
            </ModalActions>
          </ModalBox>
        </ModalOverlay>
      )}

      <Header>
        <div>
          <Title>Gestion des Paniers</Title>
          <Subtitle>{carts.length} panier{carts.length > 1 ? 's' : ''} actif{carts.length > 1 ? 's' : ''}</Subtitle>
        </div>
        {carts.length > 0 && (
          <DeleteAllButton onClick={() => setDeleteModal({ type: 'all' })}>
            <FiTrash2 size={16} /> Tout supprimer
          </DeleteAllButton>
        )}
      </Header>

      <StatsBar>
        <StatCard>
          <StatIcon bg="#eaf4ee" color="#2c5530"><FiShoppingCart size={24} /></StatIcon>
          <StatInfo>
            <h4>{stats.total}</h4>
            <span>Paniers totaux</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#d4edda" color="#155724"><FiPackage size={24} /></StatIcon>
          <StatInfo>
            <h4>{stats.withItems}</h4>
            <span>Avec articles</span>
          </StatInfo>
        </StatCard>
        <StatCard>
          <StatIcon bg="#fff3cd" color="#856404"><FiShoppingCart size={24} /></StatIcon>
          <StatInfo>
            <h4>{stats.totalItems}</h4>
            <span>Articles totaux</span>
          </StatInfo>
        </StatCard>
      </StatsBar>

      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <th>Utilisateur</th>
              <th>Articles</th>
              <th>Dernière modification</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px' }}>Chargement...</td></tr>
            ) : filteredCarts.length === 0 ? (
              <tr>
                <td colSpan="4">
                  <EmptyState>
                    <FiShoppingCart />
                    <h3>Aucun panier trouvé</h3>
                    <p>Essayez de modifier votre recherche</p>
                  </EmptyState>
                </td>
              </tr>
            ) : (
              filteredCarts.map(cart => (
                <tr key={cart.id}>
                  <td>
                    <div style={{ fontWeight: '600', color: '#2c5530' }}>
                      #{cart.id.slice(-8)}
                    </div>
                    <div style={{ fontSize: '12px', color: '#6b7c6d', marginTop: '4px' }}>
                      {cart.id}
                    </div>
                  </td>
                  <td>
                    <Badge>
                      <FiPackage size={14} />
                      {cart.items?.length || 0} article{(cart.items?.length || 0) > 1 ? 's' : ''}
                    </Badge>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FiCalendar size={14} style={{ color: '#6b7c6d' }} />
                      {cart.updatedAt?.seconds
                        ? new Date(cart.updatedAt.seconds * 1000).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'N/A'
                      }
                    </div>
                  </td>
                  <td>
                    <Actions>
                      <ActionButton to={`/carts/${cart.id}`}>
                        <FiEye size={14} /> Voir
                      </ActionButton>
                      <DeleteButton onClick={() => setDeleteModal({ type: 'single', cartId: cart.id })}>
                        <FiTrash2 size={14} /> Supprimer
                      </DeleteButton>
                    </Actions>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </TableWrapper>
    </Page>
  );
};

export default Carts;
