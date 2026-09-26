const fs = require('fs');
let code = fs.readFileSync('apps/client/src/pages/Checkout.js', 'utf8');

// The faulty line is:
// V {t('checkout.logged_in_as', '{t('checkout.logged_in_as', 'Connecté en tant que')}')} {formData.firstName
code = code.replace(/V \{t\('checkout\.logged_in_as'.*?'\)\}'\)\}/g, `✓ {t('checkout.logged_in_as', 'Connecté en tant que')}`);
code = code.replace(/V \{t\('checkout\.logged_in_as', '\{t\('checkout\.logged_in_as', 'Connect[é\ufffd] en tant que'\)'\)\}/g, `✓ {t('checkout.logged_in_as', 'Connecté en tant que')}`);
// General fix
code = code.replace(/V \{t\('checkout\.logged_in_as', '.*?'\)\}/g, `✓ {t('checkout.logged_in_as', 'Connecté en tant que')}`);

fs.writeFileSync('apps/client/src/pages/Checkout.js', code);
