import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiFilter, FiGrid, FiList, FiStar, FiShoppingCart, FiTag, FiTruck, FiShield } from 'react-icons/fi';

const ProductsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageHeader = styled.div`
  margin-bottom: 40px;
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 10px;
`;

const PageSubtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const FiltersSection = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  margin-bottom: 40px;
`;

const FiltersHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const FiltersTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2c5530;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ViewToggle = styled.div`
  display: flex;
  gap: 10px;
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
`;

const FiltersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
`;

const FilterGroup = styled.div`
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 8px;
    color: #333;
  }
  
  select, input {
    width: 100%;
    padding: 10px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    outline: none;
    transition: border-color 0.3s ease;
    
    &:focus {
      border-color: #2c5530;
    }
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
  margin-bottom: 20px;
  
  &:focus {
    border-color: #2c5530;
  }
`;

const ProductsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
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
`;

const ProductContent = styled.div`
  padding: 25px;
`;

const ProductHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #2c5530;
  margin: 0;
  line-height: 1.3;
  flex: 1;
`;

const ProductPrice = styled.div`
  font-size: 22px;
  font-weight: 700;
  color: #27ae60;
  margin-left: 15px;
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
`;

const ProductInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
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
`;

const ViewButton = styled(Link)`
  background: transparent;
  color: #2c5530;
  border: 2px solid #2c5530;
  padding: 12px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
  font-size: 14px;
  
  &:hover {
    background: #2c5530;
    color: white;
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

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #2c5530;
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
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [viewMode, setViewMode] = useState('grid');

  // Données complètes de produits
  const allProducts = [
    {
      id: '1',
      name: 'Bûches de Chêne Premium',
      description: 'Bûches de chêne séchées 2 ans, idéales pour un feu de longue durée avec une excellente valeur calorifique. Parfait pour les cheminées et poêles.',
      price: 45.99,
      category: 'bûches',
      type: 'chêne',
      stock: 150,
      image: 'https://images.unsplash.com/photo-1544966503-7cc4acb4c1a9?w=400',
      rating: 4.8,
      reviewCount: 127,
      sale: false,
      new: false,
      weight: '25kg',
      dimensions: '33cm',
      humidity: '< 20%',
      calorificValue: '4.2 kWh/kg'
    },
    {
      id: '2',
      name: 'Granulés de Bois Certifiés',
      description: 'Granulés de bois certifiés DIN Plus, parfaits pour poêles et chaudières à granulés. Faible taux de cendre et haute performance.',
      price: 6.99,
      category: 'granulés',
      type: 'mélange',
      stock: 200,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      rating: 4.9,
      reviewCount: 89,
      sale: true,
      new: false,
      weight: '15kg',
      dimensions: '6mm',
      humidity: '< 10%',
      calorificValue: '4.8 kWh/kg'
    },
    {
      id: '3',
      name: 'Bûches de Hêtre Séchées',
      description: 'Bûches de hêtre séchées naturellement, excellent pouvoir calorifique et flamme vive. Idéal pour un chauffage efficace.',
      price: 42.50,
      category: 'bûches',
      type: 'hêtre',
      stock: 120,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      rating: 4.7,
      reviewCount: 95,
      sale: false,
      new: true,
      weight: '25kg',
      dimensions: '33cm',
      humidity: '< 20%',
      calorificValue: '4.1 kWh/kg'
    },
    {
      id: '4',
      name: 'Pellets Premium',
      description: 'Pellets de qualité premium, faible taux de cendre et haute performance énergétique. Certifiés ENplus A1.',
      price: 8.50,
      category: 'pellets',
      type: 'premium',
      stock: 180,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
      rating: 4.6,
      reviewCount: 76,
      sale: false,
      new: false,
      weight: '15kg',
      dimensions: '6mm',
      humidity: '< 8%',
      calorificValue: '5.0 kWh/kg'
    },
    {
      id: '5',
      name: 'Kit Allumage Naturel',
      description: 'Kit complet pour allumer votre feu facilement avec des produits naturels et écologiques. Contient allume-feu et petit bois.',
      price: 12.99,
      category: 'allumage',
      type: 'naturel',
      stock: 85,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      rating: 4.5,
      reviewCount: 43,
      sale: true,
      new: false,
      weight: '2kg',
      dimensions: '15cm',
      humidity: '< 15%',
      calorificValue: '3.5 kWh/kg'
    },
    {
      id: '6',
      name: 'Bûches de Charme',
      description: 'Bûches de charme séchées, combustion lente et régulière, parfait pour la nuit. Excellent pouvoir calorifique.',
      price: 48.99,
      category: 'bûches',
      type: 'charme',
      stock: 95,
      image: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=400',
      rating: 4.8,
      reviewCount: 112,
      sale: false,
      new: false,
      weight: '25kg',
      dimensions: '33cm',
      humidity: '< 20%',
      calorificValue: '4.3 kWh/kg'
    },
    {
      id: '7',
      name: 'Bûches de Frêne',
      description: 'Bûches de frêne séchées, combustion rapide et intense. Parfait pour démarrer un feu ou pour un chauffage rapide.',
      price: 44.50,
      category: 'bûches',
      type: 'frêne',
      stock: 110,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
      rating: 4.6,
      reviewCount: 78,
      sale: false,
      new: false,
      weight: '25kg',
      dimensions: '33cm',
      humidity: '< 20%',
      calorificValue: '4.0 kWh/kg'
    },
    {
      id: '8',
      name: 'Bûches Mélangées',
      description: 'Mélange de différentes essences de bois, offrant un équilibre parfait entre pouvoir calorifique et durée de combustion.',
      price: 39.99,
      category: 'bûches',
      type: 'mélange',
      stock: 160,
      image: 'https://images.unsplash.com/photo-1544966503-7cc4acb4c1a9?w=400',
      rating: 4.4,
      reviewCount: 134,
      sale: false,
      new: false,
      weight: '25kg',
      dimensions: '33cm',
      humidity: '< 20%',
      calorificValue: '3.9 kWh/kg'
    },
    {
      id: '9',
      name: 'Granulés de Pin',
      description: 'Granulés de pin 100% naturels, haute densité énergétique et combustion propre. Certifiés DIN Plus.',
      price: 7.50,
      category: 'granulés',
      type: 'pin',
      stock: 140,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
      rating: 4.7,
      reviewCount: 67,
      sale: false,
      new: false,
      weight: '15kg',
      dimensions: '6mm',
      humidity: '< 10%',
      calorificValue: '4.9 kWh/kg'
    },
    {
      id: '10',
      name: 'Charbon de Bois Premium',
      description: 'Charbon de bois de qualité supérieure, longue durée de combustion et chaleur intense. Idéal pour barbecues et chauffage.',
      price: 15.99,
      category: 'charbon',
      type: 'bois',
      stock: 75,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
      rating: 4.5,
      reviewCount: 52,
      sale: false,
      new: false,
      weight: '10kg',
      dimensions: 'Variable',
      humidity: '< 5%',
      calorificValue: '7.5 kWh/kg'
    },
    {
      id: '11',
      name: 'Allume-Feu Naturel',
      description: 'Allume-feu 100% naturel à base de cire d\'abeille et de sciure de bois. Sans produits chimiques, parfait pour l\'allumage.',
      price: 8.99,
      category: 'allumage',
      type: 'cire',
      stock: 90,
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
      rating: 4.6,
      reviewCount: 41,
      sale: true,
      new: false,
      weight: '1kg',
      dimensions: '8cm',
      humidity: '< 5%',
      calorificValue: '6.0 kWh/kg'
    },
    {
      id: '12',
      name: 'Pellets de Hêtre',
      description: 'Pellets de hêtre de haute qualité, excellent pouvoir calorifique et faible taux de cendre. Certifiés ENplus A1.',
      price: 9.25,
      category: 'pellets',
      type: 'hêtre',
      stock: 125,
      image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400',
      rating: 4.8,
      reviewCount: 89,
      sale: false,
      new: false,
      weight: '15kg',
      dimensions: '6mm',
      humidity: '< 8%',
      calorificValue: '5.1 kWh/kg'
    }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Mettre à jour l'URL
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    if (searchTerm) params.set('q', searchTerm);
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

  const handleAddToCart = (productId, productName) => {
    console.log(`Ajout au panier: ${productName} (ID: ${productId})`);
    alert(`${productName} a été ajouté au panier !`);
  };

  // Logique de filtrage des produits
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

  return (
    <ProductsContainer>
      <PageHeader>
        <PageTitle>Nos Produits</PageTitle>
        <PageSubtitle>
          Découvrez notre large gamme de bois de chauffage de qualité
        </PageSubtitle>
        
        {/* Statistiques rapides */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px', 
          marginTop: '30px' 
        }}>
          <div style={{ 
            background: 'linear-gradient(135deg, #2c5530, #27ae60)', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '12px', 
            textAlign: 'center' 
          }}>
            <FiTag size={32} style={{ marginBottom: '10px' }} />
            <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>12 Produits</h4>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Dans notre catalogue</p>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #27ae60, #2ecc71)', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '12px', 
            textAlign: 'center' 
          }}>
            <FiTruck size={32} style={{ marginBottom: '10px' }} />
            <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Livraison</h4>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>24-48h partout en France</p>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #f39c12, #e67e22)', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '12px', 
            textAlign: 'center' 
          }}>
            <FiStar size={32} style={{ marginBottom: '10px' }} />
            <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>4.7/5</h4>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Note moyenne clients</p>
          </div>
          
          <div style={{ 
            background: 'linear-gradient(135deg, #e74c3c, #c0392b)', 
            color: 'white', 
            padding: '20px', 
            borderRadius: '12px', 
            textAlign: 'center' 
          }}>
            <FiShield size={32} style={{ marginBottom: '10px' }} />
            <h4 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>Garantie</h4>
            <p style={{ margin: 0, opacity: 0.9, fontSize: '14px' }}>Qualité certifiée</p>
          </div>
        </div>
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
              <option value="bûches">Bûches</option>
              <option value="granulés">Granulés</option>
              <option value="pellets">Pellets</option>
              <option value="charbon">Charbon</option>
              <option value="allumage">Allumage</option>
            </select>
          </FilterGroup>

          <FilterGroup>
            <label>Type</label>
            <select 
              value={filters.type} 
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">Tous les types</option>
              <option value="chêne">Chêne</option>
              <option value="hêtre">Hêtre</option>
              <option value="charme">Charme</option>
              <option value="frêne">Frêne</option>
              <option value="mélange">Mélange</option>
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
            <label>
              <input
                type="checkbox"
                checked={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.checked)}
              />
              En stock uniquement
            </label>
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
                      <ViewButton to={`/product/${product.id}`}>
                        Voir
                      </ViewButton>
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
                      <ViewButton to={`/product/${product.id}`}>
                        Voir
                      </ViewButton>
                    </ProductActions>
                  </ProductContent>
                </ProductCardEnhanced>
              ))}
            </ProductsList>
          )}
        </>
      )}
    </ProductsContainer>
  );
};

export default Products;

