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

const FooterContainer = styled.footer`
  background: #142618;
  color: #f1f5f2;
  padding: 56px 0 24px;
  margin-top: 48px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 768px) {
    padding: 40px 0 20px;
    margin-top: 32px;
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
    gap: 32px;
  }

  @media (max-width: 576px) {
    grid-template-columns: 1fr;
    gap: 28px;
  }
`;

const FooterCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const BrandHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
`;

const BrandLogo = styled.span`
  font-size: 24px;
`;

const BrandTitle = styled.h3`
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.3px;
  margin: 0;
`;

const BrandDesc = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: #a3b8a8;
  margin-bottom: 18px;
`;

const TrustBadgesRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: auto;
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
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  color: #b5c9ba;
  margin-bottom: 14px;

  svg {
    color: #d97706;
    flex-shrink: 0;
    margin-top: 2px;
  }

  span {
    line-height: 1.5;
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
  }
`;

const PaymentTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #a3b8a8;
  font-weight: 600;
`;

const PaymentMethods = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const PaymentPill = styled.span`
  background: #ffffff;
  color: #1e293b;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 12px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
`;

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
  }
`;

const Footer = () => {
  const { t } = useTranslation();
  const { settings, loaded } = useSiteSettings();
  const siteName = loaded ? (settings.siteName || 'Mes Bois') : 'Mes Bois';
  const footerAddress = loaded ? (settings.legalAddress || '3 Rue des Anges, 67000 Strasbourg') : '3 Rue des Anges, 67000 Strasbourg';
  const footerPhone = loaded ? (settings.supportPhone || '+49 1633637236') : '+49 1633637236';
  const footerEmail = loaded ? (settings.supportEmail || 'contact@mesbois.com') : 'contact@mesbois.com';

  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        {/* Colonne 1: Présentation & Certifications */}
        <FooterCol>
          <BrandHeader>
            <BrandLogo>🌲</BrandLogo>
            <BrandTitle>{siteName}</BrandTitle>
          </BrandHeader>
          <BrandDesc>
            {t('footer.about_text', "Votre spécialiste européen en bois de chauffage dur (Chêne, Hêtre, Charme) et pellets de haute performance. Livraison soignée directement sous votre abri par camion avec chariot tout-terrain.")}
          </BrandDesc>
          <TrustBadgesRow>
            <TrustBadge><FiCheckCircle size={13} /> PEFC / FSC</TrustBadge>
            <TrustBadge><FiCheckCircle size={13} /> DINplus / ENplus</TrustBadge>
            <TrustBadge><FiCheckCircle size={13} /> Humidité &lt; 20%</TrustBadge>
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
          <ContactItem>
            <FiClock size={16} />
            <span>{t('footer.customer_service', 'Lun–Sam : 9h00–18h00')}</span>
          </ContactItem>
          <ContactItem>
            <FiPhone size={16} />
            <span>{footerPhone}</span>
          </ContactItem>
          <ContactItem>
            <FiMail size={16} />
            <span>{footerEmail}</span>
          </ContactItem>
          <ContactItem>
            <FiMapPin size={16} />
            <span>{footerAddress}</span>
          </ContactItem>
        </FooterCol>
      </FooterContent>

      {/* Barre Moyens de Paiement */}
      <PaymentSection>
        <PaymentTitle>
          <FiShield size={16} style={{ color: '#d97706' }} />
          <span>{t('footer.payment_methods_title', 'Paiements 100% Sécurisés & Vérifiés')}</span>
        </PaymentTitle>
        <PaymentMethods>
          <PaymentPill>🏦 {t('footer.secure_transfer', 'Virement Bancaire (SEPA / Vorkasse)')}</PaymentPill>
          <PaymentPill>💳 CB / Visa / Mastercard</PaymentPill>
          <PaymentPill>🅿️ PayPal</PaymentPill>
          <PaymentPill><FiLock size={12} style={{ color: '#16a34a' }} /> SSL 256-bit</PaymentPill>
        </PaymentMethods>
      </PaymentSection>

      {/* Barre Copyright */}
      <FooterBottom>
        <div>
          © {currentYear} {siteName}. {t('footer.rights_reserved', 'Tous droits réservés.')}
        </div>
        <div style={{ opacity: 0.85 }}>
          {t('footer.delivery_notice', 'Livraison avec camion hayon et chariot tout-terrain.')}
        </div>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;
