import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiMapPin, FiPhone, FiMail, FiFacebook, FiTwitter, FiInstagram } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background: #2c5530;
  color: white;
  padding: 40px 0 20px;
  margin-top: 60px;
  
  @media (max-width: 768px) {
    padding: 30px 0 15px;
    margin-top: 40px;
  }
  
  @media (max-width: 480px) {
    padding: 25px 0 12px;
    margin-top: 30px;
  }
  
  @media (max-width: 375px) {
    padding: 20px 0 10px;
    margin-top: 25px;
  }
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 20px;
    padding: 0 15px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 15px;
    padding: 0 12px;
  }
  
  @media (max-width: 375px) {
    grid-template-columns: 1fr 1fr 1fr;
    gap: 12px;
    padding: 0 10px;
  }
`;

const FooterSection = styled.div`
  h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 20px;
    color: #fff;
    
    @media (max-width: 768px) {
      font-size: 14px;
      margin-bottom: 12px;
      text-align: center;
    }
    
    @media (max-width: 480px) {
      font-size: 13px;
      margin-bottom: 10px;
    }
    
    @media (max-width: 375px) {
      font-size: 12px;
      margin-bottom: 8px;
    }
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 15px;
    color: #e0e0e0;
    
    @media (max-width: 768px) {
      font-size: 12px;
      line-height: 1.4;
      margin-bottom: 10px;
      text-align: center;
    }
    
    @media (max-width: 480px) {
      font-size: 11px;
      line-height: 1.3;
      margin-bottom: 8px;
    }
    
    @media (max-width: 375px) {
      font-size: 10px;
      line-height: 1.2;
      margin-bottom: 6px;
    }
  }
`;

const FooterLink = styled(Link)`
  display: block;
  color: #e0e0e0;
  text-decoration: none;
  margin-bottom: 10px;
  transition: color 0.3s ease;
  
  &:hover {
    color: #fff;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 6px;
    text-align: center;
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 5px;
  }
  
  @media (max-width: 375px) {
    font-size: 10px;
    margin-bottom: 4px;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  color: #e0e0e0;
  
  svg {
    margin-right: 10px;
    color: #4a7c59;
  }
  
  @media (max-width: 768px) {
    font-size: 12px;
    margin-bottom: 8px;
    justify-content: center;
    
    svg {
      margin-right: 6px;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 11px;
    margin-bottom: 6px;
    
    svg {
      margin-right: 4px;
    }
  }
  
  @media (max-width: 375px) {
    font-size: 10px;
    margin-bottom: 5px;
    
    svg {
      margin-right: 3px;
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 12px;
    justify-content: center;
  }
  
  @media (max-width: 480px) {
    gap: 8px;
    margin-top: 10px;
  }
  
  @media (max-width: 375px) {
    gap: 6px;
    margin-top: 8px;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  @media (max-width: 768px) {
    width: 30px;
    height: 30px;
  }
  
  @media (max-width: 480px) {
    width: 28px;
    height: 28px;
  }
  
  @media (max-width: 375px) {
    width: 26px;
    height: 26px;
  }
`;

const FooterBottom = styled.div`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 40px;
  padding-top: 20px;
  text-align: center;
  color: #e0e0e0;
  
  @media (max-width: 768px) {
    margin-top: 30px;
    padding-top: 15px;
    font-size: 14px;
  }
  
  @media (max-width: 480px) {
    margin-top: 25px;
    padding-top: 12px;
    font-size: 13px;
  }
  
  @media (max-width: 375px) {
    margin-top: 20px;
    padding-top: 10px;
    font-size: 12px;
  }
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Bois de Chauffage</h3>
          <p>
            Votre spécialiste du bois de chauffage de qualité. 
            Nous vous proposons une large gamme de produits 
            pour tous vos besoins de chauffage.
          </p>
          <SocialLinks>
            <SocialLink href="#" aria-label="Facebook">
              <FiFacebook size={20} />
            </SocialLink>
            <SocialLink href="#" aria-label="Twitter">
              <FiTwitter size={20} />
            </SocialLink>
            <SocialLink href="#" aria-label="Instagram">
              <FiInstagram size={20} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Catégories</h3>
          <FooterLink to="/products?main=bois">Bois de chauffage</FooterLink>
          <FooterLink to="/products?main=accessoires">Accessoires</FooterLink>
          <FooterLink to="/products?main=buches-densifiees">Bûches densifiées</FooterLink>
          <FooterLink to="/products?main=pellets">Pellets de bois</FooterLink>
          <FooterLink to="/products?main=poeles">Poêles</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <h3>Informations</h3>
          <FooterLink to="/legal">Mentions légales</FooterLink>
          <FooterLink to="/delivery">Politique de livraison</FooterLink>
          <FooterLink to="/privacy">Politique de confidentialité</FooterLink>
          <FooterLink to="/returns">Retours et remboursements</FooterLink>
          <FooterLink to="/terms">Conditions générales de vente</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <h3>Contact</h3>
          <ContactInfo>
            <FiMapPin size={16} />
            <span>123 Rue du Bois, 75001 Paris, France</span>
          </ContactInfo>
          <ContactInfo>
            <FiPhone size={16} />
            <span>+33 1 23 45 67 89</span>
          </ContactInfo>
          <ContactInfo>
            <FiMail size={16} />
            <span>contact@boisdechauffage.fr</span>
          </ContactInfo>
        </FooterSection>
      </FooterContent>
      
      <FooterBottom>
        <p>&copy; 2024 Bois de Chauffage. Tous droits réservés.</p>
      </FooterBottom>
    </FooterContainer>
  );
};

export default Footer;

