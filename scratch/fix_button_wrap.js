const fs = require('fs');

function fixButtons(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // We want to add white-space: nowrap; to AddToCartButton and QuickViewButton
  // But wait, my previous script added white-space: normal; to AddToCartButton in Products.js
  
  // Replace white-space: normal; with white-space: nowrap;
  code = code.replace(/white-space:\s*normal;/g, 'white-space: nowrap;');
  
  // Make sure font-size is slightly smaller on mobile to ensure it fits the card width
  code = code.replace(/const AddToCartButton = styled\.button`([\s\S]*?)`;/, function(match, p1) {
    if (!p1.includes('@media')) {
      return `const AddToCartButton = styled.button\`${p1}
  @media (max-width: 768px) {
    font-size: 12px;
  }
\`;`;
    }
    return match;
  });

  // If there is AddToCartBtn (like in Home.js)
  code = code.replace(/const AddToCartBtn = styled\.button`([\s\S]*?)`;/, function(match, p1) {
    if (!p1.includes('@media')) {
      return `const AddToCartBtn = styled.button\`${p1}
  @media (max-width: 768px) {
    font-size: 12px;
  }
\`;`;
    }
    return match;
  });

  // Fix background in Home.js if needed
  code = code.replace(/background:\s*var\(--primary-color\);/g, 'background: #1b3b22;');

  fs.writeFileSync(filePath, code);
}

fixButtons('apps/client/src/pages/Products.js');
fixButtons('apps/client/src/pages/Home.js');

console.log("Buttons updated for single line text");
