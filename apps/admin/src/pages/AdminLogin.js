import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px 16px;
  background: radial-gradient(1000px 500px at 10% -10%, #d9f0db 0%, transparent 60%),
              radial-gradient(800px 400px at 90% 110%, #e8f4ea 0%, transparent 60%),
              #f5f7f6;
`;

const Card = styled.div`
  background: #fff;
  border: 1px solid #e6eae7;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(44, 85, 48, 0.15);
  width: 100%;
  max-width: 440px;
`;

const Title = styled.h1`
  font-size: 26px;
  color: #2c5530;
  margin: 0 0 6px;
  font-weight: 900;
`;

const Subtitle = styled.p`
  margin: 0 0 18px;
  color: #5e6e60;
`;

const Field = styled.div`
  display: grid;
  gap: 6px;
  margin-bottom: 12px;
`;

const Label = styled.label`
  font-weight: 700;
  font-size: 13px;
  color: #2c5530;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color .2s ease, box-shadow .2s ease;
  &:focus { border-color: #2c5530; box-shadow: 0 0 0 4px rgba(44,85,48,.08); }
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  background: #2c5530;
  color: #fff;
  border: none;
  padding: 12px 14px;
  border-radius: 10px;
  font-weight: 800;
  cursor: pointer;
  width: 100%;
  transition: transform .06s ease, background .2s ease;
  &:hover { background: #234725; }
  &:active { transform: translateY(1px); }
`;

const Helper = styled.p`
  font-size: 12px;
  color: #666;
`;

const Footer = styled.div`
  margin-top: 14px;
  font-size: 12px;
  color: #7a8a7c;
  text-align: center;
`;

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError('');
      setLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
      try {
        await setDoc(
          doc(db, 'users', cred.user.uid),
          { email: cred.user.email || email.trim(), lastLoginAt: new Date() },
          { merge: true }
        );
      } catch {}
      // Check admin gate
      try {
        const ref = doc(db, 'admins', cred.user.uid);
        const snap = await getDoc(ref);
        const data = snap.exists() ? snap.data() : null;
        if (data && (data.enabled === undefined || data.enabled === true)) {
          navigate('/dashboard', { replace: true });
        } else {
          setError("Votre compte n'est pas autorisé pour l'administration");
        }
      } catch {
        setError('Vérification des droits impossible');
      }
    } catch (e) {
      setError('Connexion échouée');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Card>
        <Title>Connexion Admin</Title>
        {error ? <Helper style={{ color: '#e74c3c' }}>{error}</Helper> : <Subtitle>Accès réservé aux administrateurs habilités</Subtitle>}
        <Field>
          <Label>Email</Label>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@email.com" />
        </Field>
        <Field>
          <Label>Mot de passe</Label>
          <Input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </Field>
        <Actions>
          <Button type="button" onClick={handleLogin} disabled={loading}>{loading ? 'Connexion…' : 'Se connecter'}</Button>
        </Actions>
        <Footer>Besoin d’aide ? Contactez le propriétaire du projet pour activer votre compte admin.</Footer>
      </Card>
    </Container>
  );
};

export default AdminLogin;
