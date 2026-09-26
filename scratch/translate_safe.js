const fs = require('fs');
const path = 'apps/client/src/pages/Checkout.js';
let content = fs.readFileSync(path, 'utf8');

// Use precise replacements this time without regex globals where they are dangerous
// We will just do a standard string replace for exact known lines
content = content.replace(
  "V Connecté en tant que {formData.firstName ? `${formData.firstName} ${formData.lastName}` : (userData?.displayName || user.email)}",
  "✓ {t('checkout.logged_in_as', 'Connecté en tant que')} {formData.firstName ? `${formData.firstName} ${formData.lastName}` : (userData?.displayName || user.email)}"
);

content = content.replace(
  'placeholder="Code promo"',
  `placeholder={t('checkout.promo_code', 'Code promo')}`
);

content = content.replace(
  "{applyingCoupon ? '...' : 'Appliquer'}",
  "{applyingCoupon ? '...' : t('checkout.apply', 'Appliquer')}"
);

content = content.replace(
  "<span>Modifier mes coordonnées & adresse</span>",
  "<span>{t('checkout.edit_address', 'Modifier mes coordonnées & adresse')}</span>"
);

content = content.replace(
  "<span>Adresse de livraison enregistrée</span>",
  "<span>{t('checkout.registered_address', 'Adresse de livraison enregistrée')}</span>"
);

content = content.replace(
  "<span>Continuer vers le paiement (Étape 2/2)</span>",
  "<span>{t('checkout.continue_to_payment', 'Continuer vers le paiement (Étape 2/2)')}</span>"
);

// We need to replace all instances of "<span>Modifier</span>"
content = content.split("<span>Modifier</span>").join("<span>{t('checkout.edit', 'Modifier')}</span>");

fs.writeFileSync(path, content);
console.log('Fixed translations safely!');
