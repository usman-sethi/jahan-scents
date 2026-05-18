import fs from 'fs';
import path from 'path';

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx') || file.endsWith('.ts')) results.push(file);
        }
    });
    return results;
}

const files = walk('src');
files.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    if (c.includes('API Error')) {
        fs.writeFileSync(f, c.replace(/throw new Error\('API Error'\)/g, 'throw new Error(`API Error ${res.url} ${res.status} ${res.statusText}`)'));
    }
});
