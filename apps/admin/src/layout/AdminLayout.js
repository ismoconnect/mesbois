import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const Shell = styled.div`
  min-height: 100vh;
  background: #f5f7f6;
`;

const HeaderBar = styled.header`
  background: #ffffff;
  border-bottom: 1px solid #e6eae7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  z-index: 30;
`;

const Brand = styled(Link)`
  display: inline-flex;
  align-items: baseline;
  gap: 6px;
  color: #2c5530;
  text-decoration: none;
  font-weight: 800;
`;

const Sidebar = styled.aside`
  background: #ffffff;
  border-right: 1px solid #e6eae7;
  padding: 16px 12px;
  position: fixed;
  top: 56px; /* sous le header */
  left: 0;
  width: 240px;
  bottom: 0;
  overflow: hidden; /* ne scroll plus */

  @media (max-width: 900px) {
    position: static;
    width: auto;
    height: auto;
    overflow: visible;
  }
`;

const NavItem = styled(Link)`
  display: block;
  padding: 10px 12px;
  margin-bottom: 6px;
  border-radius: 8px;
  color: #2c5530;
  text-decoration: none;
  font-weight: 700;
  &:hover { background: #eef3ef; }
`;

const Content = styled.main`
  padding: 24px 16px;
  padding-top: calc(56px + 16px);
  /* Détache visuellement le contenu de la sidebar: retrait augmenté */
  padding-left: calc(240px + 56px);
  height: 100vh;
  overflow: auto; /* seul le contenu scrolle */
  @media (min-width: 768px) {
    padding-right: 24px;
    padding-bottom: 24px;
  }
  @media (max-width: 900px) {
    padding-left: 16px;
    padding-top: calc(56px + 16px);
    height: auto;
    overflow: visible;
  }
`;

const Inner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 16px;
`;

const LogoutBtn = styled.button`
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
`;

const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const onLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login', { replace: true });
    } catch {}
  };

  return (
    <Shell>
      <HeaderBar>
        <Brand to="/dashboard">MesBois Admin</Brand>
        <LogoutBtn onClick={onLogout}>Déconnexion</LogoutBtn>
      </HeaderBar>
      <Sidebar>
        <NavItem to="/dashboard">Tableau de bord</NavItem>
        <NavItem to="/users">Utilisateurs</NavItem>
        <NavItem to="/orders">Commandes</NavItem>
        <NavItem to="/carts">Paniers</NavItem>
        <NavItem to="/images">Images de la Home</NavItem>
      </Sidebar>
      <Content>
        <Inner>
          {children}
        </Inner>
      </Content>
    </Shell>
  );
};

export default AdminLayout;
