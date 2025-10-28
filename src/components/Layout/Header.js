import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import styled from 'styled-components';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';

const HeaderContainer = styled.header`
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  
  @media (max-width: 768px) {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    width: 100vw !important;
    height: 60px !important;
    z-index: 9999 !important;
    transform: translateZ(0) !important;
    -webkit-transform: translateZ(0) !important;
    will-change: transform !important;
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
    overflow: hidden !important;
  }
  
  @media (max-width: 480px) {
    height: 55px !important;
  }
  
  @media (max-width: 375px) {
    height: 50px !important;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 70px;
  width: 100%;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    padding: 0 5px;
    height: 60px;
    min-width: 0;
  }
  
  @media (max-width: 480px) {
    padding: 0 4px;
    height: 55px;
  }
  
  @media (max-width: 375px) {
    padding: 0 3px;
    height: 50px;
  }
`;

const Logo = styled(Link)`
  font-size: 24px;
  font-weight: 700;
  color: #2c5530;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 1;
  min-width: 0;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 16px;
    gap: 4px;
  }
  
  @media (max-width: 480px) {
    font-size: 14px;
    gap: 3px;
  }
  
  @media (max-width: 375px) {
    font-size: 13px;
    gap: 2px;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 500px;
  margin: 0 20px;
  position: relative;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 25px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #2c5530;
  }
`;

const SearchIcon = styled(FiSearch)`
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  
  &:hover {
    color: #2c5530;
  }
  
  &.desktop-only {
    @media (max-width: 768px) {
      display: none;
    }
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  flex-shrink: 0;
  min-width: 0;
  
  @media (max-width: 768px) {
    gap: -5px; /* Negative gap to overlap and bring cart closer to hamburger */
  }
  
  @media (max-width: 480px) {
    gap: -8px;
  }
  
  @media (max-width: 375px) {
    gap: -10px;
  }
`;

const CartButton = styled.button`
  position: relative;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 2px;
    min-width: 28px;
    min-height: 28px;
  }
  
  @media (max-width: 480px) {
    padding: 1px;
    min-width: 24px;
    min-height: 24px;
  }
  
  @media (max-width: 375px) {
    padding: 1px;
    min-width: 20px;
    min-height: 20px;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const CartBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  
  @media (max-width: 768px) {
    width: 18px;
    height: 18px;
    font-size: 11px;
    top: -4px;
    right: -4px;
  }
  
  @media (max-width: 480px) {
    width: 16px;
    height: 16px;
    font-size: 10px;
    top: -3px;
    right: -3px;
  }
`;

const UserButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    padding: 2px;
    min-width: 28px;
    min-height: 28px;
  }
  
  @media (max-width: 480px) {
    padding: 1px;
    min-width: 24px;
    min-height: 24px;
  }
  
  @media (max-width: 375px) {
    padding: 1px;
    min-width: 20px;
    min-height: 20px;
  }
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const MobileMenuButton = styled.button`
  display: none; /* Hidden by default */
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
  align-items: center;
  justify-content: center;
  
  @media (max-width: 768px) {
    display: flex; /* Show on mobile */
    padding: 2px;
    min-width: 28px;
    min-height: 28px;
  }
  
  @media (max-width: 480px) {
    padding: 1px;
    min-width: 24px;
    min-height: 24px;
  }
  
  @media (max-width: 375px) {
    padding: 1px;
    min-width: 20px;
    min-height: 20px;
  }
`;

const MobileMenu = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  background-color: white !important;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  padding: 20px;
  z-index: 9999;
  opacity: 1;
  
  @media (max-width: 768px) {
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 12px 0;
  color: #333 !important;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid #f0f0f0;
  opacity: 1;
  
  @media (max-width: 768px) {
    padding: 10px 0;
    font-size: 15px;
  }
  
  @media (max-width: 480px) {
    padding: 8px 0;
    font-size: 14px;
  }
  
  &:hover {
    color: #2c5530 !important;
  }
`;

const Dropdown = styled.div`
  position: relative;
`;

const DropdownContent = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 10px 0;
  min-width: 200px;
  z-index: 1000;
`;

const DropdownItem = styled(Link)`
  display: block;
  padding: 12px 20px;
  color: #333;
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: #f5f5f5;
  }
`;

const ResponsiveIcon = styled.div`
  font-size: 24px;
  
  @media (max-width: 768px) {
    font-size: 20px;
  }
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
  
  @media (max-width: 375px) {
    font-size: 16px;
  }
`;

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, logout } = useAuth();
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to="/">
          🌲 Bois de Chauffage
        </Logo>
        
        <SearchBar>
          <form onSubmit={handleSearch}>
            <SearchInput
              type="text"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchIcon />
          </form>
        </SearchBar>
        
        <Nav>
          <NavLink to="/">Accueil</NavLink>
          <NavLink to="/products">Produits</NavLink>
          <NavLink to="/about">À propos</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </Nav>
        
        <UserActions>
          <CartButton onClick={() => navigate('/cart')}>
            <ResponsiveIcon>
              <FiShoppingCart />
            </ResponsiveIcon>
            {cartItemsCount > 0 && (
              <CartBadge>{cartItemsCount}</CartBadge>
            )}
          </CartButton>
          
          {user ? (
            <Dropdown>
              <UserButton onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}>
                <ResponsiveIcon>
                  <FiUser />
                </ResponsiveIcon>
              </UserButton>
              <DropdownContent isOpen={isUserDropdownOpen}>
                <DropdownItem to="/profile">Mon Profil</DropdownItem>
                <DropdownItem to="/orders">Mes Commandes</DropdownItem>
                <DropdownItem to="/reviews">Mes Avis</DropdownItem>
                <DropdownItem as="button" onClick={handleLogout}>
                  Déconnexion
                </DropdownItem>
              </DropdownContent>
            </Dropdown>
          ) : (
            <NavLink to="/login" className="desktop-only">Connexion</NavLink>
          )}
        </UserActions>
        
        <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <ResponsiveIcon>
            {isMobileMenuOpen ? <FiX /> : <FiMenu />}
          </ResponsiveIcon>
        </MobileMenuButton>
      </HeaderContent>
      
      <MobileMenu isOpen={isMobileMenuOpen}>
        <MobileNavLink to="/" onClick={() => setIsMobileMenuOpen(false)}>
          Accueil
        </MobileNavLink>
        <MobileNavLink to="/products" onClick={() => setIsMobileMenuOpen(false)}>
          Produits
        </MobileNavLink>
        <MobileNavLink to="/about" onClick={() => setIsMobileMenuOpen(false)}>
          À propos
        </MobileNavLink>
        <MobileNavLink to="/contact" onClick={() => setIsMobileMenuOpen(false)}>
          Contact
        </MobileNavLink>
        {!user && (
          <MobileNavLink to="/login" onClick={() => setIsMobileMenuOpen(false)}>
            Connexion
          </MobileNavLink>
        )}
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header;

