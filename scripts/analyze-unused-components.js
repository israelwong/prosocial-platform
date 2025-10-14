const fs = require("fs");
const path = require("path");

// Componentes en la carpeta de catálogo
const catalogComponents = [
  "CatalogoList",
  "CatalogoSkeleton",
  "CategoriaCard",
  "CategoriasModal",
  "DeleteConfirmModal",
  "SearchBar",
  "SeccionCard",
  "SeccionesModal",
  "ServicioCard",
  "ServicioForm",
];

// Función para buscar importaciones en archivos
function findImportsInFile(filePath, componentName) {
  try {
    const content = fs.readFileSync(filePath, "utf8");
    const importPattern = new RegExp(`import.*${componentName}.*from`, "g");
    const usagePattern = new RegExp(`<${componentName}[\\s>]`, "g");

    const imports = content.match(importPattern) || [];
    const usages = content.match(usagePattern) || [];

    return {
      imports: imports.length,
      usages: usages.length,
      hasImport: imports.length > 0,
      hasUsage: usages.length > 0,
    };
  } catch (error) {
    return { imports: 0, usages: 0, hasImport: false, hasUsage: false };
  }
}

// Función para buscar en directorio recursivamente
function searchInDirectory(dirPath, componentName) {
  const results = [];

  function searchRecursive(currentPath) {
    try {
      const items = fs.readdirSync(currentPath);

      for (const item of items) {
        const fullPath = path.join(currentPath, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
          // Saltar node_modules y .next
          if (!item.startsWith(".") && item !== "node_modules") {
            searchRecursive(fullPath);
          }
        } else if (item.endsWith(".tsx") || item.endsWith(".ts")) {
          const result = findImportsInFile(fullPath, componentName);
          if (result.hasImport || result.hasUsage) {
            results.push({
              file: fullPath,
              ...result,
            });
          }
        }
      }
    } catch (error) {
      // Ignorar errores de acceso
    }
  }

  searchRecursive(dirPath);
  return results;
}

// Analizar cada componente
console.log("🔍 Analizando uso de componentes de catálogo...\n");

const srcPath = path.join(__dirname, "src");
const results = {};

for (const component of catalogComponents) {
  console.log(`\n📋 Analizando ${component}:`);

  const usages = searchInDirectory(srcPath, component);

  // Filtrar solo archivos de la versión actual (no migrate)
  const currentUsages = usages.filter(
    (usage) =>
      !usage.file.includes("migrate/") && !usage.file.includes("node_modules")
  );

  results[component] = {
    totalUsages: currentUsages.length,
    usages: currentUsages,
  };

  if (currentUsages.length === 0) {
    console.log(`  ❌ NO SE USA - Puede eliminarse`);
  } else {
    console.log(`  ✅ Se usa en ${currentUsages.length} archivo(s):`);
    currentUsages.forEach((usage) => {
      const relativePath = path.relative(__dirname, usage.file);
      console.log(
        `    - ${relativePath} (imports: ${usage.imports}, usages: ${usage.usages})`
      );
    });
  }
}

// Resumen
console.log("\n📊 RESUMEN:");
console.log("===========");

const unusedComponents = [];
const usedComponents = [];

for (const [component, data] of Object.entries(results)) {
  if (data.totalUsages === 0) {
    unusedComponents.push(component);
  } else {
    usedComponents.push(component);
  }
}

console.log(`\n✅ Componentes EN USO (${usedComponents.length}):`);
usedComponents.forEach((comp) => console.log(`  - ${comp}`));

console.log(`\n❌ Componentes NO USADOS (${unusedComponents.length}):`);
unusedComponents.forEach((comp) => console.log(`  - ${comp}`));

if (unusedComponents.length > 0) {
  console.log("\n🗑️  COMPONENTES QUE SE PUEDEN ELIMINAR:");
  unusedComponents.forEach((comp) => {
    console.log(
      `  rm src/app/[slug]/studio/configuracion/catalogo/components/${comp}.tsx`
    );
  });
}
