import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/Layout/DashboardLayout';

const CartContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px 24px;
`;

const CartHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin: 0 0 20px 0;
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #2c5530;
  text-decoration: none;
  font-weight: 500;
  &:hover { color: #1e3a22; }
`;

const CartTitle = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2c5530;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 28px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const CartItems = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 20px;
`;

const CartItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
  &:last-child { border-bottom: none; }
  @media (max-width: 600px) { flex-direction: column; align-items: stretch; gap: 12px; }
`;

const ItemImage = styled.img`
  width: 96px; height: 96px; object-fit: cover; border-radius: 8px; border: 1px solid #eee;
`;

const ItemInfo = styled.div`
  flex: 1; min-width: 0;
`;

const ItemName = styled.h3`
  font-size: 18px; font-weight: 600; color: #2c5530; margin-bottom: 5px;
`;

const ItemDescription = styled.p`
  color: #666; font-size: 14px; margin-bottom: 10px;
`;

const ItemPrice = styled.div`
  font-size: 16px; font-weight: 600; color: #2c5530;
`;

const QuantityControls = styled.div`
  display: flex; align-items: center; gap: 10px; margin: 10px 0;
`;

const QuantityButton = styled.button`
  width: 36px; height: 36px; border: 2px solid #e0e0e0; background: white; border-radius: 6px; cursor: pointer;
  display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;
  &:hover { border-color: #2c5530; color: #2c5530; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const QuantityInput = styled.input`
  width: 64px; text-align: center; border: 2px solid #e0e0e0; border-radius: 6px; padding: 8px; font-weight: 600;
  &:focus { outline: none; border-color: #2c5530; }
`;

const RemoveButton = styled.button`
  background: #e74c3c; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 5px; font-size: 12px;
  &:hover { background: #c0392b; }
`;

const EmptyCart = styled.div`
  text-align: center; padding: 60px 20px; color: #666;
  svg { font-size: 64px; color: #ccc; margin-bottom: 20px; }
  h3 { font-size: 24px; margin-bottom: 10px; color: #2c5530; }
`;

const ShopButton = styled(Link)`
  display: inline-block; background: #2c5530; color: white; padding: 12px 22px; border-radius: 8px; text-decoration: none; font-weight: 600;
  &:hover { background: #1e3a22; }
`;

const CartSummary = styled.div`
  background: white; border-radius: 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); padding: 20px; height: fit-content; position: sticky; top: 20px;
  @media (max-width: 768px) { position: static; top: auto; }
`;

const SummaryTitle = styled.h3`
  font-size: 18px; font-weight: 700; color: #2c5530; margin-bottom: 16px;
`;

const SummaryRow = styled.div`
  display: flex; justify-content: space-between; margin-bottom: 12px; color: #666;
  &.total { font-size: 18px; font-weight: 700; color: #2c5530; border-top: 2px solid #f0f0f0; padding-top: 12px; margin-top: 12px; }
`;

const CheckoutButton = styled.button`
  width: 100%; background: #27ae60; color: white; border: none; padding: 14px; border-radius: 8px; font-size: 16px; font-weight: 700; cursor: pointer;
  &:hover { background: #219a52; }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const LoginPrompt = styled.div`
  background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 12px; margin-bottom: 16px; text-align: center;
  p { margin: 0 0 8px 0; color: #856404; }
  a { color: #2c5530; text-decoration: none; font-weight: 600; }
`;

const DashboardCart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();
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
      navigate('/login', { state: { from: { pathname: '/dashboard/cart' } } });
      return;
    }
    navigate('/checkout');
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  return (
    <DashboardLayout>
      <CartContainer>
        <CartHeader>
          <BackButton to="/products">
            <FiArrowLeft size={20} />
            Retour aux produits
          </BackButton>
          <CartTitle>
            <FiShoppingBag size={28} />
            Mon Panier ({cartItems.length} article{cartItems.length > 1 ? 's' : ''})
          </CartTitle>
        </CartHeader>

        {cartItems.length === 0 ? (
          <EmptyCart>
            <FiShoppingBag size={64} />
            <h3>Votre panier est vide</h3>
            <ShopButton to="/products">Commencer mes achats</ShopButton>
          </EmptyCart>
        ) : (
          <CartContent>
            <CartItems>
              {cartItems.map(item => (
                <CartItem key={item.id}>
                  <ItemImage src={item.image || '/placeholder-wood.jpg'} alt={item.name} onError={(e) => { e.target.src = '/placeholder-wood.jpg'; }} />
                  <ItemInfo>
                    <ItemName>{item.name}</ItemName>
                    <ItemDescription>{item.description}</ItemDescription>
                    <ItemPrice>{item.price}€ / unité</ItemPrice>
                    <QuantityControls>
                      <QuantityButton onClick={() => handleQuantityChange(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                        <FiMinus size={16} />
                      </QuantityButton>
                      <QuantityInput type="number" value={item.quantity} onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)} min="1" />
                      <QuantityButton onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
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
                <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                  Livraison gratuite à partir de 50€
                </div>
              )}
              <SummaryRow className="total">
                <span>Total</span>
                <span>{total.toFixed(2)}€</span>
              </SummaryRow>
              <CheckoutButton onClick={handleCheckout} disabled={cartItems.length === 0}>
                {user ? 'Finaliser la commande' : 'Se connecter pour commander'}
              </CheckoutButton>
            </CartSummary>
          </CartContent>
        )}
      </CartContainer>
    </DashboardLayout>
  );
};

export default DashboardCart;
