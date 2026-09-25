import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLocalizedNavigate } from '../hooks/useLocalizedNavigate';
import styled from 'styled-components';
import { 
  FiTruck, 
  FiEye, 
  FiEyeOff, 
  FiCheck, 
  FiTag, 
  FiShield, 
  FiLock,
  FiCheckCircle, 
  FiArrowRight,
  FiX,
  FiEdit2,
  FiArrowLeft
} from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import { createOrder } from '../firebase/orders';
import { createUser, signInUser } from '../firebase/auth';
import { sendEmailVerification } from 'firebase/auth';
import toast from 'react-hot-toast';
import { getCouponByCode, validateAndComputeDiscount } from '../firebase/coupons';

/* ==========================================================================
   STYLED COMPONENTS
   ========================================================================== */

const PageContainer = styled.div`
  max-width: 1140px;
  margin: 0 auto;
  padding: 32px 16px 80px;

  @media (max-width: 768px) {
    padding: 16px 12px 60px;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 20px;
  text-align: center;

  @media (max-width: 768px) {
    margin-bottom: 14px;
    text-align: left;
  }
`;

const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #142618;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;

  @media (max-width: 768px) {
    font-size: 21px;
  }
`;

const Subtitle = styled.div`
  color: #55695a;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: flex-start;
    font-size: 13px;
  }
`;

const LoginPromptButton = styled.button`
  background: none;
  border: none;
  color: #2c5530;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: inherit;

  &:hover {
    color: #1b381e;
  }
`;

/* Accordeon de connexion compact */
const LoginAccordion = styled.div`
  max-width: 480px;
  margin: 14px auto 0;
  background: #f8faf8;
  border: 1px solid #d4dfd6;
  border-radius: 10px;
  padding: 16px;
  text-align: left;
  animation: fadeIn 0.2s ease-in-out;

  @media (max-width: 768px) {
    margin: 12px 0 0;
    max-width: 100%;
  }
`;

/* Stepper Mobile Uniquement (2 Étapes) */
const MobileStepper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #ffffff;
    border: 1px solid #e1ebe3;
    border-radius: 12px;
    padding: 10px 16px;
    margin-bottom: 16px;
    box-shadow: 0 2px 6px rgba(0,0,0,0.02);
  }
`;

const StepItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  opacity: ${props => (props.$active || props.$done ? 1 : 0.45)};
  transition: opacity 0.2s;

  .step-num {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: ${props => (props.$done ? '#27ae60' : props.$active ? '#2c5530' : '#e2e8e4')};
    color: #ffffff;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-label {
    font-size: 13px;
    font-weight: 700;
    color: ${props => (props.$active ? '#142618' : '#55695a')};
  }
`;

const StepDivider = styled.div`
  flex: 1;
  height: 2px;
  background: ${props => (props.$done ? '#27ae60' : '#e2e8e4')};
  margin: 0 12px;
`;

/* Layout 2 Colonnes Desktop */
const CheckoutGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 28px;
  align-items: start;

  @media (max-width: 992px) {
    grid-template-columns: 1fr 360px;
    gap: 20px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`;

const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 16px;
  }
`;

/* Wrappers conditionnels Mobile vs Desktop */
const Step1Wrapper = styled.div`
  @media (max-width: 768px) {
    display: ${props => (props.$active ? 'block' : 'none')};
  }
`;

const Step2Wrapper = styled.div`
  @media (max-width: 768px) {
    display: ${props => (props.$active ? 'block' : 'none')};
  }
`;

const DesktopSummaryWrapper = styled.div`
  position: sticky;
  top: 80px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileSummaryWrapper = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: block;
    margin-top: 16px;
  }
`;

const Card = styled.div`
  background: #ffffff;
  border: 1px solid #e8eee9;
  border-radius: 12px;
  padding: 22px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);

  @media (max-width: 600px) {
    padding: 16px 12px;
    border-radius: 10px;
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 10px;
  border-bottom: 1px solid #edf2ee;

  .left-head {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  h2 {
    font-size: 16px;
    font-weight: 700;
    color: #1e3d22;
    margin: 0;
  }

  .step-badge {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #2c5530;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
`;

/* Chip de récapitulatif adresse pour l'étape 2 sur mobile */
const DeliveryRecapChip = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #f4f8f5;
    border: 1px solid #cfe0d3;
    border-radius: 10px;
    padding: 12px 14px;
    margin-bottom: 14px;
    font-size: 13px;

    .info {
      color: #1e3d22;
      line-height: 1.4;
      strong { color: #142618; }
    }

    button {
      background: none;
      border: none;
      color: #2c5530;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
      cursor: pointer;
      padding: 4px 6px;
      border-radius: 6px;
      &:hover { background: #e3ede5; }
    }
  }
`;

/* Formulaire Compact */
const FormGroup = styled.div`
  display: grid;
  grid-template-columns: ${props => props.$cols || '1fr'};
  gap: 12px;
  margin-bottom: 12px;

  @media (max-width: 600px) {
    grid-template-columns: ${props => props.$mobileCols || '1fr'};
    gap: 10px;
    margin-bottom: 10px;
  }
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  label {
    font-size: 12px;
    font-weight: 600;
    color: #3b5240;
    margin-bottom: 4px;
    display: flex;
    justify-content: space-between;

    span.req {
      color: #dc2626;
      margin-left: 2px;
    }

    span.opt {
      color: #88998c;
      font-weight: 400;
    }
  }
`;

const StyledInput = styled.input`
  width: 100%;
  height: 42px;
  padding: 8px 12px;
  border: 1.5px solid #d2ddd4;
  border-radius: 8px;
  font-size: 14px;
  color: #142618;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #2c5530;
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.12);
  }

  &::placeholder {
    color: #9eb0a1;
  }

  @media (max-width: 600px) {
    font-size: 14px;
    height: 40px;
  }
`;

const StyledSelect = styled.select`
  width: 100%;
  height: 42px;
  padding: 8px 12px;
  border: 1.5px solid #d2ddd4;
  border-radius: 8px;
  font-size: 14px;
  color: #142618;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #2c5530;
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.12);
  }

  @media (max-width: 600px) {
    font-size: 14px;
    height: 40px;
  }
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 10px 12px;
  border: 1.5px solid #d2ddd4;
  border-radius: 8px;
  font-size: 14px;
  color: #142618;
  background: #ffffff;
  outline: none;
  box-sizing: border-box;
  min-height: 55px;
  resize: vertical;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: #2c5530;
    box-shadow: 0 0 0 3px rgba(44, 85, 48, 0.12);
  }

  &::placeholder {
    color: #9eb0a1;
  }
`;

/* Bloc Virement Bancaire Unique */
const PaymentBox = styled.div`
  border: 2px solid #2c5530;
  background: #f4f8f5;
  border-radius: 10px;
  padding: 16px;
  position: relative;

  @media (max-width: 600px) {
    padding: 14px;
  }
`;

const PaymentBoxHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
`;

const PaymentOptionTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  font-size: 15px;
  color: #142618;

  .radio-check {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #2c5530;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
    font-size: 12px;
  }
`;

const SecurityBadge = styled.span`
  background: #dcfce7;
  color: #166534;
  font-size: 11px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const PaymentDetails = styled.div`
  font-size: 13px;
  line-height: 1.55;
  color: #3b5240;
  background: #ffffff;
  border: 1px solid #d9e4db;
  border-radius: 8px;
  padding: 12px 14px;
  margin-top: 10px;

  p {
    margin: 0 0 6px 0;
    &:last-child { margin-bottom: 0; }
  }

  strong {
    color: #142618;
  }
`;

/* Right Column: Order Summary (Sticky) */
const SummaryCard = styled(Card)`
  padding: 20px;
  border: 1px solid #d4dfd6;
  background: #fafcfa;

  @media (max-width: 600px) {
    padding: 16px 14px;
  }
`;

const SummaryTitle = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: #142618;
  margin: 0 0 14px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e1ebe3;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ItemList = styled.div`
  max-height: 220px;
  overflow-y: auto;
  margin-bottom: 14px;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd8ce;
    border-radius: 4px;
  }
`;

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 7px 0;
  border-bottom: 1px dashed #e8efe9;

  &:last-child {
    border-bottom: none;
  }
`;

const ItemThumb = styled.div`
  position: relative;
  width: 42px;
  height: 42px;
  border-radius: 6px;
  background: #fff;
  border: 1px solid #d4dfd6;
  overflow: hidden;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .qty-badge {
    position: absolute;
    top: -4px;
    right: -4px;
    background: #2c5530;
    color: #fff;
    font-size: 10px;
    font-weight: 700;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1.5px solid #fff;
  }
`;

const ItemDetails = styled.div`
  flex: 1;
  min-width: 0;

  .name {
    font-size: 13px;
    font-weight: 600;
    color: #142618;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .meta {
    font-size: 11px;
    color: #667c6c;
  }
`;

const ItemPrice = styled.div`
  font-size: 13px;
  font-weight: 700;
  color: #142618;
  white-space: nowrap;
`;

/* Coupon Section */
const CouponBox = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
`;

const CouponInput = styled.input`
  flex: 1;
  height: 38px;
  padding: 0 10px;
  border: 1.5px solid #d2ddd4;
  border-radius: 6px;
  font-size: 13px;
  text-transform: uppercase;
  outline: none;

  &:focus {
    border-color: #2c5530;
  }
`;

const CouponButton = styled.button`
  height: 38px;
  padding: 0 14px;
  background: #2c5530;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: #1e3d22;
  }

  &:disabled {
    background: #a8b8ac;
    cursor: not-allowed;
  }
`;

const AppliedCouponBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #e8f5e9;
  border: 1px solid #a5d6a7;
  color: #1b5e20;
  font-size: 12px;
  font-weight: 600;
  padding: 6px 10px;
  border-radius: 6px;
  margin-bottom: 14px;

  button {
    background: none;
    border: none;
    color: #c62828;
    cursor: pointer;
    font-size: 14px;
    padding: 0;
    display: flex;
    align-items: center;
  }
`;

/* Calculations */
const LineRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #4f6655;
  margin-bottom: 7px;

  &.discount {
    color: #166534;
    font-weight: 600;
  }

  &.total {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 2px solid #dce5de;
    font-size: 18px;
    font-weight: 800;
    color: #142618;
  }
`;

/* Checkbox Conditions */
const TermsWrapper = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 12px;
  color: #4b5e50;
  line-height: 1.45;
  margin: 14px 0;
  cursor: pointer;

  input[type="checkbox"] {
    margin-top: 2px;
    accent-color: #2c5530;
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  a {
    color: #2c5530;
    text-decoration: underline;
    font-weight: 600;
  }
`;

/* Boutons d'action */
const SubmitButton = styled.button`
  width: 100%;
  height: 50px;
  background: #27ae60;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  box-shadow: 0 4px 14px rgba(39, 174, 96, 0.3);
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #219653;
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(39, 174, 96, 0.38);
  }

  &:disabled {
    background: #a3c4ae;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }

  @media (max-width: 600px) {
    height: 48px;
    font-size: 15px;
  }
`;

const NextStepButton = styled.button`
  width: 100%;
  height: 50px;
  background: #2c5530;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  margin-top: 14px;
  box-shadow: 0 4px 14px rgba(44, 85, 48, 0.25);
  transition: all 0.2s ease;

  &:hover {
    background: #1b381e;
    transform: translateY(-1px);
  }

  @media (min-width: 769px) {
    display: none;
  }
`;

const BackStepButton = styled.button`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    background: none;
    border: none;
    color: #55695a;
    font-size: 13px;
    font-weight: 600;
    margin-top: 14px;
    width: 100%;
    cursor: pointer;
    padding: 6px;

    &:hover {
      color: #142618;
      text-decoration: underline;
    }
  }
`;

/* Reassurance Badges */
const TrustList = styled.div`
  margin-top: 14px;
  padding-top: 12px;
  border-top: 1px solid #edf2ee;
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

const TrustItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #4a6150;

  svg {
    color: #2c5530;
    flex-shrink: 0;
  }
`;

/* ==========================================================================
   COMPONENT
   ========================================================================== */

const Checkout = () => {
  const { t } = useTranslation();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user, userData } = useAuth();
  const localizedNavigate = useLocalizedNavigate();

  // Étape courante sur mobile (1: Livraison, 2: Paiement & Validation)
  const [mobileStep, setMobileStep] = useState(1);

  // Formulaire d'expédition & facturation
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    address2: '',
    postalCode: '',
    city: '',
    country: 'France',
    notes: '',
    paymentMethod: 'bank' // STRICTEMENT Virement Bancaire
  });

  // Gestion accordéon connexion & coupon
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginFields, setLoginFields] = useState({ email: '', password: '' });
  const [loginLoading, setLoginLoading] = useState(false);

  // Accordéon instructions spécifiques chauffeur
  const [showNotes, setShowNotes] = useState(false);

  // Création de compte facultative pour invité
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Coupon promo
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  // Conditions & validation
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pré-remplissage si utilisateur connecté
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        firstName: userData?.firstName || prev.firstName || '',
        lastName: userData?.lastName || prev.lastName || '',
        email: user.email || prev.email || '',
        phone: userData?.phone || prev.phone || '',
        address: userData?.address || prev.address || '',
        postalCode: userData?.postalCode || prev.postalCode || '',
        city: userData?.city || prev.city || '',
        country: userData?.country || prev.country || 'France'
      }));
    }
  }, [user, userData]);

  // Recalcul de remise coupon si sous-total change
  const subtotal = getCartTotal();
  const shipping = subtotal > 50 ? 0 : 9.99;
  const total = Math.max(0, subtotal - discount) + shipping;
  const totalItemsCount = cartItems.reduce((acc, it) => acc + (it.quantity || 1), 0);

  useEffect(() => {
    if (!appliedCoupon) return;
    const { valid, discount: d } = validateAndComputeDiscount(appliedCoupon, subtotal);
    setDiscount(valid ? Number(d.toFixed(2)) : 0);
  }, [subtotal, appliedCoupon]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Passer à l'étape 2 sur mobile
  const handleProceedToPayment = () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      return toast.error('Veuillez renseigner vos prénom et nom.');
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      return toast.error('Veuillez renseigner une adresse email valide.');
    }
    if (!formData.phone.trim()) {
      return toast.error('Veuillez renseigner votre numéro de téléphone.');
    }
    if (!formData.address.trim()) {
      return toast.error('Veuillez renseigner votre adresse de livraison complète.');
    }
    if (!formData.postalCode.trim() || !formData.city.trim()) {
      return toast.error('Veuillez renseigner votre code postal et ville.');
    }

    setMobileStep(2);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Connexion rapide en accordéon
  const handleQuickLogin = async (e) => {
    e.preventDefault();
    if (!loginFields.email || !loginFields.password) {
      toast.error('Veuillez renseigner votre email et mot de passe');
      return;
    }
    try {
      setLoginLoading(true);
      const res = await signInUser(loginFields.email, loginFields.password);
      if (!res.success) {
        toast.error(res.error || 'Identifiants incorrects');
        setLoginLoading(false);
        return;
      }
      toast.success('Connexion réussie ! Vos données ont été chargées.');
      setIsLoginOpen(false);
      setLoginLoading(false);
    } catch {
      toast.error('Erreur lors de la connexion');
      setLoginLoading(false);
    }
  };

  // Application code promo
  const handleApplyCoupon = async () => {
    const raw = (couponCode || '').trim();
    if (!raw) return toast.error('Veuillez saisir un code promo');
    try {
      setApplyingCoupon(true);
      const res = await getCouponByCode(raw);
      if (!res.success || !res.data) {
        setAppliedCoupon(null);
        setDiscount(0);
        return toast.error(res.error || 'Code promo invalide');
      }
      const coupon = res.data;
      const { valid, discount: d, reason } = validateAndComputeDiscount(coupon, subtotal);
      if (!valid) {
        setAppliedCoupon(null);
        setDiscount(0);
        return toast.error(reason || 'Code promo non applicable');
      }
      setAppliedCoupon(coupon);
      setDiscount(Number(d.toFixed(2)));
      toast.success(`Code promo "${coupon.code}" appliqué avec succès ! (-${d.toFixed(2)}€)`);
    } catch {
      toast.error('Impossible d’appliquer ce code promo');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode('');
    toast.success('Code promo retiré');
  };

  // Validation finale & Enregistrement de commande
  const handleSubmit = async (e) => {
    if (e && typeof e.preventDefault === 'function') {
      e.preventDefault();
    }

    if (!acceptTerms) {
      return toast.error('Veuillez accepter les conditions générales de vente pour continuer.');
    }

    // Validation des champs essentiels
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setMobileStep(1);
      return toast.error('Veuillez renseigner vos prénom et nom.');
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setMobileStep(1);
      return toast.error('Veuillez renseigner une adresse email valide.');
    }
    if (!formData.address.trim()) {
      setMobileStep(1);
      return toast.error('Veuillez renseigner votre adresse de livraison complète.');
    }
    if (!formData.postalCode.trim() || !formData.city.trim()) {
      setMobileStep(1);
      return toast.error('Veuillez renseigner votre code postal et ville.');
    }

    setIsSubmitting(true);

    try {
      let currentUser = user;
      const wasGuest = !user;

      // Si invité a choisi de créer un compte facultatif
      if (!currentUser && createAccount) {
        if (!password || password.length < 6) {
          setIsSubmitting(false);
          setMobileStep(1);
          return toast.error('Le mot de passe doit comporter au moins 6 caractères.');
        }
        const displayName = `${formData.firstName} ${formData.lastName}`.trim();
        const regRes = await createUser(formData.email, password, {
          displayName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country
        });
        if (regRes.success) {
          currentUser = regRes.user;
          try { await sendEmailVerification(currentUser); } catch { }
        }
      }

      const orderData = {
        userId: currentUser ? currentUser.uid : `guest_${Date.now()}`,
        items: cartItems,
        customerInfo: {
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          address2: (formData.address2 || '').trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country || 'France'
        },
        delivery: {
          method: 'standard',
          label: 'Livraison soignée avec chariot tout-terrain',
          cost: shipping
        },
        payment: {
          method: 'bank',
          label: 'Virement bancaire (SEPA)'
        },
        notes: (formData.notes || '').trim(),
        subtotal: subtotal,
        discount: discount,
        total: total,
        coupon: appliedCoupon ? {
          code: appliedCoupon.code,
          discount: discount
        } : null,
        isGuest: wasGuest && !createAccount
      };

      const result = await createOrder(orderData);

      if (result.success) {
        // Envoi asynchrone du mail de confirmation
        try {
          const emailPayload = {
            orderId: result.id,
            total: orderData.total,
            items: orderData.items.map(it => ({
              name: it.name,
              quantity: it.quantity,
              price: it.price
            })),
            customer: orderData.customerInfo,
            newUser: wasGuest && createAccount
          };
          fetch('/api/order-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(emailPayload),
            keepalive: true
          }).catch(() => { });
        } catch { }

        // Vider le panier et rediriger vers la page de virement bancaire avec coordonnées
        clearCart();
        localizedNavigate('bankTransfer', '', `?orderId=${result.id}`);
      } else {
        toast.error(result.error || 'Erreur lors de la validation de la commande');
      }
    } catch {
      toast.error('Une erreur inattendue est survenue.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Si panier vide
  if (cartItems.length === 0) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>{t('checkout.empty_cart_title', 'Votre panier est vide')}</Title>
          <Subtitle>Ajoutez des produits de qualité à votre panier pour finaliser votre commande.</Subtitle>
          <div style={{ marginTop: 24 }}>
            <button
              type="button"
              onClick={() => localizedNavigate('products')}
              style={{
                padding: '12px 24px',
                borderRadius: 8,
                border: 'none',
                background: '#2c5530',
                color: '#fff',
                fontWeight: 700,
                fontSize: 15,
                cursor: 'pointer'
              }}
            >
              Découvrir nos bois & granulés
            </button>
          </div>
        </PageHeader>
      </PageContainer>
    );
  }

  // Bloc réutilisable pour le récapitulatif de commande (utilisé sur desktop sticky & mobile étape 2)
  const renderOrderSummaryContent = () => (
    <SummaryCard>
      <SummaryTitle>
        <span>Récapitulatif de la commande</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: '#4a6150' }}>{totalItemsCount} article{totalItemsCount > 1 ? 's' : ''}</span>
      </SummaryTitle>

      {/* Liste des articles */}
      <ItemList>
        {cartItems.map((item) => (
          <ItemRow key={item.id}>
            <ItemThumb>
              <img src={item.image || 'https://picsum.photos/seed/wood/100/100'} alt={item.name} />
              <span className="qty-badge">{item.quantity}</span>
            </ItemThumb>
            <ItemDetails>
              <div className="name" title={item.name}>{item.name}</div>
              <div className="meta">Qté : {item.quantity} × {Number(item.price || 0).toFixed(2)} €</div>
            </ItemDetails>
            <ItemPrice>{(Number(item.price || 0) * (item.quantity || 1)).toFixed(2)} €</ItemPrice>
          </ItemRow>
        ))}
      </ItemList>

      {/* Code promo compact */}
      {appliedCoupon ? (
        <AppliedCouponBadge>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiTag size={14} />
            Code <strong>{appliedCoupon.code}</strong> (-{discount.toFixed(2)} €)
          </span>
          <button type="button" onClick={handleRemoveCoupon} title="Supprimer le code">
            <FiX />
          </button>
        </AppliedCouponBadge>
      ) : (
        <CouponBox>
          <CouponInput
            type="text"
            placeholder="Code promo"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
          <CouponButton 
            type="button" 
            onClick={handleApplyCoupon}
            disabled={applyingCoupon || !couponCode.trim()}
          >
            {applyingCoupon ? '...' : 'Appliquer'}
          </CouponButton>
        </CouponBox>
      )}

      {/* Lignes de décompte */}
      <LineRow>
        <span>Sous-total articles</span>
        <span>{subtotal.toFixed(2)} €</span>
      </LineRow>

      <LineRow>
        <span>Livraison tout-terrain sous abri</span>
        <span>
          {shipping === 0 ? (
            <strong style={{ color: '#27ae60' }}>Offerte</strong>
          ) : (
            `${shipping.toFixed(2)} €`
          )}
        </span>
      </LineRow>

      {discount > 0 && (
        <LineRow className="discount">
          <span>Remise coupon</span>
          <span>-{discount.toFixed(2)} €</span>
        </LineRow>
      )}

      <LineRow className="total">
        <span>Total TTC</span>
        <span>{total.toFixed(2)} €</span>
      </LineRow>

      {/* Conditions Générales */}
      <TermsWrapper>
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => setAcceptTerms(e.target.checked)}
          required
        />
        <span>
          J'accepte les <Link to="/terms" target="_blank">Conditions Générales de Vente</Link> et la <Link to="/privacy" target="_blank">Politique de Confidentialité</Link>. <span style={{ color: '#dc2626' }}>*</span>
        </span>
      </TermsWrapper>

      {/* Bouton de confirmation principal */}
      <SubmitButton
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>Validation en cours...</>
        ) : (
          <>
            <span>Confirmer la commande ({total.toFixed(2)} €)</span>
            <FiArrowRight size={18} />
          </>
        )}
      </SubmitButton>

      {/* Bouton retour étape 1 sur mobile */}
      <BackStepButton type="button" onClick={() => setMobileStep(1)}>
        <FiArrowLeft size={14} />
        <span>Modifier mes coordonnées & adresse</span>
      </BackStepButton>

      {/* Badges de réassurance */}
      <TrustList>
        <TrustItem>
          <FiTruck size={15} />
          <span>Livraison directe sous abri par camion avec chariot</span>
        </TrustItem>
        <TrustItem>
          <FiShield size={15} />
          <span>Virement bancaire sécurisé sans transmission de données bancaires</span>
        </TrustItem>
        <TrustItem>
          <FiCheckCircle size={15} />
          <span>Bois 100% fendu prêt à l'emploi & granulés certifiés DINplus</span>
        </TrustItem>
      </TrustList>
    </SummaryCard>
  );

  return (
    <PageContainer>
      <PageHeader>
        <Title>Finaliser votre commande</Title>
        <Subtitle>
          {!user ? (
            <>
              <span>Achat rapide et direct en tant qu’invité.</span>
              <span>•</span>
              <span>
                Déjà client ?{' '}
                <LoginPromptButton 
                  type="button" 
                  onClick={() => setIsLoginOpen(!isLoginOpen)}
                >
                  {isLoginOpen ? 'Fermer la connexion' : 'Se connecter'}
                </LoginPromptButton>
              </span>
            </>
          ) : (
            <span style={{ color: '#27ae60', fontWeight: 600 }}>
              ✓ Connecté en tant que {userData?.firstName || user.email}
            </span>
          )}
        </Subtitle>

        {/* Volet compact de connexion optionnelle */}
        {!user && isLoginOpen && (
          <LoginAccordion>
            <div style={{ fontWeight: 700, fontSize: 14, color: '#142618', marginBottom: 10 }}>
              Connexion à votre compte client
            </div>
            <form onSubmit={handleQuickLogin}>
              <FormGroup $cols="1fr 1fr" $mobileCols="1fr">
                <StyledInput
                  type="email"
                  placeholder="Votre adresse email"
                  value={loginFields.email}
                  onChange={(e) => setLoginFields({ ...loginFields, email: e.target.value })}
                  required
                />
                <StyledInput
                  type="password"
                  placeholder="Votre mot de passe"
                  value={loginFields.password}
                  onChange={(e) => setLoginFields({ ...loginFields, password: e.target.value })}
                  required
                />
              </FormGroup>
              <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                <button
                  type="submit"
                  disabled={loginLoading}
                  style={{
                    padding: '8px 16px',
                    borderRadius: 6,
                    border: 'none',
                    background: '#2c5530',
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  {loginLoading ? 'Connexion...' : 'Se connecter'}
                </button>
                <button
                  type="button"
                  onClick={() => setIsLoginOpen(false)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 6,
                    border: '1px solid #d4dfd6',
                    background: '#fff',
                    color: '#4a6150',
                    fontSize: 13,
                    cursor: 'pointer'
                  }}
                >
                  Annuler
                </button>
              </div>
            </form>
          </LoginAccordion>
        )}
      </PageHeader>

      {/* STEPPER SUR MOBILE UNIQUEMENT (2 ÉTAPES) */}
      <MobileStepper>
        <StepItem 
          $active={mobileStep === 1} 
          $done={mobileStep > 1}
          onClick={() => setMobileStep(1)}
        >
          <div className="step-num">{mobileStep > 1 ? <FiCheck size={12} /> : '1'}</div>
          <span className="step-label">1. Livraison</span>
        </StepItem>

        <StepDivider $done={mobileStep > 1} />

        <StepItem 
          $active={mobileStep === 2} 
          $done={false}
          onClick={() => {
            if (mobileStep === 1) handleProceedToPayment();
          }}
        >
          <div className="step-num">2</div>
          <span className="step-label">2. Paiement & Total</span>
        </StepItem>
      </MobileStepper>

      {/* Grille Principale Tout-en-un */}
      <CheckoutGrid>
        {/* Colonne Formulaire (Gauche) */}
        <FormColumn>

          {/* ÉTAPE 1 : COORDONNÉES & ADRESSE DE LIVRAISON */}
          <Step1Wrapper $active={mobileStep === 1}>
            <Card>
              <CardHeader>
                <div className="left-head">
                  <div className="step-badge">1</div>
                  <h2>Coordonnées & Adresse de livraison</h2>
                </div>
              </CardHeader>

              {/* Prénom & Nom */}
              <FormGroup $cols="1fr 1fr" $mobileCols="1fr 1fr">
                <InputWrapper>
                  <label>Prénom <span className="req">*</span></label>
                  <StyledInput
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="Jean"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
                <InputWrapper>
                  <label>Nom <span className="req">*</span></label>
                  <StyledInput
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Dupont"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              {/* Email & Téléphone */}
              <FormGroup $cols="1.2fr 1fr" $mobileCols="1fr">
                <InputWrapper>
                  <label>Adresse email <span className="req">*</span></label>
                  <StyledInput
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="jean.dupont@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
                <InputWrapper>
                  <label>Téléphone <span className="req">*</span></label>
                  <StyledInput
                    type="tel"
                    name="phone"
                    autoComplete="tel"
                    placeholder="06 12 34 56 78"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              {/* Adresse */}
              <FormGroup $cols="1fr">
                <InputWrapper>
                  <label>Adresse de livraison complète <span className="req">*</span></label>
                  <StyledInput
                    type="text"
                    name="address"
                    autoComplete="street-address"
                    placeholder="Numéro et nom de rue"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
              </FormGroup>

              {/* Complément d'adresse */}
              <FormGroup $cols="1fr">
                <InputWrapper>
                  <label>Complément d'adresse <span className="opt">(Bâtiment, étage, etc.)</span></label>
                  <StyledInput
                    type="text"
                    name="address2"
                    placeholder="Appartement, lieu-dit, digicode..."
                    value={formData.address2}
                    onChange={handleChange}
                  />
                </InputWrapper>
              </FormGroup>

              {/* Code Postal, Ville & Pays */}
              <FormGroup $cols="1fr 1.5fr 1fr" $mobileCols="1fr 1fr">
                <InputWrapper>
                  <label>Code postal <span className="req">*</span></label>
                  <StyledInput
                    type="text"
                    name="postalCode"
                    autoComplete="postal-code"
                    placeholder="67000"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
                <InputWrapper>
                  <label>Ville <span className="req">*</span></label>
                  <StyledInput
                    type="text"
                    name="city"
                    autoComplete="address-level2"
                    placeholder="Strasbourg"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </InputWrapper>
                <InputWrapper style={{ gridColumn: 'span 1' }}>
                  <label>Pays <span className="req">*</span></label>
                  <StyledSelect
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="France">France</option>
                    <option value="Allemagne">Allemagne</option>
                    <option value="Belgique">Belgique</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Suisse">Suisse</option>
                  </StyledSelect>
                </InputWrapper>
              </FormGroup>

              {/* Accordéon instructions chauffeur (replié par défaut pour gagner de la place) */}
              <div style={{ marginTop: 8 }}>
                {!showNotes ? (
                  <button
                    type="button"
                    onClick={() => setShowNotes(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2c5530',
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: 'pointer',
                      padding: '4px 0',
                      textDecoration: 'underline'
                    }}
                  >
                    + Ajouter une instruction pour le chauffeur (optionnel)
                  </button>
                ) : (
                  <InputWrapper>
                    <label>Instructions spécifiques chauffeur <span className="opt">(accès, portail...)</span></label>
                    <StyledTextarea
                      name="notes"
                      placeholder="Ex : Accès facile sous abri, largeur portail 3m, déposer le long du garage..."
                      value={formData.notes}
                      onChange={handleChange}
                    />
                  </InputWrapper>
                )}
              </div>

              {/* Création de compte facultative pour invité */}
              {!user && (
                <div style={{ marginTop: 12, paddingTop: 10, borderTop: '1px solid #edf2ee' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#334d3a', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={createAccount}
                      onChange={(e) => setCreateAccount(e.target.checked)}
                      style={{ accentColor: '#2c5530', width: 16, height: 16 }}
                    />
                    <span>Créer un compte pour suivre mes commandes plus tard</span>
                  </label>

                  {createAccount && (
                    <div style={{ marginTop: 10, maxWidth: 320, animation: 'fadeIn 0.2s ease-in-out' }}>
                      <InputWrapper>
                        <label>Mot de passe souhaité <span className="req">*</span></label>
                        <div style={{ position: 'relative' }}>
                          <StyledInput
                            type={showPassword ? 'text' : 'password'}
                            placeholder="6 caractères minimum"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ paddingRight: 40 }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                              position: 'absolute',
                              right: 10,
                              top: '50%',
                              transform: 'translateY(-50%)',
                              background: 'none',
                              border: 'none',
                              color: '#667c6c',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                          </button>
                        </div>
                      </InputWrapper>
                    </div>
                  )}
                </div>
              )}

              {/* Bouton de passage à l'étape 2 (VISIBLE SUR MOBILE UNIQUEMENT) */}
              <NextStepButton type="button" onClick={handleProceedToPayment}>
                <span>Passer au paiement (Étape 2/2)</span>
                <FiArrowRight size={18} />
              </NextStepButton>
            </Card>
          </Step1Wrapper>

          {/* ÉTAPE 2 : PAIEMENT (SUR MOBILE S'AFFICHE QUAND mobileStep === 2, SUR DESKTOP TOUJOURS VISIBLE) */}
          <Step2Wrapper $active={mobileStep === 2}>
            {/* Sur mobile, rappel de l'adresse choisie avec bouton modifier */}
            <DeliveryRecapChip>
              <div className="info">
                <div>Livraison : <strong>{formData.firstName || 'Client'} {formData.lastName}</strong></div>
                <div style={{ color: '#55695a', fontSize: 12 }}>{formData.address || 'Adresse renseignée'}, {formData.postalCode} {formData.city}</div>
              </div>
              <button type="button" onClick={() => setMobileStep(1)}>
                <FiEdit2 size={13} />
                <span>Modifier</span>
              </button>
            </DeliveryRecapChip>

            <Card>
              <CardHeader>
                <div className="left-head">
                  <div className="step-badge">2</div>
                  <h2>Mode de paiement</h2>
                </div>
              </CardHeader>

              <PaymentBox>
                <PaymentBoxHeader>
                  <PaymentOptionTitle>
                    <span className="radio-check">
                      <FiCheck size={12} />
                    </span>
                    <span>Virement bancaire (SEPA)</span>
                  </PaymentOptionTitle>
                  <SecurityBadge>
                    <FiShield size={12} />
                    100% Sécurisé
                  </SecurityBadge>
                </PaymentBoxHeader>

                <PaymentDetails>
                  <p>
                    <strong>Simple et sans risque :</strong> Vous effectuerez le virement depuis votre application bancaire sans jamais transmettre vos identifiants bancaires sur Internet.
                  </p>
                  <p style={{ marginTop: 6 }}>
                    Nos coordonnées officielles (<strong>IBAN, BIC et Titulaire</strong>) ainsi que votre <strong>référence de virement</strong> s'afficheront sur la page suivante immédiatement après confirmation.
                  </p>
                  <p style={{ marginTop: 6, color: '#166534', fontWeight: 600 }}>
                    ✓ Vos produits sont réservés immédiatement et l'expédition s'enclenche dès validation bancaire.
                  </p>
                </PaymentDetails>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 12, color: '#4a6150', fontSize: 12, flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiLock size={13} color="#2c5530" /> Chiffrement SSL 256-bit
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <FiCheckCircle size={13} color="#27ae60" /> Aucun frais additionnel
                  </span>
                </div>
              </PaymentBox>
            </Card>

            {/* SUR MOBILE : le récapitulatif avec total et bouton de confirmation est directement dans l'étape 2 */}
            <MobileSummaryWrapper>
              {renderOrderSummaryContent()}
            </MobileSummaryWrapper>
          </Step2Wrapper>

        </FormColumn>

        {/* Colonne Récapitulatif Sticky (SUR DESKTOP UNIQUEMENT) */}
        <DesktopSummaryWrapper>
          {renderOrderSummaryContent()}
        </DesktopSummaryWrapper>
      </CheckoutGrid>
    </PageContainer>
  );
};

export default Checkout;
