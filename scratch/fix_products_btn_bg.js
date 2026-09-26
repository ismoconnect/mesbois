const fs = require('fs');
let code = fs.readFileSync('apps/client/src/pages/Products.js', 'utf8');

code = code.replace(/background:\s*var\(--primary-color\);/g, 'background: #1b3b22;');

fs.writeFileSync('apps/client/src/pages/Products.js', code);
console.log("Fixed button background in Products.js");
