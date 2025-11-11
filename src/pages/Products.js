import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiFilter, FiGrid, FiList, FiStar, FiShoppingCart, FiTag, FiTruck, FiShield } from 'react-icons/fi';
import { products as catalogue } from '../data/catalogue.js';
import ProductQuickView from '../components/ProductQuickView';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';

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

const CategoryCards = styled.div`
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 12px;
  margin: 16px 0 24px;

  @media (max-width: 900px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

const CategoryCard = styled(Link)`
  position: relative;
  display: block;
  height: 140px;
  border-radius: 12px;
  overflow: hidden;
  background: #eef3ee;
  text-decoration: none;
  border: 2px solid #e0e0e0;
  transition: transform .2s ease, box-shadow .2s ease, border-color .2s ease;

  &:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,.08); border-color: #2c5530; }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(0,0,0,.45)), var(--bg-img);
    background-size: cover;
    background-position: center;
  }

  span {
    position: absolute;
    left: 12px;
    bottom: 12px;
    color: #fff;
    font-weight: 800;
    letter-spacing: .2px;
    text-shadow: 0 2px 6px rgba(0,0,0,.4);
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
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: 12px;
  margin-bottom: 40px;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(6, 1fr);
  }

  @media (max-width: 1200px) {
    grid-template-columns: repeat(5, 1fr);
  }
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 16px;
  }
  
  @media (max-width: 600px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }
`;

const ProductsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

// Composants pour les cartes produits améliorées
const ProductCardEnhanced = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
  
  @media (max-width: 768px) {
    height: 130px;
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
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  
  @media (max-width: 768px) {
    padding: 4px 8px;
    font-size: 10px;
  }
`;

const ProductContent = styled.div`
  padding: 25px;
  
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
    margin-bottom: 10px;
  }
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #2c5530;
  margin: 0;
  line-height: 1.3;
  flex: 1;
  
  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const ProductPrice = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #27ae60;
  margin-left: 15px;
  
  @media (max-width: 768px) {
    font-size: 16px;
    margin-left: 8px;
  }
`;

const ProductDescription = styled.p`
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 8px;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  
  @media (max-width: 768px) {
    margin-bottom: 8px;
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
  gap: 8px;
  margin-bottom: 20px;
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
`;

const ProductActions = styled.div`
  display: flex;
  gap: 10px;
  
  @media (max-width: 768px) {
    gap: 6px;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  background: #2c5530;
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    background: #1e3a22;
    transform: translateY(-1px);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 10px;
    font-size: 13px;
    border-radius: 6px;
    gap: 6px;
  }
`;

const QuickViewButton = styled.button`
  background: transparent;
  color: #2c5530;
  border: 2px solid #2c5530;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  cursor: pointer;
  
  &:hover {
    background: #2c5530;
    color: white;
  }
  
  @media (max-width: 768px) {
    padding: 10px 14px;
    font-size: 13px;
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

 

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
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
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { addToCart } = useCart();

  // Synchronise la catégorie principale avec l'URL
  useEffect(() => {
    const urlMain = searchParams.get('main') || '';
    setMainCategory(urlMain);
  }, [searchParams]);

  // Catalogue importé
  const allProducts = catalogue.map((p, i) => {
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
      image: '/placeholder-wood.jpg',
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
    toast.success('Produit ajouté au panier');
  };

  const openQuickView = (product) => {
    setSelectedProduct(product);
    setQuickViewOpen(true);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleQuickViewAddToCart = (product) => {
    if (!product) return;
    handleAddToCart(product);
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

  // Statistiques dynamiques (après définition de filteredProducts)
  const totalProducts = allProducts.length;
  const visibleCount = filteredProducts.length;
  const ratings = allProducts
    .map(p => (typeof p.rating === 'number' ? p.rating : 0))
    .filter(n => n > 0);
  const averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 4.7;
  const averageRatingFormatted = averageRating.toFixed(1);

  

  // Vue lorsqu'une catégorie est sélectionnée: filtres + produits
  return (
    <ProductsContainer>
      <PageHeader>
        <PageTitle>Nos Produits</PageTitle>
        <PageSubtitle>
          Découvrez notre large gamme de bois de chauffage de qualité
        </PageSubtitle>
        
        {/* Statistiques rapides */}
        <StatsGrid>
          <StatCard style={{ background: 'linear-gradient(135deg, #2c5530, #27ae60)' }}>
            <FiTag size={24} style={{ marginBottom: '6px' }} />
            <h4>{totalProducts} Produits</h4>
            <p style={{ margin: 0, opacity: 0.9 }}>Dans notre catalogue</p>
          </StatCard>

          <StatCard style={{ background: 'linear-gradient(135deg, #27ae60, #2ecc71)' }}>
            <FiTruck size={24} style={{ marginBottom: '6px' }} />
            <h4>Livraison</h4>
            <p style={{ margin: 0, opacity: 0.9 }}>24-48h partout en France</p>
          </StatCard>

          <StatCard style={{ background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}>
            <FiStar size={24} style={{ marginBottom: '6px' }} />
            <h4>{averageRatingFormatted}/5</h4>
            <p style={{ margin: 0, opacity: 0.9 }}>Note moyenne clients</p>
          </StatCard>

          <StatCard style={{ background: 'linear-gradient(135deg, #e74c3c, #c0392b)' }}>
            <FiShield size={24} style={{ marginBottom: '6px' }} />
            <h4>Garantie</h4>
            <p style={{ margin: 0, opacity: 0.9 }}>Qualité certifiée</p>
          </StatCard>
        </StatsGrid>
      </PageHeader>

      <FiltersSection>
        <FiltersHeader>
          <FiltersTitle>
            <FiFilter size={20} />
            Filtres et recherche
          </FiltersTitle>
          <ViewToggle>
            <ViewToggleButton 
              active={viewMode === 'grid'} 
              onClick={() => setViewMode('grid')}
            >
              <FiGrid size={16} />
            </ViewToggleButton>
            <ViewToggleButton 
              active={viewMode === 'list'} 
              onClick={() => setViewMode('list')}
            >
              <FiList size={16} />
            </ViewToggleButton>
          </ViewToggle>
        </FiltersHeader>

        <form onSubmit={handleSearch}>
          <SearchInput
            type="text"
            placeholder="Rechercher des produits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>

        <FiltersGrid>
          <FilterGroup>
            <label>Catégorie</label>
            <select 
              value={filters.category} 
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {uniqueCategories.map(cat => {
                const value = typeof cat === 'string' ? cat : cat.value;
                const label = typeof cat === 'string' ? (cat.charAt(0).toUpperCase() + cat.slice(1)) : cat.label;
                return (
                  <option key={value} value={value}>{label}</option>
                );
              })}
            </select>
          </FilterGroup>

          <FilterGroup>
            <label>Type</label>
            <select 
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Tous les types</option>
              {uniqueTypes.length === 0 ? null : uniqueTypes.map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup>
            <label>Prix minimum (€)</label>
            <input
              type="number"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              placeholder="0"
            />
          </FilterGroup>

          <FilterGroup>
            <label>Prix maximum (€)</label>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              placeholder="1000"
            />
          </FilterGroup>

          <FilterGroup>
            <CheckboxLabel>
              En stock uniquement
              <input
                type="checkbox"
                checked={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.checked)}
              />
            </CheckboxLabel>
          </FilterGroup>
        </FiltersGrid>

        <div style={{ marginTop: '20px', textAlign: 'right' }}>
          <button 
            onClick={clearFilters}
            style={{
              background: 'none',
              border: '2px solid #e0e0e0',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            Effacer les filtres
          </button>
        </div>
        {/* Catégories principales déplacées sous la carte de filtres */}
        <div style={{ marginTop: '16px' }}>
          <CategoriesNav>
            <CategoryButton $active={!mainCategory} onClick={() => setActiveMainCategory('')}>
              Voir tout
            </CategoryButton>
            <CategoryButton $active={mainCategory==='bois'} onClick={() => setActiveMainCategory('bois')}>
              Bois de chauffage
            </CategoryButton>
            <CategoryButton $active={mainCategory==='accessoires'} onClick={() => setActiveMainCategory('accessoires')}>
              Accessoires
            </CategoryButton>
            <CategoryButton $active={mainCategory==='buches-densifiees'} onClick={() => setActiveMainCategory('buches-densifiees')}>
              Bûches densifiées
            </CategoryButton>
            <CategoryButton $active={mainCategory==='pellets'} onClick={() => setActiveMainCategory('pellets')}>
              Pellets de bois
            </CategoryButton>
            <CategoryButton $active={mainCategory==='poeles'} onClick={() => setActiveMainCategory('poeles')}>
              Poêles
            </CategoryButton>
          </CategoriesNav>
        </div>
      </FiltersSection>

      {filteredProducts.length === 0 ? (
        <NoProducts>
          <h3>Aucun produit trouvé</h3>
          <p>Essayez de modifier vos critères de recherche</p>
        </NoProducts>
      ) : (
        <>
          <div style={{ marginBottom: '20px', color: '#666', fontSize: '16px' }}>
            {filteredProducts.length} produit(s) trouvé(s)
          </div>
          
          {viewMode === 'grid' ? (
            <ProductsGrid>
              {filteredProducts.map(product => (
                <ProductCardEnhanced key={product.id}>
                  <ProductImageContainer>
                    <ProductImage 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-wood.jpg';
                      }}
                    />
                    <ProductBadges>
                      {product.sale && <Badge type="sale">Promo</Badge>}
                      {product.new && <Badge type="new">Nouveau</Badge>}
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
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              size={14} 
                              fill={i < Math.floor(product.rating) ? '#f39c12' : 'none'} 
                            />
                          ))}
                        </div>
                        <span className="rating-text">
                          {product.rating} ({product.reviewCount})
                        </span>
                      </ProductRating>
                      
                      <ProductStock inStock={product.stock > 0}>
                        {product.stock > 0 ? 'En stock' : 'Rupture'}
                      </ProductStock>
                    </ProductInfo>
                    
                    <ProductSpecs>
                      <div className="spec-item">
                        <span>Poids:</span>
                        <span className="spec-value">{product.weight}</span>
                      </div>
                      <div className="spec-item">
                        <span>Dimensions:</span>
                        <span className="spec-value">{product.dimensions}</span>
                      </div>
                      <div className="spec-item">
                        <span>Humidité:</span>
                        <span className="spec-value">{product.humidity}</span>
                      </div>
                      <div className="spec-item">
                        <span>Calorifique:</span>
                        <span className="spec-value">{product.calorificValue}</span>
                      </div>
                    </ProductSpecs>
                    
                    <ProductActions>
                      <AddToCartButton onClick={() => handleAddToCart(product.id, product.name)}>
                        <FiShoppingCart size={16} />
                        Ajouter
                      </AddToCartButton>
                      <QuickViewButton onClick={() => openQuickView(product)}>
                        Voir
                      </QuickViewButton>
                    </ProductActions>
                  </ProductContent>
                </ProductCardEnhanced>
              ))}
            </ProductsGrid>
          ) : (
            <ProductsList>
              {filteredProducts.map(product => (
                <ProductCardEnhanced key={product.id} style={{ display: 'flex', flexDirection: 'row' }}>
                  <ProductImageContainer style={{ width: '200px', height: '150px' }}>
                    <ProductImage 
                      src={product.image} 
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = '/placeholder-wood.jpg';
                      }}
                    />
                    <ProductBadges>
                      {product.sale && <Badge type="sale">Promo</Badge>}
                      {product.new && <Badge type="new">Nouveau</Badge>}
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
                        <div className="stars">
                          {[...Array(5)].map((_, i) => (
                            <FiStar 
                              key={i} 
                              size={14} 
                              fill={i < Math.floor(product.rating) ? '#f39c12' : 'none'} 
                            />
                          ))}
                        </div>
                        <span className="rating-text">
                          {product.rating} ({product.reviewCount})
                        </span>
                      </ProductRating>
                      
                      <ProductStock inStock={product.stock > 0}>
                        {product.stock > 0 ? 'En stock' : 'Rupture'}
                      </ProductStock>
                    </ProductInfo>
                    
                    <ProductActions>
                      <AddToCartButton onClick={() => handleAddToCart(product.id, product.name)}>
                        <FiShoppingCart size={16} />
                        Ajouter
                      </AddToCartButton>
                      <QuickViewButton onClick={() => openQuickView(product)}>
                        Voir
                      </QuickViewButton>
                    </ProductActions>
                  </ProductContent>
                </ProductCardEnhanced>
              ))}
            </ProductsList>
          )}
          <ProductQuickView 
            open={quickViewOpen}
            product={selectedProduct}
            onClose={() => setQuickViewOpen(false)}
            onAddToCart={handleQuickViewAddToCart}
          />
        </>
      )}
    </ProductsContainer>
  );
};

export default Products;
