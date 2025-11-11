import React from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';

const Shell = styled.div`
  min-height: 100vh;
  background: #f5f7f6;
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: 56px 1fr;
  grid-template-areas:
    'sidebar header'
    'sidebar content';

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    grid-template-rows: 56px auto 1fr;
    grid-template-areas:
      'header'
      'sidebar'
      'content';
  }
`;

const HeaderBar = styled.header`
  grid-area: header;
  background: #ffffff;
  border-bottom: 1px solid #e6eae7;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
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
  grid-area: sidebar;
  background: #ffffff;
  border-right: 1px solid #e6eae7;
  padding: 16px 12px;
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
  grid-area: content;
  padding: 24px 16px;
  @media (min-width: 768px) {
    padding: 32px 24px;
  }
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
        <NavItem to="/images">Images de la Home</NavItem>
      </Sidebar>
      <Content>{children}</Content>
    </Shell>
  );
};

export default AdminLayout;
