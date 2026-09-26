import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiEye, FiEyeOff, FiMail, FiLock, FiUser, FiPhone, FiMapPin } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { createUser } from '../firebase/auth';
import toast from 'react-hot-toast';
import { sendEmailVerification } from 'firebase/auth';
import { useTranslation } from 'react-i18next';

const RegisterContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const RegisterCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 500px;
  
  @media (max-width: 480px) {
    padding: 24px;
    border-radius: 10px;
  }
`;

const RegisterTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c5530;
  text-align: center;
  margin-bottom: 30px;
  
  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: 20px;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 56px 12px 72px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #2c5530;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
    padding: 12px 52px 12px 64px;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
`;

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  padding: 4px;
`;

const Button = styled.button`
  background: #2c5530;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #1e3a22;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 20px;
  color: #666;
  
  a {
    color: #2c5530;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  font-size: 14px;
  text-align: center;
`;

const PasswordRequirements = styled.div`
  font-size: 12px;
  color: #666;
  margin-top: 5px;
  
  ul {
    margin: 5px 0;
    padding-left: 20px;
  }
`;

const Register = () => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'France'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  const mapAuthError = (raw) => {
    if (!raw) return t('register.error_occurred', 'Une erreur est survenue');
    const msg = String(raw).toLowerCase();
    if (msg.includes('auth/email-already-in-use')) {
      return t('register.email_in_use', "Cette adresse e‑mail est déjà utilisée. Connectez‑vous ou réinitialisez votre mot de passe.");
    }
    if (msg.includes('auth/invalid-email')) {
      return t('register.invalid_email', "Adresse e‑mail invalide.");
    }
    if (msg.includes('auth/weak-password')) {
      return t('register.weak_password', "Mot de passe trop faible (minimum 6 caractères).");
    }
    if (msg.includes('network') || msg.includes('request-failed')) {
      return t('register.network_error', "Problème de réseau. Veuillez réessayer.");
    }
    return t('register.error_occurred', 'Une erreur est survenue');
  };

  // Rediriger si déjà connecté (uniquement quand on est sur la page /register)
  React.useEffect(() => {
    const path = typeof window !== 'undefined' ? window.location.pathname : '';
    if (user && (path === '/register' || path.endsWith('/register'))) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError(t('register.passwords_dont_match', 'Les mots de passe ne correspondent pas'));
      return false;
    }
    
    if (formData.password.length < 6) {
      setError(t('register.password_too_short', 'Le mot de passe doit contenir au moins 6 caractères'));
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const displayName = `${(formData.firstName || '').trim()} ${(formData.lastName || '').trim()}`.trim();
      const result = await createUser(formData.email, formData.password, {
        displayName: displayName || undefined,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
        country: formData.country
      });
      
      if (result.success) {
        try {
          await sendEmailVerification(result.user, {
            url: 'https://jeferco.boisdechauffages.com/auth/action',
            handleCodeInApp: true
          });
          toast.success(t('register.account_created_verify', "Compte créé ! Vérifiez votre email pour valider votre adresse."));
        } catch (_) {
          toast.success(t('register.account_created', 'Compte créé avec succès !'));
        }
        navigate('/dashboard', { replace: true });
      } else {
        setError(mapAuthError(result.error));
      }
    } catch (err) {
      setError(mapAuthError(err?.message || String(err)));
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        <RegisterTitle>{t('register.title', 'Créer un compte')}</RegisterTitle>
        
        {error && (
          <>
            <ErrorMessage>{error}</ErrorMessage>
            {error.includes(t('register.email_in_use_check', 'déjà utilisée')) && (
              <div style={{ textAlign: 'center', marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 8,
                    border: '1px solid #e0e0e0',
                    background: '#2c5530',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {t('register.go_to_login', 'Aller à la connexion')}
                </button>
              </div>
            )}
          </>
        )}
        
        <Form onSubmit={handleSubmit}>
          <FormRow>
            <InputGroup>
              <InputIcon>
                <FiUser size={20} />
              </InputIcon>
              <Input
                type="text"
                name="firstName"
                placeholder={t('register.first_name', 'Prénom')}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </InputGroup>
            
            <InputGroup>
              <InputIcon>
                <FiUser size={20} />
              </InputIcon>
              <Input
                type="text"
                name="lastName"
                placeholder={t('register.last_name', 'Nom')}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </FormRow>
          
          <FormRow>
            <InputGroup>
              <InputIcon>
                <FiPhone size={20} />
              </InputIcon>
              <Input
                type="tel"
                name="phone"
                placeholder={t('register.phone', 'Téléphone')}
                value={formData.phone}
                onChange={handleChange}
              />
            </InputGroup>
            
            <InputGroup>
              <InputIcon>
                <FiMail size={20} />
              </InputIcon>
              <Input
                type="email"
                name="email"
                placeholder={t('register.email', 'Adresse email')}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </FormRow>
          
          <FormRow>
            <InputGroup>
              <InputIcon>
                <FiLock size={20} />
              </InputIcon>
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder={t('register.password', 'Mot de passe')}
                value={formData.password}
                onChange={handleChange}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </PasswordToggle>
            </InputGroup>
            
            <InputGroup>
              <InputIcon>
                <FiLock size={20} />
              </InputIcon>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder={t('register.confirm_password', 'Confirmer le mot de passe')}
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <PasswordToggle
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </PasswordToggle>
            </InputGroup>
          </FormRow>
          
          <PasswordRequirements>
            {t('register.password_requirements', 'Le mot de passe doit contenir au moins 6 caractères')}
          </PasswordRequirements>
          
          <InputGroup>
            <InputIcon>
              <FiMapPin size={20} />
            </InputIcon>
            <Input
              type="text"
              name="address"
              placeholder={t('register.address', 'Adresse')}
              value={formData.address}
              onChange={handleChange}
            />
          </InputGroup>
          <div style={{ fontSize: 12, color: '#dc2626', marginTop: 4, fontWeight: 600 }}>
            {t('register.address_notice', 'Cette adresse sera utilisée comme adresse de livraison pour vos commandes. Vous pourrez la modifier plus tard dans votre espace client.')}
          </div>
          
          <FormRow>
            <InputGroup>
              <Input
                type="text"
                name="city"
                placeholder={t('register.city', 'Ville')}
                value={formData.city}
                onChange={handleChange}
              />
            </InputGroup>
            
            <InputGroup>
              <Input
                type="text"
                name="postalCode"
                placeholder={t('register.postal_code', 'Code postal')}
                value={formData.postalCode}
                onChange={handleChange}
              />
            </InputGroup>
          </FormRow>
          
          <Button type="submit" disabled={loading}>
            {loading ? t('register.loading', 'Création du compte...') : t('register.submit', 'Créer le compte')}
          </Button>
        </Form>
        
        <LoginLink>
          {t('register.already_have_account', 'Déjà un compte ?')} <Link to="/login">{t('register.login', 'Se connecter')}</Link>
        </LoginLink>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;

