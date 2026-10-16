import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';
import { getCategoryImage } from '../../utils/categoryImages';
import { useProductImages } from '../../hooks/useProductImages';
import { useTranslation } from 'react-i18next';
import { getLocalizedProduct } from '../../utils/productLocalization';
import { trackTikTokEvent } from '../../utils/tiktokPixel';
import toast from 'react-hot-toast';

const CardContainer = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
  
  @media (max-width: 480px) {
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    &:hover { transform: none; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 200px;
  overflow: hidden;
  background-color: #f7fafc;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${CardContainer}:hover & {
    transform: scale(1.05);
  }
`;

const Badge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${props => props.type === 'sale' ? '#e53e3e' : '#319795'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const CardContent = styled.div`
  padding: 20px;
  
  @media (max-width: 480px) {
    padding: 12px;
  }
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductDescription = styled.p`
  color: #718096;
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

const Price = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: #2c5530;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #d69e2e;
  font-size: 14px;
`;

const StockInfo = styled.span`
  font-size: 12px;
  color: ${props => props.inStock ? '#38a169' : '#e53e3e'};
  font-weight: 500;
  display: block;
  margin-bottom: 12px;
`;

const AddToCartButton = styled.button`
  width: 100%;
  background: ${props => props.disabled ? '#cbd5e0' : '#2c5530'};
  color: white;
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: #1e3a21;
    transform: translateY(-2px);
  }
  
  @media (max-width: 480px) {
    padding: 10px;
    font-size: 13px;
  }
`;

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const locProduct = getLocalizedProduct(product, i18n.language);

  const isInCartItem = isInCart(locProduct.id);
  const { productImages } = useProductImages();

  const imageUrl = productImages[locProduct.id] || locProduct.image || getCategoryImage(locProduct.category) || `https://res.cloudinary.com/dkuctstdf/image/upload/v1740924719/pellets_premium_bavaria_5_1_2_w12f3k.webp`;

  const handleAddToCart = () => {
    addToCart(locProduct, 1);

    // Événement TikTok Ads AddToCart
    trackTikTokEvent('AddToCart', {
      content_id: locProduct.id,
      content_name: locProduct.name,
      value: locProduct.price,
      currency: 'EUR',
      quantity: 1
    });

    toast.dismiss('add-to-cart');
    toast.custom((tToast) => (
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
            {t('product.added_toast_title', 'Le produit a été ajouté avec succès à votre panier.')}
          </div>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
            {t('product.added_toast_question', 'Que souhaitez-vous faire ?')}
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
              onClick={() => toast.dismiss(tToast.id)}
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
              {t('product.continue_shopping', 'Poursuivre les achats')}
            </button>
            <button
              type="button"
              onClick={() => {
                toast.dismiss(tToast.id);
                navigate('/cart');
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
              {t('product.view_cart', 'Voir le panier')}
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

  return (
    <CardContainer>
      <ImageContainer>
        <ProductImage
          src={imageUrl}
          alt={locProduct.name}
          onError={(e) => {
            e.target.src = 'https://res.cloudinary.com/dkuctstdf/image/upload/v1740924719/pellets_premium_bavaria_5_1_2_w12f3k.webp';
          }}
        />
        
        {locProduct.sale && (
          <Badge type="sale">{t('product.badge_sale', 'Promo')}</Badge>
        )}
        {locProduct.new && (
          <Badge type="new">{t('product.badge_new', 'Nouveau')}</Badge>
        )}
      </ImageContainer>

      <CardContent>
        <ProductName>{locProduct.name}</ProductName>
        <ProductDescription>{locProduct.description}</ProductDescription>

        <ProductInfo>
          <Price>{locProduct.price}€</Price>
          <Rating>
            <FiStar size={14} />
            <span>{locProduct.rating || 4.8}</span>
          </Rating>
        </ProductInfo>

        <StockInfo inStock={locProduct.stock > 0}>
          {locProduct.stock > 0 
            ? t('product.in_stock', 'En stock ({{count}})', { count: locProduct.stock }) 
            : t('product.out_of_stock', 'Rupture de stock')}
        </StockInfo>

        <AddToCartButton
          onClick={handleAddToCart}
          disabled={locProduct.stock === 0 || isInCartItem}
        >
          <FiShoppingCart size={16} />
          {isInCartItem 
            ? t('product.in_cart', 'Dans le panier') 
            : t('product.add_to_cart', 'Ajouter au panier')}
        </AddToCartButton>
      </CardContent>
    </CardContainer>
  );
};

export default ProductCard;
