const fs = require('fs');
const path = 'apps/client/src/pages/Billing.js';
let content = fs.readFileSync(path, 'utf8');

// The return statement is around line 588:
// return (
//   <RIBGrid>

content = content.replace(
  /return \(\s*<RIBGrid>/,
  `return (
                      <>
                      <RIBGrid>`
);

// The end is:
//                       </div>
//                     );

content = content.replace(
  /<\/WhatsAppBtn>\s*<\/div>\s*\);\s*}\)\(\)\}/,
  `</WhatsAppBtn>
                      </div>
                      </>
                    );
                  })()}`
);

fs.writeFileSync(path, content);
console.log('Fixed JSX fragment issue in Billing.js');
