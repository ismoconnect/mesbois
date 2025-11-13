import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiCreditCard, FiTruck, FiUser, FiMapPin, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../firebase/orders';
import { createUser, signInUser } from '../firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import toast from 'react-hot-toast';

const CheckoutContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 20px;

  @media (max-width: 768px) {
    padding: 24px 16px 96px;
  }
`;

const CheckoutHeader = styled.div`
  text-align: center;
  margin-bottom: 40px;
`;

const CheckoutTitle = styled.h1`
  font-size: 32px;
  font-weight: 700;
  color: #2c5530;
  margin-bottom: 10px;
`;

const CheckoutSubtitle = styled.p`
  color: #666;
  font-size: 16px;
`;

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 40px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

const CheckoutForm = styled.form`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

const SectionTitle = styled.h3`
  font-size: 20px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 30px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InputGroup = styled.div`
  position: relative;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px ${props => (props.$withRightIcon ? '44px' : '16px')} 12px ${props => (props.$withLeftIcon ? '44px' : '16px')};
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;

  &:focus {
    border-color: #2c5530;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  pointer-events: none;
`;

const InputRight = styled.button`
  position: absolute;
  right: 8px;
  top: 0;
  bottom: 0;
  margin: auto 0;
  height: 100%;
  width: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: #666;
  cursor: pointer;
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 40px 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  background: white;

  &:focus {
    border-color: #2c5530;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: border-color 0.3s ease;
  resize: vertical;
  min-height: 100px;

  &:focus {
    border-color: #2c5530;
  }
`;

const PaymentMethods = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const PaymentMethod = styled.label`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #2c5530;
  }

  input[type="radio"] {
    margin: 0;
  }

  input[type="radio"]:checked + & {
    border-color: #2c5530;
    background: #f8f9fa;
  }
`;

const OrderSummary = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  padding: 30px;
  height: fit-content;
  position: sticky;
  top: 20px;

  @media (max-width: 768px) {
    position: static;
    top: auto;
    padding: 20px;
  }
`;

const OrderItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #f0f0f0;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
`;

const ItemInfo = styled.div`
  flex: 1;
`;

const ItemName = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #2c5530;
  margin-bottom: 5px;
`;

const ItemQuantity = styled.span`
  color: #666;
  font-size: 12px;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #2c5530;
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

const PlaceOrderButton = styled.button`
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;

  &:hover {
    background: #219a52;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const MobileCheckoutBar = styled.div`
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  box-shadow: 0 -6px 20px rgba(0,0,0,0.08);
  padding: 12px 16px;
  display: none;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const MobileTotal = styled.div`
  font-size: 16px;
  font-weight: 700;
  color: #2c5530;
`;

const MobilePlaceOrderButton = styled.button`
  flex: 1;
  background: #27ae60;
  color: white;
  border: none;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover { background: #219a52; }
  &:disabled { background: #ccc; cursor: not-allowed; }
`;

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, userData } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: userData?.displayName?.split(' ')[0] || '',
    lastName: userData?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    city: userData?.city || '',
    postalCode: userData?.postalCode || '',
    country: userData?.country || 'France',
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [acceptCreate, setAcceptCreate] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [accountPassword, setAccountPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'
  const [authFields, setAuthFields] = useState({ email: '', password: '', confirm: '' });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let currentUser = user;

      // Si non connecté, créer automatiquement un compte et envoyer un mail de vérification
      if (!currentUser) {
        if (!acceptCreate) {
          setLoading(false);
          return toast.error('Veuillez cocher "Créer un compte ?" pour continuer');
        }
        if (!accountPassword || accountPassword.length < 6) {
          setLoading(false);
          return toast.error('Veuillez renseigner un mot de passe (6 caractères minimum)');
        }
        const displayName = `${formData.firstName} ${formData.lastName}`.trim() || 'Client';
        const regRes = await createUser(formData.email, accountPassword, {
          displayName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        });
        if (!regRes.success) {
          setLoading(false);
          return toast.error(regRes.error || 'Impossible de créer le compte');
        }
        currentUser = regRes.user;
        try { await sendEmailVerification(currentUser); } catch {}
      }

      const orderData = {
        userId: currentUser.uid,
        items: cartItems,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        },
        delivery: {
          method: 'standard',
          cost: subtotal > 50 ? 0 : 9.99
        },
        payment: {
          method: 'bank'
        },
        notes: formData.notes,
        total: subtotal + (subtotal > 50 ? 0 : 9.99)
      };

      const result = await createOrder(orderData);

      if (result.success) {
        toast.success('Commande créée. Vérifiez votre email pour confirmer votre compte.');
        clearCart();
        navigate(`/payment/bank?orderId=${result.id}`);
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  // Si le panier est vide (ex: après clearCart), ne pas rediriger automatiquement
  // pour éviter d'annuler une navigation programmée (ex: vers /payment/bank)
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <CheckoutTitle>Finaliser la commande</CheckoutTitle>
        <CheckoutSubtitle>Remplissez vos informations pour passer votre commande</CheckoutSubtitle>
        {!user && (
          <div style={{
            marginTop: 12,
            padding: '10px 12px',
            border: '2px solid #e0e0e0',
            borderRadius: 8,
            background: '#f8f9fa',
            fontWeight: 700,
            color: '#2c5530'
          }}>
            Déjà client ?{' '}
            <button type="button" onClick={() => setAuthMode('login')} style={{ color: '#2c5530', textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 800 }}>
              Cliquez ici pour vous connecter
            </button>
          </div>
        )}
      </CheckoutHeader>

      <CheckoutContent>
        <CheckoutForm id="checkoutForm" onSubmit={handleSubmit}>
          <SectionTitle>
            <FiUser size={20} />
            Facturation & Expédition
          </SectionTitle>

          <FormGrid>
            <InputGroup>
              <InputIcon>
                <FiUser size={20} />
              </InputIcon>
              <Input
                type="text"
                name="firstName"
                placeholder="Prénom *"
                value={formData.firstName}
                onChange={handleChange}
                required
                $withLeftIcon
              />
            </InputGroup>

            <InputGroup>
              <Input
                type="text"
                name="lastName"
                placeholder="Nom *"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </FormGrid>

          <InputGroup>
            <Input
              type="text"
              name="company"
              placeholder="Nom de l’entreprise (facultatif)"
              value={formData.company || ''}
              onChange={handleChange}
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FiCreditCard size={20} />
            </InputIcon>
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              $withLeftIcon
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FiCreditCard size={20} />
            </InputIcon>
            <Input
              type="tel"
              name="phone"
              placeholder="Téléphone"
              value={formData.phone}
              onChange={handleChange}
              $withLeftIcon
            />
          </InputGroup>

          <InputGroup>
            <InputIcon>
              <FiMapPin size={20} />
            </InputIcon>
            <Input
              type="text"
              name="address"
              placeholder="Numéro et nom de rue *"
              value={formData.address}
              onChange={handleChange}
              required
              $withLeftIcon
            />
          </InputGroup>

          <InputGroup>
            <Input
              type="text"
              name="address2"
              placeholder="Appartement, suite, unité, etc. (facultatif)"
              value={formData.address2 || ''}
              onChange={handleChange}
            />
          </InputGroup>

          <FormGrid>
            <InputGroup>
              <Input
                type="text"
                name="city"
                placeholder="Ville"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </InputGroup>

            <InputGroup>
              <Input
                type="text"
                name="postalCode"
                placeholder="Code postal"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </FormGrid>

          <InputGroup>
            <Select
              name="country"
              value={formData.country}
              onChange={handleChange}
            >
              <option value="">Sélectionner un pays/région…</option>
              <option value="Allemagne">Allemagne</option>
              <option value="Belgique">Belgique</option>
              <option value="France">France</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Suisse">Suisse</option>
            </Select>
          </InputGroup>

          <SectionTitle>
            <FiTruck size={20} />
            Informations complémentaires
          </SectionTitle>

          

          {/* Section paiement retirée selon demande: pas d'options affichées ici */}

          <InputGroup>
            <TextArea
              name="notes"
              placeholder="Notes pour la livraison (optionnel)"
              value={formData.notes}
              onChange={handleChange}
            />
          </InputGroup>

          {!user && (
            <div style={{ marginTop: 12 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input type="checkbox" name="createAccount" required checked={acceptCreate} onChange={(e)=> setAcceptCreate(e.target.checked)} />
                Créer un compte ?
              </label>
              {acceptCreate && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      name="accountPassword"
                      placeholder="Mot de passe *"
                      value={accountPassword}
                      onChange={(e)=> setAccountPassword(e.target.value)}
                      required
                      $withRightIcon
                    />
                    <InputRight type="button" onClick={() => setShowPassword(v => !v)} aria-label="Basculer la visibilité du mot de passe">
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </InputRight>
                  </div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>6 caractères minimum</div>
                </div>
              )}
            </div>
          )}
        </CheckoutForm>

        <OrderSummary>
          <SectionTitle>Résumé de la commande</SectionTitle>
          <SummaryRow>
            <span>Sous-total</span>
            <span>{subtotal.toFixed(2)}€</span>
          </SummaryRow>
          <SummaryRow>
            <span>Livraison</span>
            <span>{shipping.toFixed(2)}€</span>
          </SummaryRow>
          <SummaryRow className="total">
            <span>Total</span>
            <span>{total.toFixed(2)}€</span>
          </SummaryRow>
          <PlaceOrderButton type="submit" form="checkoutForm" disabled={loading}>
            <FiLock size={20} />
            {loading ? 'Traitement...' : 'Confirmer la commande'}
          </PlaceOrderButton>
        </OrderSummary>
      </CheckoutContent>
    </CheckoutContainer>
  );
};

export default Checkout;
