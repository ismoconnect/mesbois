import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationFR from './locales/fr/translation.json';
import translationDE from './locales/de/translation.json';

const resources = {
  fr: {
    translation: translationFR
  },
  de: {
    translation: translationDE
  }
};

i18n
  // Détecte la langue du navigateur
  .use(LanguageDetector)
  // Passe l'instance i18n à react-i18next.
  .use(initReactI18next)
  .init({
    resources,
    // Langue de secours
    fallbackLng: 'de',
    
    // Par défaut on force le FR pour le développement (le développeur)
    // En production on bloquera sur le DE. 
    // Pour tester l'affichage final, changez 'fr' en 'de' ici :
    lng: 'fr', 

    interpolation: {
      escapeValue: false // React s'occupe de l'échappement
    }
  });

export default i18n;
