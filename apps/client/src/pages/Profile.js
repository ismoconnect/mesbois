import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiSave, FiX,
  FiLock, FiBell, FiEye, FiEyeOff, FiLogOut, FiTruck
} from 'react-icons/fi';
import { FaShieldAlt } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser, updateUserData, changePassword } from '../firebase/auth';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/Layout/DashboardLayout';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 0 0 36px 0;
  word-break: break-word;
  overflow-wrap: break-word;
  @media (max-width: 600px) {
    padding: 0 4px 28px 4px;
  }
`;

const ProfileHero = styled.div`
  background: linear-gradient(135deg, #1b3820 0%, #2c5530 70%, #3e7343 100%);
  color: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: 0 8px 24px rgba(27, 56, 32, 0.15);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    padding: 18px 16px;
    border-radius: 14px;
  }
`;

const HeroLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const AvatarCircle = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  border: 2px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 800;
  color: #fff;
  flex-shrink: 0;
`;

const HeroDetails = styled.div`
  h1 {
    font-size: 22px;
    font-weight: 800;
    margin: 0 0 4px 0;
    color: #fff;
  }
  p {
    margin: 0;
    font-size: 13px;
    opacity: 0.9;
    display: flex;
    align-items: center;
    gap: 6px;
  }
`;

const ClientBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.25);
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #f1f8f3;
`;

const TabsNav = styled.div`
  display: flex;
  background: #f1f5f9;
  padding: 4px;
  border-radius: 12px;
  margin-bottom: 20px;
  gap: 4px;
`;

const TabButton = styled.button`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${props => props.$active ? '#fff' : 'transparent'};
  color: ${props => props.$active ? '#2c5530' : '#64748b'};
  box-shadow: ${props => props.$active ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'};

  &:hover {
    color: #2c5530;
  }

  @media (max-width: 600px) {
    font-size: 13px;
    padding: 9px 8px;
    gap: 6px;
  }
`;

const Card = styled.div`
  background: #fff;
  border-radius: 14px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  padding: 24px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    padding: 16px;
    border-radius: 12px;
  }
`;

const CardTitle = styled.h2`
  font-size: 17px;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
`;

const EditToggleBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #dcfce7;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
`;

const InfoBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &.full {
    grid-column: 1 / -1;
  }

  .lbl {
    font-size: 11.5px;
    color: #64748b;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .val {
    font-size: 14px;
    font-weight: 700;
    color: #0f172a;
    word-break: break-word;
  }

  .sub {
    font-size: 12px;
    color: #94a3b8;
  }
`;

const ForkliftBanner = styled.div`
  background: #fffbeb;
  border: 1px solid #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 10px;
  padding: 12px 14px;
  margin-top: 14px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 13px;
  color: #92400e;
  line-height: 1.45;
`;

const FormGroup = styled.div`
  margin-bottom: 14px;

  label {
    display: block;
    font-size: 12.5px;
    font-weight: 700;
    color: #334155;
    margin-bottom: 5px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  svg.lead-icon {
    position: absolute;
    left: 12px;
    color: #94a3b8;
    pointer-events: none;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px 10px ${props => props.$hasIcon ? '38px' : '12px'};
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #2c5530;
    box-shadow: 0 0 0 2px rgba(44, 85, 48, 0.12);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  background: white;

  &:focus {
    border-color: #2c5530;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 13.5px;
  color: #0f172a;
  outline: none;
  min-height: 70px;
  font-family: inherit;
  resize: vertical;

  &:focus {
    border-color: #2c5530;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 18px;

  @media (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

const PrimaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #2c5530;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1e3a22;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const SecondaryBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #fff;
  color: #475569;
  border: 1px solid #cbd5e1;
  padding: 10px 18px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f8fafc;
  }
`;

const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 0;
  border-bottom: 1px solid #f1f5f9;

  &:last-child {
    border-bottom: none;
  }
`;

const Toggle = styled.button`
  min-width: 48px;
  width: 48px;
  height: 26px;
  border-radius: 999px;
  border: none;
  background: ${props => props.$active ? '#22c55e' : '#cbd5e1'};
  position: relative;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    top: 3px;
    left: ${props => props.$active ? '25px' : '3px'};
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
`;

const EyeBtn = styled.button`
  position: absolute;
  right: 10px;
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;

  &:hover {
    color: #475569;
  }
`;

const LogoutBox = styled.div`
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
`;

const LogoutBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
  padding: 9px 16px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #fee2e2;
  }
`;

const Profile = ({ defaultTab }) => {
  const { user, userData, setUserData } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialTab = defaultTab || (location.pathname.includes('/settings') ? 'security' : 'details');
  const [activeTab, setActiveTab] = useState(initialTab);

  const [isEditing, setIsEditing] = useState(false);
  const [savingDetails, setSavingDetails] = useState(false);

  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France',
    accessNotes: ''
  });

  const [emailOrderUpdates, setEmailOrderUpdates] = useState(true);
  const [emailPromotions, setEmailPromotions] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (userData) {
      setFormData({
        displayName: userData.displayName || '',
        phone: userData.phone || '',
        address: userData.address || '',
        city: userData.city || '',
        postalCode: userData.postalCode || '',
        country: userData.country || 'France',
        accessNotes: userData.accessNotes || ''
      });

      if (userData.preferences) {
        setEmailOrderUpdates(userData.preferences.emailOrderUpdates !== false);
        setEmailPromotions(!!userData.preferences.emailPromotions);
      }
    }
  }, [user, userData, navigate]);

  const handleFieldChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSavingDetails(true);

    try {
      const res = await updateUserData(user.uid, formData);
      if (!res.success) throw new Error(res.error || 'Erreur');

      if (res.data) setUserData(res.data);
      toast.success('Vos coordonnées ont été enregistrées avec succès !');
      setIsEditing(false);
    } catch {
      toast.error('Erreur lors de la sauvegarde du profil.');
    } finally {
      setSavingDetails(false);
    }
  };

  const handleSavePreferences = async (updates, promos) => {
    if (!user) return;
    try {
      const res = await updateUserData(user.uid, {
        preferences: {
          emailOrderUpdates: updates,
          emailPromotions: promos
        }
      });
      if (res.success && res.data) {
        setUserData(res.data);
      }
      toast.success('Préférences enregistrées !');
    } catch {
      toast.error('Erreur lors de la mise à jour des préférences');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Merci de remplir tous les champs de mot de passe.');
      return;
    }

    if (newPassword.length < 6) {
      toast.error('Le nouveau mot de passe doit comporter au moins 6 caractères.');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas.');
      return;
    }

    setPasswordLoading(true);
    try {
      const res = await changePassword(currentPassword, newPassword);
      if (!res.success) throw new Error(res.error);

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Mot de passe modifié avec succès !');
    } catch {
      toast.error('Ancien mot de passe incorrect ou erreur.');
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success('Vous avez été déconnecté.');
      navigate('/');
    } catch {
      toast.error('Erreur de déconnexion.');
    }
  };

  if (!user) return null;

  const userInitials = (userData?.displayName || user.email || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <DashboardLayout>
      <Container>
        {/* Hero Card */}
        <ProfileHero>
          <HeroLeft>
            <AvatarCircle>{userInitials}</AvatarCircle>
            <HeroDetails>
              <h1>{userData?.displayName || 'Mon Profil Client'}</h1>
              <p>
                <FiMail size={13} /> {user.email}
              </p>
            </HeroDetails>
          </HeroLeft>
          <ClientBadge>
            <FaShieldAlt size={12} /> Compte Client Vérifié
          </ClientBadge>
        </ProfileHero>

        {/* Navigation Onglets */}
        <TabsNav>
          <TabButton
            $active={activeTab === 'details'}
            onClick={() => setActiveTab('details')}
          >
            <FiUser size={16} /> Coordonnées & Livraison
          </TabButton>
          <TabButton
            $active={activeTab === 'security'}
            onClick={() => setActiveTab('security')}
          >
            <FiLock size={16} /> Sécurité & Préférences
          </TabButton>
        </TabsNav>

        {/* ONGLET 1 : COORDONNÉES & LIVRAISON */}
        {activeTab === 'details' && (
          <>
            <Card>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiUser color="#2c5530" />
                  <span>Informations de contact & facturation</span>
                </div>
                {!isEditing && (
                  <EditToggleBtn onClick={() => setIsEditing(true)}>
                    <FiEdit3 size={13} /> Modifier
                  </EditToggleBtn>
                )}
              </CardTitle>

              {!isEditing ? (
                <>
                  <Grid>
                    <InfoBox>
                      <span className="lbl"><FiUser size={12} /> Nom & Prénom</span>
                      <span className="val">{userData?.displayName || 'Non renseigné'}</span>
                    </InfoBox>
                    <InfoBox>
                      <span className="lbl"><FiPhone size={12} /> Téléphone de livraison</span>
                      <span className="val">{userData?.phone || 'Non renseigné'}</span>
                      <span className="sub">Utilisé par le transporteur pour le créneau</span>
                    </InfoBox>
                    <InfoBox className="full">
                      <span className="lbl"><FiMapPin size={12} /> Adresse de dépose</span>
                      <span className="val">
                        {userData?.address
                          ? `${userData.address}, ${userData.postalCode || ''} ${userData.city || ''} (${userData.country || 'France'})`
                          : 'Aucune adresse enregistrée'
                        }
                      </span>
                    </InfoBox>
                    {userData?.accessNotes && (
                      <InfoBox className="full" style={{ background: '#f0fdf4', borderColor: '#bbf7d0' }}>
                        <span className="lbl" style={{ color: '#166534' }}><FiTruck size={12} /> Accès chariot tout-terrain</span>
                        <span className="val" style={{ color: '#166534' }}>{userData.accessNotes}</span>
                      </InfoBox>
                    )}
                  </Grid>

                  <ForkliftBanner>
                    <FiTruck size={20} style={{ flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <strong>Livraison par chariot embarqué tout-terrain :</strong> nos palettes de bois sont déposées directement au plus près de votre stockage (abri, garage, cour), sous réserve d'un passage suffisant (largeur minimale d'accès 2,20m).
                    </div>
                  </ForkliftBanner>
                </>
              ) : (
                <form onSubmit={handleSaveProfile}>
                  <Grid>
                    <FormGroup>
                      <label>Nom complet / Société</label>
                      <InputWrapper>
                        <FiUser className="lead-icon" size={16} />
                        <Input
                          $hasIcon
                          type="text"
                          name="displayName"
                          placeholder="Ex: Jean Dupont"
                          value={formData.displayName}
                          onChange={handleFieldChange}
                          required
                        />
                      </InputWrapper>
                    </FormGroup>

                    <FormGroup>
                      <label>Numéro de téléphone</label>
                      <InputWrapper>
                        <FiPhone className="lead-icon" size={16} />
                        <Input
                          $hasIcon
                          type="tel"
                          name="phone"
                          placeholder="Ex: 06 12 34 56 78"
                          value={formData.phone}
                          onChange={handleFieldChange}
                          required
                        />
                      </InputWrapper>
                    </FormGroup>

                    <FormGroup style={{ gridColumn: '1 / -1' }}>
                      <label>Adresse (Numéro et nom de rue)</label>
                      <InputWrapper>
                        <FiMapPin className="lead-icon" size={16} />
                        <Input
                          $hasIcon
                          type="text"
                          name="address"
                          placeholder="Ex: 15 rue des Chênes"
                          value={formData.address}
                          onChange={handleFieldChange}
                          required
                        />
                      </InputWrapper>
                    </FormGroup>

                    <FormGroup>
                      <label>Code Postal</label>
                      <Input
                        type="text"
                        name="postalCode"
                        placeholder="Ex: 67000"
                        value={formData.postalCode}
                        onChange={handleFieldChange}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Ville</label>
                      <Input
                        type="text"
                        name="city"
                        placeholder="Ex: Strasbourg"
                        value={formData.city}
                        onChange={handleFieldChange}
                        required
                      />
                    </FormGroup>

                    <FormGroup>
                      <label>Pays</label>
                      <Select
                        name="country"
                        value={formData.country}
                        onChange={handleFieldChange}
                      >
                        <option value="France">France</option>
                        <option value="Belgique">Belgique</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Suisse">Suisse</option>
                        <option value="Allemagne">Allemagne</option>
                      </Select>
                    </FormGroup>

                    <FormGroup style={{ gridColumn: '1 / -1' }}>
                      <label>Précisions d'accès pour le chariot embarqué (facultatif)</label>
                      <Textarea
                        name="accessNotes"
                        placeholder="Ex: Allée gravillonnée, portail de 3m, stockage devant le garage à gauche..."
                        value={formData.accessNotes}
                        onChange={handleFieldChange}
                      />
                    </FormGroup>
                  </Grid>

                  <ButtonRow>
                    <SecondaryBtn type="button" onClick={() => setIsEditing(false)}>
                      <FiX size={15} /> Annuler
                    </SecondaryBtn>
                    <PrimaryBtn type="submit" disabled={savingDetails}>
                      <FiSave size={15} />
                      {savingDetails ? 'Enregistrement…' : 'Enregistrer mes coordonnées'}
                    </PrimaryBtn>
                  </ButtonRow>
                </form>
              )}
            </Card>
          </>
        )}

        {/* ONGLET 2 : SÉCURITÉ & PRÉFÉRENCES */}
        {activeTab === 'security' && (
          <>
            {/* Préférences emails */}
            <Card>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiBell color="#2c5530" />
                  <span>Préférences de communication</span>
                </div>
              </CardTitle>

              <ToggleRow>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1f2937' }}>
                    Notifications de commande & livraison
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                    Recevez par email la confirmation de paiement et les alertes d'acheminement du camion.
                  </div>
                </div>
                <Toggle
                  type="button"
                  $active={emailOrderUpdates}
                  onClick={() => {
                    const newVal = !emailOrderUpdates;
                    setEmailOrderUpdates(newVal);
                    handleSavePreferences(newVal, emailPromotions);
                  }}
                />
              </ToggleRow>

              <ToggleRow>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '13.5px', color: '#1f2937' }}>
                    Offres spéciales & conseils de chauffage
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b', marginTop: '2px' }}>
                    Soyez informé des tarifs de saison morte et des conseils de stockage du bois.
                  </div>
                </div>
                <Toggle
                  type="button"
                  $active={emailPromotions}
                  onClick={() => {
                    const newVal = !emailPromotions;
                    setEmailPromotions(newVal);
                    handleSavePreferences(emailOrderUpdates, newVal);
                  }}
                />
              </ToggleRow>
            </Card>

            {/* Changement de mot de passe */}
            <Card>
              <CardTitle>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FiLock color="#2c5530" />
                  <span>Sécurité du compte & mot de passe</span>
                </div>
              </CardTitle>

              <form onSubmit={handleChangePassword} style={{ maxWidth: '440px' }}>
                <FormGroup>
                  <label>Mot de passe actuel</label>
                  <InputWrapper>
                    <Input
                      type={showCurrent ? 'text' : 'password'}
                      placeholder="Votre mot de passe actuel"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                    <EyeBtn
                      type="button"
                      onClick={() => setShowCurrent(!showCurrent)}
                      aria-label="Afficher/masquer"
                    >
                      {showCurrent ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </EyeBtn>
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <label>Nouveau mot de passe</label>
                  <InputWrapper>
                    <Input
                      type={showNew ? 'text' : 'password'}
                      placeholder="Minimum 6 caractères"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <EyeBtn
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      aria-label="Afficher/masquer"
                    >
                      {showNew ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </EyeBtn>
                  </InputWrapper>
                </FormGroup>

                <FormGroup>
                  <label>Confirmer le nouveau mot de passe</label>
                  <InputWrapper>
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Retapez le nouveau mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <EyeBtn
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      aria-label="Afficher/masquer"
                    >
                      {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                    </EyeBtn>
                  </InputWrapper>
                </FormGroup>

                <ButtonRow style={{ justifyContent: 'flex-start' }}>
                  <PrimaryBtn type="submit" disabled={passwordLoading}>
                    <FiLock size={15} />
                    {passwordLoading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
                  </PrimaryBtn>
                </ButtonRow>
              </form>

              <LogoutBox>
                <div style={{ fontSize: '13px', color: '#64748b' }}>
                  Session active sur cet appareil
                </div>
                <LogoutBtn onClick={handleLogout}>
                  <FiLogOut size={15} /> Se déconnecter de Brennholzkaufen
                </LogoutBtn>
              </LogoutBox>
            </Card>
          </>
        )}
      </Container>
    </DashboardLayout>
  );
};

export default Profile;
