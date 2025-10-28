import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const CartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c5530;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    color: #1e3a22;
  }
`;

const CartTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #2c5530;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
  
  &:last-child {
    border-bottom: none;
  }
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const ItemImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 5px;
`;

const ItemDescription = styled.p`
  color: #666;
  font-size: 14px;
  margin-bottom: 10px;
`;

const ItemPrice = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #2c5530;
`;

const QuantityControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 10px 0;
`;

const QuantityButton = styled.button`
  width: 32px;
  height: 32px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
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
  width: 60px;
  text-align: center;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  padding: 8px;
  font-weight: 600;
  
  &:focus {
    outline: none;
    border-color: #2c5530;
  }
`;

const RemoveButton = styled.button`
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #c0392b;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;
  
  svg {
    font-size: 64px;
    color: #ccc;
    margin-bottom: 20px;
  }
  
  h3 {
    font-size: 24px;
    margin-bottom: 10px;
    color: #2c5530;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 30px;
  }
`;

const ShopButton = styled(Link)`
  display: inline-block;
  background: #2c5530;
  color: white;
  padding: 15px 30px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: #1e3a22;
  }
`;

const CartSummary = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  height: fit-content;
  position: sticky;
  top: 20px;
`;

const SummaryTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 20px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  color: #666;
  
  &.total {
    font-size: 18px;
    font-weight: 700;
    color: #2c5530;
    border-top: 2px solid #f0f0f0;
    padding-top: 15px;
    margin-top: 15px;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  background: #27ae60;
  color: white;
  border: none;
  padding: 15px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 20px;
  
  &:hover {
    background: #219a52;
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const LoginPrompt = styled.div`
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  text-align: center;
  
  p {
    margin: 0 0 10px 0;
    color: #856404;
  }
  
  a {
    color: #2c5530;
    text-decoration: none;
    font-weight: 600;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return;
    }
    navigate('/checkout');
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <CartContainer>
        <CartHeader>
          <BackButton to="/products">
            <FiArrowLeft size={20} />
            Retour aux produits
          </BackButton>
          <CartTitle>
            <FiShoppingBag size={32} />
            Mon Panier
          </CartTitle>
        </CartHeader>
        
        <EmptyCart>
          <FiShoppingBag size={64} />
          <h3>Votre panier est vide</h3>
          <p>Découvrez nos produits et ajoutez-les à votre panier</p>
          <ShopButton to="/products">Commencer mes achats</ShopButton>
        </EmptyCart>
      </CartContainer>
    );
  }

  return (
    <CartContainer>
      <CartHeader>
        <BackButton to="/products">
          <FiArrowLeft size={20} />
          Retour aux produits
        </BackButton>
        <CartTitle>
          <FiShoppingBag size={32} />
          Mon Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
        </CartTitle>
      </CartHeader>
      
      <CartContent>
        <CartItems>
          {cartItems.map(item => (
            <CartItem key={item.id}>
              <ItemImage 
                src={item.image || '/placeholder-wood.jpg'} 
                alt={item.name}
                onError={(e) => {
                  e.target.src = '/placeholder-wood.jpg';
                }}
              />
              <ItemInfo>
                <ItemName>{item.name}</ItemName>
                <ItemDescription>{item.description}</ItemDescription>
                <ItemPrice>{item.price}€ / unité</ItemPrice>
                
                <QuantityControls>
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus size={16} />
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                    min="1"
                  />
                  <QuantityButton
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <FiPlus size={16} />
                  </QuantityButton>
                </QuantityControls>
              </ItemInfo>
              
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#2c5530', marginBottom: '10px' }}>
                  {(item.price * item.quantity).toFixed(2)}€
                </div>
                <RemoveButton onClick={() => removeFromCart(item.id)}>
                  <FiTrash2 size={14} />
                  Supprimer
                </RemoveButton>
              </div>
            </CartItem>
          ))}
        </CartItems>
        
        <CartSummary>
          <SummaryTitle>Résumé de la commande</SummaryTitle>
          
          {!user && (
            <LoginPrompt>
              <p>Connectez-vous pour finaliser votre commande</p>
              <Link to="/login">Se connecter</Link>
            </LoginPrompt>
          )}
          
          <SummaryRow>
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)}€</span>
          </SummaryRow>
          
          <SummaryRow>
            <span>Livraison</span>
            <span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)}€`}</span>
          </SummaryRow>
          
          {shipping > 0 && (
            <div style={{ fontSize: '12px', color: '#666', marginBottom: '15px' }}>
              Livraison gratuite à partir de 50€
            </div>
          )}
          
          <SummaryRow className="total">
            <span>Total</span>
            <span>{total.toFixed(2)}€</span>
          </SummaryRow>
          
          <CheckoutButton onClick={handleCheckout}>
            {user ? 'Finaliser la commande' : 'Se connecter pour commander'}
          </CheckoutButton>
        </CartSummary>
      </CartContent>
    </CartContainer>
  );
};

export default Cart;

