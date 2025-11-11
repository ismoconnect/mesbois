import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiCreditCard, FiTruck, FiUser, FiMapPin, FiLock } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../firebase/orders';
import { createUser, signInUser } from '../firebase/auth';
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
  padding: 12px 40px 12px ${props => (props.$withLeftIcon ? '44px' : '16px')};
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
  const [authLoading, setAuthLoading] = useState(false);
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
      if (!user) {
        setLoading(false);
        return toast.error('Veuillez créer un compte ou vous connecter pour finaliser.');
      }
      const orderData = {
        userId: user.uid,
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
          method: formData.deliveryMethod,
          cost: formData.deliveryMethod === 'express' ? 15.99 : 9.99
        },
        payment: {
          method: formData.paymentMethod
        },
        notes: formData.notes,
        total: getCartTotal() + (formData.deliveryMethod === 'express' ? 15.99 : 9.99)
      };

      const result = await createOrder(orderData);

      if (result.success) {
        toast.success('Commande passée avec succès !');
        clearCart();
        navigate(`/orders/${result.id}`);
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
  const shipping = formData.deliveryMethod === 'express' ? 15.99 : 9.99;
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <CheckoutContainer>
      <CheckoutHeader>
        <CheckoutTitle>Finaliser la commande</CheckoutTitle>
        <CheckoutSubtitle>Remplissez vos informations pour passer votre commande</CheckoutSubtitle>
      </CheckoutHeader>

      <CheckoutContent>
        <CheckoutForm onSubmit={handleSubmit}>
          {!user && (
            <div style={{ marginBottom: 24 }}>
              <SectionTitle>
                <FiLock size={20} />
                Créez votre compte ou connectez-vous
              </SectionTitle>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <button type="button" onClick={() => setAuthMode('register')} style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid #e0e0e0', background: authMode==='register' ? '#f8f9fa' : '#fff', fontWeight: 700 }}>Créer un compte</button>
                <button type="button" onClick={() => setAuthMode('login')} style={{ padding: '8px 12px', borderRadius: 8, border: '2px solid #e0e0e0', background: authMode==='login' ? '#f8f9fa' : '#fff', fontWeight: 700 }}>Se connecter</button>
              </div>
              <FormGrid>
                <InputGroup>
                  <InputIcon>
                    <FiCreditCard size={20} />
                  </InputIcon>
                  <Input
                    type="email"
                    name="authEmail"
                    placeholder="Email"
                    value={authFields.email}
                    onChange={(e) => setAuthFields({ ...authFields, email: e.target.value })}
                    required
                    $withLeftIcon
                  />
                </InputGroup>
                <InputGroup>
                  <InputIcon>
                    <FiLock size={20} />
                  </InputIcon>
                  <Input
                    type="password"
                    name="authPassword"
                    placeholder="Mot de passe"
                    value={authFields.password}
                    onChange={(e) => setAuthFields({ ...authFields, password: e.target.value })}
                    required
                    $withLeftIcon
                  />
                </InputGroup>
              </FormGrid>
              {authMode === 'register' && (
                <InputGroup>
                  <InputIcon>
                    <FiLock size={20} />
                  </InputIcon>
                  <Input
                    type="password"
                    name="authConfirm"
                    placeholder="Confirmer le mot de passe"
                    value={authFields.confirm}
                    onChange={(e) => setAuthFields({ ...authFields, confirm: e.target.value })}
                    required
                    $withLeftIcon
                  />
                </InputGroup>
              )}
              <div style={{ display: 'flex', gap: 10 }}>
                {authMode === 'register' ? (
                  <PlaceOrderButton type="button" onClick={async () => {
                    if (!authFields.email || !authFields.password || authFields.password !== authFields.confirm) {
                      return toast.error('Veuillez saisir un email et des mots de passe identiques.');
                    }
                    setAuthLoading(true);
                    const displayName = `${formData.firstName} ${formData.lastName}`.trim() || 'Client';
                    const result = await createUser(authFields.email, authFields.password, {
                      displayName,
                      phone: formData.phone,
                      address: formData.address,
                      city: formData.city,
                      postalCode: formData.postalCode,
                      country: formData.country
                    });
                    setAuthLoading(false);
                    if (result.success) toast.success('Compte créé. Vous êtes connecté.');
                    else toast.error(result.error || 'Création du compte impossible');
                  }} disabled={authLoading}>
                    {authLoading ? 'Traitement...' : "Créer mon compte"}
                  </PlaceOrderButton>
                ) : (
                  <PlaceOrderButton type="button" onClick={async () => {
                    if (!authFields.email || !authFields.password) return toast.error('Email et mot de passe requis');
                    setAuthLoading(true);
                    const result = await signInUser(authFields.email, authFields.password);
                    setAuthLoading(false);
                    if (result.success) toast.success('Connexion réussie');
                    else toast.error(result.error || 'Connexion impossible');
                  }} disabled={authLoading}>
                    {authLoading ? 'Traitement...' : 'Se connecter'}
                  </PlaceOrderButton>
                )}
              </div>
              <hr style={{ margin: '20px 0', borderTop: '1px solid #eee' }} />
            </div>
          )}
          <SectionTitle>
            <FiUser size={20} />
            Informations de livraison
          </SectionTitle>

          <FormGrid>
            <InputGroup>
              <InputIcon>
                <FiUser size={20} />
              </InputIcon>
              <Input
                type="text"
                name="firstName"
                placeholder="Prénom"
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
                placeholder="Nom"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </InputGroup>
          </FormGrid>

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
              placeholder="Adresse"
              value={formData.address}
              onChange={handleChange}
              required
              $withLeftIcon
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
              <option value="France">France</option>
              <option value="Belgique">Belgique</option>
              <option value="Suisse">Suisse</option>
              <option value="Luxembourg">Luxembourg</option>
            </Select>
          </InputGroup>

          <SectionTitle>
            <FiTruck size={20} />
            Mode de livraison
          </SectionTitle>

          <PaymentMethods>
            <PaymentMethod>
              <input
                type="radio"
                name="deliveryMethod"
                value="standard"
                checked={formData.deliveryMethod === 'standard'}
                onChange={handleChange}
              />
              <div>
                <div style={{ fontWeight: '600' }}>Livraison standard</div>
                <div style={{ fontSize: '12px', color: '#666' }}>3-5 jours ouvrés</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c5530' }}>9,99€</div>
              </div>
            </PaymentMethod>

            <PaymentMethod>
              <input
                type="radio"
                name="deliveryMethod"
                value="express"
                checked={formData.deliveryMethod === 'express'}
                onChange={handleChange}
              />
              <div>
                <div style={{ fontWeight: '600' }}>Livraison express</div>
                <div style={{ fontSize: '12px', color: '#666' }}>1-2 jours ouvrés</div>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#2c5530' }}>15,99€</div>
              </div>
            </PaymentMethod>
          </PaymentMethods>

          <SectionTitle>
            <FiLock size={20} />
            Mode de paiement
          </SectionTitle>

          <PaymentMethods>
            <PaymentMethod>
              <input
                type="radio"
                name="paymentMethod"
                value="card"
                checked={formData.paymentMethod === 'card'}
                onChange={handleChange}
              />
              <div>
                <div style={{ fontWeight: '600' }}>Carte bancaire</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Visa, Mastercard</div>
              </div>
            </PaymentMethod>

            <PaymentMethod>
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === 'paypal'}
                onChange={handleChange}
              />
              <div>
                <div style={{ fontWeight: '600' }}>PayPal</div>
                <div style={{ fontSize: '12px', color: '#666' }}>Paiement sécurisé</div>
              </div>
            </PaymentMethod>

            <PaymentMethod>
              <input
                type="radio"
                name="paymentMethod"
                value="bank"
                checked={formData.paymentMethod === 'bank'}
                onChange={handleChange}
              />
              <div>
                <div style={{ fontWeight: '600' }}>Virement bancaire</div>
                <div style={{ fontSize: '12px', color: '#666' }}>RIB communiqué après validation</div>
              </div>
            </PaymentMethod>
          </PaymentMethods>

          <InputGroup>
            <TextArea
              name="notes"
              placeholder="Notes pour la livraison (optionnel)"
              value={formData.notes}
              onChange={handleChange}
            />
          </InputGroup>
        </CheckoutForm>

        <OrderSummary>
          <SectionTitle>Résumé de la commande</SectionTitle>

          {cartItems.map(item => (
            <OrderItem key={item.id}>
              <ItemImage 
                src={item.image || '/placeholder-wood.jpg'} 
                alt={item.name}
                onError={(e) => {
                  e.target.src = '/placeholder-wood.jpg';
                }}
              />
              <ItemInfo>
                <ItemName>{item.name}</ItemName>
                <ItemQuantity>Quantité: {item.quantity}</ItemQuantity>
              </ItemInfo>
              <ItemPrice>{(((Number(item.price) || 0) * (Number(item.quantity) || 0))).toFixed(2)}€</ItemPrice>
            </OrderItem>
          ))}

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

          <PlaceOrderButton type="button" onClick={handleSubmit} disabled={loading}>
            <FiLock size={20} />
            {loading ? 'Traitement...' : 'Confirmer la commande'}
          </PlaceOrderButton>
        </OrderSummary>
      </CheckoutContent>
      <MobileCheckoutBar>
        <MobileTotal>Total {total.toFixed(2)}€</MobileTotal>
        <MobilePlaceOrderButton onClick={handleSubmit} disabled={loading}>
          {loading ? 'Traitement...' : 'Confirmer'}
        </MobilePlaceOrderButton>
      </MobileCheckoutBar>
    </CheckoutContainer>
  );
};

export default Checkout;
