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
    let changed = false;
    
    const replacement = `if (res.status === 401 || res.status === 403) {
            localStorage.removeItem('token');
            return {};
          }
          if (!res.ok) throw new Error(\`API Error \${res.url} \${res.status} \${res.statusText}\`);`;

    if (c.includes('if (!res.ok) throw new Error(`API Error ${res.url} ${res.status} ${res.statusText}`);')) {
        c = c.replaceAll('if (!res.ok) throw new Error(`API Error ${res.url} ${res.status} ${res.statusText}`);', replacement);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(f, c);
        console.log("Updated", f);
    }
});
