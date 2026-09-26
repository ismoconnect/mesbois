const fs = require('fs');
let code = fs.readFileSync('apps/client/src/pages/Products.js', 'utf8');

const newActions = `const ProductActions = styled.div\`
  display: flex;
  gap: 6px;
  margin-top: auto;
  padding-top: 6px;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 8px;
    padding-top: 8px;
  }
\`;`;

code = code.replace(/const ProductActions = styled\.div`[\s\S]*?`;/, newActions);

// We will also globally replace white-space: nowrap in buttons if it exists
code = code.replace(/white-space:\s*nowrap;/g, '');

const newAddBtn = `const AddToCartButton = styled.button\`
  flex: 1;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: normal;
  text-align: center;

  &:hover:not(:disabled) {
    background: #104c27;
  }

  &:disabled {
    background: #e2e8f0;
    color: #94a3b8;
    cursor: not-allowed;
  }
\`;`;

// Replace AddToCartButton
code = code.replace(/const AddToCartButton = styled\.button`[\s\S]*?`;/, newAddBtn);

fs.writeFileSync('apps/client/src/pages/Products.js', code);
console.log("Updated Products.js");
