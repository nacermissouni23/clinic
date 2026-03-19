const fs = require('fs');
let c = fs.readFileSync('src/components/layout/header.tsx', 'utf8');
c = c.replace(/\s*const isRTL = locale === "ar";/g, '');
fs.writeFileSync('src/components/layout/header.tsx', c);