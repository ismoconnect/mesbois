import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import routeMapping from '../utils/routeMapping.json';

const SwitcherContainer = styled.nav`
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const LangLink = styled.a`
  background: none;
  border: none;
  text-decoration: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${props => props.$active ? '#fff' : 'rgba(255, 255, 255, 0.7)'};
  font-weight: ${props => props.$active ? '600' : '400'};
  padding: 4px 8px;
  border-radius: 12px;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
  }

  .flag {
    font-size: 16px;
  }
`;

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLang = (i18n.language || 'de').toLowerCase().startsWith('fr') ? 'fr' : 'de';

  const getTargetUrl = (targetLang) => {
    const pathParts = location.pathname.split('/').filter(Boolean);
    let langInUrl = null;
    let restOfPath = pathParts;
    
    if (pathParts[0] === 'fr' || pathParts[0] === 'de') {
      langInUrl = pathParts[0];
      restOfPath = pathParts.slice(1);
    }
    
    const currentSlug = restOfPath[0] || '';
    let foundRouteKey = 'home';
    let additionalParams = restOfPath.slice(1).join('/');
    
    const fullPathStr = restOfPath.join('/');
    for (const [key, mapping] of Object.entries(routeMapping)) {
      if (mapping[currentLang] === fullPathStr || mapping.fr === fullPathStr || mapping.de === fullPathStr) {
        foundRouteKey = key;
        additionalParams = '';
        break;
      }
      if (currentSlug && (mapping[currentLang] === currentSlug || mapping.fr === currentSlug || mapping.de === currentSlug)) {
        foundRouteKey = key;
        break;
      }
    }
    
    const newSlug = routeMapping[foundRouteKey]?.[targetLang] ?? foundRouteKey;
    let newPath = `/${targetLang}`;
    if (newSlug) newPath += `/${newSlug}`;
    if (additionalParams) newPath += `/${additionalParams}`;
    if (location.search) newPath += location.search;
    return newPath;
  };

  const handleClick = (e, targetLang) => {
    e.preventDefault();
    if (targetLang === currentLang) return;
    i18n.changeLanguage(targetLang);
    navigate(getTargetUrl(targetLang));
  };

  return (
    <SwitcherContainer aria-label="Sprachauswahl / Sélecteur de langue">
      <LangLink 
        href={getTargetUrl('de')} 
        onClick={(e) => handleClick(e, 'de')}
        $active={currentLang === 'de'}
        hrefLang="de"
        aria-label="Deutsch"
      >
        <span className="flag">🇩🇪</span> DE
      </LangLink>
      <LangLink 
        href={getTargetUrl('fr')} 
        onClick={(e) => handleClick(e, 'fr')}
        $active={currentLang === 'fr'}
        hrefLang="fr"
        aria-label="Français"
      >
        <span className="flag">🇫🇷</span> FR
      </LangLink>
    </SwitcherContainer>
  );
};

export default LanguageSwitcher;
