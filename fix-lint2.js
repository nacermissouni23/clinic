const fs = require('fs');
let c = fs.readFileSync('src/components/layout/header.tsx', 'utf8');
c = c.replace(/const CLINIC_NAME_FR.*?\n/g, '');
c = c.replace(/const CLINIC_NAME_AR.*?\n/g, '');
fs.writeFileSync('src/components/layout/header.tsx', c);