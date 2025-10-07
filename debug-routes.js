// Script para analizar rutas problemáticas en Vercel
const fs = require("fs");
const path = require("path");

// Patrón de Vercel
const vercelPattern = /^[a-zA-Z0-9_ :;.,"'?!(){}\[\]@<>=+*#$&`|~\^%\/-]+$/;

// Rutas problemáticas conocidas
const problematicRoutes = [
  "/studio/[slug]/app/configuracion/catalogo/paquetes/[accion]/[id]",
  "/studio/[slug]/app/configuracion/catalogo/paquetes/[accion]",
  "/admin/agents/[id]",
  "/admin/plans/[id]",
  "/admin/descuentos/general/[id]",
  "/api/studio/[slug]/setup-status",
  "/api/plans/[id]/create-stripe-price",
  "/api/plans/[id]/migrate-subscriptions",
  "/api/plans/[id]/services",
  "/api/plataformas/[id]",
  "/api/leads/[id]",
  "/api/campanas/[id]",
  "/api/canales/[id]",
  "/api/projects/[id]",
  "/api/service-categories/[id]",
  "/api/services/[id]",
  "/api/admin/agents/[id]",
  "/api/admin/agents/[id]/auth-status",
  "/api/admin/agents/[id]/resend-credentials",
  "/api/admin/descuentos/[id]",
  "/api/admin/plataformas-redes/[id]",
  "/api/admin/studios/[id]",
];

console.log("🔍 Analizando rutas problemáticas:");
console.log("=====================================");

problematicRoutes.forEach((route) => {
  const matches = vercelPattern.test(route);
  console.log(`${matches ? "✅" : "❌"} ${route}`);

  if (!matches) {
    // Analizar caracteres problemáticos
    const chars = route.split("");
    const problematicChars = chars.filter((char) => !vercelPattern.test(char));
    console.log(`   Caracteres problemáticos: ${problematicChars.join(", ")}`);
  }
});

// Buscar archivos con rutas dinámicas
console.log("\n🔍 Buscando archivos con rutas dinámicas:");
console.log("==========================================");

function findDynamicRoutes(dir, basePath = "") {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      if (item.includes("[") && item.includes("]")) {
        const routePath = basePath + "/" + item;
        const matches = vercelPattern.test(routePath);
        console.log(`${matches ? "✅" : "❌"} ${routePath}`);

        if (!matches) {
          const chars = routePath.split("");
          const problematicChars = chars.filter(
            (char) => !vercelPattern.test(char)
          );
          console.log(
            `   Caracteres problemáticos: ${problematicChars.join(", ")}`
          );
        }
      }

      findDynamicRoutes(fullPath, basePath + "/" + item);
    }
  });
}

try {
  findDynamicRoutes("src/app");
} catch (error) {
  console.log("Error al buscar rutas dinámicas:", error.message);
}

// Verificar si hay caracteres especiales en nombres de archivos
console.log("\n🔍 Verificando caracteres especiales en archivos:");
console.log("============================================");

function checkSpecialChars(dir, basePath = "") {
  const items = fs.readdirSync(dir);

  items.forEach((item) => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Verificar si el nombre del directorio tiene caracteres problemáticos
      const matches = vercelPattern.test(item);
      if (!matches) {
        console.log(`❌ Directorio problemático: ${basePath}/${item}`);
        const chars = item.split("");
        const problematicChars = chars.filter(
          (char) => !vercelPattern.test(char)
        );
        console.log(
          `   Caracteres problemáticos: ${problematicChars.join(", ")}`
        );
      }

      checkSpecialChars(fullPath, basePath + "/" + item);
    }
  });
}

try {
  checkSpecialChars("src/app");
} catch (error) {
  console.log("Error al verificar caracteres especiales:", error.message);
}
