import React from 'react';
import styled, { keyframes } from 'styled-components';
import { 
  FiPlus, 
  FiMinus, 
  FiTrash2, 
  FiShoppingBag, 
  FiArrowLeft, 
  FiArrowRight, 
  FiTruck, 
  FiShield, 
  FiCheckCircle
} from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LocalizedLink from '../components/LocalizedLink/LocalizedLink';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';

/* ==========================================================================
   ANIMATIONS & STYLED COMPONENTS
   ========================================================================== */

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
`;

const CartPageContainer = styled.div`
  max-width: 1140px;
  width: 100%;
  margin: 0 auto;
  padding: 28px 16px 80px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 16px 12px 60px;
  }
`;

/* Navigation & En-tête */
const CartNavHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
    gap: 10px;
  }
`;

const BackLink = styled(LocalizedLink)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4a6b51;
  text-decoration: none;
  font-size: 13px;
  font-weight: 600;
  transition: color 0.15s ease, transform 0.15s ease;
  width: fit-content;

  &:hover {
    color: #1e3d22;
    transform: translateX(-2px);
  }
`;

const HeaderTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const MainTitle = styled.h1`
  font-size: 24px;
  font-weight: 800;
  color: #142618;
  letter-spacing: -0.02em;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const ItemCountBadge = styled.span`
  background: #e8f3ea;
  color: #1e3d22;
  font-size: 12px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid #cfe0d3;
`;

const ClearCartGhostBtn = styled.button`
  background: none;
  border: none;
  color: #718096;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  padding: 6px 8px;
  border-radius: 6px;
  transition: all 0.2s ease;

  &:hover {
    color: #dc2626;
    background: #fef2f2;
  }
`;

/* Barre de progression livraison offerte */
const ShippingProgressBarContainer = styled.div`
  background: #ffffff;
  border: 1px solid ${props => props.$qualified ? '#bbf7d0' : '#e2e8f0'};
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);

  @media (max-width: 768px) {
    padding: 10px 14px;
    margin-bottom: 14px;
  }
`;

const ShippingTextRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${props => props.$qualified ? '#166534' : '#334155'};
  font-weight: 500;
  margin-bottom: 8px;

  strong {
    font-weight: 700;
    color: ${props => props.$qualified ? '#15803d' : '#1e3d22'};
  }

  svg {
    flex-shrink: 0;
    color: ${props => props.$qualified ? '#16a34a' : '#2c5530'};
  }
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  background: #f1f5f9;
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => Math.min(props.$percent, 100)}%;
  background: ${props => props.$qualified ? 'linear-gradient(90deg, #22c55e, #16a34a)' : 'linear-gradient(90deg, #3b82f6, #2c5530)'};
  border-radius: 999px;
  transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
`;

/* Layout 2 colonnes */
const CartLayoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 28px;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

/* Liste des articles */
const CartItemListCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5ede6;
  border-radius: 14px;
  padding: 8px 16px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.03);
  animation: ${fadeIn} 0.25s ease-out;

  @media (max-width: 768px) {
    padding: 4px 12px;
    border-radius: 12px;
  }
`;

/* Ligne produit compacte responsive (Horizontal mobile et desktop) */
const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #edf2ee;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    gap: 12px;
    padding: 12px 0;
  }
`;

const ProductThumbWrapper = styled.div`
  width: 82px;
  height: 82px;
  border-radius: 10px;
  overflow: hidden;
  background: #f7faf8;
  border: 1px solid #e5ede6;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 72px;
    height: 72px;
    border-radius: 8px;
  }
`;

const ProductDetails = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 6px;

  @media (max-width: 768px) {
    gap: 4px;
  }
`;

const ProductHeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const ProductTitle = styled.h3`
  font-size: 14.5px;
  font-weight: 700;
  color: #142618;
  margin: 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 13.5px;
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
  flex-shrink: 0;

  &:hover {
    color: #ef4444;
    background: #fef2f2;
  }
`;

const ProductUnitPrice = styled.div`
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
`;

const ProductBottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: 4px;
`;

/* Stepper Pill ultra propre */
const QuantityPill = styled.div`
  display: inline-flex;
  align-items: center;
  background: #f4f7f4;
  border: 1px solid #dbe6dc;
  border-radius: 20px;
  padding: 2px 4px;
  gap: 2px;
`;

const StepperBtn = styled.button`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  border: none;
  background: #ffffff;
  color: #142618;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

  &:hover:not(:disabled) {
    background: #e8f1e9;
    color: #1e3d22;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #f1f5f2;
    box-shadow: none;
  }
`;

const QuantityValue = styled.span`
  min-width: 26px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  color: #142618;
  user-select: none;
`;

const LineTotalPrice = styled.div`
  font-size: 16px;
  font-weight: 800;
  color: #1e3d22;
  text-align: right;

  @media (max-width: 768px) {
    font-size: 15px;
  }
`;

/* Carte Récapitulatif (Sticky sur desktop) */
const SummaryCard = styled.div`
  background: #ffffff;
  border: 1.5px solid #e1ebe3;
  border-radius: 14px;
  padding: 22px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
  position: sticky;
  top: 90px;
  animation: ${fadeIn} 0.25s ease-out;

  @media (max-width: 960px) {
    position: static;
    top: auto;
    padding: 18px 16px;
  }
`;

const SummaryHeading = styled.h2`
  font-size: 17px;
  font-weight: 800;
  color: #142618;
  margin: 0 0 16px 0;
  padding-bottom: 12px;
  border-bottom: 1px solid #edf2ee;
`;

const SummaryBreakdown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
`;

const BreakdownRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13.5px;
  color: #55695a;

  strong {
    color: #142618;
    font-weight: 700;
  }

  .free-badge {
    background: #dcfce7;
    color: #15803d;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 12px;
  }
`;

const Divider = styled.div`
  height: 1px;
  border-top: 1px dashed #dbe6dc;
  margin: 6px 0;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 4px;

  .label-group {
    display: flex;
    flex-direction: column;

    .label {
      font-size: 15px;
      font-weight: 800;
      color: #142618;
    }

    .subtext {
      font-size: 11px;
      color: #667c6c;
    }
  }

  .total-amount {
    font-size: 21px;
    font-weight: 800;
    color: #1e3d22;
    letter-spacing: -0.02em;
  }
`;

/* Bouton principal de commande */
const PrimaryCheckoutBtn = styled.button`
  width: 100%;
  background: #2c5530;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 14.5px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(44, 85, 48, 0.25);
  transition: all 0.15s ease;
  margin-top: 18px;

  &:hover {
    background: #1e3d22;
    box-shadow: 0 6px 18px rgba(44, 85, 48, 0.35);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ContinueShoppingLink = styled(LocalizedLink)`
  display: block;
  text-align: center;
  color: #4a6b51;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  margin-top: 12px;
  transition: color 0.15s ease;

  &:hover {
    color: #1e3d22;
    text-decoration: underline;
  }
`;

/* Liste de réassurance e-commerce */
const TrustList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #edf2ee;
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 9px;
  color: #4a5d4f;
  font-size: 11.5px;
  line-height: 1.35;

  svg {
    color: #27ae60;
    flex-shrink: 0;
  }
`;

/* Panier vide */
const EmptyStateContainer = styled.div`
  background: #ffffff;
  border: 1px solid #e5ede6;
  border-radius: 16px;
  padding: 56px 20px;
  text-align: center;
  max-width: 520px;
  margin: 30px auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
`;

const EmptyIconCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: #f0f6f2;
  color: #2c5530;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 18px;
`;

const EmptyTitle = styled.h2`
  font-size: 20px;
  font-weight: 800;
  color: #142618;
  margin: 0 0 8px;
`;

const EmptyDesc = styled.p`
  font-size: 13.5px;
  color: #64748b;
  margin: 0 0 24px;
  line-height: 1.5;
`;

const ShopNowButton = styled(LocalizedLink)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: #2c5530;
  color: #ffffff;
  padding: 12px 22px;
  border-radius: 9px;
  font-size: 13.5px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    background: #1e3d22;
    transform: translateY(-1px);
  }
`;

/* ==========================================================================
   COMPOSANT PRINCIPAL
   ========================================================================== */

const Cart = () => {
  const { t } = useTranslation();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const localizedNavigate = useLocalizedNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vider l'ensemble de votre panier ?")) {
      clearCart();
    }
  };

  const handleProceedToCheckout = () => {
    localizedNavigate('checkout');
  };

  const subtotal = getCartTotal();
  const freeShippingThreshold = 50;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const shipping = isFreeShipping ? 0 : 9.99;
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = (subtotal / freeShippingThreshold) * 100;

  // Calcul du nombre total d'articles (somme des quantités)
  const totalItemCount = cartItems.reduce((acc, it) => acc + (Number(it.quantity) || 1), 0);

  /* Cas Panier Vide */
  if (cartItems.length === 0) {
    return (
      <CartPageContainer>
        <CartNavHeader>
          <BackLink routeKey="products">
            <FiArrowLeft size={16} />
            <span>{t("cart.back_to_products", "Retour au catalogue")}</span>
          </BackLink>
        </CartNavHeader>

        <EmptyStateContainer>
          <EmptyIconCircle>
            <FiShoppingBag size={32} />
          </EmptyIconCircle>
          <EmptyTitle>{t("cart.empty_title", "Votre panier est vide")}</EmptyTitle>
          <EmptyDesc>
            {t("cart.empty_desc", "Découvrez notre sélection de bois de chauffage haute performance et granulés certifiés.")}
          </EmptyDesc>
          <ShopNowButton routeKey="products">
            <span>{t("cart.start_shopping", "Découvrir nos produits")}</span>
            <FiArrowRight size={15} />
          </ShopNowButton>
        </EmptyStateContainer>
      </CartPageContainer>
    );
  }

  return (
    <CartPageContainer>
      {/* En-tête de navigation */}
      <CartNavHeader>
        <BackLink routeKey="products">
          <FiArrowLeft size={16} />
          <span>{t("cart.back_to_products", "Continuer mes achats")}</span>
        </BackLink>

        <HeaderTitleRow>
          <TitleGroup>
            <MainTitle>{t("cart.title", "Mon Panier")}</MainTitle>
            <ItemCountBadge>
              {totalItemCount} {totalItemCount > 1 ? 'articles' : 'article'}
            </ItemCountBadge>
          </TitleGroup>

          <ClearCartGhostBtn onClick={handleClearCart} title="Vider le panier">
            <FiTrash2 size={13} />
            <span>{t("cart.clear_cart", "Vider le panier")}</span>
          </ClearCartGhostBtn>
        </HeaderTitleRow>
      </CartNavHeader>

      {/* Barre de stimulation / livraison offerte */}
      <ShippingProgressBarContainer $qualified={isFreeShipping}>
        <ShippingTextRow $qualified={isFreeShipping}>
          {isFreeShipping ? (
            <>
              <FiCheckCircle size={16} />
              <span>
                Félicitations ! Vous bénéficiez de la <strong>livraison sous abri offerte</strong> !
              </span>
            </>
          ) : (
            <>
              <FiTruck size={16} />
              <span>
                Plus que <strong>{amountToFreeShipping.toFixed(2)}&nbsp;€</strong> pour débloquer la <strong>livraison sous abri offerte</strong> !
              </span>
            </>
          )}
        </ShippingTextRow>
        <ProgressTrack>
          <ProgressBar $qualified={isFreeShipping} $percent={progressPercent} />
        </ProgressTrack>
      </ShippingProgressBarContainer>

      {/* Grille principale : Articles + Résumé */}
      <CartLayoutGrid>
        {/* Colonne Liste des articles */}
        <CartItemListCard>
          {cartItems.map((item, idx) => {
            const itemId = item.id || item.productId || `cart-item-${idx}`;
            const itemPrice = Number(item.price) || 0;
            const itemQty = Number(item.quantity) || 1;
            const lineTotal = itemPrice * itemQty;
            const fallbackImg = 'https://picsum.photos/seed/wood/160/160';

            return (
              <ProductRow key={itemId}>
                {/* Vignette produit */}
                <ProductThumbWrapper>
                  <img
                    src={item.image || fallbackImg}
                    alt={item.name || 'Produit'}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = fallbackImg;
                    }}
                  />
                </ProductThumbWrapper>

                {/* Détails et contrôles */}
                <ProductDetails>
                  <ProductHeaderRow>
                    <ProductTitle title={item.name}>{item.name}</ProductTitle>
                    <DeleteButton 
                      onClick={() => removeFromCart(itemId)} 
                      aria-label="Supprimer l'article"
                      title="Supprimer cet article"
                    >
                      <FiTrash2 size={15} />
                    </DeleteButton>
                  </ProductHeaderRow>

                  <ProductUnitPrice>
                    {itemPrice.toFixed(2)}&nbsp;€&nbsp;/&nbsp;unité
                  </ProductUnitPrice>

                  <ProductBottomRow>
                    {/* Stepper de quantité Pill */}
                    <QuantityPill>
                      <StepperBtn
                        type="button"
                        onClick={() => handleQuantityChange(itemId, itemQty - 1)}
                        disabled={itemQty <= 1}
                        aria-label="Diminuer la quantité"
                      >
                        <FiMinus size={11} />
                      </StepperBtn>
                      <QuantityValue>{itemQty}</QuantityValue>
                      <StepperBtn
                        type="button"
                        onClick={() => handleQuantityChange(itemId, itemQty + 1)}
                        aria-label="Augmenter la quantité"
                      >
                        <FiPlus size={11} />
                      </StepperBtn>
                    </QuantityPill>

                    {/* Prix total de la ligne */}
                    <LineTotalPrice>
                      {lineTotal.toFixed(2)}&nbsp;€
                    </LineTotalPrice>
                  </ProductBottomRow>
                </ProductDetails>
              </ProductRow>
            );
          })}
        </CartItemListCard>

        {/* Colonne Résumé de commande Sticky */}
        <SummaryCard>
          <SummaryHeading>{t("cart.summary_title", "Récapitulatif")}</SummaryHeading>

          <SummaryBreakdown>
            <BreakdownRow>
              <span>{t("cart.subtotal", "Sous-total")}</span>
              <strong>{subtotal.toFixed(2)}&nbsp;€</strong>
            </BreakdownRow>

            <BreakdownRow>
              <span>{t("cart.shipping", "Livraison sous abri")}</span>
              {isFreeShipping ? (
                <span className="free-badge">Offerte</span>
              ) : (
                <strong>{shipping.toFixed(2)}&nbsp;€</strong>
              )}
            </BreakdownRow>

            <BreakdownRow>
              <span>Délai moyen constaté</span>
              <strong style={{ fontSize: '12px', color: '#142618' }}>2 à 5 jours ouvrés</strong>
            </BreakdownRow>

            <Divider />

            <TotalRow>
              <div className="label-group">
                <span className="label">{t("cart.total", "Total TTC")}</span>
                <span className="subtext">TVA 20% incluse</span>
              </div>
              <div className="total-amount">{total.toFixed(2)}&nbsp;€</div>
            </TotalRow>
          </SummaryBreakdown>

          <PrimaryCheckoutBtn type="button" onClick={handleProceedToCheckout}>
            <span>Valider mon panier ({total.toFixed(2)}&nbsp;€)</span>
            <FiArrowRight size={16} />
          </PrimaryCheckoutBtn>

          <ContinueShoppingLink routeKey="products">
            ← {t("cart.continue_shopping", "Continuer mes achats")}
          </ContinueShoppingLink>

          {/* Rassurance Client */}
          <TrustList>
            <TrustItem>
              <FiTruck size={15} />
              <span>Livraison directe sous abri par camion avec chariot tout-terrain</span>
            </TrustItem>
            <TrustItem>
              <FiShield size={15} />
              <span>Paiement par virement bancaire sécurisé sans risque</span>
            </TrustItem>
            <TrustItem>
              <FiCheckCircle size={15} />
              <span>Bois fendu haute qualité & granulés certifiés DINplus</span>
            </TrustItem>
          </TrustList>
        </SummaryCard>
      </CartLayoutGrid>
    </CartPageContainer>
  );
};

export default Cart;
