import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiEye, FiEyeOff, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { signInUser, resetPassword } from '../firebase/auth';
import toast from 'react-hot-toast';

const LoginContainer = styled.div`
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
`;

const LoginCard = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
  
  @media (max-width: 480px) {
    padding: 24px;
    border-radius: 10px;
  }
`;

const LoginTitle = styled.h1`
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

const InputGroup = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  padding-top: 12px;
  padding-bottom: 12px;
  padding-left: ${(p) => (p.$withLeftIcon ? '56px' : '16px')};
  padding-right: ${(p) => (p.$withRightAction ? '56px' : '16px')};
  
  &:focus {
    border-color: #2c5530;
  }
  
  @media (max-width: 480px) {
    font-size: 15px;
    padding-left: ${(p) => (p.$withLeftIcon ? '52px' : '14px')};
    padding-right: ${(p) => (p.$withRightAction ? '52px' : '14px')};
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

const ForgotPassword = styled.button`
  background: none;
  border: none;
  color: #2c5530;
  cursor: pointer;
  font-size: 14px;
  text-align: center;
  text-decoration: underline;
  
  &:hover {
    color: #1e3a22;
  }
`;

const SignupLink = styled.div`
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

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = '/dashboard';

  // Rediriger si déjà connecté
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, from]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signInUser(formData.email, formData.password);
      
      if (result.success) {
        toast.success('Connexion réussie !');
        navigate('/dashboard', { replace: true });
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      toast.error('Veuillez entrer votre adresse email');
      return;
    }

    try {
      const result = await resetPassword(formData.email);
      if (result.success) {
        toast.success('Email de réinitialisation envoyé !');
      } else {
        toast.error(result.error);
      }
    } catch (err) {
      toast.error('Erreur lors de l\'envoi de l\'email');
    }
  };

  return (
    <LoginContainer>
      <LoginCard>
        <LoginTitle>Connexion</LoginTitle>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Form onSubmit={handleSubmit}>
          <InputGroup>
            <InputIcon>
              <FiMail size={20} />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Adresse email"
              value={formData.email}
              onChange={handleChange}
              required
              $withLeftIcon
            />
          </InputGroup>
          
          <InputGroup>
            <InputIcon>
              <FiLock size={20} />
            </InputIcon>
            <Input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Mot de passe"
              value={formData.password}
              onChange={handleChange}
              required
              $withLeftIcon
              $withRightAction
            />
            <PasswordToggle
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </PasswordToggle>
          </InputGroup>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>
          
          <ForgotPassword type="button" onClick={handleForgotPassword}>
            Mot de passe oublié ?
          </ForgotPassword>
        </Form>
        
        <SignupLink>
          Pas encore de compte ? <Link to="/register">S'inscrire</Link>
        </SignupLink>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;

