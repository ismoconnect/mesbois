const fs = require('fs');
let code = fs.readFileSync('apps/client/src/pages/Checkout.js', 'utf8');

const lines = code.split('\\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('formData.firstName ? `${formData.firstName} ${formData.lastName}` : (userData?.displayName || user.email)') && lines[i].includes('checkout.logged_in_as')) {
    lines[i] = "              ✓ {t('checkout.logged_in_as', 'Connecté en tant que')} {formData.firstName ? `${formData.firstName} ${formData.lastName}` : (userData?.displayName || user.email)}";
  }
}

fs.writeFileSync('apps/client/src/pages/Checkout.js', lines.join('\\n'));
