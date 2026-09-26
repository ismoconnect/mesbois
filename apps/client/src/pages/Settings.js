import React from 'react';
import { useTranslation } from 'react-i18next';
import Profile from './Profile';

// Die Einstellungsseite ist nun mit Mein Profil vereint
// und öffnet sich direkt im Tab "Sicherheit & Einstellungen"
const Settings = () => {
  const { t } = useTranslation();
  return <Profile defaultTab="security" />;
};

export default Settings;
