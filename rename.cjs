const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    try {
      filelist = fs.statSync(dirFile).isDirectory() ? walkSync(dirFile, filelist) : filelist.concat(dirFile);
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'EACCES') return;
      throw err;
    }
  });
  return filelist;
}

const files = [
  ...walkSync('./src'),
  './index.html',
  './server.ts',
  './metadata.json',
  './package.json'
];

files.forEach(file => {
  if (!file.endsWith('.ts') && !file.endsWith('.tsx') && !file.endsWith('.html') && !file.endsWith('.json') && !file.endsWith('.css')) {
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  let newContent = content
    .replace(/VELORÉ/g, 'JAHAN')
    .replace(/velore/g, 'jahan')
    .replace(/veloré/g, 'jahan')
    .replace(/VELORE/g, 'JAHAN')
    .replace(/Veloré/g, 'Jahan')
    .replace(/Velore/g, 'Jahan');
    
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log(`Updated ${file}`);
  }
});
