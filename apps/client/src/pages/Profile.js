import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiUser, FiMail, FiPhone, FiMapPin, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { signOutUser, updateUserData } from '../firebase/auth';
import toast from 'react-hot-toast';
import DashboardLayout from '../components/Layout/DashboardLayout';

const ProfileContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  @media (max-width: 600px) {
    padding: 20px 12px 28px;
  }
`;

const ProfileHeader = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  margin-bottom: 30px;
  @media (max-width: 600px) {
    padding: 18px 14px;
    margin-bottom: 20px;
  }
`;

const ProfileTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  @media (max-width: 600px) {
    font-size: 22px;
    margin-bottom: 16px;
  }
`;

const ProfileInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  @media (max-width: 600px) {
    gap: 14px;
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #666;
  font-size: 15px;
  flex-wrap: nowrap;
  min-width: 0;
  
  svg {
    color: #2c5530;
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const EditButton = styled.button`
  background: #2c5530;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  
  &:hover {
    background: #1e3a22;
  }
`;

const EditForm = styled.form`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  @media (max-width: 600px) {
    padding: 18px 14px;
    margin-top: 10px;
  }
`;

const FormTitle = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
  @media (max-width: 600px) { grid-template-columns: 1fr; gap: 14px; }
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #2c5530;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  background: white;
  
  &:focus {
    border-color: #2c5530;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const SaveButton = styled.button`
  background: #27ae60;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #219a52;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const CancelButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #c0392b;
  }
`;

const LogoutButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 24px;
  width: 100%;
  text-align: center;
  @media (max-width: 600px) {
    padding: 12px 16px;
  }
  
  &:hover {
    background: #c0392b;
  }
`;

const Profile = () => {
  const { user, userData, setUserData } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  });

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
        country: userData.country || 'France'
      });
    }
  }, [user, userData, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!user) {
        throw new Error('Utilisateur non connecté');
      }

      const res = await updateUserData(user.uid, formData);
      if (!res.success) {
        throw new Error(res.error || 'Erreur lors de la mise à jour');
      }

      if (res.data) {
        setUserData(res.data);
      }

      toast.success('Profil mis à jour avec succès !');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutUser();
      toast.success('Déconnexion réussie');
      navigate('/');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <DashboardLayout>
      <ProfileContainer>
      <ProfileHeader>
        <ProfileTitle>
          <FiUser size={28} />
          Mon Profil
        </ProfileTitle>
        
        <ProfileInfo>
          <InfoItem>
            <FiUser size={20} />
            <span>{userData?.displayName || 'Non renseigné'}</span>
          </InfoItem>
          <InfoItem>
            <FiMail size={20} />
            <span>{user.email}</span>
          </InfoItem>
          <InfoItem>
            <FiPhone size={20} />
            <span>{userData?.phone || 'Non renseigné'}</span>
          </InfoItem>
          <InfoItem>
            <FiMapPin size={20} />
            <span>
              {userData?.address && userData?.city 
                ? `${userData.address}, ${userData.city}` 
                : 'Adresse non renseignée'
              }
            </span>
          </InfoItem>
        </ProfileInfo>
        
        <EditButton onClick={() => setIsEditing(true)}>
          <FiEdit3 size={16} />
          Modifier le profil
        </EditButton>
      </ProfileHeader>

      {isEditing && (
        <EditForm onSubmit={handleSave}>
          <FormTitle>
            <FiEdit3 size={24} />
            Modifier mes informations
          </FormTitle>
          
          <FormGrid>
            <InputGroup>
              <InputIcon>
                <FiUser size={20} />
              </InputIcon>
              <Input
                type="text"
                name="displayName"
                placeholder="Nom complet"
                value={formData.displayName}
                onChange={handleChange}
                required
              />
            </InputGroup>
            
            <InputGroup>
              <InputIcon>
                <FiPhone size={20} />
              </InputIcon>
              <Input
                type="tel"
                name="phone"
                placeholder="Téléphone"
                value={formData.phone}
                onChange={handleChange}
              />
            </InputGroup>
          </FormGrid>
          
          <InputGroup>
            <InputIcon>
              <FiMapPin size={20} />
            </InputIcon>
            <Input
              type="text"
              name="address"
              placeholder="Adresse"
              value={formData.address}
              onChange={handleChange}
            />
          </InputGroup>
          
          <FormGrid>
            <InputGroup>
              <Input
                type="text"
                name="city"
                placeholder="Ville"
                value={formData.city}
                onChange={handleChange}
              />
            </InputGroup>
            
            <InputGroup>
              <Input
                type="text"
                name="postalCode"
                placeholder="Code postal"
                value={formData.postalCode}
                onChange={handleChange}
              />
            </InputGroup>
          </FormGrid>
          
          <InputGroup>
            <Select
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="France">France</option>
              <option value="Belgique">Belgique</option>
              <option value="Suisse">Suisse</option>
              <option value="Luxembourg">Luxembourg</option>
            </Select>
          </InputGroup>
          
          <ButtonGroup>
            <CancelButton type="button" onClick={() => setIsEditing(false)}>
              <FiX size={16} />
              Annuler
            </CancelButton>
            <SaveButton type="submit" disabled={loading}>
              <FiSave size={16} />
              {loading ? 'Sauvegarde...' : 'Sauvegarder'}
            </SaveButton>
          </ButtonGroup>
        </EditForm>
      )}

      <LogoutButton onClick={handleLogout}>
        Se déconnecter
      </LogoutButton>
      </ProfileContainer>
    </DashboardLayout>
  );
};

export default Profile;

