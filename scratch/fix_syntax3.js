const fs = require('fs');
let code = fs.readFileSync('apps/client/src/pages/Checkout.js', 'utf8');

const badString = "V {t('checkout.logged_in_as', '{t('checkout.logged_in_as', 'Connecté en tant que')}')}";
const goodString = "✓ {t('checkout.logged_in_as', 'Connecté en tant que')}";
// And also this weird one:
const badString2 = "V {t('checkout.logged_in_as', '{t('checkout.logged_in_as', 'Connect en tant que')}')}";

code = code.split(badString).join(goodString);
code = code.split(badString2).join(goodString);
// Just to be safe, split on the first part
code = code.replace(/V \{t\('checkout\.logged_in_as', '\{t\('checkout\.logged_in_as', 'Connect. en tant que'\)'\)\}/g, goodString);

fs.writeFileSync('apps/client/src/pages/Checkout.js', code);
