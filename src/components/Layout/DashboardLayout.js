import React from 'react';
import styled from 'styled-components';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiHome, FiShoppingBag, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';

const Shell = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px 16px;
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 20px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 18px;
  height: fit-content;
`;

const UserCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f6f8f7;
  border-radius: 10px;
  margin-bottom: 16px;
`;

const Avatar = styled.div`
  width: 42px;
  height: 42px;
  border-radius: 999px;
  background: #2c5530;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  small { color: #667; }
`;

const Nav = styled.nav`
  display: grid;
  gap: 6px;
`;

const NavItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #1f2d1f;
  transition: background .15s ease, transform .15s ease;

  &:hover { background: #f3f5f4; transform: translateX(1px); }
`;

const LogoutButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff5f5;
  color: #a23a3a;
  border: 1px solid #ffe3e3;
  cursor: pointer;
  margin-top: 6px;

  &:hover { background: #ffecec; }
`;

const Main = styled.main``;

const HeaderBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 14px 16px;
  margin-bottom: 16px;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const HeaderButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
  background: #f9fafb;
  color: #1f2d1f;
  cursor: pointer;
  transition: background .15s ease;
  &:hover { background: #f1f3f5; }
`;

const DashboardLayout = ({ children }) => {
  const { user, userData, logout } = useAuth();
  const name = userData?.displayName || user?.email || '';
  const initial = name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <Shell>
      <Sidebar>
        <UserCard>
          <Avatar>{initial}</Avatar>
          <UserInfo>
            <strong>{name}</strong>
            <small>Client</small>
          </UserInfo>
        </UserCard>

        <Nav>
          <NavItem to="/dashboard">
            <FiHome />
            Tableau de bord
          </NavItem>
          <NavItem to="/orders">
            <FiShoppingBag />
            Mes commandes
          </NavItem>
          <NavItem to="/profile">
            <FiUser />
            Profil
          </NavItem>
          
          <NavItem to="/settings">
            <FiSettings />
            Réglages
          </NavItem>
        </Nav>

        <LogoutButton onClick={logout}>
          <FiLogOut /> Se déconnecter
        </LogoutButton>
      </Sidebar>

      <Main>
        <HeaderBar>
          <HeaderTitle>
            <Avatar style={{ width: 32, height: 32 }}>{initial}</Avatar>
            <span>Bienvenue, {name}</span>
          </HeaderTitle>
          <HeaderActions>
            <Link to="/profile" style={{ textDecoration: 'none' }}>
              <HeaderButton>
                <FiUser /> Profil
              </HeaderButton>
            </Link>
            <HeaderButton onClick={logout}>
              <FiLogOut /> Déconnexion
            </HeaderButton>
          </HeaderActions>
        </HeaderBar>
        {children}
      </Main>
    </Shell>
  );
};

export default DashboardLayout;
