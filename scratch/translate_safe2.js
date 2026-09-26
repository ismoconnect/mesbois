const fs = require('fs');
const path = 'apps/client/src/pages/Checkout.js';
let content = fs.readFileSync(path, 'utf8');

// Use a regex that ignores the first character (V or ✓)
content = content.replace(/.\s*Connecté en tant que/g, "✓ {t('checkout.logged_in_as', 'Connecté en tant que')}");
content = content.replace(/.\s*Connect en tant que/g, "✓ {t('checkout.logged_in_as', 'Connecté en tant que')}");

// Fix 'Connect' safely:
const searchString1 = "{formData.firstName ? `${formData.firstName} ${formData.lastName}` : (userData?.displayName || user.email)}";
if (content.includes("V Connect") || content.includes("✓ Connect") || content.includes("Connecté en tant que")) {
  const lines = content.split('\\n');
  for(let i=0; i<lines.length; i++) {
     if(lines[i].includes("Connect") && lines[i].includes("en tant que") && lines[i].includes("formData.firstName")) {
         lines[i] = "              ✓ {t('checkout.logged_in_as', 'Connecté en tant que')} {formData.firstName ? `${formData.firstName} ${formData.lastName}` : (userData?.displayName || user.email)}";
     }
  }
  content = lines.join('\\n');
}

fs.writeFileSync(path, content);
console.log('Fixed translations safely part 2!');
