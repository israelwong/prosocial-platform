const fs = require('fs');
const path = require('path');

// Patrón exacto de Vercel del error
const vercelPattern = /^[a-zA-Z0-9_ :;.,"'?!(){}\[\]@<>=+*#$&`|~\^%\/-]+$/;

function analyzeAllPaths(dir, basePath = '') {
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    const currentPath = basePath + '/' + item;
    
    // Verificar cada carácter individualmente
    const chars = item.split('');
    const problematicChars = chars.filter(char => !vercelPattern.test(char));
    
    if (problematicChars.length > 0) {
      console.log(`❌ PROBLEMÁTICO: ${currentPath}`);
      console.log(`   Caracteres problemáticos: ${problematicChars.join(', ')}`);
      console.log(`   Códigos ASCII: ${problematicChars.map(c => c.charCodeAt(0)).join(', ')}`);
      console.log('');
    }
    
    if (stat.isDirectory()) {
      analyzeAllPaths(fullPath, currentPath);
    }
  });
}

// También verificar rutas específicas que podrían estar causando problemas
const specificRoutes = [
  '/studio/[slug]/app/configuracion',
  '/studio/[slug]/app/configuracion/catalogo',
  '/studio/[slug]/app/configuracion/catalogo/paquetes',
  '/studio/[slug]/app/configuracion/catalogo/paquetes/[accion]',
  '/studio/[slug]/app/configuracion/catalogo/paquetes/[accion]/[id]',
  '/studio/[slug]/app/configuracion/catalogo/servicios',
  '/studio/[slug]/app/configuracion/cuenta',
  '/studio/[slug]/app/configuracion/cuenta/perfil',
  '/studio/[slug]/app/configuracion/cuenta/seguridad',
  '/studio/[slug]/app/configuracion/cuenta/suscripcion',
  '/studio/[slug]/app/configuracion/operacion',
  '/studio/[slug]/app/configuracion/operacion/personal',
  '/studio/[slug]/app/configuracion/operacion/pipeline',
  '/studio/[slug]/app/configuracion/operacion/tipos-evento',
  '/studio/[slug]/app/configuracion/pagina',
  '/studio/[slug]/app/configuracion/pagina/faq',
  '/studio/[slug]/app/configuracion/pagina/portafolio',
  '/studio/[slug]/app/configuracion/pagina/promociones',
  '/studio/[slug]/app/configuracion/pagina/seo',
  '/studio/[slug]/app/configuracion/pagos',
  '/studio/[slug]/app/configuracion/pagos/metodos',
  '/studio/[slug]/app/configuracion/pagos/metodos/cuentas-negocio',
  '/studio/[slug]/app/configuracion/pagos/metodos/stripe',
  '/studio/[slug]/app/configuracion/platform',
  '/studio/[slug]/app/configuracion/platform/integraciones',
  '/studio/[slug]/app/configuracion/platform/modulos',
  '/studio/[slug]/app/configuracion/platform/notificaciones',
  '/studio/[slug]/app/configuracion/studio',
  '/studio/[slug]/app/configuracion/studio/contacto',
  '/studio/[slug]/app/configuracion/studio/horarios',
  '/studio/[slug]/app/configuracion/studio/identidad',
  '/studio/[slug]/app/configuracion/studio/redes-sociales',
  '/studio/[slug]/app/configuracion/ventas',
  '/studio/[slug]/app/configuracion/ventas/condiciones-comerciales',
  '/studio/[slug]/app/configuracion/ventas/crm',
  '/studio/[slug]/app/configuracion/ventas/inteligencia-financiera',
  '/studio/[slug]/app/configuracion/ventas/reglas-agendamiento'
];

console.log('🔍 Analizando rutas específicas:');
console.log('================================');

specificRoutes.forEach(route => {
  const matches = vercelPattern.test(route);
  console.log(`${matches ? '✅' : '❌'} ${route}`);
  
  if (!matches) {
    const chars = route.split('');
    const problematicChars = chars.filter(char => !vercelPattern.test(char));
    console.log(`   Caracteres problemáticos: ${problematicChars.join(', ')}`);
  }
});

console.log('\n🔍 Analizando estructura de archivos:');
console.log('=====================================');

try {
  analyzeAllPaths('src/app');
} catch (error) {
  console.log('Error:', error.message);
}
