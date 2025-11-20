import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiCreditCard, FiTruck, FiUser, FiMapPin, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { createOrder } from '../firebase/orders';
import { createUser, signInUser } from '../firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import toast from 'react-hot-toast';
import { getCouponByCode, validateAndComputeDiscount } from '../firebase/coupons';

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
    paymentMethod: 'bank',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [acceptCreate, setAcceptCreate] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [accountPassword, setAccountPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState('register'); // 'register' | 'login'
  const [authFields, setAuthFields] = useState({ email: '', password: '', confirm: '' });
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const couponSectionRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = Math.max(0, subtotal - discount) + shipping;

  // Recompute discount when subtotal changes if a coupon is applied
  useEffect(() => {
    if (!appliedCoupon) return;
    const { valid, discount: d } = validateAndComputeDiscount(appliedCoupon, subtotal);
    setDiscount(valid ? Number(d.toFixed(2)) : 0);
  }, [subtotal]);

  const handleAuthFieldChange = (e) => {
    const { name, value } = e.target;
    setAuthFields(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!authFields.email || !authFields.password) {
      return toast.error('Veuillez renseigner votre email et votre mot de passe');
    }
    try {
      setAuthLoading(true);
      const res = await signInUser(authFields.email, authFields.password);
      if (!res.success) {
        return toast.error(res.error || 'Impossible de vous connecter');
      }
      toast.dismiss('login-success');
      toast.custom((t) => (
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
              Connexion réussie.
            </div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
              Vos informations ont été chargées pour finaliser la commande.
            </div>
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: 'none',
                background: '#2c5530',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              OK
            </button>
          </div>
        </div>
      ), {
        id: 'login-success',
        duration: 1000,
        position: 'top-center'
      });
      setAuthMode('register');
      setAcceptCreate(false);
      setShowCoupon(false);
    } catch (err) {
      toast.error('Erreur lors de la connexion');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }
    if (!acceptTerms) {
      return toast.error('Veuillez lire et accepter les conditions générales avant de confirmer la commande.');
    }
    setLoading(true);

    try {
      const wasGuest = !user;
      let currentUser = user;

      // Si non connecté
      if (!currentUser) {
        // En mode connexion, on n'impose pas la création de compte :
        // on demande à l'utilisateur de se connecter ou de choisir "Continuer sans connexion".
        if (authMode === 'login') {
          setLoading(false);
          return toast.error('Veuillez vous connecter ou cliquer sur "Continuer sans connexion pour creer un compte "', { id: 'checkout-auth' });
        }

        // En mode création de compte, création automatique + mail de vérification
        if (!acceptCreate) {
          setLoading(false);
          return toast.error('Veuillez cocher "Créer un compte ?" pour continuer', { id: 'checkout-auth' });
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
        customerInfo: currentUser && userData ? {
          firstName: userData.firstName || formData.firstName,
          lastName: userData.lastName || formData.lastName,
          email: currentUser.email || formData.email,
          phone: userData.phone || formData.phone,
          address: userData.address || formData.address,
          city: userData.city || formData.city,
          postalCode: userData.postalCode || formData.postalCode,
          country: userData.country || formData.country
        } : {
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
          method: formData.paymentMethod || 'bank'
        },
        notes: formData.notes,
        total: Math.max(0, subtotal - discount) + (subtotal > 50 ? 0 : 9.99),
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          type: appliedCoupon.type,
          value: appliedCoupon.value,
          discount
        } : null
      };

      const result = await createOrder(orderData);

      if (result.success) {
        // Fire-and-forget: send professional confirmation email
        try {
          const customer = orderData.customerInfo || {};
          const emailPayload = {
            orderId: result.id,
            total: orderData.total,
            items: Array.isArray(orderData.items) ? orderData.items.map(it => ({
              name: it.name,
              quantity: it.quantity,
              price: it.price
            })) : [],
            customer: {
              firstName: customer.firstName,
              lastName: customer.lastName,
              email: customer.email,
              phone: customer.phone,
              address: customer.address,
              city: customer.city,
              postalCode: customer.postalCode,
              country: customer.country,
            },
            newUser: wasGuest,
          };
          // Do not await to avoid blocking UX; failures are silent
          fetch('/api/order-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailPayload),
            keepalive: true
          }).catch(() => {});
        } catch (_) {
          // ignore email errors
        }
        clearCart();
        const payMethod = orderData.payment?.method || 'bank';
        if (payMethod === 'paypal') {
          navigate(`/payment/paypal?orderId=${result.id}`);
        } else {
          if (wasGuest) {
            navigate(`/payment/bank?orderId=${result.id}`);
          } else {
            navigate('/billing');
          }
        }
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors de la création de la commande');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyCoupon = async () => {
    const raw = (couponCode || '').trim();
    if (!raw) return toast.error('Veuillez saisir un code');
    try {
      setApplyingCoupon(true);
      // fetch coupon by code (uppercase normalized)
      const res = await getCouponByCode(raw);
      if (!res.success || !res.data) {
        setAppliedCoupon(null);
        setDiscount(0);
        return toast.error(res.error || 'Code invalide');
      }
      const coupon = res.data;
      // compute discount against current subtotal
      const { valid, discount: d, reason } = validateAndComputeDiscount(coupon, subtotal);
      if (!valid) {
        setAppliedCoupon(null);
        setDiscount(0);
        return toast.error(reason || 'Code non applicable');
      }
      setAppliedCoupon(coupon);
      setDiscount(Number(d.toFixed(2)));
      toast.dismiss('coupon-applied');
      toast.custom((t) => (
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
              Code promo appliqué avec succès.
            </div>
            <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>
              Votre remise a été prise en compte sur le total.
            </div>
            <button
              type="button"
              onClick={() => toast.dismiss(t.id)}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: 'none',
                background: '#2c5530',
                color: '#fff',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              OK
            </button>
          </div>
        </div>
      ), {
        id: 'coupon-applied',
        duration: 1000,
        position: 'top-center'
      });
    } catch (err) {
      toast.error('Impossible d\'appliquer le code');
    } finally {
      setApplyingCoupon(false);
    }
  };

  // Si le panier est vide (ex: accès direct à /checkout), afficher un message
  // plutôt qu'une page blanche. Cela n'empêche pas une navigation programmée
  // (ex: vers /payment/bank) car la redirection se fait immédiatement.
  if (cartItems.length === 0) {
    return (
      <CheckoutContainer>
        <CheckoutHeader>
          <CheckoutTitle>Votre panier est vide</CheckoutTitle>
          <CheckoutSubtitle>
            Ajoutez des produits à votre panier avant de finaliser votre commande.
          </CheckoutSubtitle>
          <button
            type="button"
            onClick={() => navigate('/products')}
            style={{
              marginTop: 20,
              padding: '10px 18px',
              borderRadius: 8,
              border: 'none',
              fontWeight: 700,
              cursor: 'pointer',
              background: '#2c5530',
              color: '#fff'
            }}
          >
            Voir les produits
          </button>
        </CheckoutHeader>
      </CheckoutContainer>
    );
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
        <div style={{
          marginTop: 12,
          padding: '10px 12px',
          border: '2px solid #e0e0e0',
          borderRadius: 8,
          background: '#f8f9fa',
          fontWeight: 700,
          color: '#2c5530'
        }}>
          Avez-vous un code promo ?{' '}
          <button
            type="button"
            onClick={() => {
              // toggle: si déjà ouvert, on le referme; sinon on l'ouvre et on scrolle jusqu'au champ
              if (showCoupon) {
                setShowCoupon(false);
                return;
              }
              setShowCoupon(true);
              // petit délai pour laisser le DOM afficher la section puis scroller jusqu'au champ
              setTimeout(() => {
                if (couponSectionRef.current) {
                  couponSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
              }, 10);
            }}
            style={{ color: '#2c5530', textDecoration: 'underline', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 800 }}
          >
            Cliquez ici pour saisir votre code
          </button>
        </div>
      </CheckoutHeader>

      <CheckoutContent>
        {(!user || showCoupon) && (
          <CheckoutForm id="checkoutForm" onSubmit={handleSubmit}>
          {!user && authMode === 'login' && (
            <div style={{
              marginBottom: 24,
              padding: 16,
              borderRadius: 8,
              border: '1px solid #e0e0e0',
              background: '#f8f9fa'
            }}>
              <SectionTitle>
                <FiLock size={20} />
                Connexion à votre compte
              </SectionTitle>
              <InputGroup>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={authFields.email}
                  onChange={handleAuthFieldChange}
                  required
                />
              </InputGroup>
              <InputGroup>
                <Input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={authFields.password}
                  onChange={handleAuthFieldChange}
                  required
                />
              </InputGroup>
              <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={authLoading}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 8,
                    background: '#2c5530',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {authLoading ? 'Connexion…' : 'Se connecter'}
                </button>
                <button
                  type="button"
                  onClick={() => setAuthMode('register')}
                  style={{
                    padding: '10px 16px',
                    borderRadius: 8,
                    background: '#fff',
                    color: '#2c5530',
                    border: '1px solid #e0e0e0',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Continuer sans connexion
                </button>
              </div>
            </div>
          )}
          {showCoupon && (
            <div ref={couponSectionRef} style={{ marginBottom: 20 }}>
              <SectionTitle>Code promo</SectionTitle>
              <div style={{ display: 'flex', gap: 10 }}>
                <Input
                  type="text"
                  name="coupon"
                  placeholder="Saisissez votre code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button type="button" onClick={handleApplyCoupon} disabled={applyingCoupon} style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  background: '#2c5530',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>
                  {applyingCoupon ? 'Application...' : 'Appliquer'}
                </button>
              </div>
            </div>
          )}

          {!user && authMode === 'register' && (
            <>
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

              <p style={{ margin: '4px 0 6px', fontSize: 13, color: '#dc2626', fontWeight: 600 }}>
                Merci de bien renseigner l’adresse de livraison complète (numéro, rue, code postal, ville) pour garantir une expédition sans erreur.
              </p>
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
                <FiCreditCard size={20} />
                Mode de paiement
              </SectionTitle>
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <label style={{ display:'flex', alignItems:'center', gap:8, border:'2px solid #e0e0e0', borderRadius:8, padding:'10px 12px', cursor:'pointer' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={(e)=> setFormData({ ...formData, paymentMethod: e.target.value })}
                    />
                    Virement bancaire
                  </label>
                  <label style={{ display:'flex', alignItems:'center', gap:8, border:'2px solid #e0e0e0', borderRadius:8, padding:'10px 12px', cursor:'pointer' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={formData.paymentMethod === 'paypal'}
                      onChange={(e)=> setFormData({ ...formData, paymentMethod: e.target.value })}
                    />
                    PayPal (paiement manuel)
                  </label>
                </div>
              </div>

              <SectionTitle>
                <FiTruck size={20} />
                Informations complémentaires
              </SectionTitle>

              <InputGroup>
                <TextArea
                  name="notes"
                  placeholder="Notes pour la livraison (optionnel)"
                  value={formData.notes}
                  onChange={handleChange}
                />
              </InputGroup>

              {!user && authMode === 'register' && (
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
            </>
          )}
        </CheckoutForm>
        )}

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
          {discount > 0 && (
            <SummaryRow>
              <span>Remise{appliedCoupon?.code ? ` (${appliedCoupon.code})` : ''}</span>
              <span>-{discount.toFixed(2)}€</span>
            </SummaryRow>
          )}
          <SummaryRow className="total">
            <span>Total</span>
            <span>{total.toFixed(2)}€</span>
          </SummaryRow>
          <div style={{ marginTop: 12, fontSize: 12, color: '#4b5563', lineHeight: 1.5 }}>
            Vos données personnelles seront utilisées pour le traitement de votre commande, vous accompagner au cours
            de votre visite du site web, et pour d’autres raisons décrites dans notre{' '}
            <a href="/privacy" style={{ color: '#2c5530', textDecoration: 'underline' }}>politique de confidentialité</a>.
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 10, fontSize: 13, color: '#111827' }}>
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              style={{ marginTop: 3 }}
            />
            <span>
              J’ai lu et j’accepte les{' '}
              <a href="/terms" style={{ color: '#2c5530', textDecoration: 'underline' }}>conditions générales</a>.
              <span style={{ color: '#dc2626' }}> *</span>
            </span>
          </label>
          <PlaceOrderButton type="button" onClick={handleSubmit} disabled={loading}>
            <FiLock size={20} />
            {loading ? 'Traitement...' : 'Confirmer la commande'}
          </PlaceOrderButton>
        </OrderSummary>
      </CheckoutContent>
    </CheckoutContainer>
  );
};

export default Checkout;
