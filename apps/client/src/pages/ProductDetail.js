import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiStar, FiShoppingCart, FiTruck, FiShield, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { getProductById } from '../firebase/products';
import { products as catalogue } from '../data/catalogue.js';
import toast from 'react-hot-toast';

 

const ProductDetailContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px 16px;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  color: #2c5530;
  cursor: pointer;
  font-weight: 500;
  margin-bottom: 20px;
  
  &:hover {
    color: #1e3a22;
  }
  
  @media (max-width: 768px) {
    margin-bottom: 12px;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 24px;
  
  @media (max-width: 992px) {
    gap: 24px;
    padding: 20px;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 320px;
  object-fit: contain; /* show the entire product without cropping */
  border-radius: 12px;
  background: #ffffff; /* neutral backdrop around contained image */
  
  @media (max-width: 992px) {
    height: 280px;
  }
  
  @media (max-width: 768px) {
    height: 240px;
  }
  
  @media (max-width: 480px) {
    height: 200px;
  }
`;

const ProductInfo = styled.div`
  h1 {
    font-size: 32px;
    font-weight: 700;
    color: #2c5530;
    margin-bottom: 15px;
  }
  
  .price {
    font-size: 28px;
    font-weight: 700;
    color: #27ae60;
    margin-bottom: 20px;
  }
  
  .description {
    color: #666;
    line-height: 1.6;
    margin-bottom: 30px;
    font-size: 16px;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  
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

const StockInfo = styled.div`
  background: ${props => props.inStock ? '#d4edda' : '#f8d7da'};
  color: ${props => props.inStock ? '#155724' : '#721c24'};
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 30px;
  font-weight: 600;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  
  label {
    font-weight: 600;
    color: #333;
  }
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const QuantityButton = styled.button`
  width: 40px;
  height: 40px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2c5530;
    color: #2c5530;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 80px;
  text-align: center;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 10px;
  font-weight: 600;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #2c5530;
  }
`;

const AddToCartButton = styled.button`
  background: #2c5530;
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    background: #1e3a22;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-top: 24px;
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  
  svg {
    color: #2c5530;
  }
  
  div {
    h4 {
      font-size: 14px;
      font-weight: 600;
      color: #2c5530;
      margin-bottom: 5px;
    }
    
    p {
      font-size: 12px;
      color: #666;
    }
  }
`;

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
  color: #2c5530;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #e74c3c;
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, isInCart, getCartItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await getProductById(id);

        if (result.success && result.data) {
          setProduct(result.data);
        } else {
          // Fallback local catalogue
          const mapMainToCategory = (main) => {
            const m = (main || '').toLowerCase();
            if (['bois', 'bûches', 'buches', 'charbon'].includes(m)) return 'bûches';
            if (['pellets', 'granulés', 'granules'].includes(m)) return 'pellets';
            if (['allumage', 'accessoires'].includes(m)) return 'accessoires';
            if (['poêles', 'poeles'].includes(m)) return 'poêles';
            if (['bûches densifiées', 'buches densifiees', 'densifiees'].includes(m)) return 'bûches densifiées';
            return '';
          };

          const buildFromCatalogue = (p, idx) => ({
            id: p.id || `p-${idx}`,
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
          });

          let local = null;
          if (id && id.startsWith('p-')) {
            const idx = parseInt(id.split('-')[1], 10);
            if (!Number.isNaN(idx) && idx >= 0 && idx < catalogue.length) {
              local = buildFromCatalogue(catalogue[idx], idx);
            }
          }
          if (!local) {
            const idx = catalogue.findIndex(p => String(p.id) === String(id));
            if (idx !== -1) local = buildFromCatalogue(catalogue[idx], idx);
          }

          if (local) {
            setProduct(local);
          } else {
            setError(result.error || 'Produit non trouvé');
          }
        }
      } catch (err) {
        setError('Erreur lors du chargement du produit');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity} ${product.name} ajouté(s) au panier`);
  };

  if (loading) {
    return (
      <ProductDetailContainer>
        <LoadingSpinner>Chargement du produit...</LoadingSpinner>
      </ProductDetailContainer>
    );
  }

  if (error) {
    return (
      <ProductDetailContainer>
        <ErrorMessage>
          <h3>Erreur</h3>
          <p>{error}</p>
        </ErrorMessage>
      </ProductDetailContainer>
    );
  }

  if (!product) {
    return (
      <ProductDetailContainer>
        <ErrorMessage>
          <h3>Produit non trouvé</h3>
          <p>Le produit que vous recherchez n'existe pas.</p>
        </ErrorMessage>
      </ProductDetailContainer>
    );
  }

  const isInCartItem = isInCart(product.id);
  const cartItem = getCartItem(product.id);

  return (
    <ProductDetailContainer>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft size={20} />
        Retour
      </BackButton>
      
      <ProductContainer>
        <div>
          <ProductImage 
            src={product.image || '/placeholder-wood.jpg'} 
            alt={product.name}
            onError={(e) => {
              e.target.src = '/placeholder-wood.jpg';
            }}
          />
        </div>
        
        <ProductInfo>
          <h1>{product.name}</h1>
          <div className="price">{product.price}€</div>
            
            <Rating>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(product.rating || 4.5) ? '#f39c12' : 'none'} 
                  />
                ))}
              </div>
              <span className="rating-text">
                {product.rating || 4.5} ({product.reviewCount || 0} avis)
              </span>
            </Rating>
            
            <StockInfo inStock={product.stock > 0}>
              {product.stock > 0 
                ? `En stock (${product.stock} disponibles)` 
                : 'Rupture de stock'
              }
            </StockInfo>
            
            <p className="description">{product.description}</p>
            
            <QuantitySelector>
              <label>Quantité :</label>
              <QuantityControls>
                <QuantityButton
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <FiMinus size={16} />
                </QuantityButton>
                <QuantityInput
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={product.stock}
                />
                <QuantityButton
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <FiPlus size={16} />
                </QuantityButton>
              </QuantityControls>
            </QuantitySelector>
            
            <AddToCartButton 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <FiShoppingCart size={20} />
              {isInCartItem 
                ? `Ajouté au panier (${cartItem.quantity})` 
                : 'Ajouter au panier'
              }
            </AddToCartButton>
            
            <Features>
              <Feature>
                <FiTruck size={24} />
                <div>
                  <h4>Livraison rapide</h4>
                  <p>Livraison en 24-48h</p>
                </div>
              </Feature>
              
              <Feature>
                <FiShield size={24} />
                <div>
                  <h4>Qualité garantie</h4>
                  <p>Produit certifié</p>
                </div>
              </Feature>
            </Features>
          </ProductInfo>
        </ProductContainer>
      </ProductDetailContainer>
  );
};

export default ProductDetail;

