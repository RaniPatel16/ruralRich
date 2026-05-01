const fs = require('fs');
const path = require('path');

function walk(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const stat = fs.statSync(path.join(dir, file));
    if (stat.isDirectory()) {
      fileList = walk(path.join(dir, file), fileList);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fileList.push(path.join(dir, file));
    }
  }
  return fileList;
}

const files = walk('frontend/src');

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Backgrounds
  content = content.replace(/background:\s*['"]white['"]/g, "background: 'var(--bg-white)'");
  content = content.replace(/background:\s*['"]#ffffff['"]/ig, "background: 'var(--bg-white)'");
  content = content.replace(/background:\s*['"]#f8fafc['"]/ig, "background: 'var(--bg-main)'");
  
  // Text colors
  content = content.replace(/color:\s*['"]#0f172a['"]/ig, "color: 'var(--text-main)'");
  content = content.replace(/color:\s*['"]#1e293b['"]/ig, "color: 'var(--text-main)'");
  content = content.replace(/color:\s*['"]#334155['"]/ig, "color: 'var(--text-secondary)'");
  content = content.replace(/color:\s*['"]#475569['"]/ig, "color: 'var(--text-secondary)'");
  content = content.replace(/color:\s*['"]#64748b['"]/ig, "color: 'var(--text-muted)'");
  content = content.replace(/color:\s*['"]#94a3b8['"]/ig, "color: 'var(--text-muted)'");
  
  // Borders
  content = content.replace(/border:\s*['"]1px solid #f1f5f9['"]/ig, "border: '1px solid var(--border)'");
  content = content.replace(/border:\s*['"]2px solid #f1f5f9['"]/ig, "border: '2px solid var(--border)'");
  content = content.replace(/border:\s*['"]2px solid #e2e8f0['"]/ig, "border: '2px solid var(--border-hover)'");
  content = content.replace(/borderBottom:\s*['"]1px solid #f1f5f9['"]/ig, "borderBottom: '1px solid var(--border)'");
  content = content.replace(/borderBottom:\s*['"]1px solid #e2e8f0['"]/ig, "borderBottom: '1px solid var(--border)'");
  content = content.replace(/borderTop:\s*['"]1px solid #f1f5f9['"]/ig, "borderTop: '1px solid var(--border)'");
  content = content.replace(/borderColor:\s*['"]#e2e8f0['"]/ig, "borderColor: 'var(--border)'");

  fs.writeFileSync(file, content, 'utf8');
}
console.log('Theme applied to all JSX files!');
