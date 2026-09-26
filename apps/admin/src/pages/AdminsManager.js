import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { db } from '../firebase/config';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  serverTimestamp,
  query,
  where 
} from 'firebase/firestore';
import { useAdminAuth } from '../contexts/AdminAuthContext';
import toast from 'react-hot-toast';
import { 
  FiShield, 
  FiUserCheck, 
  FiUserPlus, 
  FiTrash2, 
  FiCheckCircle, 
  FiXCircle, 
  FiSearch, 
  FiInfo, 
  FiUser, 
  FiX, 
  FiAlertTriangle,
  FiRefreshCw
} from 'react-icons/fi';

const Page = styled.div`
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  display: grid;
  gap: 20px;
  padding: 16px 10px 32px;
  box-sizing: border-box;

  @media (min-width: 768px) {
    gap: 24px;
    padding: 24px 16px 32px;
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const Title = styled.h1`
  margin: 0;
  color: #1a331f;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.5px;

  @media (min-width: 768px) {
    font-size: 26px;
  }
`;

const SuperBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Subtitle = styled.p`
  margin: 0;
  color: #6b7c6d;
  font-size: 13px;
  line-height: 1.4;
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const PrimaryButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #2c5530;
  color: #ffffff;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(44, 85, 48, 0.2);
  transition: all 0.2s ease;

  &:hover {
    background: #1f3d23;
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(44, 85, 48, 0.25);
  }

  &:active {
    transform: translateY(0);
  }
`;

const RefreshButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  background: #ffffff;
  border: 1px solid #dcdfe4;
  border-radius: 10px;
  color: #2c5530;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: #f5f7f6;
    border-color: #2c5530;
  }
`;

const NoticeBox = styled.div`
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
  border: 1px solid #bbf7d0;
  border-radius: 12px;
  padding: 16px;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  color: #166534;
  font-size: 13px;
  line-height: 1.5;

  svg {
    flex-shrink: 0;
    margin-top: 2px;
    color: #15803d;
  }

  strong {
    color: #14532d;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;

  @media (min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
`;

const StatCard = styled.div`
  background: #ffffff;
  border: 1px solid #e6eae7;
  border-radius: 12px;
  padding: 18px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.03);
`;

const StatIcon = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 12px;
  display: grid;
  place-items: center;
  background: ${props => props.$bg || '#f5f7f6'};
  color: ${props => props.$color || '#2c5530'};
  flex-shrink: 0;
`;

const StatInfo = styled.div`
  display: flex;
  flex-direction: column;

  .label {
    font-size: 12px;
    font-weight: 600;
    color: #6b7c6d;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .value {
    font-size: 22px;
    font-weight: 800;
    color: #1a331f;
    margin-top: 2px;
  }
`;

const ControlBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background: #ffffff;
  padding: 14px 16px;
  border-radius: 12px;
  border: 1px solid #e6eae7;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const SearchInputWrapper = styled.div`
  position: relative;
  flex: 1;
  max-width: 400px;

  svg {
    position: absolute;
    left: 12px;
    top: 50%;
    transform: translateY(-50%);
    color: #8fa091;
  }

  input {
    width: 100%;
    box-sizing: border-box;
    padding: 9px 12px 9px 36px;
    border: 1px solid #dce2dd;
    border-radius: 8px;
    font-size: 13px;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #2c5530;
      box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
    }
  }
`;

const FilterTabs = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const FilterTab = styled.button`
  background: ${props => props.$active ? '#2c5530' : '#f5f7f6'};
  color: ${props => props.$active ? '#ffffff' : '#5e6e60'};
  border: 1px solid ${props => props.$active ? '#2c5530' : '#e6eae7'};
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;

  &:hover {
    background: ${props => props.$active ? '#234725' : '#eaf4ee'};
  }
`;

const TableCard = styled.div`
  background: #ffffff;
  border: 1px solid #e6eae7;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0,0,0,0.03);
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13px;

  th {
    background: #f8faf8;
    padding: 14px 16px;
    color: #556858;
    font-weight: 700;
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 1px solid #e6eae7;
  }

  td {
    padding: 14px 16px;
    border-bottom: 1px solid #f0f3f1;
    vertical-align: middle;
    color: #2b3b2d;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background: #fafcfa;
  }

  @media (max-width: 850px) {
    display: block;
    overflow-x: auto;
  }
`;

const UserAvatar = styled.div`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${props => props.$super ? 'linear-gradient(135deg, #fef3c7, #fde68a)' : '#eaf4ee'};
  color: ${props => props.$super ? '#92400e' : '#2c5530'};
  border: 1px solid ${props => props.$super ? '#fcd34d' : '#cfe3d4'};
  display: grid;
  place-items: center;
  font-weight: 800;
  font-size: 14px;
  flex-shrink: 0;
`;

const UserMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;

  .text {
    display: flex;
    flex-direction: column;

    .name {
      font-weight: 700;
      color: #1a331f;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .email {
      font-size: 12px;
      color: #718374;
    }
  }
`;

const RoleBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;

  ${props => props.$role === 'superadmin' ? `
    background: #fef3c7;
    color: #92400e;
    border: 1px solid #fde68a;
  ` : `
    background: #eaf4ee;
    color: #2c5530;
    border: 1px solid #cfe3d4;
  `}
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 11.5px;
  font-weight: 600;

  ${props => props.$enabled ? `
    background: #dcfce7;
    color: #166534;
    border: 1px solid #bbf7d0;
  ` : `
    background: #fee2e2;
    color: #991b1b;
    border: 1px solid #fecaca;
  `}
`;

const ActionButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;

  ${props => props.$variant === 'toggle-role' && `
    background: #fef9c3;
    color: #854d0e;
    border-color: #fde047;
    &:hover { background: #fef08a; }
  `}

  ${props => props.$variant === 'toggle-status' && `
    background: ${props.$enabled ? '#fee2e2' : '#dcfce7'};
    color: ${props.$enabled ? '#991b1b' : '#166534'};
    border-color: ${props.$enabled ? '#fecaca' : '#bbf7d0'};
    &:hover { opacity: 0.85; }
  `}

  ${props => props.$variant === 'delete' && `
    background: #ffffff;
    color: #dc2626;
    border-color: #fecaca;
    &:hover { background: #fee2e2; }
  `}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/* Modal Styles */
const ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 18, 0.6);
  backdrop-filter: blur(4px);
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

const ModalCard = styled.div`
  background: #ffffff;
  border-radius: 16px;
  max-width: 520px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  overflow: hidden;
  animation: scaleIn 0.2s ease-out;

  @keyframes scaleIn {
    from { opacity: 0; transform: scale(0.96); }
    to { opacity: 1; transform: scale(1); }
  }
`;

const ModalHeader = styled.div`
  padding: 18px 24px;
  border-bottom: 1px solid #e6eae7;
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 800;
    color: #1a331f;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  button {
    background: none;
    border: none;
    color: #6b7c6d;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    &:hover { background: #f5f7f6; color: #1a331f; }
  }
`;

const ModalBody = styled.form`
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 12.5px;
    font-weight: 700;
    color: #2c5530;
  }

  input, select, textarea {
    width: 100%;
    box-sizing: border-box;
    padding: 10px 12px;
    border: 1.5px solid #dce2dd;
    border-radius: 8px;
    font-size: 13.5px;
    outline: none;
    transition: all 0.2s;

    &:focus {
      border-color: #2c5530;
      box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
    }
  }

  .hint {
    font-size: 11.5px;
    color: #718374;
    line-height: 1.4;
  }
`;

const RoleOptionGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

const RoleOptionCard = styled.div`
  border: 2px solid ${props => props.$selected ? '#2c5530' : '#e6eae7'};
  background: ${props => props.$selected ? '#f0fdf4' : '#ffffff'};
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s;

  .role-title {
    font-weight: 800;
    font-size: 13px;
    color: ${props => props.$selected ? '#166534' : '#2b3b2d'};
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 4px;
  }

  .role-desc {
    font-size: 11px;
    color: #6b7c6d;
    line-height: 1.35;
  }
`;

const ModalFooter = styled.div`
  padding: 16px 24px;
  background: #f8faf8;
  border-top: 1px solid #e6eae7;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const SecondaryButton = styled.button`
  background: #ffffff;
  border: 1px solid #dce2dd;
  color: #556858;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f5f7f6;
  }
`;

const EmptyState = styled.div`
  padding: 48px 24px;
  text-align: center;
  color: #6b7c6d;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  svg {
    color: #a3b3a6;
  }

  h4 {
    margin: 0;
    font-size: 16px;
    color: #2b3b2d;
  }

  p {
    margin: 0;
    font-size: 13px;
    max-width: 380px;
  }
`;

export default function AdminsManager() {
  const { user: currentUser } = useAdminAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all'); // 'all', 'superadmin', 'admin', 'active', 'inactive'
  
  // Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    uid: '',
    displayName: '',
    role: 'admin',
    enabled: true
  });
  const [submitting, setSubmitting] = useState(false);
  const [lookingUpUser, setLookingUpUser] = useState(false);

  // Charger tous les admins depuis Firestore (avec déduplication par email)
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, 'admins'));
      const byEmail = new Map();

      snap.forEach(docSnap => {
        const data = docSnap.data();
        const emailKey = (data.email || docSnap.id).toLowerCase().trim();
        const existing = byEmail.get(emailKey);

        // Si pas encore vu, ou si le nouveau document a un vrai UID (ne commence pas par 'admin_')
        if (!existing || (!docSnap.id.startsWith('admin_') && existing.id.startsWith('admin_'))) {
          byEmail.set(emailKey, {
            id: docSnap.id,
            ...data
          });
        }
      });

      setAdmins(Array.from(byEmail.values()));
    } catch (err) {
      console.error('Erreur chargement admins:', err);
      toast.error('Erreur lors du chargement des administrateurs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Recherche automatique de l'UID d'un utilisateur par son email
  const handleEmailBlur = async () => {
    const emailToSearch = (formData.email || '').trim().toLowerCase();
    if (!emailToSearch || !emailToSearch.includes('@')) return;

    try {
      setLookingUpUser(true);
      // Chercher dans la collection users
      const q = query(collection(db, 'users'), where('email', '==', emailToSearch));
      const querySnap = await getDocs(q);
      
      if (!querySnap.empty) {
        const foundUser = querySnap.docs[0];
        const uData = foundUser.data();
        setFormData(prev => ({
          ...prev,
          uid: foundUser.id,
          displayName: prev.displayName || uData.displayName || `${uData.firstName || ''} ${uData.lastName || ''}`.trim()
        }));
        toast.success(`Utilisateur trouvé : ${uData.displayName || emailToSearch}`);
      }
    } catch (e) {
      console.warn('User lookup info:', e);
    } finally {
      setLookingUpUser(false);
    }
  };

  // Création / Ajout d'un admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    const email = (formData.email || '').trim().toLowerCase();
    let uid = (formData.uid || '').trim();

    if (!email || !email.includes('@')) {
      toast.error('Veuillez saisir une adresse email valide');
      return;
    }

    // Si aucun UID n'est fourni, on cherche dans 'users'
    if (!uid) {
      try {
        const q = query(collection(db, 'users'), where('email', '==', email));
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
          uid = querySnap.docs[0].id;
        } else {
          uid = `admin_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
        }
      } catch (err) {
        uid = `admin_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      }
    }

    try {
      setSubmitting(true);
      const emailDocId = `admin_${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
      
      const newAdminData = {
        uid: uid,
        email: email,
        displayName: formData.displayName.trim() || email.split('@')[0],
        role: formData.role, // 'superadmin' | 'admin'
        enabled: formData.enabled,
        createdAt: serverTimestamp(),
        createdBy: currentUser?.email || 'superadmin'
      };

      // Enregistrer sous l'UID
      await setDoc(doc(db, 'admins', uid), newAdminData, { merge: true });

      // Enregistrer également sous l'emailDocId si différent pour une compatibilité totale
      if (emailDocId !== uid) {
        try {
          await setDoc(doc(db, 'admins', emailDocId), newAdminData, { merge: true });
        } catch {}
      }

      toast.success(`L'administrateur ${email} a été ajouté avec succès !`);
      
      setIsAddModalOpen(false);
      setFormData({
        email: '',
        uid: '',
        displayName: '',
        role: 'admin',
        enabled: true
      });
      fetchAdmins();
    } catch (err) {
      console.error('Erreur ajout admin:', err);
      toast.error(err.message || 'Erreur lors de la création de l\'administrateur');
    } finally {
      setSubmitting(false);
    }
  };

  // Basculer le rôle (Super Admin <-> Admin)
  const handleToggleRole = async (admin) => {
    const currentRole = admin.role === 'superadmin' || admin.role === 'super_admin' ? 'superadmin' : 'admin';
    const newRole = currentRole === 'superadmin' ? 'admin' : 'superadmin';
    
    // Empêcher de rétrograder le dernier superadmin ou soi-même s'il n'y en a qu'un
    if (currentRole === 'superadmin') {
      const superAdminsCount = admins.filter(a => (a.role === 'superadmin' || a.role === 'super_admin') && (a.enabled === undefined || a.enabled === true)).length;
      if (superAdminsCount <= 1) {
        toast.error('Impossible de rétrograder le dernier Super Administrateur actif.');
        return;
      }
    }

    try {
      await updateDoc(doc(db, 'admins', admin.id), { role: newRole });
      if (admin.email) {
        const emailDocId = `admin_${admin.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}`;
        if (emailDocId !== admin.id) {
          try { await updateDoc(doc(db, 'admins', emailDocId), { role: newRole }); } catch {}
        }
      }
      toast.success(`Rôle mis à jour : ${admin.email} est désormais ${newRole === 'superadmin' ? 'Super Admin' : 'Admin standard'}`);
      fetchAdmins();
    } catch (err) {
      console.error('Erreur changement de rôle:', err);
      toast.error('Erreur lors du changement de rôle');
    }
  };

  // Activer / Désactiver un compte admin
  const handleToggleStatus = async (admin) => {
    const currentEnabled = admin.enabled === undefined ? true : admin.enabled;
    const newStatus = !currentEnabled;

    if (admin.id === currentUser?.uid && !newStatus) {
      toast.error('Vous ne pouvez pas désactiver votre propre compte administrateur en cours d\'utilisation.');
      return;
    }

    try {
      await updateDoc(doc(db, 'admins', admin.id), { enabled: newStatus });
      if (admin.email) {
        const emailDocId = `admin_${admin.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}`;
        if (emailDocId !== admin.id) {
          try { await updateDoc(doc(db, 'admins', emailDocId), { enabled: newStatus }); } catch {}
        }
      }
      toast.success(`Compte ${admin.email} ${newStatus ? 'activé' : 'désactivé'}`);
      fetchAdmins();
    } catch (err) {
      console.error('Erreur changement statut:', err);
      toast.error('Erreur lors de la mise à jour du statut');
    }
  };

  // Supprimer un administrateur
  const handleDeleteAdmin = async (admin) => {
    if (admin.id === currentUser?.uid) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte Super Admin.');
      return;
    }

    const confirm = window.confirm(`Êtes-vous sûr de vouloir révoquer définitivement les accès administrateur de ${admin.email} ?`);
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'admins', admin.id));
      if (admin.email) {
        const emailDocId = `admin_${admin.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '_')}`;
        if (emailDocId !== admin.id) {
          try { await deleteDoc(doc(db, 'admins', emailDocId)); } catch {}
        }
      }
      toast.success(`Accès révoqué pour ${admin.email}`);
      fetchAdmins();
    } catch (err) {
      console.error('Erreur suppression admin:', err);
      toast.error('Erreur lors de la révocation de l\'accès');
    }
  };

  // Filtrage
  const filteredAdmins = admins.filter(admin => {
    const isSuper = admin.role === 'superadmin' || admin.role === 'super_admin' || !admin.role;
    const isEnabled = admin.enabled === undefined || admin.enabled === true;

    // Filtre texte
    const q = search.toLowerCase().trim();
    const matchSearch = !q || 
      (admin.email && admin.email.toLowerCase().includes(q)) ||
      (admin.displayName && admin.displayName.toLowerCase().includes(q)) ||
      (admin.id && admin.id.toLowerCase().includes(q));

    if (!matchSearch) return false;

    // Filtre rôle / statut
    if (filterRole === 'superadmin') return isSuper;
    if (filterRole === 'admin') return !isSuper;
    if (filterRole === 'active') return isEnabled;
    if (filterRole === 'inactive') return !isEnabled;

    return true;
  });

  // Statistiques
  const totalCount = admins.length;
  const superCount = admins.filter(a => a.role === 'superadmin' || a.role === 'super_admin' || !a.role).length;
  const standardCount = totalCount - superCount;
  const activeCount = admins.filter(a => a.enabled === undefined || a.enabled === true).length;

  return (
    <Page>
      <Header>
        <HeaderLeft>
          <TitleRow>
            <Title>Gestion des Administrateurs</Title>
            <SuperBadge>
              <FiShield size={13} />
              Réservé Super Admin
            </SuperBadge>
          </TitleRow>
          <Subtitle>
            Gérez les rôles, permissions et contrôlez l'accès au catalogue, au contenu et aux paiements.
          </Subtitle>
        </HeaderLeft>

        <HeaderActions>
          <RefreshButton onClick={fetchAdmins} title="Actualiser la liste">
            <FiRefreshCw size={16} />
          </RefreshButton>
          <PrimaryButton onClick={() => setIsAddModalOpen(true)}>
            <FiUserPlus size={16} />
            Ajouter un administrateur
          </PrimaryButton>
        </HeaderActions>
      </Header>

      {/* Bannière explicative */}
      <NoticeBox>
        <FiInfo size={20} />
        <div>
          <strong>Règle de sécurité des accès :</strong> Seuls les <strong>Super Admins</strong> ont accès à la section <em>« CONTENU »</em> (Gestion des images, Paramètres du site, Moyens de paiement) ainsi qu'à cette page de gestion des administrateurs. Les <strong>Admins standards</strong> ont un accès restreint (Tableau de bord, Commandes, Utilisateurs et Paniers).
        </div>
      </NoticeBox>

      {/* Cartes de statistiques */}
      <StatsGrid>
        <StatCard>
          <StatIcon $bg="#eaf4ee" $color="#2c5530">
            <FiUserCheck size={22} />
          </StatIcon>
          <StatInfo>
            <span className="label">Total Administrateurs</span>
            <span className="value">{totalCount}</span>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon $bg="#fef3c7" $color="#b45309">
            <FiShield size={22} />
          </StatIcon>
          <StatInfo>
            <span className="label">Super Admins</span>
            <span className="value">{superCount}</span>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon $bg="#f1f5f9" $color="#475569">
            <FiUser size={22} />
          </StatIcon>
          <StatInfo>
            <span className="label">Admins Standards</span>
            <span className="value">{standardCount}</span>
          </StatInfo>
        </StatCard>

        <StatCard>
          <StatIcon $bg="#dcfce7" $color="#15803d">
            <FiCheckCircle size={22} />
          </StatIcon>
          <StatInfo>
            <span className="label">Comptes Actifs</span>
            <span className="value">{activeCount}</span>
          </StatInfo>
        </StatCard>
      </StatsGrid>

      {/* Barre de recherche et filtres */}
      <ControlBar>
        <SearchInputWrapper>
          <FiSearch size={16} />
          <input
            type="text"
            placeholder="Rechercher par email, nom ou identifiant..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </SearchInputWrapper>

        <FilterTabs>
          <FilterTab $active={filterRole === 'all'} onClick={() => setFilterRole('all')}>
            Tous ({totalCount})
          </FilterTab>
          <FilterTab $active={filterRole === 'superadmin'} onClick={() => setFilterRole('superadmin')}>
            Super Admins ({superCount})
          </FilterTab>
          <FilterTab $active={filterRole === 'admin'} onClick={() => setFilterRole('admin')}>
            Admins standards ({standardCount})
          </FilterTab>
          <FilterTab $active={filterRole === 'active'} onClick={() => setFilterRole('active')}>
            Actifs ({activeCount})
          </FilterTab>
          <FilterTab $active={filterRole === 'inactive'} onClick={() => setFilterRole('inactive')}>
            Inactifs ({totalCount - activeCount})
          </FilterTab>
        </FilterTabs>
      </ControlBar>

      {/* Tableau des administrateurs */}
      <TableCard>
        {loading ? (
          <EmptyState>
            <FiRefreshCw size={28} style={{ animation: 'spin 1s linear infinite' }} />
            <h4>Chargement des administrateurs...</h4>
          </EmptyState>
        ) : filteredAdmins.length === 0 ? (
          <EmptyState>
            <FiAlertTriangle size={32} />
            <h4>Aucun administrateur trouvé</h4>
            <p>Essayez de modifier vos critères de recherche ou ajoutez un nouvel administrateur.</p>
          </EmptyState>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Administrateur</th>
                <th>Rôle & Accès</th>
                <th>Statut</th>
                <th>UID Firestore</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAdmins.map((admin) => {
                const isSuper = admin.role === 'superadmin' || admin.role === 'super_admin' || !admin.role;
                const isEnabled = admin.enabled === undefined || admin.enabled === true;
                const isMe = admin.id === currentUser?.uid;
                const initials = (admin.displayName || admin.email || 'A')
                  .substring(0, 2)
                  .toUpperCase();

                return (
                  <tr key={admin.id}>
                    <td>
                      <UserMeta>
                        <UserAvatar $super={isSuper}>
                          {initials}
                        </UserAvatar>
                        <div className="text">
                          <div className="name">
                            {admin.displayName || 'Administrateur'}
                            {isMe && <span style={{ color: '#2c5530', fontSize: 11, fontWeight: 700 }}>(Vous)</span>}
                          </div>
                          <div className="email">{admin.email}</div>
                        </div>
                      </UserMeta>
                    </td>

                    <td>
                      <RoleBadge $role={isSuper ? 'superadmin' : 'admin'}>
                        {isSuper ? <FiShield size={12} /> : <FiUserCheck size={12} />}
                        {isSuper ? 'Super Admin' : 'Admin standard'}
                      </RoleBadge>
                    </td>

                    <td>
                      <StatusBadge $enabled={isEnabled}>
                        {isEnabled ? <FiCheckCircle size={12} /> : <FiXCircle size={12} />}
                        {isEnabled ? 'Actif' : 'Désactivé'}
                      </StatusBadge>
                    </td>

                    <td>
                      <code style={{ fontSize: 11.5, background: '#f5f7f6', padding: '2px 6px', borderRadius: 4, color: '#4b5563' }}>
                        {admin.id}
                      </code>
                    </td>

                    <td>
                      <ActionButtons style={{ justifyContent: 'flex-end' }}>
                        {/* Bouton de bascule de rôle */}
                        <ActionBtn 
                          $variant="toggle-role" 
                          onClick={() => handleToggleRole(admin)}
                          title={isSuper ? 'Rétrograder en Admin standard' : 'Promouvoir en Super Admin'}
                        >
                          <FiShield size={12} />
                          {isSuper ? 'Rétrograder Admin' : 'Promouvoir Super Admin'}
                        </ActionBtn>

                        {/* Bouton Activer/Désactiver */}
                        <ActionBtn 
                          $variant="toggle-status"
                          $enabled={isEnabled}
                          disabled={isMe && isEnabled}
                          onClick={() => handleToggleStatus(admin)}
                          title={isEnabled ? 'Désactiver le compte' : 'Activer le compte'}
                        >
                          {isEnabled ? <FiXCircle size={12} /> : <FiCheckCircle size={12} />}
                          {isEnabled ? 'Désactiver' : 'Activer'}
                        </ActionBtn>

                        {/* Bouton Supprimer */}
                        <ActionBtn 
                          $variant="delete" 
                          disabled={isMe}
                          onClick={() => handleDeleteAdmin(admin)}
                          title="Révoquer l'accès administrateur"
                        >
                          <FiTrash2 size={13} />
                        </ActionBtn>
                      </ActionButtons>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </TableCard>

      {/* Modal d'ajout d'un administrateur */}
      {isAddModalOpen && (
        <ModalOverlay onClick={() => setIsAddModalOpen(false)}>
          <ModalCard onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <h3>
                <FiUserPlus size={20} color="#2c5530" />
                Nouvel Administrateur
              </h3>
              <button type="button" onClick={() => setIsAddModalOpen(false)}>
                <FiX size={20} />
              </button>
            </ModalHeader>

            <ModalBody onSubmit={handleAddAdmin}>
              <FormGroup>
                <label>Adresse E-mail du compte *</label>
                <input
                  type="email"
                  required
                  placeholder="ex: admin@mesbois.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  onBlur={handleEmailBlur}
                />
                <span className="hint">
                  {lookingUpUser ? 'Vérification du compte...' : 'L’adresse e-mail avec laquelle l’administrateur se connecte.'}
                </span>
              </FormGroup>

              <FormGroup>
                <label>Nom complet / Identifiant (Optionnel)</label>
                <input
                  type="text"
                  placeholder="ex: Marc Dupont"
                  value={formData.displayName}
                  onChange={e => setFormData({ ...formData, displayName: e.target.value })}
                />
              </FormGroup>

              <FormGroup>
                <label>Rôle & Droits d'accès *</label>
                <RoleOptionGrid>
                  <RoleOptionCard
                    $selected={formData.role === 'admin'}
                    onClick={() => setFormData({ ...formData, role: 'admin' })}
                  >
                    <div className="role-title">
                      <FiUserCheck size={14} />
                      Admin Standard
                    </div>
                    <div className="role-desc">
                      Accès aux Commandes, Clients, Paniers et Tableau de bord. Pas d'accès au Contenu ni aux Paiements.
                    </div>
                  </RoleOptionCard>

                  <RoleOptionCard
                    $selected={formData.role === 'superadmin'}
                    onClick={() => setFormData({ ...formData, role: 'superadmin' })}
                  >
                    <div className="role-title" style={{ color: '#92400e' }}>
                      <FiShield size={14} />
                      Super Admin
                    </div>
                    <div className="role-desc">
                      Accès total : Images, Paramètres du site, RIB/Paiements et Gestion des Administrateurs.
                    </div>
                  </RoleOptionCard>
                </RoleOptionGrid>
              </FormGroup>

              <FormGroup>
                <label>Identifiant Firebase UID (Optionnel)</label>
                <input
                  type="text"
                  placeholder="UID Firebase si connu (auto-détecté si le compte existe)"
                  value={formData.uid}
                  onChange={e => setFormData({ ...formData, uid: e.target.value })}
                />
                <span className="hint">
                  Si laissé vide, l'UID sera automatiquement associé lors de sa connexion.
                </span>
              </FormGroup>

              <ModalFooter style={{ margin: '0 -24px -24px -24px' }}>
                <SecondaryButton type="button" onClick={() => setIsAddModalOpen(false)}>
                  Annuler
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={submitting}>
                  {submitting ? 'Enregistrement...' : 'Enregistrer l’administrateur'}
                </PrimaryButton>
              </ModalFooter>
            </ModalBody>
          </ModalCard>
        </ModalOverlay>
      )}
    </Page>
  );
}
