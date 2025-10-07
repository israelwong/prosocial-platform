const pattern = /^[a-zA-Z0-9_ :;.,"'?!(){}\[\]@<>=+*#$&`|~\^%\/-]+$/;

const routes = [
  '/studio/[slug]',
  '/studio/[slug]/app/configuracion/catalogo/paquetes/[accion]',
  '/studio/[slug]/app/configuracion/catalogo/paquetes/[accion]/[id]',
  '/admin/plans/[id]',
  '/admin/agents/[id]',
  '/admin/descuentos/general/[id]',
  '/api/studio/[slug]',
  '/api/plataformas/[id]',
  '/api/plans/[id]',
  '/api/leads/[id]'
];

console.log('Testing routes against Vercel pattern:');
routes.forEach(route => {
  const matches = pattern.test(route);
  console.log(`${matches ? '✅' : '❌'} ${route}`);
});

// Test specific problematic characters
console.log('\nTesting problematic characters:');
const testChars = ['[', ']', '{', '}', '(', ')', '@', '<', '>', '=', '+', '*', '#', '$', '&', '`', '|', '~', '^', '%'];
testChars.forEach(char => {
  const testRoute = `/test${char}route`;
  const matches = pattern.test(testRoute);
  console.log(`${matches ? '✅' : '❌'} Character '${char}' in route: ${testRoute}`);
});
