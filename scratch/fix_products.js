const fs = require('fs');

let path = 'apps/client/src/pages/Products.js';
let content = fs.readFileSync(path, 'utf8');

// Replace flex-direction
content = content.replace(
  `@media (max-width: 768px) {
    gap: 4px;
    padding-top: 4px;
  }`,
  `@media (max-width: 768px) {
    flex-direction: column;
    gap: 4px;
    padding-top: 4px;
  }`
);

// Replace white-space
content = content.replace(/white-space: nowrap;/g, 'white-space: normal;');

fs.writeFileSync(path, content);
console.log('Fixed Products.js');
