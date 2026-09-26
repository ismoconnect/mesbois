import i18n from '../i18n';
import { useTranslation } from 'react-i18next';
import routeMapping from '../utils/routeMapping.json';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { getRIB } from '../firebase/rib';
import { getOrderById } from '../firebase/orders';
import { useAuth } from '../contexts/AuthContext';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import toast from 'react-hot-toast';
import { formatTransferRef } from '../utils/ref';
import { 
  FiCheckCircle, 
  FiCopy, 
  FiCheck, 
  FiTruck, 
  FiShield, 
  FiPhone, 
  FiMail,
  FiArrowRight, 
  FiUser, 
  FiPackage,
  FiClock,
  FiHome
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

// ========================================================
// STYLED COMPONENTS (RESPONSIVE & COMPACT MOBILE)
// ========================================================

const PageContainer = styled.div`
  width: 100%;
  max-width: 860px;
  margin: 0 auto;
  padding: 24px 16px 70px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #1f2937;
  box-sizing: border-box;
  overflow-x: hidden;

  @media (max-width: 640px) {
    padding: 10px 8px 48px;
    max-width: 100vw;
  }
`;

const HeaderCard = styled.div`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  padding: 18px 14px;
  text-align: center;
  margin-bottom: 10px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 640px) {
    border-radius: 10px;
    padding: 12px 8px;
    margin-bottom: 8px;
  }
`;

const IconBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #ecfdf5;
  color: #10b981;
  font-size: 22px;
  margin-bottom: 6px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.16);

  @media (max-width: 640px) {
    width: 32px;
    height: 32px;
    font-size: 16px;
    margin-bottom: 4px;
  }
`;

const MainTitle = styled.h1`
  color: #1b4332;
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 4px 0;
  letter-spacing: -0.3px;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    font-size: clamp(12.5px, 3.8vw, 14.5px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 0 2px 0;
  }
`;

const Subtitle = styled.p`
  color: #6b7280;
  font-size: 13px;
  margin: 0 0 8px 0;
  line-height: 1.4;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    font-size: 10.5px;
    margin: 0 0 6px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const OrderRefBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  white-space: nowrap;
  max-width: 100%;
  box-sizing: border-box;

  span.ref-code {
    color: #166534;
    font-family: monospace;
    font-size: 13px;
    font-weight: 800;
    letter-spacing: 0.5px;
  }

  button.copy-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    color: #6b7280;
    display: inline-flex;
    align-items: center;
    padding: 0;
    font-size: 12px;
    transition: color 0.15s;

    &:hover {
      color: #166534;
    }
  }

  @media (max-width: 640px) {
    padding: 2px 8px;
    font-size: 10.5px;
    gap: 4px;

    span.ref-code {
      font-size: 11.5px;
    }
  }
`;

const MainCard = styled.div`
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid ${props => props.isWhatsAppOnly ? '#86efac' : '#e2e8f0'};
  overflow: hidden;
  margin-bottom: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    border-radius: 10px;
    margin-bottom: 8px;
  }
`;

const CardHeader = styled.div`
  padding: 12px 16px;
  background: ${props => props.isWhatsAppOnly ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : '#f8fafc'};
  border-bottom: 1px solid ${props => props.isWhatsAppOnly ? '#bbf7d0' : '#e2e8f0'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 7px 8px;
    flex-wrap: nowrap;
    gap: 4px;
  }
`;

const HeaderStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;

  .header-icon {
    font-size: 17px;
    line-height: 1;
    flex-shrink: 0;
  }

  .header-text-col {
    min-width: 0;
    overflow: hidden;
  }

  h2 {
    margin: 0;
    font-size: 14.5px;
    font-weight: 800;
    color: #166534;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .header-sub {
    font-size: 11px;
    color: #15803d;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 640px) {
    gap: 5px;
    .header-icon {
      font-size: 14px;
    }
    h2 {
      font-size: clamp(10px, 2.9vw, 11.5px);
      letter-spacing: -0.2px;
    }
    .header-sub {
      font-size: 9px;
    }
  }
`;

const SecurityTag = styled.div`
  background: #166534;
  color: #ffffff;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 10.5px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;

  @media (max-width: 640px) {
    font-size: 8px;
    padding: 2px 5px;
  }
`;

const CardBody = styled.div`
  padding: 16px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 8px;
  }
`;

// WhatsApp Section
const WhatsAppBox = styled.div`
  background: #ffffff;
  border: 1.5px solid #25D366;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 10px;
  box-shadow: 0 3px 12px rgba(37, 211, 102, 0.08);
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 8px;
    margin-bottom: 8px;
    border-radius: 8px;
  }
`;

const ReassurancePill = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 7px;
  padding: 7px 10px;
  margin-bottom: 10px;
  font-size: 11.5px;
  color: #14532d;
  line-height: 1.4;
  width: 100%;
  box-sizing: border-box;

  .pill-icon {
    font-size: 15px;
    flex-shrink: 0;
    margin-top: 1px;
  }

  strong {
    color: #0f172a;
  }

  @media (max-width: 640px) {
    padding: 5px 6px;
    font-size: 9.5px;
    line-height: 1.3;
    margin-bottom: 7px;
    gap: 5px;
    .pill-icon {
      font-size: 12px;
    }
  }
`;

const WhatsAppButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: #25D366;
  color: #ffffff;
  text-decoration: none;
  font-weight: 800;
  font-size: 14px;
  padding: 12px 14px;
  border-radius: 8px;
  box-shadow: 0 3px 12px rgba(37, 211, 102, 0.32);
  transition: all 0.18s ease-in-out;
  cursor: pointer;
  text-align: center;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  white-space: nowrap;
  overflow: hidden;

  &:hover {
    background: #1ebd5a;
    color: #ffffff;
    box-shadow: 0 5px 16px rgba(37, 211, 102, 0.42);
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 640px) {
    font-size: clamp(9.5px, 2.75vw, 11px);
    padding: 9px 4px;
    border-radius: 7px;
    gap: 4px;

    svg {
      width: 15px;
      height: 15px;
      flex-shrink: 0;
    }
  }
`;

const SubActionRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 7px;
  flex-wrap: nowrap;
  gap: 4px;
  font-size: 11px;
  color: #4b5563;
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;

  .phone-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    strong {
      color: #111827;
    }
  }

  @media (max-width: 640px) {
    font-size: 9.5px;
    margin-top: 5px;
    gap: 3px;
  }
`;

const MiniCopyButton = styled.button`
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  color: #374151;
  padding: 3px 7px;
  border-radius: 5px;
  font-size: 10.5px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 3px;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: all 0.15s ease;

  &:hover {
    background: #e5e7eb;
  }

  @media (max-width: 640px) {
    font-size: 9px;
    padding: 2px 4px;
    gap: 2px;
  }
`;

// Stepper compact
const StepperSection = styled.div`
  margin: 14px 0 10px;

  .stepper-title {
    font-weight: 700;
    font-size: 13px;
    color: #374151;
    margin-bottom: 8px;
  }

  @media (max-width: 640px) {
    margin: 10px 0 8px;
    .stepper-title {
      font-size: 11.5px;
      margin-bottom: 6px;
    }
  }
`;

const StepperTrack = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 8px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    gap: 3px;
  }
`;

const StepperItem = styled.div`
  background: #f9fafb;
  border: 1px solid ${props => props.active ? '#86efac' : '#e5e7eb'};
  border-radius: 8px;
  padding: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;

  .step-num {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.active ? '#15803d' : '#e5e7eb'};
    color: ${props => props.active ? '#ffffff' : '#6b7280'};
    font-size: 11px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .step-name {
    font-size: 11.5px;
    font-weight: 700;
    color: #111827;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100%;
  }

  .step-sub {
    font-size: 10.5px;
    color: #6b7280;
    line-height: 1.3;
  }

  @media (max-width: 640px) {
    padding: 5px 1px;
    border-radius: 6px;
    gap: 2px;

    .step-num {
      width: 15px;
      height: 15px;
      font-size: 8.5px;
    }

    .step-name {
      font-size: 9px;
      line-height: 1.15;
    }

    .step-sub {
      display: none;
    }
  }
`;

// Fallback Email Strip
const EmailHelpStrip = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: nowrap;
  gap: 6px;
  font-size: 11.5px;
  color: #4b5563;
  margin-top: 10px;
  white-space: nowrap;
  width: 100%;
  box-sizing: border-box;

  .help-label {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: #4b5563;
    font-weight: 500;
  }

  .desktop-prefix {
    display: inline;
  }

  a {
    color: #2c5530;
    font-weight: 700;
    text-decoration: none;
    white-space: nowrap;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: color 0.15s;

    &:hover {
      color: #1e3a22;
      text-decoration: underline;
    }
  }

  @media (max-width: 640px) {
    padding: 5px 8px;
    font-size: 10px;
    margin-top: 6px;
    gap: 4px;

    .desktop-prefix {
      display: none;
    }

    a {
      font-size: 10px;
      gap: 3px;
    }
  }
`;

// RIB Fields for Cas 1
const RIBGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 12px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const RIBBox = styled.div`
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  .label-val {
    overflow: hidden;
    strong {
      color: #2c5530;
      display: block;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 2px;
    }
    div.val {
      font-size: 14px;
      font-weight: 700;
      color: #0f172a;
      word-break: break-all;
    }
  }

  @media (max-width: 640px) {
    padding: 8px 10px;
    .label-val div.val {
      font-size: 13px;
    }
  }
`;

// Order Recap Box
const OrderRecapCard = styled.div`
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  margin-top: 12px;
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;

  @media (max-width: 640px) {
    padding: 8px;
    margin-top: 8px;
    border-radius: 10px;
  }
`;

const RecapHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 8px;
  font-weight: 800;
  font-size: 14px;
  color: #111827;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    font-size: 11.5px;
    padding-bottom: 5px;
    margin-bottom: 5px;
  }
`;

const ItemRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 0;
  font-size: 13px;
  color: #374151;
  width: 100%;
  box-sizing: border-box;
  gap: 4px;

  .item-title {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .item-qty {
    font-weight: 800;
    color: #166534;
    background: #ecfdf5;
    padding: 1px 5px;
    border-radius: 4px;
    font-size: 11px;
    flex-shrink: 0;
  }
  .item-price {
    font-weight: 700;
    color: #111827;
    flex-shrink: 0;
  }

  @media (max-width: 640px) {
    font-size: 10.5px;
    padding: 2.5px 0;
    .item-qty {
      padding: 1px 3px;
      font-size: 10px;
    }
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 5px 0;
  border-top: 1px solid #f9fafb;
  font-size: 12.5px;
  color: #4b5563;
  width: 100%;
  box-sizing: border-box;
  gap: 4px;

  .label {
    color: #6b7280;
    flex-shrink: 0;
  }
  .val {
    text-align: right;
    font-weight: 600;
    color: #1f2937;
    min-width: 0;
    word-break: break-word;
    overflow-wrap: anywhere;
    max-width: 62%;
  }

  @media (max-width: 640px) {
    font-size: 10px;
    padding: 2.5px 0;
    .val {
      max-width: 58%;
    }
  }
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 8px;
  margin-top: 4px;
  border-top: 2px solid #e5e7eb;
  font-weight: 800;
  font-size: 14.5px;
  color: #111827;
  width: 100%;
  box-sizing: border-box;

  .total-price {
    font-size: 18px;
    font-weight: 800;
    color: #166534;
  }

  @media (max-width: 640px) {
    font-size: 11.5px;
    padding-top: 5px;
    margin-top: 3px;
    .total-price {
      font-size: 14.5px;
    }
  }
`;

// Trust Bar compact
const TrustBar = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin-top: 12px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    gap: 4px;
    margin-top: 8px;
    margin-bottom: 10px;
  }
`;

const TrustItem = styled.div`
  background: #f9fafb;
  border: 1px solid #f3f4f6;
  border-radius: 8px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #374151;
  font-weight: 600;
  min-width: 0;
  box-sizing: border-box;
  overflow: hidden;

  svg {
    color: #2c5530;
    font-size: 15px;
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 640px) {
    padding: 5px 2px;
    border-radius: 6px;
    flex-direction: column;
    text-align: center;
    gap: 2px;
    font-size: 9px;
    line-height: 1.15;

    svg {
      font-size: 12px;
    }
  }
`;

// Bottom Action Bar (TOTALEMENT EN BAS)
const BottomActionContainer = styled.div`
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;

  @media (max-width: 640px) {
    margin-top: 12px;
    gap: 6px;
  }
`;

const BottomPrimaryButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #2c5530;
  color: #ffffff;
  padding: 13px 28px;
  border-radius: 10px;
  font-weight: 700;
  font-size: 14.5px;
  text-decoration: none;
  width: 100%;
  max-width: 440px;
  box-sizing: border-box;
  box-shadow: 0 2px 8px rgba(44, 85, 48, 0.2);
  transition: all 0.15s ease;
  white-space: nowrap;

  &:hover {
    background: #1e3a22;
    color: #ffffff;
    box-shadow: 0 4px 12px rgba(44, 85, 48, 0.3);
  }

  svg {
    flex-shrink: 0;
  }

  span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @media (max-width: 640px) {
    font-size: clamp(10px, 2.85vw, 12px);
    padding: 10px 8px;
    max-width: 100%;
    border-radius: 8px;
    gap: 5px;
  }
`;

const BottomSecondaryLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #4b5563;
  font-size: 12.5px;
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: #111827;
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    font-size: 10.5px;
  }
`;

// ========================================================
// MAIN COMPONENT
// ========================================================

export default function BankTransfer() {
  const { t, i18n } = useTranslation();
  const [params] = useSearchParams();
  const location = useLocation();
  const { user } = useAuth();
  const { settings, loaded: settingsLoaded } = useSiteSettings();
  const supportEmail = (settingsLoaded && settings?.supportEmail) ? settings.supportEmail : 'kontakt@brennholzkaufen.online';

  const queryOrderId = params.get('orderId');
  const stateOrderId = location.state?.orderId;
  const orderId = stateOrderId || queryOrderId || '';

  const [order, setOrder] = useState(location.state?.orderData || null);
  const [rib, setRib] = useState({
    holder: '',
    iban: '',
    bic: '',
    bank: '',
    enabled: false,
    whatsappNumber: '+49 1633637236'
  });
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);

  // Synchronisation des données (RIB et commande)
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [ribRes, orderRes] = await Promise.all([
          getRIB(),
          (!order && orderId) ? getOrderById(orderId) : Promise.resolve(null)
        ]);

        if (isMounted) {
          if (ribRes && ribRes.success && ribRes.data) {
            setRib(ribRes.data);
          }
          if (orderRes && orderRes.success && orderRes.data) {
            setOrder(orderRes.data);
          }
        }
      } catch (err) {
        console.error('Erreur chargement BankTransfer:', err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();
    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  // Déterminer si le RIB est disponible publiquement (Cas 1) ou masqué (Cas 2 WhatsApp Pro)
  const isRibPublic = Boolean(
    (rib.enabled === true || rib.enabled === 'true') && 
    rib.iban && 
    rib.iban.trim().length > 5
  );

  // Extraire les infos de la commande
  const orderRef = formatTransferRef(orderId);
  const customer = order?.customerInfo || {};
  const customerName = [customer.firstName, customer.lastName].filter(Boolean).join(' ') || (user?.displayName || 'Client');
  const customerPhone = customer.phone || '';
  const customerEmail = customer.email || (user?.email || '');
  const deliveryAddress = [customer.address, customer.postalCode, customer.city, customer.country].filter(Boolean).join(', ');
  const items = Array.isArray(order?.items) ? order.items : [];
  const total = typeof order?.total === 'number' ? order.total : (order?.total || 0);
  const totalFormatted = Number(total).toFixed(2);
  const isGuest = location.state?.wasGuest ?? (!user);

  // Numéro WhatsApp Pro
  const rawWhatsApp = rib.whatsappNumber || '+49 1633637236';
  const cleanPhone = rawWhatsApp.replace(/[^0-9]/g, '');

  // Formatage des articles pour le message WhatsApp
  const itemsSummary = items.length > 0
    ? items.map(item => `  • ${item.quantity}x ${item.name || item.title || 'Bois de chauffage'}`).join('\n')
    : '  • Commande de bois de chauffage';

  // Message Cas 2 (demande de RIB personnalisé)
  const whatsappMessageCas2 = 
`Bonjour Brennholzkaufen,

Je viens de finaliser ma commande sur votre site internet et je souhaite obtenir votre RIB / IBAN officiel pour effectuer mon virement bancaire.

📋 *RÉCAPITULATIF DE MA COMMANDE :*
- *Réf. Commande :* #${orderRef}
- *Client :* ${customerName}
- *Téléphone :* ${customerPhone}
- *Adresse de livraison :* ${deliveryAddress || 'Adresse enregistrée'}
- *Montant total TTC :* ${totalFormatted} €

📦 *Articles commandés :*
${itemsSummary}

Pouvez-vous me transmettre vos coordonnées bancaires afin que j'effectue le virement pour enclencher la préparation et valider le créneau de livraison avec chariot tout-terrain ?

Merci beaucoup !`;

  // Message Cas 1 (envoi de justificatif)
  const whatsappMessageCas1 = 
`Bonjour Brennholzkaufen,

Je viens d'effectuer le virement bancaire pour ma commande #${orderRef} d'un montant de ${totalFormatted} € (${customerName} - ${customerPhone}).

Je vous contacte pour vous transmettre le justificatif de paiement et confirmer ma disponibilité pour la livraison avec chariot tout-terrain.

Merci !`;

  const targetWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(!isRibPublic ? whatsappMessageCas2 : whatsappMessageCas1)}`;

  const handleCopy = (text, keyName) => {
    if (!text) return;
    try {
      navigator.clipboard.writeText(text);
      setCopiedKey(keyName);
      toast.success(`${keyName} copié !`);
      setTimeout(() => setCopiedKey(null), 2500);
    } catch {
      toast.error('Erreur lors de la copie');
    }
  };

  // Écran de chargement synchronisé (aucun flash)
  if (loading) {
    return (
      <PageContainer>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '360px',
          padding: '40px 20px',
          textAlign: 'center'
        }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3.5px solid #e2e8f0',
            borderTopColor: '#2c5530',
            borderRadius: '50%',
            animation: 'bt-spin 0.8s linear infinite',
            marginBottom: 14
          }} />
          <style>{`@keyframes bt-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
          <div style={{ color: '#2c5530', fontWeight: 800, fontSize: 16 }}>
            {t('bank_transfer.validating_order', 'Validation de votre commande…')}
          </div>
          <div style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>
            {t('bank_transfer.securing_details', 'Sécurisation des coordonnées et synchronisation logistique')}
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      {/* En-tête de validation compact sur carte blanche */}
      <HeaderCard>
        <IconBadge>
          <FiCheckCircle />
        </IconBadge>
        <MainTitle>
          {isRibPublic ? t('bank_transfer.success_public', 'Commande enregistrée avec succès') : t('bank_transfer.success_private', 'Votre commande a bien été enregistrée !')}
        </MainTitle>
        <Subtitle>
          {t('bank_transfer.success_desc', 'Votre réservation de bois de chauffage a été validée dans notre système.')}
        </Subtitle>
        <OrderRefBadge>
          <span>Réf. commande :</span>
          <span className="ref-code">#{orderRef}</span>
          <button
            type="button"
            className="copy-btn"
            onClick={() => handleCopy(orderRef, 'Réf. commande')}
            title="Copier la référence"
          >
            {copiedKey === 'Réf. commande' ? <FiCheck style={{ color: '#10b981' }} /> : <FiCopy />}
          </button>
        </OrderRefBadge>
      </HeaderCard>

      {/* ========================================================
          CAS 2 : RIB MASQUÉ -> FLOW DIRECT WHATSAPP PRO
          ======================================================== */}
      {!isRibPublic && (
        <MainCard isWhatsAppOnly>
          <CardHeader isWhatsAppOnly>
            <HeaderStatus>
              <span className="header-icon">💬</span>
              <div className="header-text-col">
                <h2>Transmission du RIB sur WhatsApp Pro</h2>
                <div className="header-sub">Service client officiel • Réponse rapide 7j/7</div>
              </div>
            </HeaderStatus>
            <SecurityTag>Anti-Fraude</SecurityTag>
          </CardHeader>

          <CardBody>
            {/* Boîte d'action principale WhatsApp compacte */}
            <WhatsAppBox>
              <ReassurancePill>
                <span className="pill-icon">🛡️</span>
                <div>
                  <strong>{t('bank_transfer.security_title', 'Sécurité bancaire & accès chariot tout-terrain :')}</strong> {t('bank_transfer.security_text', 'nos coordonnées bancaires vous sont transmises directement sur WhatsApp par notre conseiller.')}
                </div>
              </ReassurancePill>

              {/* Bouton WhatsApp Pro Pré-rempli */}
              <WhatsAppButton 
                href={targetWhatsAppUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <FaWhatsapp size={19} />
                <span>Finaliser sur WhatsApp &amp; recevoir le RIB →</span>
              </WhatsAppButton>

              <SubActionRow>
                <div className="phone-text">
                  📱 Pro : <strong>{rawWhatsApp}</strong>
                </div>
                <MiniCopyButton
                  type="button"
                  onClick={() => handleCopy(whatsappMessageCas2, 'Message commande')}
                >
                  {copiedKey === 'Message commande' ? <FiCheck style={{ color: '#10b981' }} /> : <FiCopy />}
                  <span>{t('bank_transfer.copy', t('bank_transfer.copy', 'Copier'))}</span>
                </MiniCopyButton>
              </SubActionRow>
            </WhatsAppBox>

            {/* Stepper compact (sur mobile : 1 ligne épurée) */}
            <StepperSection>
              <div className="stepper-title">Étapes de finalisation :</div>
              <StepperTrack>
                <StepperItem active>
                  <span className="step-num">1</span>
                  <div className="step-name">Validée</div>
                  <div className="step-sub">Stock réservé</div>
                </StepperItem>

                <StepperItem active>
                  <span className="step-num">2</span>
                  <div className="step-name">WhatsApp</div>
                  <div className="step-sub">{t('bank_transfer.step_click', '1 clic conseiller')}</div>
                </StepperItem>

                <StepperItem>
                  <span className="step-num">3</span>
                  <div className="step-name">RIB reçu</div>
                  <div className="step-sub">Virement direct</div>
                </StepperItem>

                <StepperItem>
                  <span className="step-num">4</span>
                  <div className="step-name">Livraison</div>
                  <div className="step-sub">Chariot tout-terrain</div>
                </StepperItem>
              </StepperTrack>
            </StepperSection>

            {/* Support Email alternatif */}
            <EmailHelpStrip>
              <div className="help-label">
                <span className="desktop-prefix">Pas de WhatsApp ? </span>
                <span>Support e-mail :</span>
              </div>
              <a href={`mailto:${supportEmail}`}>
                <FiMail style={{ verticalAlign: 'middle', marginRight: 3 }} />
                <span>{supportEmail}</span>
              </a>
            </EmailHelpStrip>
          </CardBody>
        </MainCard>
      )}

      {/* ========================================================
          CAS 1 : RIB PUBLIC ACTIVÉ DANS L'ADMIN
          ======================================================== */}
      {isRibPublic && (
        <MainCard>
          <CardHeader>
            <HeaderStatus>
              <span className="header-icon">🏦</span>
              <div className="header-text-col">
                <h2>{t('bank_transfer.bank_details', 'Coordonnées bancaires pour votre virement')}</h2>
                <div className="header-sub">{t('bank_transfer.order_transfer', 'Veuillez ordonner votre virement pour expédition')}</div>
              </div>
            </HeaderStatus>
            <SecurityTag style={{ background: '#047857' }}>{t('bank_transfer.pro_account', 'Compte Professionnel Validé')}</SecurityTag>
          </CardHeader>

          <CardBody>
            <div style={{
              background: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: 8,
              padding: '10px 12px',
              color: '#92400e',
              fontSize: 12.5,
              lineHeight: 1.4,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginBottom: 12
            }}>
              <FiClock style={{ fontSize: 16, flexShrink: 0 }} />
              <div>
                <strong>{t('bank_transfer.quick_tip', 'Conseil rapide :')}</strong> {t('bank_transfer.tip_prefix', 'Privilégiez un ')}<strong>{t('bank_transfer.tip_bold', 'virement instantané')}</strong>{t('bank_transfer.tip2', ' pour une préparation immédiate en entrepôt.')}
              </div>
            </div>

            {/* Grille du RIB */}
            <RIBGrid>
              <RIBBox>
                <div className="label-val">
                  <strong>{t("bank_transfer.account_holder", "Titulaire")}</strong>
                  <div className="val">{rib.holder || 'Brennholzkaufen'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(rib.holder, 'Titulaire')}
                  style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                >
                  {copiedKey === 'Titulaire' ? <FiCheck style={{ color: '#10b981' }} /> : <FiCopy />}
                  <span>{copiedKey === 'Titulaire' ? t('bank_transfer.copied', 'Copié') : t('bank_transfer.copy', 'Copier')}</span>
                </button>
              </RIBBox>

              <RIBBox>
                <div className="label-val">
                  <strong>{t("bank_transfer.bank", "Banque")}</strong>
                  <div className="val">{rib.bank || 'Banque Européenne'}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(rib.bank, 'Banque')}
                  style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                >
                  {copiedKey === 'Banque' ? <FiCheck style={{ color: '#10b981' }} /> : <FiCopy />}
                  <span>{copiedKey === 'Banque' ? t('bank_transfer.copied', 'Copié') : t('bank_transfer.copy', 'Copier')}</span>
                </button>
              </RIBBox>

              <RIBBox style={{ gridColumn: '1 / -1' }}>
                <div className="label-val">
                  <strong>{t("bank_transfer.iban", "IBAN (Compte de paiement)")}</strong>
                  <div className="val" style={{ fontFamily: 'monospace', letterSpacing: '0.8px', fontSize: 15 }}>
                    {rib.iban}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(rib.iban.replace(/\s+/g, ''), 'IBAN')}
                  style={{ background: '#2c5530', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700 }}
                >
                  {copiedKey === 'IBAN' ? <FiCheck /> : <FiCopy />}
                  <span>{copiedKey === 'IBAN' ? t('bank_transfer.copied_exclam', 'Copié !') : t('bank_transfer.copy_iban', "Copier l'IBAN")}</span>
                </button>
              </RIBBox>

              <RIBBox>
                <div className="label-val">
                  <strong>{t('bank_transfer.bic', 'BIC / SWIFT')}</strong>
                  <div className="val" style={{ fontFamily: 'monospace' }}>{rib.bic}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(rib.bic, 'BIC')}
                  style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                >
                  {copiedKey === 'BIC' ? <FiCheck style={{ color: '#10b981' }} /> : <FiCopy />}
                  <span>{copiedKey === 'BIC' ? t('bank_transfer.copied', 'Copié') : t('bank_transfer.copy', 'Copier')}</span>
                </button>
              </RIBBox>

              <RIBBox>
                <div className="label-val">
                  <strong>{t("bank_transfer.reference", "Référence (Obligatoire)")}</strong>
                  <div className="val" style={{ color: '#b91c1c', fontFamily: 'monospace' }}>#{orderRef}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(orderRef, 'Référence')}
                  style={{ background: '#fff', border: '1px solid #d1d5db', borderRadius: 6, padding: '5px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11 }}
                >
                  {copiedKey === 'Référence' ? <FiCheck style={{ color: '#10b981' }} /> : <FiCopy />}
                  <span>{copiedKey === 'Référence' ? t('bank_transfer.copied', 'Copié') : t('bank_transfer.copy', 'Copier')}</span>
                </button>
              </RIBBox>
            </RIBGrid>

            {/* Bouton WhatsApp Pro secondaire en Cas 1 */}
            <div style={{ marginTop: 14, padding: '12px', background: '#f0fdf4', borderRadius: 8, border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 12.5, color: '#14532d' }}>
                <strong>{t('bank_transfer.transfer_done', 'Virement effectué ?')}</strong> {t('bank_transfer.whatsapp_desc', 'Transmettez votre justificatif sur WhatsApp Pro pour enclencher la préparation prioritaire.')}
              </div>
              <a
                href={targetWhatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: '#25D366',
                  color: '#fff',
                  padding: '8px 14px',
                  borderRadius: 6,
                  fontWeight: 700,
                  fontSize: 12.5,
                  textDecoration: 'none'
                }}
              >
                <FaWhatsapp size={16} />
                <span>{t('bank_transfer.send_whatsapp', 'Envoyer sur WhatsApp')}</span>
              </a>
            </div>
          </CardBody>
        </MainCard>
      )}

      {/* ========================================================
          RÉCAPITULATIF DE COMMANDE COMPACT
          ======================================================== */}
      <OrderRecapCard>
        <RecapHeader>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <FiPackage style={{ color: '#2c5530' }} />
            <span>{t('bank_transfer.order_summary', 'Récapitulatif de votre commande')}</span>
          </div>
          <span style={{ fontSize: 12, color: '#6b7280', fontWeight: 600 }}>
            {items.length} {items.length > 1 ? 'articles' : 'article'}
          </span>
        </RecapHeader>

        {items.length > 0 && (
          <div style={{ marginBottom: 6 }}>
            {items.map((it, idx) => (
              <ItemRow key={idx}>
                <div className="item-title">
                  <span className="item-qty">{it.quantity}x</span>
                  <span>{it.name || it.title || 'Palette de bois'}</span>
                </div>
                <div className="item-price">
                  {typeof it.price === 'number' ? (it.price * (it.quantity || 1)).toFixed(2) : it.price} €
                </div>
              </ItemRow>
            ))}
          </div>
        )}

        <DetailRow>
          <span className="label">{t("bank_transfer.delivery_address", "Adresse de livraison :")}</span>
          <span className="val">{deliveryAddress || 'Adresse enregistrée'}</span>
        </DetailRow>

        <DetailRow>
          <span className="label">{t("bank_transfer.delivery_mode", "Mode de livraison :")}</span>
          <span className="val" style={{ color: '#166534', fontWeight: 700 }}>
            <FiTruck style={{ verticalAlign: 'middle', marginRight: 4 }} />{t("bank_transfer.forklift_included", "Chariot tout-terrain inclus")}</span>
        </DetailRow>

        <DetailRow>
          <span className="label">{t("bank_transfer.recipient", "Destinataire :")}</span>
          <span className="val">
            {customerName} {customerPhone ? `(${customerPhone})` : ''}
          </span>
        </DetailRow>

        {customerEmail && (
          <DetailRow>
            <span className="label">{t("bank_transfer.email_conf", "Email de confirmation :")}</span>
            <span className="val">{customerEmail}</span>
          </DetailRow>
        )}

        <TotalRow>
          <span>{t("bank_transfer.total_to_pay", "Total TTC à régler :")}</span>
          <span className="total-price">{totalFormatted} €</span>
        </TotalRow>
      </OrderRecapCard>

      {/* Engagements confiance en bande compacte */}
      <TrustBar>
        <TrustItem>
          <FiTruck />
          <span>{t("bank_transfer.forklift_to_shelter", "Chariot tout-terrain jusqu'à l'abri")}</span>
        </TrustItem>
        <TrustItem>
          <FiShield />
          <span>{t("bank_transfer.wood_certified", "Bois 100% sec certifié (< 20%)")}</span>
        </TrustItem>
        <TrustItem>
          <FiClock />
          <span>{t("bank_transfer.support_whatsapp", "Support & WhatsApp 7j/7")}</span>
        </TrustItem>
      </TrustBar>

      {/* ========================================================
          ACTIONS EN BAS DE PAGE (PROPRES & ANCRÉES EN BAS)
          ======================================================== */}
      <BottomActionContainer>
        {user ? (
          <BottomPrimaryButton to="/dashboard/orders">
            <FiUser />
            <span>{t('bank_transfer.view_in_client_area', 'Consulter ma commande dans mon espace client')}</span>
          </BottomPrimaryButton>
        ) : (
          <BottomPrimaryButton to={`/${i18n.language || 'fr'}/${routeMapping.products[i18n.language || 'fr']}`}>
            <FiArrowRight />
            <span>{t("bank_transfer.continue_shopping", "Continuer mes achats sur la boutique")}</span>
          </BottomPrimaryButton>
        )}

        <BottomSecondaryLink to="/">
          <FiHome size={14} />
          <span>{t("bank_transfer.back_home", "Retour à l'accueil")}</span>
        </BottomSecondaryLink>

        {/* Note e-mail pour invités */}
        {isGuest && (
          <div style={{ textAlign: 'center', fontSize: 11.5, color: '#6b7280', maxWidth: 440, marginTop: 4 }}>
            📧 {t("bank_transfer.email_sent", "Un e-mail de confirmation reprenant ces informations vous a également été envoyé.")}
          </div>
        )}
      </BottomActionContainer>
    </PageContainer>
  );
}


