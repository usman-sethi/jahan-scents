const fs = require('fs');
const lines = fs.readFileSync('src/components/home/ProductShowcase.tsx', 'utf-8').split('\n');
console.log(lines.slice(70, 92).join('\n'));
