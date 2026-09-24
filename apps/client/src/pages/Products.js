import React, { useState, useEffect } from 'react';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiFilter, FiGrid, FiList, FiStar, FiShoppingCart, FiTag, FiTruck, FiShield, FiSearch, FiX, FiCheck } from 'react-icons/fi';
import { FaFire } from 'react-icons/fa';
import { products as catalogue } from '../data/catalogue.js';
import { useCart } from '../contexts/CartContext';
import { useProductImages } from '../hooks/useProductImages';
import toast from 'react-hot-toast';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useTranslation } from 'react-i18next';

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  
  @media (max-width: 768px) {
    padding: 0 16px 20px; /* keep top flush under header */
    margin-top: 0;
  }
  
  @media (max-width: 480px) {
    margin-top: 0;
  }
  
  @media (max-width: 375px) {
    margin-top: 0;
  }
`;

 

const CategoriesNav = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px;
  margin: 16px 0 24px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const CategoryButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 12px;
  border-radius: 10px;
  border: 2px solid ${p => p.$active ? '#2c5530' : '#e0e0e0'};
  background: ${p => p.$active ? '#2c5530' : '#fff'};
  color: ${p => p.$active ? '#fff' : '#2c5530'};
  font-weight: 700;
  cursor: pointer;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-top: 30px;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 4px;
    margin-top: 8px;
  }
`;

const StatCard = styled.div`
  color: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  min-height: 120px;

  @media (max-width: 768px) {
    padding: 6px;
    border-radius: 8px;
    min-height: 66px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    h4 { font-size: 12px; margin: 0 0 2px 0; line-height: 1.1; }
    p { font-size: 10px; margin: 0; }
    svg { width: 16px; height: 16px; margin-bottom: 4px; }
  }

  @media (max-width: 400px) {
    h4 { font-size: 10px; }
    p { font-size: 9px; }
    svg { width: 14px; height: 14px; }
  }
`;

const PageHeader = styled.div`
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    margin-top: 0;
    padding-top: 0;
    margin-bottom: 4px;
  }
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #2c5530;
  margin: 0 0 10px; /* remove default top margin */
  
  @media (max-width: 768px) {
    font-size: 21px;
    margin: 0 0 3px;
  }
`;

const PageSubtitle = styled.p`
  color: #666;
  font-size: 16px;
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-top: 0;
    margin-bottom: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const FiltersSection = styled.div`
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 30px;
  
  @media (max-width: 768px) {
    padding: 12px;
    margin-bottom: 16px;
  }
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: 8px;
    align-items: stretch;
  }
`;

const FiltersTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2c5530;
  display: flex;
  align-items: center;
  gap: 10px;
  
  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    justify-content: flex-end;
  }
`;

const ViewToggleButton = styled.button`
  padding: 8px;
  border: 2px solid ${props => props.active ? '#2c5530' : '#e0e0e0'};
  background: ${props => props.active ? '#2c5530' : 'white'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2c5530;
  }
  
  @media (max-width: 480px) {
    padding: 6px;
  }
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const FilterGroup = styled.div`
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 6px;
    color: #333;
    font-size: 14px;
  }
  
  select, input:not([type='checkbox']) {
    width: 100%;
    padding: 8px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 13px;
    outline: none;
    transition: border-color 0.3s ease;
    
    &:focus {
      border-color: #2c5530;
    }
  }
`;

const CheckboxLabel = styled.label`
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  color: #333;
  font-size: 14px;
  line-height: 1.2;
  cursor: pointer;
  padding: 4px 0;

  input[type='checkbox'] {
    width: 16px;
    height: 16px;
    margin-left: 6px;
    vertical-align: middle;
    position: relative;
    top: 0.5px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 10px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 14px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.3s ease;
  margin-bottom: 12px;
  
  &:focus {
    border-color: #2c5530;
  }
  
  @media (max-width: 768px) {
    padding: 8px 12px;
    border-radius: 10px;
    font-size: 13px;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
  margin-bottom: 32px;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  @media (max-width: 420px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 6px;
  }
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 12px 0 4px;

  @media (min-width: 769px) {
    justify-content: flex-end;
  }
`;

const PageButton = styled.button`
  padding: 6px 10px;
  border-radius: 8px;
  border: 2px solid ${p => p.$active ? '#2c5530' : '#e0e0e0'};
  background: ${p => p.$active ? '#2c5530' : '#fff'};
  color: ${p => p.$active ? '#fff' : '#2c5530'};
  font-weight: 700;
  font-size: 13px;
  min-width: 36px;
`;

const PageInfo = styled.span`
  font-size: 13px;
  color: #666;
  margin-left: 6px;
`;

// Composants pour les cartes produits améliorées
const ProductCardEnhanced = styled.div`
  background: white;
  border-radius: 14px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  cursor: pointer;
  transform: translate3d(calc(var(--tx, 0px)), calc(var(--ty, 0px)), 0);
  
  &:hover {
    /* Combine base subtle proximity with a slight lift on hover */
    transform: translate3d(calc(var(--tx, 0px)), calc(-4px + var(--ty, 0px)), 0);
    box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  height: 160px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 120px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${ProductCardEnhanced}:hover & {
    transform: scale(1.05);
  }
`;

const ProductBadges = styled.div`
  position: absolute;
  top: 15px;
  left: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Badge = styled.div`
  background: ${props => props.type === 'sale' ? '#e74c3c' : props.type === 'new' ? '#27ae60' : '#2c5530'};
  color: white;
  padding: 4px 10px;
  border-radius: 16px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    padding: 3px 6px;
    font-size: 10px;
  }
`;

const ProductContent = styled.div`
  padding: 16px;
  
  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
`;

const ProductName = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: #2c5530;
  margin: 0;
  line-height: 1.3;
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 13px;
  }
`;

const ProductPrice = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #27ae60;
  margin-left: 15px;
  
  @media (max-width: 768px) {
    font-size: 15px;
    margin-left: 8px;
  }
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 13px;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 6px;
  }
  
  @media (max-width: 480px) {
    display: none;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  
  @media (max-width: 768px) {
    margin-bottom: 6px;
  }
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  .stars {
    display: flex;
    gap: 2px;
    color: #f39c12;
  }
  
  .rating-text {
    color: #666;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    .rating-text { display: none; }
  }
`;

const ProductStock = styled.div`
  font-size: 12px;
  color: ${props => props.inStock ? '#27ae60' : '#e74c3c'};
  font-weight: 600;
  background: ${props => props.inStock ? '#d4edda' : '#f8d7da'};
  padding: 4px 8px;
  border-radius: 12px;
`;

const ProductSpecs = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
  margin-bottom: 14px;
  font-size: 12px;
  color: #666;
  
  .spec-item {
    display: flex;
    justify-content: space-between;
    
    .spec-value {
      font-weight: 600;
      color: #2c5530;
    }
  }

  @media (max-width: 480px) {
    display: none;
  }
`;

const ProductActions = styled.div`
  display: flex;
  gap: 8px;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  background: #2c5530;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 13px;
  
  &:hover {
    background: #1e3a22;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 8px;
    font-size: 12.5px;
    border-radius: 6px;
    gap: 6px;
  }
`;

const QuickViewButton = styled.button`
  background: transparent;
  color: #2c5530;
  border: 2px solid #2c5530;
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  font-size: 13px;
  cursor: pointer;
  
  &:hover {
    background: #2c5530;
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 8px 10px;
    font-size: 12.5px;
    border-radius: 6px;
    gap: 6px;
  }
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #2c5530;
  }
  
  p {
    font-size: 16px;
  }
`;

 


/* ================= SENIOR REDESIGNED CATALOG HEADER & FILTERS ================= */

const CatalogHeader = styled.div`
  margin-bottom: 20px;
  
  @media (max-width: 768px) {
    margin-bottom: 14px;
  }
`;

const CatalogTitle = styled.h1`
  font-size: 32px;
  font-weight: 800;
  color: #1b3b22;
  margin: 0 0 6px;
  letter-spacing: -0.4px;
  
  @media (max-width: 768px) {
    font-size: 24px;
    margin-bottom: 4px;
  }
`;

const CatalogSubtitle = styled.p`
  color: #64748b;
  font-size: 15px;
  margin: 0 0 12px;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 13px;
    margin-bottom: 10px;
  }
`;

const TrustPillBar = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 13px;
  font-weight: 600;
  color: #2c5530;
  padding: 8px 14px;
  background: #f1f8f3;
  border-radius: 8px;
  margin-bottom: 18px;

  span {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  @media (max-width: 768px) {
    font-size: 11.5px;
    gap: 10px;
    padding: 6px 10px;
    margin-bottom: 14px;
  }
`;

/* Horizontal Scrollable Category Bar (Swipeable on Mobile) */
const CategoryPillsScroll = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  overflow-x: auto;
  white-space: nowrap;
  padding-bottom: 8px;
  margin-bottom: 16px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }

  @media (max-width: 768px) {
    gap: 8px;
    margin-left: -16px;
    margin-right: -16px;
    padding-left: 16px;
    padding-right: 16px;
  }
`;

const CategoryChip = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 13.5px;
  font-weight: ${p => p.$active ? '700' : '500'};
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid ${p => p.$active ? '#1b3b22' : '#e2e8f0'};
  background: ${p => p.$active ? '#1b3b22' : '#ffffff'};
  color: ${p => p.$active ? '#ffffff' : '#334155'};
  box-shadow: ${p => p.$active ? '0 4px 12px rgba(27, 59, 34, 0.25)' : '0 1px 3px rgba(0,0,0,0.04)'};

  &:hover {
    border-color: #1b3b22;
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 7px 14px;
    font-size: 12.5px;
  }
`;

/* Search and Toolbar */
const CatalogToolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    gap: 8px;
  }
`;

const SearchBox = styled.div`
  flex: 1;
  min-width: 220px;
  position: relative;
  display: flex;
  align-items: center;

  svg.search-icon {
    position: absolute;
    left: 14px;
    color: #94a3b8;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 10px 38px 10px 38px;
    border-radius: 10px;
    border: 1px solid #cbd5e1;
    font-size: 14px;
    background: #ffffff;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: #2c5530;
      box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.1);
    }
  }

  button.clear-btn {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  @media (max-width: 768px) {
    min-width: 100%;
    order: 1;
  }
`;

const ToolbarActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 768px) {
    order: 2;
    width: 100%;
    justify-content: space-between;
  }
`;

const FilterTriggerBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 14px;
  border-radius: 10px;
  border: 1px solid ${p => p.$hasFilters ? '#d97706' : '#cbd5e1'};
  background: ${p => p.$hasFilters ? '#fef3c7' : '#ffffff'};
  color: ${p => p.$hasFilters ? '#92400e' : '#1e293b'};
  font-size: 13.5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #1b3b22;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 13px;
  }
`;

const FilterBadge = styled.span`
  background: #d97706;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 999px;
`;

const ViewToggleCompact = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
`;

const ViewBtn = styled.button`
  padding: 8px 10px;
  background: ${p => p.$active ? '#1b3b22' : 'transparent'};
  color: ${p => p.$active ? '#ffffff' : '#64748b'};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;

  &:hover {
    color: ${p => p.$active ? '#ffffff' : '#1b3b22'};
  }
`;

/* Collapsible Advanced Filters Drawer */
const CollapsibleFiltersPanel = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 20px;
  box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06);
  animation: slideDown 0.25s ease-out;

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @media (max-width: 768px) {
    padding: 14px 16px;
    margin-bottom: 14px;
  }
`;

const FilterPanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;

  h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 700;
    color: #1e293b;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  button.reset-btn {
    background: none;
    border: none;
    color: #d97706;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    text-decoration: underline;
  }
`;

const FilterFieldsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 14px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 10px;
  }
`;

const FilterItem = styled.div`
  label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 4px;
  }

  select, input {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    font-size: 13.5px;
    outline: none;
    background: #ffffff;

    &:focus {
      border-color: #2c5530;
    }
  }
`;

const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  font-weight: 600;
  color: #1e293b;
  cursor: pointer;
  margin-top: 6px;

  input {
    width: 16px;
    height: 16px;
    accent-color: #2c5530;
  }
`;

const Products = () => {
  const { t } = useTranslation();
  const localizedNavigate = useLocalizedNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const { productImages } = useProductImages();
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    available: searchParams.get('available') === 'true'
  });

  

  const [mainCategory, setMainCategory] = useState(searchParams.get('main') || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState('grid');
  // const navigate = useNavigate();
  const inDashboard = location.pathname.startsWith('/dashboard');
  const { addToCart } = useCart();
  const [fsProducts, setFsProducts] = useState([]);
  const [, setFsLoading] = useState(true);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Pagination (mobile uniquement)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // mobile: 10, desktop: 8

  useEffect(() => {
    const mq = typeof window !== 'undefined' ? window.matchMedia('(max-width: 768px)') : null;
    const update = () => {
      const mobile = mq ? mq.matches : false;
      setItemsPerPage(mobile ? 10 : 8);
    };
    update();
    if (mq && mq.addEventListener) {
      mq.addEventListener('change', update);
    } else if (mq && mq.addListener) {
      mq.addListener(update);
    }
    return () => {
      if (mq && mq.removeEventListener) {
        mq.removeEventListener('change', update);
      } else if (mq && mq.removeListener) {
        mq.removeListener(update);
      }
    };
  }, []);

  // Charger les produits depuis Firestore (préféré) et rebasculer sur le catalogue local si vide
  useEffect(() => {
    (async () => {
      try {
        const snap = await getDocs(collection(db, 'products'));
        const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setFsProducts(list);
      } catch (e) {
        // silencieux: on bascule simplement sur le catalogue local
        setFsProducts([]);
      } finally {
        setFsLoading(false);
      }
    })();
  }, []);

  // Réinitialiser la page si les filtres changent
  const filtersKey = React.useMemo(() => JSON.stringify(filters), [filters]);
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filtersKey, mainCategory]);

  // Synchronise la catégorie principale avec l'URL
  useEffect(() => {
    const urlMain = searchParams.get('main') || '';
    setMainCategory(urlMain);
  }, [searchParams]);

  // Mapping d'affichage pour catégories issus des slugs Firestore ou du catalogue
  const mapMainToCategory = (main) => {
    switch (main) {
      case 'bois':
        return 'bûches';
      case 'accessoires':
        return 'accessoires';
      case 'buches-densifiees':
        return 'bûches densifiées';
      case 'pellets':
        return 'pellets';
      case 'poeles':
        return 'poêles';
      default:
        return '';
    }
  };

  // Produits Firestore (si disponibles), sinon catalogue local
  const fsMapped = fsProducts.map((p, i) => ({
    id: p.id,
    name: p.name,
    description: [p.vendor, p.regularPrice ? `(Prix régulier ${p.regularPrice}€)` : null].filter(Boolean).join(' · '),
    price: p.price,
    regularPrice: p.regularPrice,
    category: mapMainToCategory(p.category || p.main),
    type: p.type || '',
    stock: typeof p.stock === 'number' ? p.stock : 1,
    image: p.image || `https://picsum.photos/seed/${p.id}/800/500`,
    rating: typeof p.rating === 'number' ? p.rating : 0,
    reviewCount: typeof p.reviewCount === 'number' ? p.reviewCount : 0,
    sale: p.regularPrice ? (p.price || 0) < p.regularPrice : false,
    new: !!p.new,
    weight: p.weight || '',
    dimensions: p.dimensions || '',
    humidity: p.humidity || '',
    calorificValue: p.calorificValue || ''
  }));

  // Catalogue importé (fallback)
  const catMapped = catalogue.map((p, i) => {
    const mapMainToCategory = (main) => {
      switch (main) {
        case 'bois':
          return 'bûches';
        case 'accessoires':
          return 'accessoires';
        case 'buches-densifiees':
          return 'bûches densifiées';
        case 'pellets':
          return 'pellets';
        case 'poeles':
          return 'poêles';
        default:
          return '';
      }
    };
    return {
      id: p.id || `p-${i}`,
      name: p.name,
      description: [p.vendor, p.regularPrice ? `(Prix régulier ${p.regularPrice}€)` : null].filter(Boolean).join(' · '),
      price: p.price,
      regularPrice: p.regularPrice,
      category: mapMainToCategory(p.main),
      type: '',
      stock: 1,
      image: `https://picsum.photos/seed/${p.id || `p-${i}`}/800/500`,
      rating: 0,
      reviewCount: 0,
      sale: p.regularPrice ? p.price < p.regularPrice : false,
      new: false,
      weight: '',
      dimensions: '',
      humidity: '',
      calorificValue: ''
    };
  });

  const usingFS = fsProducts.length > 0;
  const allProducts = usingFS ? fsMapped : catMapped;

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Mettre à jour l'URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (searchTerm) params.set('q', searchTerm);
    if (mainCategory) params.set('main', mainCategory);
    setSearchParams(params);
  };

  const setActiveMainCategory = (slug) => {
    setMainCategory(slug);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (searchTerm) params.set('q', searchTerm);
    if (slug) params.set('main', slug);
    setSearchParams(params);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (searchTerm) params.set('q', searchTerm);
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      type: '',
      minPrice: '',
      maxPrice: '',
      available: false
    });
    setSearchTerm('');
    setSearchParams({});
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    toast.dismiss('add-to-cart');
    toast.custom((t) => (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.35)',
          zIndex: 20000
        }}
      >
        <div
          style={{
            background: '#fff',
            borderRadius: 12,
            padding: '20px 18px 16px',
            maxWidth: '90vw',
            width: 320,
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            textAlign: 'center',
            marginTop: '22vh'
          }}
        >
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
            Le produit a été ajouté avec succès à votre panier.
          </div>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
            Que souhaitez-vous faire ?
          </div>
          <div
            style={{
              display: 'flex',
              gap: 8,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}
          >
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              style={{
                flex: 1,
                minWidth: 120,
                padding: '8px 10px',
                borderRadius: 999,
                border: '1px solid #ccc',
                background: '#fff',
                color: '#333',
                fontSize: 13,
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Poursuivre les achats
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(t.id);
                localizedNavigate('cart');
              }}
              style={{
                flex: 1,
                minWidth: 120,
                padding: '8px 10px',
                borderRadius: 999,
                border: 'none',
                background: '#e95420',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Voir le panier
            </button>
          </div>
        </div>
      </div>
    ), {
      id: 'add-to-cart',
      duration: 100,
      position: 'top-center'
    });
  };

  

  // Logique de filtrage des produits
  const mapToMainCategory = (p) => {
    const cat = (p.category || '').toLowerCase();
    if (['bûches', 'buches', 'charbon'].includes(cat)) return 'bois';
    if (['pellets', 'granulés', 'granules'].includes(cat)) return 'pellets';
    if (['allumage', 'accessoires'].includes(cat)) return 'accessoires';
    if (['poêles', 'poeles'].includes(cat)) return 'poeles';
    if (['bûches densifiées', 'buches densifiees', 'densifiees'].includes(cat)) return 'buches-densifiees';
    return '';
  };

  // Options dynamiques pour filtres
  const fixedCategories = [
    { value: 'bûches', label: 'Bois de chauffage' },
    { value: 'accessoires', label: 'Accessoires' },
    { value: 'bûches densifiées', label: 'Bûches densifiées' },
    { value: 'pellets', label: 'Pellets' },
    { value: 'poêles', label: 'Poêles' }
  ];
  const uniqueCategories = fixedCategories;
  const typesSource = allProducts.filter(p => {
    // restreindre par catégorie si sélectionnée
    if (filters.category) return p.category === filters.category;
    // restreindre par catégorie principale si définie
    if (mainCategory) return mapToMainCategory(p) === mainCategory;
    return true;
  });
  const uniqueTypes = Array.from(new Set(typesSource.map(p => (p.type || '').trim()).filter(Boolean)));

  const filteredProducts = allProducts.filter(product => {
    // Filtre par terme de recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      if (!product.name.toLowerCase().includes(searchLower) &&
          !product.description.toLowerCase().includes(searchLower) &&
          !product.category.toLowerCase().includes(searchLower)) {
        return false;
      }
    }

    // Filtre par catégorie principale (5 groupes)
    if (mainCategory) {
      if (mapToMainCategory(product) !== mainCategory) return false;
    }

    // Filtre par catégorie
    if (filters.category && product.category !== filters.category) {
      return false;
    }

    // Filtre par type
    if (filters.type && product.type !== filters.type) {
      return false;
    }

    // Filtre par prix minimum
    if (filters.minPrice && product.price < parseFloat(filters.minPrice)) {
      return false;
    }

    // Filtre par prix maximum
    if (filters.maxPrice && product.price > parseFloat(filters.maxPrice)) {
      return false;
    }

    // Filtre par disponibilité
    if (filters.available && product.stock === 0) {
      return false;
    }

    return true;
  });

  // Pagination calculée (après le filtrage)
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / (itemsPerPage || 1)));
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const pagedProducts = filteredProducts.slice(startIdx, endIdx);

  const getPageNumbers = () => {
    const pages = [];
    const maxToShow = 5;
    if (totalPages <= maxToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      const start = Math.max(1, Math.min(currentPage - 2, totalPages - (maxToShow - 1)));
      const end = Math.min(totalPages, start + maxToShow - 1);
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  // Clampe la page si le nombre total change
  useEffect(() => {
    setCurrentPage(p => Math.min(p, totalPages));
  }, [totalPages]);

  // Statistiques dynamiques (après définition de filteredProducts)
  const totalProducts = allProducts.length;
  const ratings = allProducts
    .map(p => (typeof p.rating === 'number' ? p.rating : 0))
    .filter(n => n > 0);
  const averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 4.7;
  const averageRatingFormatted = averageRating.toFixed(1);

  

  // Vue lorsqu'une catégorie est sélectionnée: filtres + produits
  return (
    <ProductsContainer>
      
      {/* 1. HEADER ÉPURÉ & TRUST BAR */}
      <CatalogHeader>
        <CatalogTitle>{t("products.title", "Nos Combustibles & Bois de Chauffage")}</CatalogTitle>
        <CatalogSubtitle>
          {t("products.subtitle", "Sélectionnez vos stères de bois dur fendu (chêne, hêtre, charme) ou vos granulés certifiés DINplus.")}
        </CatalogSubtitle>
        
        <TrustPillBar>
          <span><FaFire size={13} style={{ color: '#d97706' }} /> Humidité garantie &lt; 20%</span>
          <span><FiTruck size={14} style={{ color: '#16a34a' }} /> Livraison à domicile 24-48h</span>
          <span><FiShield size={14} style={{ color: '#2563eb' }} /> Virement sécurisé (Vorkasse)</span>
          <span><FiStar size={13} style={{ color: '#f59e0b' }} /> Note 4.8/5</span>
        </TrustPillBar>
      </CatalogHeader>

      {/* 2. BARRE DE CATÉGORIES DÉFILANTE (SWIPEABLE HORIZONTAL CHIPS) */}
      <CategoryPillsScroll>
        <CategoryChip 
          $active={!mainCategory} 
          onClick={() => setActiveMainCategory('')}
        >
          🌲 {t('home.cat_all', 'Tout voir')} ({allProducts.length})
        </CategoryChip>
        <CategoryChip 
          $active={mainCategory === 'bois'} 
          onClick={() => setActiveMainCategory('bois')}
        >
          🪵 {t('home.cat_wood', 'Bois de chauffage')}
        </CategoryChip>
        <CategoryChip 
          $active={mainCategory === 'pellets'} 
          onClick={() => setActiveMainCategory('pellets')}
        >
          ⚡ {t('home.cat_pellets', 'Pellets & Granulés')}
        </CategoryChip>
        <CategoryChip 
          $active={mainCategory === 'buches-densifiees'} 
          onClick={() => setActiveMainCategory('buches-densifiees')}
        >
          🧱 {t('home.cat_briquettes', 'Bûches densifiées')}
        </CategoryChip>
        <CategoryChip 
          $active={mainCategory === 'accessoires'} 
          onClick={() => setActiveMainCategory('accessoires')}
        >
          🪓 {t('home.cat_accessories', 'Accessoires')}
        </CategoryChip>
        <CategoryChip 
          $active={mainCategory === 'poeles'} 
          onClick={() => setActiveMainCategory('poeles')}
        >
          ♨️ {t('home.cat_stoves', 'Poêles')}
        </CategoryChip>
      </CategoryPillsScroll>

      {/* 3. TOOLBAR CONDENSÉE (RECHERCHE + BOUTON FILTRE + VUE) */}
      <CatalogToolbar>
        <SearchBox>
          <FiSearch className="search-icon" size={16} />
          <input
            type="text"
            placeholder={t('products.search_placeholder', 'Rechercher un produit (ex: chêne 33cm, pellets...)...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-btn" onClick={() => setSearchTerm('')} title="Effacer">
              <FiX size={15} />
            </button>
          )}
        </SearchBox>

        <ToolbarActions>
          <FilterTriggerBtn 
            $hasFilters={Boolean(filters.type || filters.minPrice || filters.maxPrice || filters.available)}
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <FiFilter size={15} />
            <span>Filtres</span>
            {(Boolean(filters.type) + Boolean(filters.minPrice) + Boolean(filters.maxPrice) + Boolean(filters.available)) > 0 && (
              <FilterBadge>
                {Boolean(filters.type) + Boolean(filters.minPrice) + Boolean(filters.maxPrice) + Boolean(filters.available)}
              </FilterBadge>
            )}
          </FilterTriggerBtn>

          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            {filteredProducts.length} {t("products.products_found", "produits")}
          </span>

          <ViewToggleCompact>
            <ViewBtn 
              $active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
              title="Vue Grille"
            >
              <FiGrid size={15} />
            </ViewBtn>
            <ViewBtn 
              $active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
              title="Vue Liste"
            >
              <FiList size={15} />
            </ViewBtn>
          </ViewToggleCompact>
        </ToolbarActions>
      </CatalogToolbar>

      {/* 4. TIROIR DE FILTRES AVANCÉS DÉPLIABLE */}
      {isFiltersOpen && (
        <CollapsibleFiltersPanel>
          <FilterPanelHeader>
            <h4><FiFilter size={16} /> Filtres avancés</h4>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button className="reset-btn" onClick={clearFilters}>Réinitialiser tout</button>
              <button 
                onClick={() => setIsFiltersOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <FiX size={18} />
              </button>
            </div>
          </FilterPanelHeader>

          <FilterFieldsGrid>
            {uniqueTypes.length > 0 && (
              <FilterItem>
                <label>Type spécifique</label>
                <select 
                  value={filters.type} 
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <option value="">Tous les types</option>
                  {uniqueTypes.map(t => (
                    <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
                  ))}
                </select>
              </FilterItem>
            )}

            <FilterItem>
              <label>Prix minimum (€)</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                placeholder="0 €"
              />
            </FilterItem>

            <FilterItem>
              <label>Prix maximum (€)</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                placeholder="1000 €"
              />
            </FilterItem>
          </FilterFieldsGrid>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <FilterCheckbox>
              <input
                type="checkbox"
                checked={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.checked)}
              />
              <span>En stock uniquement ({allProducts.filter(p => p.stock > 0).length})</span>
            </FilterCheckbox>

            <button 
              onClick={() => setIsFiltersOpen(false)}
              style={{
                background: '#1b3b22',
                color: '#ffffff',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Voir les {filteredProducts.length} résultats
            </button>
          </div>
        </CollapsibleFiltersPanel>
      )}


      {filteredProducts.length === 0 ? (
        <NoProducts>
          <h3>{t("products.no_products")}</h3>
          <p>{t("products.try_other_criteria")}</p>
        </NoProducts>
      ) : (
        <>
          <div style={{ marginBottom: '20px', color: '#666', fontSize: '16px' }}>
            {filteredProducts.length} {t("products.products_found")}
          </div>
          
          {viewMode === 'grid' ? (
            <ProductsGrid>
              {pagedProducts.map(product => (
                <ProductCardEnhanced
                  key={product.id}
                  onClick={() => localizedNavigate(inDashboard ? 'dashboardProductDetail' : 'productDetail', product.id)}
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const dx = (x - rect.width / 2) / rect.width; // -0.5 .. 0.5
                    const dy = (y - rect.height / 2) / rect.height; // -0.5 .. 0.5
                    el.style.setProperty('--tx', `${dx * 6}px`);
                    el.style.setProperty('--ty', `${dy * 6}px`);
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.setProperty('--tx', '0px');
                    el.style.setProperty('--ty', '0px');
                  }}
                >
                  <ProductImageContainer>
                    <ProductImage 
                      src={productImages[product.id] || product.image || `https://picsum.photos/seed/${product.id}/800/500`} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://picsum.photos/seed/fallback/800/500';
                      }}
                    />
                    
                    <ProductBadges>
                      {product.sale && <Badge type="sale">{t("products.sale")}</Badge>}
                      {product.new && <Badge type="new">{t("products.new")}</Badge>}
                    </ProductBadges>
                  </ProductImageContainer>
                  
                  <ProductContent>
                    <ProductHeader>
                      <ProductName>{product.name}</ProductName>
                      <ProductPrice>{product.price}€</ProductPrice>
                    </ProductHeader>
                    
                    <ProductDescription>{product.description}</ProductDescription>
                    
                    <ProductInfo>
                      <ProductRating>
                        {(() => { const r = product.rating || 4.5; return (
                          <>
                            <div className="stars">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  size={14}
                                  fill={i < Math.floor(r) ? '#f39c12' : 'none'}
                                />
                              ))}
                            </div>
                            <span className="rating-text">{r} ({product.reviewCount || 0})</span>
                          </>
                        ); })()}
                      </ProductRating>
                      
                      <ProductStock inStock={product.stock > 0}>
                        {product.stock > 0 ? t('products.in_stock') : t('products.out_of_stock')}
                      </ProductStock>
                    </ProductInfo>
                    
                    <ProductSpecs>
                      <div className="spec-item">
                        <span>{t("products.weight")}</span>
                        <span className="spec-value">{product.weight}</span>
                      </div>
                      <div className="spec-item">
                        <span>{t("products.dimensions")}</span>
                        <span className="spec-value">{product.dimensions}</span>
                      </div>
                      <div className="spec-item">
                        <span>{t("products.humidity")}</span>
                        <span className="spec-value">{product.humidity}</span>
                      </div>
                      <div className="spec-item">
                        <span>{t("products.calorific")}</span>
                        <span className="spec-value">{product.calorificValue}</span>
                      </div>
                    </ProductSpecs>
                    
                    <ProductActions>
                      <AddToCartButton onClick={(e) => { e.stopPropagation(); handleAddToCart(product); }}>
                        <FiShoppingCart size={16} />
                        {t("products.add_to_cart")}
                      </AddToCartButton>
                      <QuickViewButton onClick={(e) => { e.stopPropagation(); localizedNavigate(inDashboard ? 'dashboardProductDetail' : 'productDetail', product.id); }}>
                        {t("products.quick_view")}
                      </QuickViewButton>
                    </ProductActions>
                  </ProductContent>
                </ProductCardEnhanced>
              ))}
            </ProductsGrid>
          ) : (
            <ProductsList>
              {pagedProducts.map(product => (
                <ProductCardEnhanced
                  key={product.id}
                  style={{ display: 'flex', flexDirection: 'row' }}
                  onClick={() => localizedNavigate(inDashboard ? 'dashboardProductDetail' : 'productDetail', product.id)}
                  onMouseMove={(e) => {
                    const el = e.currentTarget;
                    const rect = el.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    const dx = (x - rect.width / 2) / rect.width;
                    const dy = (y - rect.height / 2) / rect.height;
                    el.style.setProperty('--tx', `${dx * 6}px`);
                    el.style.setProperty('--ty', `${dy * 6}px`);
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.setProperty('--tx', '0px');
                    el.style.setProperty('--ty', '0px');
                  }}
                >
                  <ProductImageContainer style={{ width: '200px', height: '150px' }}>
                    <ProductImage 
                      src={productImages[product.id] || product.image || `https://picsum.photos/seed/${product.id}/800/500`} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-wood.jpg';
                      }}
                    />
                    {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('debugImages') === '1' && (
                      <div style={{ padding: 8, fontSize: 12, color: '#666' }}>{productImages[product.id] || product.image || `https://picsum.photos/seed/${product.id}/800/500`}</div>
                    )}
                    <ProductBadges>
                      {product.sale && <Badge type="sale">{t("products.sale")}</Badge>}
                      {product.new && <Badge type="new">{t("products.new")}</Badge>}
                    </ProductBadges>
                  </ProductImageContainer>
                  
                  <ProductContent style={{ flex: 1 }}>
                    <ProductHeader>
                      <ProductName>{product.name}</ProductName>
                      <ProductPrice>{product.price}€</ProductPrice>
                    </ProductHeader>
                    
                    <ProductDescription>{product.description}</ProductDescription>
                    
                    <ProductInfo>
                      <ProductRating>
                        {(() => { const r = product.rating || 4.5; return (
                          <>
                            <div className="stars">
                              {[...Array(5)].map((_, i) => (
                                <FiStar 
                                  key={i} 
                                  size={14} 
                                  fill={i < Math.floor(r) ? '#f39c12' : 'none'} 
                                />
                              ))}
                            </div>
                            <span className="rating-text">{r} ({product.reviewCount || 0})</span>
                          </>
                        ); })()}
                      </ProductRating>
                      
                      <ProductStock inStock={product.stock > 0}>
                        {product.stock > 0 ? t('products.in_stock') : t('products.out_of_stock')}
                      </ProductStock>
                    </ProductInfo>
                    
                    <ProductActions>
                      <AddToCartButton onClick={() => handleAddToCart(product)}>
                        <FiShoppingCart size={16} />
                        {t("products.add_to_cart")}
                      </AddToCartButton>
                      <QuickViewButton onClick={(e) => { e.stopPropagation(); localizedNavigate(inDashboard ? 'dashboardProductDetail' : 'productDetail', product.id); }}>
                        {t("products.quick_view")}
                      </QuickViewButton>
                    </ProductActions>
                  </ProductContent>
                </ProductCardEnhanced>
              ))}
            </ProductsList>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <PaginationBar>
              <PageButton onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
                {t("products.prev")}
              </PageButton>
              {getPageNumbers().map(n => (
                <PageButton key={n} $active={n === currentPage} onClick={() => setCurrentPage(n)}>
                  {n}
                </PageButton>
              ))}
              {getPageNumbers()[getPageNumbers().length - 1] < totalPages && (
                <PageInfo>…</PageInfo>
              )}
              <PageButton onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                {t("products.next")}
              </PageButton>
            </PaginationBar>
          )}

        </>
      )}
    </ProductsContainer>
  );
};

export default Products;
