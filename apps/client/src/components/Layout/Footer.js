import React from 'react';
import styled from 'styled-components';
import { 
  FiMapPin, 
  FiPhone, 
  FiMail, 
  FiClock, 
  FiShield, 
  FiCheckCircle, 
  FiLock 
} from 'react-icons/fi';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import LocalizedLink from '../LocalizedLink/LocalizedLink';
import LanguageSwitcher from '../LanguageSwitcher';

const FooterContainer = styled.footer`
  background: #142618;
  color: #f1f5f2;
  padding: 56px 0 24px;
  margin-top: 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 768px) {
    padding: 24px 0 16px;
    margin-top: 24px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr 1.6fr;
  gap: 40px;

  @media (max-width: 992px) {
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr;
    gap: 16px 14px;
    padding: 0 16px;
  }
`;

const FooterCol = styled.div`
  display: flex;
  flex-direction: column;

  &:first-child {
    @media (max-width: 768px) {
      grid-column: 1 / -1;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 12px;
      margin-bottom: 2px;
    }
  }

  &:nth-child(4) {
    @media (max-width: 768px) {
      grid-column: 1 / -1;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 10px;
      padding: 12px 14px;
      margin-top: 2px;
    }
  }
`;

const BrandHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 6px;
  }
`;

const BrandLogoImg = styled.img`
  height: 38px;
  width: auto;
  max-width: 250px;
  object-fit: contain;
  display: block;

  @media (max-width: 768px) {
    height: 32px;
    max-width: 210px;
  }
`;

const BrandLogo = styled.span`
  font-size: 24px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const BrandTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.3px;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const BrandDesc = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #a3b8a8;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 12px;
    line-height: 1.45;
    margin-bottom: 10px;
    max-width: 600px;
  }
`;

const TrustBadgesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;

  @media (max-width: 768px) {
    gap: 5px;
    margin-top: 0;
  }
`;

const TrustBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #d1fae5;
  padding: 5px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;

  @media (max-width: 768px) {
    padding: 3px 7px;
    font-size: 10px;
    border-radius: 4px;
    gap: 3px;

    svg {
      width: 11px;
      height: 11px;
    }
  }
`;

const ColTitle = styled.h4`
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 18px;
  position: relative;
  padding-bottom: 8px;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 28px;
    height: 2px;
    background: #d97706;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 13.5px;
    margin-bottom: 10px;
    padding-bottom: 4px;

    &::after {
      width: 20px;
      height: 2px;
    }
  }
`;

const FooterLink = styled(LocalizedLink)`
  color: #b5c9ba;
  text-decoration: none;
  font-size: 14px;
  margin-bottom: 12px;
  transition: all 0.2s ease;
  display: inline-block;

  &:hover {
    color: #ffffff;
    transform: translateX(3px);
  }

  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 6px;
    line-height: 1.35;

    &:hover {
      transform: none;
    }
  }
`;

const ContactList = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px 12px;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 6px;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #b5c9ba;
  margin-bottom: 14px;

  svg {
    color: #d97706;
    flex-shrink: 0;
  }

  a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
    &:hover {
      color: #ffffff;
      text-decoration: underline;
    }
  }

  span {
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    margin-bottom: 0;
    font-size: 12px;
    gap: 8px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const PaymentSection = styled.div`
  max-width: 1200px;
  margin: 36px auto 0;
  padding: 24px 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 16px;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    margin-top: 18px;
    padding: 14px 16px 0;
    gap: 10px;
  }
`;

const PaymentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: #a3b8a8;
  font-weight: 600;

  @media (max-width: 768px) {
    font-size: 12px;
    gap: 6px;
    justify-content: center;
  }
`;

const PaymentMethods = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    justify-content: center;
    gap: 6px;
  }
`;

const PaymentCard = styled.div`
  background: #ffffff;
  height: 32px;
  padding: 0 10px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  user-select: none;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.18);
  }

  @media (max-width: 768px) {
    height: 28px;
    padding: 0 7px;
    border-radius: 5px;
  }
`;

const PaymentPill = styled.div`
  background: #ffffff;
  color: #1e293b;
  font-size: 12px;
  font-weight: 700;
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.12);
  border: 1px solid #e2e8f0;
  user-select: none;
  white-space: nowrap;

  @media (max-width: 768px) {
    height: 28px;
    font-size: 10.5px;
    padding: 0 8px;
    gap: 5px;
    border-radius: 5px;
  }
`;

/* Logos Vectoriels Officiels Haute Définition */
const CbLogo = () => (
  <svg width="34" height="20" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="CB">
    <rect width="32" height="22" rx="4" fill="#007A5E"/>
    <path d="M0 4C0 1.79 1.79 0 4 0H16V22H4C1.79 22 0 20.21 0 18V4Z" fill="#005B94"/>
    <text x="16" y="15.5" fill="#ffffff" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" fontWeight="900" fontSize="12" textAnchor="middle" fontStyle="italic" letterSpacing="-0.5">cb</text>
  </svg>
);

const VisaLogo = () => (
  <svg width="42" height="18" viewBox="0 0 50 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
    <path d="M19.64 15.22H16.48L18.46 3.02H21.62L19.64 15.22ZM14.04 3.02L11.02 11.36L10.66 9.65C10.05 7.55 8.23 5.25 6.08 4.12L8.91 15.21H12.22L17.15 3.02H14.04ZM33.15 11.23C33.16 8.08 28.77 7.88 28.81 6.25C28.82 5.69 29.36 5.08 30.55 4.92C31.14 4.85 32.78 4.77 34.62 5.62L35.34 2.68C34.35 2.31 33.08 2 31.47 2C27.85 2 25.31 3.92 25.29 6.69C25.26 8.73 27.08 9.87 28.48 10.55C29.91 11.26 30.39 11.7 30.38 12.34C30.37 13.3 29.22 13.73 28.16 13.74C26.24 13.77 25.11 13.22 24.22 12.8L23.47 15.83C24.46 16.28 26.3 16.67 28.2 16.7C32.01 16.7 34.5 14.81 34.51 11.91M44.42 15.22H47.3L45.45 3.02H42.85C42.2 3.02 41.66 3.4 41.41 3.99L34.76 15.22H38.12L38.79 13.38H42.89L43.28 15.22H44.42ZM39.73 10.82L41.42 6.23C41.42 6.23 41.89 4.93 42.12 4.24L42.51 10.82H39.73Z" fill="#1434CB"/>
    <path d="M5.64 3.02H0.62L0.57 3.3C4.41 4.28 7.6 6.65 8.64 9.68L7.57 4.25C7.39 3.42 6.8 3.06 6.07 3.02H5.64Z" fill="#F7B600"/>
  </svg>
);

const MastercardLogo = () => (
  <svg width="34" height="20" viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
    <circle cx="11" cy="11" r="9" fill="#EB001B"/>
    <circle cx="25" cy="11" r="9" fill="#F79E1B"/>
    <path d="M18 5.34 A9 9 0 0 1 21.6 11 A9 9 0 0 1 18 16.66 A9 9 0 0 1 14.4 11 A9 9 0 0 1 18 5.34 z" fill="#FF5F00"/>
  </svg>
);

const SepaLogo = () => (
  <svg width="28" height="18" viewBox="0 0 36 22" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="SEPA">
    <rect width="36" height="22" rx="3.5" fill="#003399"/>
    <path d="M5 18c6-1.5 11-6.5 13-13 3 5 8 9 14 11-7-1-11-4-14-8-2 4-6 8-13 10z" fill="#00B0FF" opacity="0.85"/>
    <text x="18" y="15" fill="#ffffff" fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif" fontWeight="800" fontSize="9" textAnchor="middle" letterSpacing="0.8">SEPA</text>
  </svg>
);

const FooterBottom = styled.div`
  max-width: 1200px;
  margin: 24px auto 0;
  padding: 16px 20px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 13px;
  color: #7b9682;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    margin-top: 14px;
    padding: 12px 16px 0;
    font-size: 11px;
    gap: 4px;
  }
`;

const Footer = () => {
  const { t } = useTranslation();
  const { settings, loaded } = useSiteSettings();
  const siteName = loaded ? (settings.siteName || 'brennholzkaufen') : 'brennholzkaufen';
  const footerAddress = loaded ? (settings.legalAddress || '3 Rue des Anges, 67000 Strasbourg') : '3 Rue des Anges, 67000 Strasbourg';
  const footerPhone = loaded ? (settings.supportPhone || '+49 1633637236') : '+49 1633637236';
  const footerEmail = loaded ? (settings.supportEmail || 'kontakt@brennholzkaufen.online') : 'kontakt@brennholzkaufen.online';

  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        {/* Colonne 1: Présentation & Certifications */}
        <FooterCol>
          <BrandHeader>
            <BrandLogoImg 
              src="/images/brennholzkaufen_logo_white.png" 
              alt="brennholzkaufen by Pusch Heinz Kamin- u. Brennholz" 
            />
          </BrandHeader>
          <BrandDesc>
            {t('footer.about_text', "Votre spécialiste européen en bois de chauffage dur (Chêne, Hêtre, Charme) et pellets de haute performance. Livraison soignée directement sous votre abri par camion avec chariot tout-terrain.")}
          </BrandDesc>
          <TrustBadgesRow>
            <TrustBadge><FiCheckCircle size={13} /> PEFC / FSC</TrustBadge>
            <TrustBadge><FiCheckCircle size={13} /> DINplus / ENplus</TrustBadge>
            <TrustBadge><FiCheckCircle size={13} /> {t('footer.humidity', 'Humidité < 20%')}</TrustBadge>
          </TrustBadgesRow>
        </FooterCol>

        {/* Colonne 2: Produits */}
        <FooterCol>
          <ColTitle>{t('footer.categories_title', 'Nos Combustibles')}</ColTitle>
          <FooterLink routeKey="products" search="?main=bois">
            {t('home.cat_wood', 'Bois de chauffage')}
          </FooterLink>
          <FooterLink routeKey="products" search="?main=pellets">
            {t('home.cat_pellets', 'Pellets & Granulés')}
          </FooterLink>
          <FooterLink routeKey="products" search="?main=buches-densifiees">
            {t('home.cat_briquettes', 'Bûches densifiées')}
          </FooterLink>
          <FooterLink routeKey="products" search="?main=accessoires">
            {t('home.cat_accessories', 'Accessoires & Allumage')}
          </FooterLink>
          <FooterLink routeKey="products" search="?main=poeles">
            {t('home.cat_stoves', 'Poêles & Foyers')}
          </FooterLink>
        </FooterCol>

        {/* Colonne 3: Informations Légales */}
        <FooterCol>
          <ColTitle>{t('footer.info_title', 'Informations')}</ColTitle>
          <FooterLink routeKey="legal">{t('legal.title', 'Mentions légales')}</FooterLink>
          <FooterLink routeKey="delivery">{t('delivery.title', 'Politique de livraison')}</FooterLink>
          <FooterLink routeKey="terms">{t('terms.title', 'Conditions générales (CGV)')}</FooterLink>
          <FooterLink routeKey="privacy">{t('privacy.title', 'Confidentialité (RGPD)')}</FooterLink>
          <FooterLink routeKey="returns">{t('returns.title', 'Retours & Rétractation')}</FooterLink>
        </FooterCol>

        {/* Colonne 4: Contact & Service Client */}
        <FooterCol>
          <ColTitle>{t('footer.contact_title', 'Service Client')}</ColTitle>
          <ContactList>
            <ContactItem>
              <FiClock size={16} />
              <span>{t('footer.customer_service', 'Lun–Sam : 9h00–18h00')}</span>
            </ContactItem>
            <ContactItem>
              <FiPhone size={16} />
              <a href={`tel:${footerPhone.replace(/\s+/g, '')}`}>{footerPhone}</a>
            </ContactItem>
            <ContactItem>
              <FiMail size={16} />
              <a href={`mailto:${footerEmail}`}>{footerEmail}</a>
            </ContactItem>
            <ContactItem>
              <FiMapPin size={16} />
              <span>{footerAddress}</span>
            </ContactItem>
          </ContactList>
        </FooterCol>
      </FooterContent>

      {/* Barre Moyens de Paiement */}
      <PaymentSection>
        <PaymentTitle>
          <FiShield size={16} style={{ color: '#d97706' }} />
          <span>{t('footer.payment_methods_title', 'Paiements 100% Sécurisés & Vérifiés')}</span>
        </PaymentTitle>
        <PaymentMethods>
          <PaymentCard title="Carte Bancaire (CB)">
            <CbLogo />
          </PaymentCard>
          <PaymentCard title="Visa">
            <VisaLogo />
          </PaymentCard>
          <PaymentCard title="Mastercard">
            <MastercardLogo />
          </PaymentCard>
          <PaymentPill title="Virement Bancaire (SEPA)">
            <SepaLogo />
            <span>{t('footer.secure_transfer', 'Virement Bancaire (SEPA)')}</span>
          </PaymentPill>
          <PaymentPill title="Chiffrement SSL 256-bit">
            <FiLock size={13} style={{ color: '#16a34a' }} />
            <span>SSL 256-bit</span>
          </PaymentPill>
        </PaymentMethods>
      </PaymentSection>

      {/* Barre Copyright */}
      <FooterBottom>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          <div>
            © {currentYear} {siteName}. {t('footer.rights_reserved', 'Tous droits réservés.')}
          </div>
          <LanguageSwitcher />
        </div>
        <div style={{ opacity: 0.85 }}>
          {t('footer.delivery_notice', 'Livraison avec camion hayon et chariot tout-terrain.')}
        </div>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
