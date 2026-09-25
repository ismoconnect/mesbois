import React from 'react';
import Profile from './Profile';

// La page Paramètres est désormais unifiée avec Mon Profil
// et s'ouvre directement sur l'onglet "Sécurité & Préférences"
const Settings = () => {
  return <Profile defaultTab="security" />;
};

export default Settings;
