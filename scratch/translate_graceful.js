const fs = require('fs');
const path = 'apps/client/src/pages/Checkout.js';
let content = fs.readFileSync(path, 'utf8');

// Replace "V Connecté en tant que..."
const searchLogin = "V Connecté en tant que {formData.firstName ? `${formData.firstName} ${formData.lastName}` : (userData?.displayName || user.email)}";
const searchLoginAlt = "✓ Connecté en tant que {formData.firstName ? `${formData.firstName} ${formData.lastName}` : (userData?.displayName || user.email)}";
const searchLoginAlt2 = "V {t('checkout.logged_in_as', 'Connecté en tant que')} {formData.firstName ? `${formData.firstName} ${formData.lastName}` : (userData?.displayName || user.email)}";

const replaceLogin = "✓ {t('checkout.logged_in_as', 'Connecté en tant que')} {formData.firstName ? `${formData.firstName} ${formData.lastName}` : (userData?.displayName || user.email)}";

if (content.includes(searchLogin)) {
    content = content.replace(searchLogin, replaceLogin);
} else if (content.includes(searchLoginAlt)) {
    content = content.replace(searchLoginAlt, replaceLogin);
} else {
    // If it's none of the above, we'll replace manually by finding the line
    const match = content.match(/.*Connect. en tant que.*/);
    if (match) {
        content = content.replace(match[0], "              " + replaceLogin);
    }
}

// Replace "Code promo"
content = content.replace(
  'placeholder="Code promo"',
  `placeholder={t('checkout.promo_code', 'Code promo')}`
);

// Replace "Appliquer"
content = content.replace(
  "{applyingCoupon ? '...' : 'Appliquer'}",
  "{applyingCoupon ? '...' : t('checkout.apply', 'Appliquer')}"
);

// Replace "Modifier mes coordonnées & adresse"
content = content.replace(
  "<span>Modifier mes coordonnées & adresse</span>",
  "<span>{t('checkout.edit_address', 'Modifier mes coordonnées & adresse')}</span>"
);

// Replace "Adresse de livraison enregistrée"
content = content.replace(
  "<span>Adresse de livraison enregistrée</span>",
  "<span>{t('checkout.registered_address', 'Adresse de livraison enregistrée')}</span>"
);

// Replace "Continuer vers le paiement (Étape 2/2)"
content = content.replace(
  "<span>Continuer vers le paiement (Étape 2/2)</span>",
  "<span>{t('checkout.continue_to_payment', 'Continuer vers le paiement (Étape 2/2)')}</span>"
);

// Replace "Modifier" exact span
content = content.replace(/<span>Modifier<\/span>/g, "<span>{t('checkout.edit', 'Modifier')}</span>");

fs.writeFileSync(path, content);
console.log('Fixed translations gracefully!');
