import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiMessageCircle, FiCheckCircle } from 'react-icons/fi';
import { FaTruck, FaShieldAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const ContactContainer = styled.div`
  max-width: 1040px;
  margin: 0 auto;
  padding: 20px 16px 48px;

  @media (max-width: 768px) {
    padding: 10px 12px 32px;
  }
`;

const ContactHeader = styled.div`
  text-align: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    margin-bottom: 14px;
  }
`;

const ContactBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  color: #047857;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.4px;
  text-transform: uppercase;
  padding: 3px 10px;
  border-radius: 999px;
  margin-bottom: 6px;

  @media (max-width: 768px) {
    font-size: 10px;
    padding: 2px 8px;
    margin-bottom: 4px;
  }
`;

const ContactTitle = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin: 0 0 6px 0;
  letter-spacing: -0.3px;

  @media (max-width: 768px) {
    font-size: 19px;
    margin: 0 0 4px 0;
  }
`;

const ContactSubtitle = styled.p`
  font-size: 13.5px;
  color: #64748b;
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.45;

  @media (max-width: 768px) {
    font-size: 12px;
    line-height: 1.4;
  }
`;

const ContactContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.3fr;
  gap: 20px;
  align-items: start;

  @media (max-width: 860px) {
    grid-template-columns: 1fr;
    gap: 14px;
  }
`;

const ContactInfo = styled.div`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 18px 16px;

  @media (max-width: 768px) {
    padding: 14px 12px;
    border-radius: 10px;
  }
`;

const InfoTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 14px 0;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #16a34a;
    font-size: 17px;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 12px;
    gap: 6px;

    svg {
      font-size: 16px;
    }
  }
`;

const InfoItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-bottom: 12px;

  &:last-of-type {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    gap: 8px;
    margin-bottom: 10px;
  }
`;

const IconBox = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #ecfdf5;
  color: #047857;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;

  svg {
    width: 15px;
    height: 15px;
  }

  @media (max-width: 768px) {
    width: 28px;
    height: 28px;
    border-radius: 6px;

    svg {
      width: 13px;
      height: 13px;
    }
  }
`;

const InfoContent = styled.div`
  min-width: 0;

  h4 {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin: 0 0 1px 0;

    @media (max-width: 768px) {
      font-size: 10px;
    }
  }

  p, a {
    color: #0f172a;
    font-size: 12.5px;
    font-weight: 600;
    line-height: 1.4;
    margin: 0;
    text-decoration: none;
    display: inline-block;

    @media (max-width: 768px) {
      font-size: 12px;
    }
  }

  a:hover {
    color: #16a34a;
  }
`;

const QuickNotice = styled.div`
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 8px;
  padding: 8px 10px;
  font-size: 11.5px;
  color: #475569;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;

  svg {
    color: #16a34a;
    flex-shrink: 0;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 8px;
    margin-top: 10px;
  }
`;

const ContactForm = styled.form`
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  padding: 18px 16px;

  @media (max-width: 768px) {
    padding: 14px 12px;
    border-radius: 10px;
  }
`;

const FormTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
  margin: 0 0 14px 0;

  svg {
    color: #16a34a;
    font-size: 16px;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    font-size: 14px;
    margin-bottom: 12px;
    gap: 6px;

    svg {
      font-size: 15px;
    }
  }
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  margin-bottom: 8px;

  @media (max-width: 480px) {
    grid-template-columns: 1fr 1fr;
    gap: 6px;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 8px;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  font-size: 11px;
  color: #334155;
  margin-bottom: 3px;

  @media (max-width: 768px) {
    font-size: 10.5px;
    margin-bottom: 2px;
  }
`;

const Input = styled.input`
  width: 100%;
  height: 35px;
  padding: 0 10px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  font-size: 12.5px;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
  background: #ffffff;
  
  &:focus {
    border-color: #1b3b22;
    box-shadow: 0 0 0 2px rgba(27, 59, 34, 0.08);
  }

  @media (max-width: 768px) {
    height: 33px;
    padding: 0 8px;
    font-size: 12px;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 8px 10px;
  border: 1px solid #cbd5e1;
  border-radius: 7px;
  font-size: 12.5px;
  color: #0f172a;
  outline: none;
  transition: all 0.2s ease;
  resize: vertical;
  min-height: 75px;
  background: #ffffff;
  font-family: inherit;
  
  &:focus {
    border-color: #1b3b22;
    box-shadow: 0 0 0 2px rgba(27, 59, 34, 0.08);
  }

  @media (max-width: 768px) {
    min-height: 65px;
    padding: 6px 8px;
    font-size: 12px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 38px;
  background: #1b3b22;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(27, 59, 34, 0.2);
  margin-top: 4px;
  
  &:hover:not(:disabled) {
    background: #142c19;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(27, 59, 34, 0.25);
  }
  
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }

  @media (max-width: 768px) {
    height: 36px;
    font-size: 12.5px;
    gap: 6px;
  }
`;

const DeliveryNoticeCard = styled.div`
  margin-top: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 12px;
    gap: 10px;
    margin-top: 12px;
  }
`;

const DeliveryInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  .truck-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background: #ecfdf5;
    color: #047857;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  h4 {
    font-size: 13px;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 2px 0;
  }

  p {
    font-size: 11.5px;
    color: #64748b;
    margin: 0;
  }

  @media (max-width: 768px) {
    .truck-icon {
      width: 30px;
      height: 30px;
      border-radius: 6px;
      svg { width: 15px; height: 15px; }
    }
    h4 { font-size: 12px; }
    p { font-size: 10.5px; }
  }
`;

const DeliveryBadges = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;

  span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    font-weight: 600;
    color: #047857;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    padding: 3px 8px;
    border-radius: 6px;
  }

  @media (max-width: 768px) {
    span {
      font-size: 10px;
      padding: 2px 6px;
    }
  }
`;

const Contact = () => {
  const { t } = useTranslation();
  const { settings, loaded } = useSiteSettings();
  const phone = loaded && settings.supportPhone ? settings.supportPhone : '+49 1633637236';
  const email = loaded && settings.supportEmail ? settings.supportEmail : 'kontakt@brennholzkaufen.online';
  const address = loaded && settings.legalAddress ? settings.legalAddress : '3 Rue des Anges, 67000 Strasbourg';

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

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
      await new Promise(resolve => setTimeout(resolve, 800));
      
      toast.success(t('contact.success', 'Message envoyé avec succès ! Notre équipe vous répondra sous 2h.'));
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      toast.error(t('contact.error', 'Erreur lors de l\'envoi du message'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ContactContainer>
      <ContactHeader>
        <ContactBadge>
          <FiMessageCircle size={12} /> {t('contact.badge', 'Service Client & Devis Gratuit')}
        </ContactBadge>
        <ContactTitle>{t('contact.title', 'Contactez notre équipe')}</ContactTitle>
        <ContactSubtitle>
          {t('contact.subtitle', 'Une question sur un produit, votre livraison ou un devis personnalisé ? Nous vous répondons rapidement.')}
        </ContactSubtitle>
      </ContactHeader>
      
      <ContactContent>
        <ContactInfo>
          <InfoTitle>
            <FiMessageCircle />
            {t('contact.info_title', 'Nos coordonnées directes')}
          </InfoTitle>
          
          <InfoItem>
            <IconBox>
              <FiPhone />
            </IconBox>
            <InfoContent>
              <h4>{t('contact.phone', 'Téléphone direct')}</h4>
              <a href={`tel:${phone.replace(/\s+/g, '')}`}>{phone}</a>
            </InfoContent>
          </InfoItem>

          <InfoItem>
            <IconBox>
              <FiMail />
            </IconBox>
            <InfoContent>
              <h4>{t('contact.email', 'Email du support')}</h4>
              <a href={`mailto:${email}`}>{email}</a>
            </InfoContent>
          </InfoItem>
          
          <InfoItem>
            <IconBox>
              <FiMapPin />
            </IconBox>
            <InfoContent>
              <h4>{t('contact.address', 'Dépôt & Siège')}</h4>
              <p>{address}</p>
            </InfoContent>
          </InfoItem>
          
          <InfoItem>
            <IconBox>
              <FiClock />
            </IconBox>
            <InfoContent>
              <h4>{t('contact.hours', 'Horaires d\'ouverture')}</h4>
              <p>
                {t('contact.hours_week', 'Lun – Ven : 8h30 – 18h30')}<br />
                {t('contact.hours_weekend', 'Samedi : 9h00 – 17h00 (Dimanche fermé)')}
              </p>
            </InfoContent>
          </InfoItem>

          <QuickNotice>
            <FiCheckCircle />
            <span>{t('contact.guarantee', 'Réponse garantie sous 2h ouvrées par nos conseillers.')}</span>
          </QuickNotice>
        </ContactInfo>
        
        <ContactForm onSubmit={handleSubmit}>
          <FormTitle>
            <FiSend />
            {t('contact.form_title', 'Envoyez-nous un message')}
          </FormTitle>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">{t('contact.form_firstname', 'Prénom *')}</Label>
              <Input
                type="text"
                id="firstName"
                name="firstName"
                placeholder={t("contact.form_firstname_placeholder", "Votre prénom")}
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="lastName">{t('contact.form_lastname', 'Nom *')}</Label>
              <Input
                type="text"
                id="lastName"
                name="lastName"
                placeholder={t("contact.form_lastname_placeholder", "Votre nom")}
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="email">{t('contact.form_email', 'Email *')}</Label>
              <Input
                type="email"
                id="email"
                name="email"
                placeholder={t("contact.form_email_placeholder", "nom@exemple.com")}
                value={formData.email}
                onChange={handleChange}
                required
              />
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone">{t('contact.form_phone', 'Téléphone')}</Label>
              <Input
                type="tel"
                id="phone"
                name="phone"
                placeholder={t("contact.form_phone_placeholder", "06 12 34 56 78")}
                value={formData.phone}
                onChange={handleChange}
              />
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="subject">{t('contact.form_subject', 'Sujet *')}</Label>
            <Input
              type="text"
              id="subject"
              name="subject"
              placeholder={t("contact.form_subject_placeholder", "Ex: Demande de livraison, Devis stères...")}
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="message">{t('contact.form_message', 'Votre message *')}</Label>
            <TextArea
              id="message"
              name="message"
              placeholder={t("contact.form_message_placeholder", "Détaillez votre demande ou votre code postal de livraison...")}
              value={formData.message}
              onChange={handleChange}
              required
            />
          </FormGroup>
          
          <SubmitButton type="submit" disabled={loading}>
            <FiSend size={15} />
            {loading ? t('contact.sending', 'Envoi en cours...') : t('contact.send', 'Envoyer mon message')}
          </SubmitButton>
        </ContactForm>
      </ContactContent>
      
      <DeliveryNoticeCard>
        <DeliveryInfo>
          <div className="truck-icon">
            <FaTruck size={17} />
          </div>
          <div>
            <h4>{t('contact.delivery_title', 'Zone de livraison directe sous abri')}</h4>
            <p>{t('contact.delivery_desc', 'Camion équipé d\'un chariot tout-terrain pour déposer vos palettes exactement où vous le souhaitez.')}</p>
          </div>
        </DeliveryInfo>
        <DeliveryBadges>
          <span><FiCheckCircle size={11} /> {t('contact.delivery_badge1', 'Chariot tout-terrain')}</span>
          <span><FaShieldAlt size={10} /> {t('contact.delivery_badge2', '100% garanti')}</span>
        </DeliveryBadges>
      </DeliveryNoticeCard>
    </ContactContainer>
  );
};

export default Contact;
