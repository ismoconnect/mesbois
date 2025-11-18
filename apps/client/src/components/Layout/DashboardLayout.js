import React, { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { FiHome, FiShoppingBag, FiShoppingCart, FiUser, FiSettings, FiLogOut, FiMenu, FiActivity } from 'react-icons/fi';

const Shell = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 96px 20px 24px calc(260px + 24px);
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 88px 12px 24px 12px;
    overflow-x: hidden;
  }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.25);
  z-index: 1002;
  display: none;
  @media (max-width: 900px) {
    display: block;
  }
`;

const Sidebar = styled.aside`
  position: fixed;
  top: 0;
  left: 0;
  width: 260px;
  height: 100vh;
  background: #eaf4ee;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 24px 16px;
  border-radius: 0;
  overflow-y: auto;
  z-index: 1003;
  border-right: 1px solid #d4e3db;

  @media (max-width: 900px) {
    transform: translateX(${props => (props.$open ? '0' : '-100%')});
    transition: transform .2s ease;
  }
`;

const UserCard = styled(Link)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f6f8f7;
  border-radius: 10px;
  margin-bottom: 16px;
  text-decoration: none;
  color: inherit;
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

const Main = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

const HeaderBar = styled.div`
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0 8px 24px rgba(0,0,0,0.08);
  padding: 10px 14px;
  z-index: 1001;

  @media (max-width: 900px) {
    left: 0;
    height: 64px;
    padding: 8px 10px;
  }
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 700;
  
  span.header-name {
    @media (max-width: 900px) {
      display: none;
    }
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const HeaderButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
  background: #f9fafb;
  color: #1f2d1f;
  cursor: pointer;
  transition: background .15s ease;
  position: relative;
  &:hover { background: #f1f3f5; }
  
  @media (max-width: 900px) {
    padding: 8px;
    .label { display: none; }
  }
`;

const CountBubble = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: #e74c3c;
  color: #fff;
  font-size: 11px;
  line-height: 18px;
  text-align: center;
  font-weight: 800;
`;

const Burger = styled.button`
  display: none;
  @media (max-width: 900px) {
    display: inline-flex;
  }
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e6e6e6;
  background: #f9fafb;
  color: #1f2d1f;
  cursor: pointer;
`;

const DashboardLayout = ({ children }) => {
  const { user, userData, logout } = useAuth();
  const { getCartItemsCount } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { settings } = useSiteSettings();
  const appName = settings.siteName || 'Bois de Chauffage';
  const displayName = userData?.displayName || appName;
  const headerInitial = displayName?.charAt(0)?.toUpperCase() || '';
  const cartCount = typeof getCartItemsCount === 'function' ? getCartItemsCount() : 0;

  return (
    <>
      <Sidebar $open={open}>
        <UserCard to="/dashboard" onClick={() => setOpen(false)}>
          <Avatar>🌲</Avatar>
          <UserInfo>
            <strong>{appName}</strong>
            <small>Espace client</small>
          </UserInfo>
        </UserCard>

        <Nav>
          <NavItem to="/dashboard" onClick={() => setOpen(false)}>
            <FiHome />
            Mon Espace Client
          </NavItem>
          <NavItem to="/dashboard/cart" onClick={() => setOpen(false)}>
            <FiShoppingCart />
            Panier
          </NavItem>
          <NavItem to="/orders" onClick={() => setOpen(false)}>
            <FiShoppingBag />
            Mes commandes
          </NavItem>
          <NavItem to="/billing" onClick={() => setOpen(false)}>
            <FiShoppingBag />
            Facturation
          </NavItem>
          <NavItem to="/suivi" onClick={() => setOpen(false)}>
            <FiActivity />
            Suivi
          </NavItem>
          <NavItem to="/profile" onClick={() => setOpen(false)}>
            <FiUser />
            Profil
          </NavItem>
          <NavItem to="/settings" onClick={() => setOpen(false)}>
            <FiSettings />
            Réglages
          </NavItem>
        </Nav>

        <LogoutButton onClick={async () => { 
          try { 
            await logout(); 
          } finally { 
            try { navigate('/', { replace: true }); } catch {}
            try { window.location.replace('/'); } catch {}
          } 
        }}>
          <FiLogOut /> Se déconnecter
        </LogoutButton>
      </Sidebar>

      {open && <Overlay onClick={() => setOpen(false)} />}

      <HeaderBar>
        <HeaderTitle>
          <Burger onClick={() => setOpen(v => !v)} aria-label="Ouvrir le menu">
            <FiMenu /> Menu
          </Burger>
          <span className="header-name">Bienvenue, {displayName}</span>
        </HeaderTitle>
        <HeaderActions>
          <Link to="/dashboard/cart" style={{ textDecoration: 'none' }}>
            <HeaderButton>
              <FiShoppingCart /> <span className="label">Panier</span>
              {cartCount > 0 && <CountBubble>{cartCount > 99 ? '99+' : cartCount}</CountBubble>}
            </HeaderButton>
          </Link>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <HeaderButton>
              <FiUser /> <span className="label">Profil</span>
            </HeaderButton>
          </Link>
          <Link to="/dashboard" style={{ textDecoration: 'none' }}>
            <Avatar style={{ width: 32, height: 32 }}>{headerInitial}</Avatar>
          </Link>
        </HeaderActions>
      </HeaderBar>

      <Shell>
        <Main>
          {children}
        </Main>
      </Shell>
    </>
  );
};

export default DashboardLayout;
