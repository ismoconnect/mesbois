import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';
import { grantTikTokConsent } from '../../utils/tiktokPixel';

const BannerContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20000;
  display: flex;
  justify-content: center;
  pointer-events: none;
`;

const BannerInner = styled.div`
  pointer-events: auto;
  max-width: 960px;
  margin: 0 16px 16px;
  background: #111827;
  color: #f9fafb;
  padding: 14px 18px;
  border-radius: 10px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  font-size: 13px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const BannerText = styled.p`
  flex: 1;
  margin: 0;
  line-height: 1.5;
`;

const BannerLink = styled.a`
  color: #bbf7d0;
  text-decoration: underline;
  &:hover {
    color: #86efac;
  }
`;

const ButtonRow = styled.div`
  display: flex;
  gap: 8px;
`;

const BannerButton = styled.button`
  border-radius: 999px;
  border: none;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
`;

const AcceptButton = styled(BannerButton)`
  background: #22c55e;
  color: #022c22;

  &:hover {
    background: #16a34a;
  }
`;

const DeclineButton = styled(BannerButton)`
  background: transparent;
  color: #e5e7eb;
  border: 1px solid #4b5563;

  &:hover {
    background: #1f2937;
  }
`;

const COOKIE_KEY = 'cookie-consent';

const CookieBanner = () => {
  const { i18n } = useTranslation();
  const [visible, setVisible] = useState(false);

  const lang = (i18n.language || 'de').toLowerCase();
  const isDe = lang.startsWith('de');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem(COOKIE_KEY);
      if (!stored) {
        setVisible(true);
      }
    } catch {
      setVisible(true);
    }
  }, []);

  const handleChoice = (value) => {
    try {
      if (value === 'accepted') {
        grantTikTokConsent();
      } else {
        window.localStorage.setItem(COOKIE_KEY, 'rejected');
      }
    } catch {
      // ignore
    }
    setVisible(false);
  };

  if (!visible) return null;

  const privacyPath = isDe ? '/de/datenschutz' : '/fr/confidentialite';

  return (
    <BannerContainer>
      <BannerInner>
        <BannerText>
          {isDe ? (
            <>
              Wir verwenden Cookies, um Ihre Nutzererfahrung zu optimieren, Zugriffe zu analysieren und Inhalte zu personalisieren. Sie können nicht zwingend erforderliche Cookies akzeptieren oder ablehnen. Details in unserer{' '}
              <BannerLink href={privacyPath}>Datenschutzerklärung</BannerLink>.
            </>
          ) : (
            <>
              Nous utilisons des cookies pour améliorer votre expérience, analyser le trafic et personnaliser certains contenus. Vous pouvez accepter ou refuser les cookies non essentiels. Pour en savoir plus, consultez notre{' '}
              <BannerLink href={privacyPath}>politique de confidentialité</BannerLink>.
            </>
          )}
        </BannerText>
        <ButtonRow>
          <DeclineButton type="button" onClick={() => handleChoice('rejected')}>
            {isDe ? 'Ablehnen' : 'Refuser'}
          </DeclineButton>
          <AcceptButton type="button" onClick={() => handleChoice('accepted')}>
            {isDe ? 'Akzeptieren' : 'Accepter'}
          </AcceptButton>
        </ButtonRow>
      </BannerInner>
    </BannerContainer>
  );
};

export default CookieBanner;
