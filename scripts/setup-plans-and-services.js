const { exec } = require("child_process");
const path = require("path");

async function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n🚀 Ejecutando: ${scriptPath}`);
    console.log("=".repeat(60));

    const child = exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`❌ Error ejecutando ${scriptPath}:`, error);
        reject(error);
        return;
      }

      if (stderr) {
        console.error(`⚠️  Warnings en ${scriptPath}:`, stderr);
      }

      console.log(stdout);
      resolve();
    });

    // Mostrar output en tiempo real
    child.stdout.on("data", (data) => {
      process.stdout.write(data);
    });

    child.stderr.on("data", (data) => {
      process.stderr.write(data);
    });
  });
}

async function setupPlansAndServices() {
  try {
    console.log("🎯 Iniciando configuración completa de planes y servicios");
    console.log("📋 Este proceso incluye:");
    console.log("   1. Limpieza y recreación de categorías y servicios");
    console.log("   2. Limpieza y recreación de planes con precios");
    console.log("   3. Configuración de relaciones plan-servicio");

    const scriptsDir = __dirname;

    // Paso 1: Limpiar y recrear servicios
    await runScript(path.join(scriptsDir, "cleanup-and-recreate-services.js"));

    // Paso 2: Limpiar y recrear planes
    await runScript(path.join(scriptsDir, "cleanup-and-recreate-plans.js"));

    console.log("\n🎉 ¡Configuración completa finalizada exitosamente!");
    console.log("\n📊 Resumen de lo que se ha configurado:");
    console.log("   ✅ Categorías de servicios organizadas por funcionalidad");
    console.log("   ✅ Servicios específicos para cada categoría");
    console.log("   ✅ Plan Personal: $399/mes, $3999/año");
    console.log("   ✅ Plan Pro: $599/mes, $5999/año (Popular)");
    console.log("   ✅ Plan Premium: $999/mes, $9999/año");
    console.log("   ✅ Relaciones plan-servicio configuradas según la tabla");

    console.log("\n🔗 Próximos pasos recomendados:");
    console.log(
      "   1. Verificar la configuración en el panel de administración"
    );
    console.log(
      "   2. Configurar productos de Stripe con los precios definidos"
    );
    console.log("   3. Probar la funcionalidad de suscripciones");
  } catch (error) {
    console.error("\n❌ Error durante la configuración:", error);
    process.exit(1);
  }
}

// Ejecutar el script maestro
setupPlansAndServices()
  .then(() => {
    console.log("\n✅ Proceso maestro completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error en proceso maestro:", error);
    process.exit(1);
  });
