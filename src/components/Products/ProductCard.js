import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../../contexts/CartContext';

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
`;

const ImageContainer = styled.div`
  position: relative;
  height: 200px;
  overflow: hidden;
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

const Badge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: ${props => props.type === 'sale' ? '#e74c3c' : '#2c5530'};
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const CardContent = styled.div`
  padding: 20px;
`;

const ProductName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #2c5530;
  line-height: 1.4;
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

const Price = styled.div`
  font-size: 20px;
  font-weight: 700;
  color: #2c5530;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  color: #f39c12;
  font-size: 14px;
`;

const StockInfo = styled.div`
  font-size: 12px;
  color: ${props => props.inStock ? '#27ae60' : '#e74c3c'};
  margin-bottom: 15px;
  font-weight: 500;
`;

const AddToCartButton = styled.button`
  width: 100%;
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
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #1e3a22;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const ProductCard = ({ product }) => {
  const { addToCart, isInCart } = useCart();
  const isInCartItem = isInCart(product.id);

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  return (
    <CardContainer>
      <ImageContainer>
        <ProductImage 
          src={product.image || '/placeholder-wood.jpg'} 
          alt={product.name}
          onError={(e) => {
            e.target.src = '/placeholder-wood.jpg';
          }}
        />
        {product.sale && (
          <Badge type="sale">Promo</Badge>
        )}
        {product.new && (
          <Badge type="new">Nouveau</Badge>
        )}
      </ImageContainer>
      
      <CardContent>
        <ProductName>{product.name}</ProductName>
        <ProductDescription>{product.description}</ProductDescription>
        
        <ProductInfo>
          <Price>{product.price}€</Price>
          <Rating>
            <FiStar size={14} />
            <span>{product.rating || 4.5}</span>
          </Rating>
        </ProductInfo>
        
        <StockInfo inStock={product.stock > 0}>
          {product.stock > 0 ? `En stock (${product.stock})` : 'Rupture de stock'}
        </StockInfo>
        
        <AddToCartButton 
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isInCartItem}
        >
          <FiShoppingCart size={16} />
          {isInCartItem ? 'Dans le panier' : 'Ajouter au panier'}
        </AddToCartButton>
      </CardContent>
    </CardContainer>
  );
};

export default ProductCard;

