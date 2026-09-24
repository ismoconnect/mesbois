import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useLocalizedNavigate } from '../../hooks/useLocalizedNavigate';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import LocalizedLink from '../LocalizedLink/LocalizedLink';
import styled from 'styled-components';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiSearch, FiPhone, FiClock } from 'react-icons/fi';
import { useTranslation } from 'react-i18next';

const LangSelect = styled.select`
  appearance: none;
  background: transparent;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 4px 24px 4px 8px;
  font-size: 13px;
  font-weight: 600;
  color: #2c5530;
  cursor: pointer;
  outline: none;
  background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%232c5530%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E");
  background-repeat: no-repeat;
  background-position: right 8px top 50%;
  background-size: 8px auto;
  
  &:hover {
    border-color: #2c5530;
  }
`;

const HeaderContainer = styled.header`
  background: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  top: 52px; /* increased offset below the fixed TopBar on desktop */
  left: 0;
  right: 0;
  width: 100vw;
  z-index: 1000;
  
  @media (max-width: 768px) {
    top: 0 !important;
    width: 100vw !important;
    height: 60px !important;
    z-index: 9999 !important;
    transform: translateZ(0) !important;
    -webkit-transform: translateZ(0) !important;
    will-change: transform !important;
    backface-visibility: hidden !important;
    -webkit-backface-visibility: hidden !important;
    overflow: visible !important;
  }
  
  @media (max-width: 480px) {
    height: 55px !important;
  }
  
  @media (max-width: 375px) {
    height: 50px !important;
  }
`;

const LogoIcon = styled.span`
  font-size: 32px;
  display: flex;
  align-items: center;
  @media (min-width: 769px) {
    font-size: 40px;
  }
`;

const LogoText = styled.span`
  display: flex;
  flex-direction: column;
  line-height: 1.1;
`;

const HeaderAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 999px;
  background: #2c5530;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
`;

const TopBar = styled.div`
  display: none;
  background: #f3f6f4;
  color: #2c5530;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100vw;
  z-index: 1001;
  border-bottom: 1px solid #e8eee9;
  
  @media (min-width: 769px) {
    display: block;
  }
`;

const TopBarContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
`;

const InfoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c5530;
`;

const DesktopOnly = styled.div`
  @media (max-width: 768px) {
    display: none !important;
  }
`;

const MobileOnly = styled.div`
  @media (min-width: 769px) {
    display: none !important;
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
  text-decoration: none;
  display: flex;
  align-items: center;
  flex-shrink: 1;
  min-width: 0;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:active { outline: none; box-shadow: none; }
`;

const LogoImage = styled.img`
  height: 48px;
  width: auto;
  max-width: 280px;
  object-fit: contain;
  display: block;

  @media (max-width: 768px) {
    height: 40px;
    max-width: 220px;
  }

  @media (max-width: 480px) {
    height: 35px;
    max-width: 195px;
  }

  @media (max-width: 375px) {
    height: 32px;
    max-width: 175px;
  }
`;

const SearchBar = styled.div`
  flex: 1;
  max-width: 380px;
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
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:active { outline: none; box-shadow: none; }
  
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
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    gap: 6px;
  }
  
  @media (max-width: 375px) {
    gap: 4px;
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
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:focus-visible { outline: none; box-shadow: none; }
  &::-moz-focus-inner { border: 0; }
  &:active { outline: none; box-shadow: none; }
  
  @media (max-width: 768px) {
    padding: 6px;
    min-width: 28px;
    min-height: 28px;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
    min-width: 24px;
    min-height: 24px;
  }
  
  @media (max-width: 375px) {
    padding: 6px;
    min-width: 20px;
    min-height: 20px;
  }
  
  &:hover {
    background-color: #eef4ef;
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
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:focus-visible { outline: none; box-shadow: none; }
  &::-moz-focus-inner { border: 0; }
  &:active { outline: none; box-shadow: none; }
  
  @media (max-width: 768px) {
    padding: 6px;
    min-width: 28px;
    min-height: 28px;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
    min-width: 24px;
    min-height: 24px;
  }
  
  @media (max-width: 375px) {
    padding: 6px;
    min-width: 20px;
    min-height: 20px;
  }
  
  &:hover {
    background-color: #eef4ef;
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
  border-radius: 50%;
  transition: background-color 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:active { outline: none; box-shadow: none; }
  
  @media (max-width: 768px) {
    display: flex; /* Show on mobile */
    padding: 6px;
    min-width: 28px;
    min-height: 28px;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
    min-width: 24px;
    min-height: 24px;
  }
  
  @media (max-width: 375px) {
    padding: 6px;
    min-width: 20px;
    min-height: 20px;
  }

  &:hover {
    background-color: #eef4ef;
  }
`;

const MobileSearchButton = styled.button`
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  flex-shrink: 0;
  min-width: 32px;
  min-height: 32px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: background-color 0.3s ease;
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:active { outline: none; box-shadow: none; }

  @media (max-width: 768px) {
    display: flex;
    padding: 6px;
    min-width: 28px;
    min-height: 28px;
  }

  @media (max-width: 480px) {
    padding: 6px;
    min-width: 24px;
    min-height: 24px;
  }

  @media (max-width: 375px) {
    padding: 6px;
    min-width: 20px;
    min-height: 20px;
  }

  &:hover {
    background-color: #eef4ef;
  }
`;

const MobileMenu = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 9999;
  border-top: 1px solid #f0f0f0;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: transform 0.25s ease, opacity 0.25s ease;
  
  @media (max-width: 768px) {
    padding: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 12px;
  }
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileSearchPanel = styled.div`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: #ffffff;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  padding: 12px 16px;
  z-index: 10000;
  border-top: 1px solid #f0f0f0;
  transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-8px)'};
  opacity: ${props => props.isOpen ? 1 : 0};
  transition: transform 0.25s ease, opacity 0.25s ease;

  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileSearchInput = styled.input`
  width: 100%;
  padding: 12px 14px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #2c5530;
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
  -webkit-tap-highlight-color: transparent;
  outline: none;
  &:focus { outline: none; box-shadow: none; }
  &:active { outline: none; box-shadow: none; }
  
  @media (max-width: 768px) {
    padding: 12px 0;
    font-size: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 10px 0;
    font-size: 15px;
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
  width: 100%;
  text-align: left;
  font-size: 14px;
  background: transparent;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #f5f5f5;
  }
`;

const ResponsiveIcon = styled.div`
  font-size: 24px;
  color: #2c5530;
  
  @media (max-width: 768px) {
    font-size: 22px;
  }
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
  
  @media (max-width: 375px) {
    font-size: 18px;
  }
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CartDrawerOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 11000;
`;

const EmptyCartAlertOverlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 12000;
`;

const EmptyCartAlertBox = styled.div`
  background: #ffffff;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  max-width: 320px;
  width: 80vw;
  text-align: center;
`;

const EmptyCartAlertTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #2c5530;
`;

const EmptyCartAlertText = styled.div`
  font-size: 14px;
  color: #444;
  margin-bottom: 16px;
`;

const EmptyCartAlertButton = styled.button`
  padding: 8px 16px;
  border-radius: 999px;
  border: none;
  background: #2c5530;
  color: #fff;
  font-weight: 600;
  cursor: pointer;
`;

const CartDrawer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 360px;
  max-width: 100%;
  height: 100vh;
  background: #fff;
  box-shadow: -4px 0 20px rgba(0,0,0,0.15);
  z-index: 11001;
  display: flex;
  flex-direction: column;

  @media (max-width: 480px) {
    right: 0;
    left: auto;
    width: 70vw;
    max-width: 420px;
    top: 0;
    height: 100vh;
  }
`;

const CartDrawerHeader = styled.div`
  padding: 18px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
`;

const CartDrawerTitle = styled.h3`
  margin: 0;
  font-size: 18px;
  color: #2c5530;
`;

const CartDrawerClose = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
`;

const CartDrawerBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
`;

const CartDrawerItem = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
`;

const CartDrawerItemImage = styled.img`
  width: 64px;
  height: 64px;
  object-fit: cover;
  border-radius: 6px;
  background: #f5f5f5;
`;

const CartDrawerItemInfo = styled.div`
  flex: 1;
`;

const CartDrawerItemName = styled.div`
  font-size: 14px;
  font-weight: 600;
  margin-bottom: 4px;
`;

const CartDrawerItemMeta = styled.div`
  font-size: 13px;
  color: #666;
`;

const CartDrawerItemActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 6px;
`;

const CartQtyControls = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1px solid #e0e0e0;
  border-radius: 999px;
  overflow: hidden;
`;

const CartQtyButton = styled.button`
  width: 24px;
  height: 24px;
  border: none;
  background: #f5f5f5;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CartQtyValue = styled.span`
  min-width: 28px;
  text-align: center;
  font-size: 13px;
`;

const CartRemoveButton = styled.button`
  border: none;
  background: none;
  color: #e74c3c;
  font-size: 12px;
  cursor: pointer;
`;

const CartDrawerFooter = styled.div`
  border-top: 1px solid #f0f0f0;
  padding: 16px 20px 20px;

  @media (max-width: 480px) {
    padding-bottom: 64px; /* remonter encore le bloc CTA sur mobile */
  }
`;

const CartDrawerRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 14px;
`;

const CartDrawerPrimary = styled.button`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: none;
  background: #27ae60;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  margin-top: 8px;
`;

const CartDrawerSecondary = styled.button`
  width: 100%;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  background: #fff;
  color: #2c5530;
  font-weight: 600;
  cursor: pointer;
`;

const Header = () => {
  const { t, i18n } = useTranslation();
  const headerRef = useRef(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isEmptyCartAlertOpen, setIsEmptyCartAlertOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, userData, logout } = useAuth();
  const { cartItems, getCartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();
  const localizedNavigate = useLocalizedNavigate();
  const location = useLocation();
  const { settings, loaded } = useSiteSettings();

  const headerSiteName = loaded ? (settings.siteName || '') : '';
  const headerPhone = loaded ? (settings.supportPhone || '') : '';
  const profileDisplayName = userData?.displayName || '';
  const profileInitial = profileDisplayName ? profileDisplayName.charAt(0).toUpperCase() : '';

  let headerSiteNameDisplay = headerSiteName;
  if (headerSiteName.length > 10) {
    const breakIndex = headerSiteName.indexOf(' ', 10);
    if (breakIndex !== -1 && breakIndex < headerSiteName.length - 1) {
      headerSiteNameDisplay = (
        <>
          {headerSiteName.slice(0, breakIndex)}
          <br />
          {headerSiteName.slice(breakIndex + 1)}
        </>
      );
    }
  }

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      localizedNavigate('products', '', `?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const closeAllOverlays = () => {
    setIsMobileMenuOpen(false);
    setIsMobileSearchOpen(false);
    setIsUserDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((v) => {
      const next = !v;
      if (next) {
        setIsMobileSearchOpen(false);
        setIsUserDropdownOpen(false);
      }
      return next;
    });
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen((v) => {
      const next = !v;
      if (next) {
        setIsMobileMenuOpen(false);
        setIsUserDropdownOpen(false);
      }
      return next;
    });
  };

  const handleUserToggle = () => {
    setIsUserDropdownOpen((v) => {
      const next = !v;
      if (next) {
        setIsMobileMenuOpen(false);
        setIsMobileSearchOpen(false);
      }
      return next;
    });
  };

  const handleGoToCart = () => {
    closeAllOverlays();
    const path = location.pathname || '';
    const inDashboardArea = path === '/dashboard' || path.startsWith('/dashboard/') || path === '/profile' || path === '/orders' || path.startsWith('/orders/');
    if (inDashboardArea) {
      navigate('/orders');
    } else {
      setIsCartDrawerOpen(true);
    }
  };

  const handleLinkClick = (e, to) => {
    e.preventDefault();
    closeAllOverlays();
    if (location.pathname === to) {
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
      }
    }
    navigate(to);
  };

  const handleLogout = async () => {
    await logout();
    setIsUserDropdownOpen(false);
    localizedNavigate('home');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!(isMobileMenuOpen || isUserDropdownOpen || isMobileSearchOpen)) return;
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        closeAllOverlays();
      }
    };

    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isMobileMenuOpen, isUserDropdownOpen, isMobileSearchOpen]);

  // Empêcher le scroll de la page en arrière-plan quand le panier est ouvert
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    if (isCartDrawerOpen) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
    };
  }, [isCartDrawerOpen]);

  return (
    <>
      {/* Desktop Top Bar */}
      <TopBar>
        <TopBarContent>
          <InfoGroup>
            <InfoItem>
              <FiPhone /> <span>{headerPhone}</span>
            </InfoItem>
            <InfoItem>
              <FiClock /> <span>Lun–Sam 9h–18h</span>
            </InfoItem>
          </InfoGroup>

          <DesktopOnly>
            <UserActions>
              <LangSelect 
                value={i18n.language} 
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                title="Changer la langue"
                style={{ backgroundColor: '#f3f6f4', padding: '2px 20px 2px 6px', fontSize: '12px' }}
              >
                <option value="fr">🇫🇷 FR</option>
                <option value="de">🇩🇪 DE</option>
              </LangSelect>
              {!user && (
                <>
                  <NavLink as={LocalizedLink} routeKey="login">Connexion</NavLink>
                  <NavLink as={LocalizedLink} routeKey="register">Inscription</NavLink>
                </>
              )}
              <CartButton onClick={handleGoToCart}>
                <ResponsiveIcon>
                  <FiShoppingCart />
                </ResponsiveIcon>
                {cartItemsCount > 0 && (
                  <CartBadge>{cartItemsCount}</CartBadge>
                )}
              </CartButton>
            </UserActions>
          </DesktopOnly>
        </TopBarContent>
      </TopBar>

      <HeaderContainer ref={headerRef}>
        <HeaderContent>
          <Logo as={LocalizedLink} routeKey="home" onClick={closeAllOverlays} title="brennholzkaufen by Pusch Heinz Kamin- u. Brennholz">
            <LogoImage 
              src="/images/brennholzkaufen_logo_transparent.png" 
              alt="brennholzkaufen by Pusch Heinz Kamin- u. Brennholz" 
            />
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
            <LocalizedLink routeKey="home" onClick={closeAllOverlays} style={{marginRight: '15px', color: '#333', textDecoration: 'none', fontWeight: '500'}}>{t('nav.home')}</LocalizedLink>
            <LocalizedLink routeKey="products" onClick={closeAllOverlays} style={{marginRight: '15px', color: '#333', textDecoration: 'none', fontWeight: '500'}}>{t('nav.products')}</LocalizedLink>
            <LocalizedLink routeKey="about" onClick={closeAllOverlays} style={{marginRight: '15px', color: '#333', textDecoration: 'none', fontWeight: '500'}}>{t('nav.about')}</LocalizedLink>
            <LocalizedLink routeKey="contact" onClick={closeAllOverlays} style={{color: '#333', textDecoration: 'none', fontWeight: '500'}}>{t('nav.contact')}</LocalizedLink>
          </Nav>

          <RightActions>
            {/* Mobile search toggle */}
            <MobileSearchButton onClick={toggleMobileSearch} aria-label="Recherche">
              <ResponsiveIcon>
                <FiSearch />
              </ResponsiveIcon>
            </MobileSearchButton>

            <UserActions>
              {user ? (
                <Dropdown>
                  <UserButton onClick={handleUserToggle}>
                    <HeaderAvatar>{profileInitial}</HeaderAvatar>
                  </UserButton>
                  <DropdownContent isOpen={isUserDropdownOpen}>
                    <DropdownItem as={LocalizedLink} routeKey="dashboard" onClick={() => setIsUserDropdownOpen(false)}>Mon espace client</DropdownItem>
                    <DropdownItem as={LocalizedLink} routeKey="orders" onClick={() => setIsUserDropdownOpen(false)}>Mes Commandes</DropdownItem>
                    <DropdownItem as={LocalizedLink} routeKey="profile" onClick={() => setIsUserDropdownOpen(false)}>Mon Profil</DropdownItem>
                    <DropdownItem
                      as="button"
                      onClick={handleLogout}
                      style={{ color: '#b91c1c', fontWeight: 600 }}
                    >
                      Déconnexion
                    </DropdownItem>
                  </DropdownContent>
                </Dropdown>
              ) : (
                <Dropdown>
                  <UserButton onClick={handleUserToggle}>
                    <ResponsiveIcon>
                      <FiUser />
                    </ResponsiveIcon>
                  </UserButton>
                  <DropdownContent isOpen={isUserDropdownOpen}>
                    <DropdownItem as={LocalizedLink} routeKey="login" onClick={() => setIsUserDropdownOpen(false)}>Connexion</DropdownItem>
                    <DropdownItem as={LocalizedLink} routeKey="register" onClick={() => setIsUserDropdownOpen(false)}>Inscription</DropdownItem>
                  </DropdownContent>
                </Dropdown>
              )}

              {/* Cart visible here only on mobile; on desktop it's in TopBar */}
              <MobileOnly>
                <CartButton onClick={handleGoToCart}>
                  <ResponsiveIcon>
                    <FiShoppingCart />
                  </ResponsiveIcon>
                  {cartItemsCount > 0 && (
                    <CartBadge>{cartItemsCount}</CartBadge>
                  )}
                </CartButton>
              </MobileOnly>
            </UserActions>

            <MobileMenuButton onClick={toggleMobileMenu} aria-label="Menu">
              <ResponsiveIcon>
                {isMobileMenuOpen ? <FiX /> : <FiMenu />}
              </ResponsiveIcon>
            </MobileMenuButton>
          </RightActions>
        </HeaderContent>

        {/* Mobile Search Panel */}
        <MobileSearchPanel isOpen={isMobileSearchOpen}>
          <form onSubmit={(e) => { handleSearch(e); setIsMobileSearchOpen(false); }}>
            <MobileSearchInput
              type="text"
              placeholder="Rechercher des produits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </form>
        </MobileSearchPanel>

        <MobileMenu isOpen={isMobileMenuOpen}>
          <LocalizedLink routeKey="home" onClick={closeAllOverlays} style={{display:'block', padding:'15px', color:'#333', textDecoration:'none', borderBottom:'1px solid #eee'}}>{t('nav.home')}</LocalizedLink>
          <LocalizedLink routeKey="products" onClick={closeAllOverlays} style={{display:'block', padding:'15px', color:'#333', textDecoration:'none', borderBottom:'1px solid #eee'}}>{t('nav.products')}</LocalizedLink>
          <LocalizedLink routeKey="about" onClick={closeAllOverlays} style={{display:'block', padding:'15px', color:'#333', textDecoration:'none', borderBottom:'1px solid #eee'}}>{t('nav.about')}</LocalizedLink>
          <LocalizedLink routeKey="contact" onClick={closeAllOverlays} style={{display:'block', padding:'15px', color:'#333', textDecoration:'none', borderBottom:'1px solid #eee'}}>{t('nav.contact')}</LocalizedLink>
          {!user && (
            <LocalizedLink routeKey="login" onClick={closeAllOverlays} style={{display:'block', padding:'15px', color:'#2c5530', textDecoration:'none', fontWeight:'bold'}}>{t('nav.login')}</LocalizedLink>
          )}
        </MobileMenu>
      </HeaderContainer>

      {/* Cart drawer (public pages) */}
      {isCartDrawerOpen && (
        <>
          <CartDrawerOverlay onClick={() => setIsCartDrawerOpen(false)} />
          <CartDrawer>
            <CartDrawerHeader>
              <CartDrawerTitle>Panier d'achat</CartDrawerTitle>
              <CartDrawerClose onClick={() => setIsCartDrawerOpen(false)}>×</CartDrawerClose>
            </CartDrawerHeader>
            <CartDrawerBody>
              {cartItems.length === 0 ? (
                <p>Votre panier est vide.</p>
              ) : (
                cartItems.map((item) => (
                  <CartDrawerItem key={item.id}>
                    <CartDrawerItemImage src={item.image || 'https://picsum.photos/seed/cart/80/80'} alt={item.name} />
                    <CartDrawerItemInfo>
                      <CartDrawerItemName>{item.name}</CartDrawerItemName>
                      <CartDrawerItemMeta>
                        {item.quantity} × {Number(item.price || 0).toFixed(2)}€
                      </CartDrawerItemMeta>
                      <CartDrawerItemActions>
                        <CartQtyControls>
                          <CartQtyButton
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </CartQtyButton>
                          <CartQtyValue>{item.quantity}</CartQtyValue>
                          <CartQtyButton
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </CartQtyButton>
                        </CartQtyControls>
                        <CartRemoveButton type="button" onClick={() => removeFromCart(item.id)}>
                          Supprimer
                        </CartRemoveButton>
                      </CartDrawerItemActions>
                    </CartDrawerItemInfo>
                  </CartDrawerItem>
                ))
              )}
            </CartDrawerBody>
            <CartDrawerFooter>
              <CartDrawerRow>
                <span>Sous-total</span>
                <span>{getCartTotal().toFixed(2)}€</span>
              </CartDrawerRow>
              {cartItems.length > 0 && (
                <CartRemoveButton
                  type="button"
                  onClick={() => {
                    clearCart();
                  }}
                  style={{ marginBottom: 8 }}
                >
                  Vider le panier
                </CartRemoveButton>
              )}
              <CartDrawerSecondary
                type="button"
                onClick={() => { setIsCartDrawerOpen(false); localizedNavigate('products'); }}
                style={{ marginBottom: 8 }}
              >
                Continuer mes achats
              </CartDrawerSecondary>
              <CartDrawerSecondary
                type="button"
                onClick={() => { setIsCartDrawerOpen(false); localizedNavigate('cart'); }}
              >
                Voir le panier
              </CartDrawerSecondary>
              <CartDrawerPrimary
                type="button"
                onClick={() => { if (!cartItems || cartItems.length === 0) { setIsEmptyCartAlertOpen(true); return; } setIsCartDrawerOpen(false); localizedNavigate('checkout'); }}
              >
                Commander
              </CartDrawerPrimary>
            </CartDrawerFooter>
          </CartDrawer>
        </>
      )}

      {isEmptyCartAlertOpen && (
        <EmptyCartAlertOverlay onClick={() => { setIsEmptyCartAlertOpen(false); setIsCartDrawerOpen(false); }}>
          <EmptyCartAlertBox onClick={(e) => e.stopPropagation()}>
            <EmptyCartAlertTitle>Votre panier est vide</EmptyCartAlertTitle>
            <EmptyCartAlertText>
              Ajoutez des produits à votre panier avant de passer commande.
            </EmptyCartAlertText>
            <EmptyCartAlertButton
              type="button"
              onClick={() => { setIsEmptyCartAlertOpen(false); setIsCartDrawerOpen(false); }}
            >
              OK
            </EmptyCartAlertButton>
          </EmptyCartAlertBox>
        </EmptyCartAlertOverlay>
      )}
    </>
  );
};

export default Header;
