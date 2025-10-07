const fs = require('fs');
const path = require('path');

// Patrón de Vercel para caracteres válidos
const vercelPattern = /^[a-zA-Z0-9_ :;.,"'?!(){}\[\]@<>=+*#$&`|~\^%\/-]+$/;

function findProblematicPaths(dir, basePath = '') {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const currentPath = basePath + '/' + item;
    
    // Verificar si el nombre tiene caracteres problemáticos
    if (!vercelPattern.test(item)) {
      console.log(`❌ PROBLEMÁTICO: ${currentPath}`);
      console.log(`   Tipo: ${stat.isDirectory() ? 'Directorio' : 'Archivo'}`);
      
      // Identificar caracteres problemáticos
      const chars = item.split('');
      const problematicChars = chars.filter(char => !vercelPattern.test(char));
      console.log(`   Caracteres problemáticos: ${problematicChars.join(', ')}`);
      console.log('');
    }
    
    if (stat.isDirectory()) {
      findProblematicPaths(fullPath, currentPath);
    }
  });
}

console.log('🔍 Buscando archivos y carpetas con caracteres problemáticos:');
console.log('=============================================================');

try {
  findProblematicPaths('src/app');
} catch (error) {
  console.log('Error:', error.message);
}
