import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';
import styled from 'styled-components';
import { FiStar, FiShoppingCart, FiTruck, FiShield, FiArrowLeft, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useProductImages } from '../hooks/useProductImages';
import { getProductById } from '../firebase/products';
import { products as catalogue } from '../data/catalogue.js';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const ProductDetailContainer = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  padding: 20px 16px 48px;

  @media (max-width: 768px) {
    padding: 10px 10px 32px;
  }
`;

const BackButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 6px 12px;
  color: #475569;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
  
  &:hover {
    background: #f8fafc;
    border-color: #cbd5e1;
    color: #1b3b22;
  }
  
  @media (max-width: 768px) {
    padding: 5px 10px;
    font-size: 12px;
    margin-bottom: 8px;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  background: white;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  padding: 24px;
  
  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 14px;
    border-radius: 12px;
  }
`;

const ProductImageWrapper = styled.div`
  position: relative;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 12px;
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px;
  overflow: hidden;

  @media (max-width: 900px) {
    height: 250px;
  }

  @media (max-width: 480px) {
    height: 200px;
    padding: 8px;
  }
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  transition: transform 0.3s ease;
`;

const ProductBadges = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 2;
`;

const Badge = styled.span`
  background: ${props => props.type === 'sale' ? '#dc2626' : props.type === 'new' ? '#16a34a' : '#1b3b22'};
  color: white;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.3px;
  text-transform: uppercase;
  box-shadow: 0 2px 4px rgba(0,0,0,0.12);

  @media (max-width: 480px) {
    font-size: 9px;
    padding: 2px 6px;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ProductTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.25;
  margin: 0 0 10px 0;

  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 1.3;
    margin: 0 0 6px 0;
  }
`;

const PriceRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-bottom: 8px;
    gap: 6px;
  }
`;

const ProductPrice = styled.div`
  font-size: 26px;
  font-weight: 800;
  color: #16a34a;

  @media (max-width: 768px) {
    font-size: 21px;
  }
`;

const RegularPrice = styled.span`
  font-size: 14px;
  color: #94a3b8;
  text-decoration: line-through;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 12.5px;
  }
`;

const DiscountTag = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: #dc2626;
  background: #fef2f2;
  border: 1px solid #fecaca;
  padding: 2px 6px;
  border-radius: 999px;

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 1.5px 5px;
  }
`;

const ProductMetaBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #f1f5f9;

  @media (max-width: 768px) {
    margin-bottom: 10px;
    padding-bottom: 8px;
  }
`;

const Rating = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  
  .stars {
    display: inline-flex;
    gap: 1.5px;
    color: #f59e0b;

    svg {
      width: 14px;
      height: 14px;
    }
  }
  
  .rating-text {
    color: #64748b;
    font-size: 12px;
    font-weight: 600;
  }

  @media (max-width: 480px) {
    gap: 3px;
    .stars svg {
      width: 12px;
      height: 12px;
    }
    .rating-text {
      font-size: 11px;
    }
  }
`;

const StockBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 11.5px;
  font-weight: 600;
  color: ${props => props.inStock ? '#047857' : '#b91c1c'};
  background: ${props => props.inStock ? '#ecfdf5' : '#fef2f2'};
  border: 1px solid ${props => props.inStock ? '#a7f3d0' : '#fecaca'};
  padding: 3px 8px;
  border-radius: 999px;
  white-space: nowrap;
  flex-shrink: 0;

  &::before {
    content: '';
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${props => props.inStock ? '#10b981' : '#ef4444'};
  }

  @media (max-width: 480px) {
    font-size: 10.5px;
    padding: 2px 7px;
    gap: 4px;

    &::before {
      width: 5px;
      height: 5px;
    }
  }
`;

const ProductDescription = styled.p`
  color: #475569;
  font-size: 13.5px;
  line-height: 1.55;
  margin: 0 0 14px 0;

  @media (max-width: 768px) {
    font-size: 12.5px;
    line-height: 1.5;
    margin-bottom: 10px;
  }
`;

const ProductSpecsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 8px 10px;
  margin-bottom: 14px;

  @media (max-width: 768px) {
    padding: 6px 8px;
    gap: 4px;
    margin-bottom: 10px;
  }
`;

const SpecItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11.5px;
  
  .spec-label {
    color: #64748b;
  }
  
  .spec-value {
    font-weight: 700;
    color: #0f172a;
  }

  @media (max-width: 480px) {
    font-size: 10.5px;
  }
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;

  @media (max-width: 480px) {
    gap: 8px;
    margin-bottom: 10px;
  }
`;

const QuantityControls = styled.div`
  display: inline-flex;
  align-items: center;
  border: 1.5px solid #cbd5e1;
  border-radius: 8px;
  background: #ffffff;
  padding: 2px;
  flex-shrink: 0;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: #334155;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  
  &:hover:not(:disabled) {
    background: #f1f5f9;
    color: #0f172a;
  }
  
  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
  }
`;

const QuantityInput = styled.input`
  width: 42px;
  height: 32px;
  text-align: center;
  border: none;
  background: transparent;
  font-weight: 700;
  font-size: 14px;
  color: #0f172a;
  
  &:focus {
    outline: none;
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  @media (max-width: 480px) {
    width: 36px;
    height: 30px;
    font-size: 13px;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #1b3b22;
  color: white;
  border: none;
  height: 38px;
  padding: 0 16px;
  border-radius: 8px;
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 3px 10px rgba(27, 59, 34, 0.2);
  white-space: nowrap;
  
  &:hover:not(:disabled) {
    background: #142c19;
    transform: translateY(-1px);
    box-shadow: 0 5px 14px rgba(27, 59, 34, 0.25);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (max-width: 480px) {
    height: 36px;
    padding: 0 12px;
    font-size: 12.5px;
    gap: 6px;

    svg {
      width: 15px;
      height: 15px;
    }
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
  margin-top: 10px;
  padding-top: 12px;
  border-top: 1px solid #f1f5f9;

  @media (max-width: 480px) {
    gap: 6px;
    margin-top: 8px;
    padding-top: 10px;
  }
`;

const Feature = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  min-width: 0;
  
  svg {
    color: #16a34a;
    flex-shrink: 0;
    width: 18px;
    height: 18px;
  }
  
  div {
    min-width: 0;
    h4 {
      font-size: 11.5px;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 1px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    p {
      font-size: 10.5px;
      color: #64748b;
      margin: 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  @media (max-width: 480px) {
    padding: 6px 8px;
    gap: 6px;

    svg {
      width: 16px;
      height: 16px;
    }

    div h4 {
      font-size: 11px;
    }
    div p {
      font-size: 10px;
    }
  }
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #e74c3c;
  
  h3 {
    font-size: 20px;
    margin-bottom: 8px;
  }
`;

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const localizedNavigate = useLocalizedNavigate();
  const { addToCart, isInCart, getCartItem } = useCart();
  const { productImages } = useProductImages();
  const { t } = useTranslation();

  // Instant pre-load from sessionStorage cache if available to prevent any flashing
  const [product, setProduct] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const raw = sessionStorage.getItem('mesbois:fs_products:v2');
        if (raw) {
          const list = JSON.parse(raw);
          const found = list.find(p => String(p.id) === String(id));
          if (found) return found;
        }
      }
    } catch (e) {}
    const catFound = catalogue.find(p => String(p.id) === String(id));
    if (catFound) return catFound;
    return null;
  });

  const [, setLoading] = useState(!product);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    let active = true;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const result = await getProductById(id);

        if (!active) return;

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
            image: `https://picsum.photos/seed/${p.id || `p-${idx}`}/1000/700`,
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
        if (active) setError('Erreur lors du chargement du produit');
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchProduct();
    return () => { active = false; };
  }, [id]);

  const handleQuantityChange = (newQuantity) => {
    if (!product) return;
    const max = product?.stock ?? 99;
    if (newQuantity >= 1 && newQuantity <= max) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.dismiss('add-to-cart');
    toast.custom((tItem) => (
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
            padding: '18px 16px 14px',
            maxWidth: '90vw',
            width: 320,
            boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
            textAlign: 'center',
            marginTop: '20vh'
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 6 }}>
            {t('cart.added_success', 'Le produit a été ajouté avec succès à votre panier.')}
          </div>
          <div style={{ fontSize: 12.5, color: '#64748b', marginBottom: 14 }}>
            {t('cart.what_next', 'Que souhaitez-vous faire ?')}
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
              onClick={() => toast.dismiss(tItem.id)}
              style={{
                flex: 1,
                minWidth: 110,
                padding: '7px 10px',
                borderRadius: 999,
                border: '1px solid #cbd5e1',
                background: '#fff',
                color: '#334155',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t('cart.continue_shopping', 'Poursuivre')}
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(tItem.id);
                localizedNavigate('cart');
              }}
              style={{
                flex: 1,
                minWidth: 110,
                padding: '7px 10px',
                borderRadius: 999,
                border: 'none',
                background: '#1b3b22',
                color: '#fff',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {t('cart.view_cart', 'Voir le panier')}
            </button>
          </div>
        </div>
      </div>
    ), {
      id: 'add-to-cart',
      duration: 1500,
      position: 'top-center'
    });
  };

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

  const view = product || {
    id,
    name: 'Produit',
    description: '',
    price: '',
    stock: 0,
    image: `https://picsum.photos/seed/${id}/1000/700`,
    rating: 4.5,
    reviewCount: 0
  };

  const isInCartItem = product ? isInCart(product.id) : false;
  const cartItem = product ? getCartItem(product.id) : null;
  const hasSpecs = !!(view.weight || view.dimensions || view.humidity || view.calorificValue);

  return (
    <ProductDetailContainer>
      <BackButton onClick={() => navigate(-1)}>
        <FiArrowLeft size={16} />
        {t('cart.back_to_products', 'Retour aux produits')}
      </BackButton>
      
      <ProductContainer>
        <ProductImageWrapper>
          <ProductImage 
            src={productImages[view.id] || view.image || `https://picsum.photos/seed/${view.id}/1000/700`} 
            alt={view.name}
            onError={(e) => {
              e.target.src = 'https://res.cloudinary.com/dkuctstdf/image/upload/v1740924719/pellets_premium_bavaria_5_1_2_w12f3k.webp';
            }}
          />
          <ProductBadges>
            {view.sale && <Badge type="sale">{t('products.sale', 'Promo')}</Badge>}
            {view.new && <Badge type="new">{t('products.new', 'Nouveau')}</Badge>}
          </ProductBadges>
        </ProductImageWrapper>
        
        <ProductInfo>
          <ProductTitle>{view.name}</ProductTitle>

          <PriceRow>
            <ProductPrice>{view.price}{view.price !== '' ? '€' : ''}</ProductPrice>
            {view.regularPrice && view.regularPrice > view.price && (
              <>
                <RegularPrice>{view.regularPrice}€</RegularPrice>
                <DiscountTag>-{Math.round((1 - view.price / view.regularPrice) * 100)}%</DiscountTag>
              </>
            )}
          </PriceRow>
            
          <ProductMetaBar>
            <Rating>
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FiStar 
                    key={i} 
                    size={14} 
                    fill={i < Math.floor(view.rating || 4.5) ? '#f59e0b' : 'none'} 
                  />
                ))}
              </div>
              <span className="rating-text">
                {view.rating || 4.5} ({view.reviewCount || 0} avis)
              </span>
            </Rating>
            
            <StockBadge inStock={view.stock > 0}>
              {view.stock > 0 
                ? `${t('products.in_stock', 'En stock')} (${view.stock} dispo)` 
                : t('products.out_of_stock', 'Rupture de stock')
              }
            </StockBadge>
          </ProductMetaBar>
          
          {view.description && (
            <ProductDescription>{view.description}</ProductDescription>
          )}

          {hasSpecs && (
            <ProductSpecsGrid>
              {view.weight && (
                <SpecItem>
                  <span className="spec-label">{t('products.weight', 'Poids')}</span>
                  <span className="spec-value">{view.weight}</span>
                </SpecItem>
              )}
              {view.dimensions && (
                <SpecItem>
                  <span className="spec-label">{t('products.dimensions', 'Dimensions')}</span>
                  <span className="spec-value">{view.dimensions}</span>
                </SpecItem>
              )}
              {view.humidity && (
                <SpecItem>
                  <span className="spec-label">{t('products.humidity', 'Humidité')}</span>
                  <span className="spec-value">{view.humidity}</span>
                </SpecItem>
              )}
              {view.calorificValue && (
                <SpecItem>
                  <span className="spec-label">{t('products.calorific', 'Calorifique')}</span>
                  <span className="spec-value">{view.calorificValue}</span>
                </SpecItem>
              )}
            </ProductSpecsGrid>
          )}
          
          <ActionRow>
            <QuantityControls>
              <QuantityButton
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={!product || quantity <= 1}
                aria-label="Diminuer la quantité"
              >
                <FiMinus size={14} />
              </QuantityButton>
              <QuantityInput
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min="1"
                max={view.stock || 99}
              />
              <QuantityButton
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={!product || quantity >= (view.stock || 99)}
                aria-label="Augmenter la quantité"
              >
                <FiPlus size={14} />
              </QuantityButton>
            </QuantityControls>
            
            <AddToCartButton 
              onClick={handleAddToCart}
              disabled={!product || view.stock === 0}
            >
              <FiShoppingCart size={17} />
              {isInCartItem 
                ? `${t('products.add_to_cart', 'Ajouter')} (${cartItem.quantity})` 
                : t('products.add_to_cart', 'Ajouter au panier')
              }
            </AddToCartButton>
          </ActionRow>
          
          <Features>
            <Feature>
              <FiTruck size={20} />
              <div>
                <h4>Livraison rapide</h4>
                <p>Livraison en 24-48h</p>
              </div>
            </Feature>
            
            <Feature>
              <FiShield size={20} />
              <div>
                <h4>Qualité garantie</h4>
                <p>Produit 100% certifié</p>
              </div>
            </Feature>
          </Features>
        </ProductInfo>
      </ProductContainer>
    </ProductDetailContainer>
  );
};

export default ProductDetail;
