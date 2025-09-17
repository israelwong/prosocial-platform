const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function verifyCategoriesSetup() {
  try {
    console.log("🔍 Verificando configuración de categorías...");

    // Verificar categorías
    const categories = await prisma.service_categories.findMany({
      orderBy: { posicion: "asc" },
    });

    console.log(`📋 Categorías encontradas: ${categories.length}`);
    categories.forEach((category, index) => {
      console.log(
        `  ${index + 1}. ${category.name} (Posición: ${category.posicion}, Activa: ${category.active})`
      );
    });

    // Verificar servicios
    const services = await prisma.platform_services.findMany({
      include: {
        category: true,
      },
      orderBy: [
        { category: { posicion: "asc" } },
        { posicion: "asc" },
      ],
    });

    console.log(`\n📋 Servicios encontrados: ${services.length}`);

    // Agrupar servicios por categoría
    const servicesByCategory = {};
    const servicesWithoutCategory = [];

    services.forEach((service) => {
      if (service.category) {
        if (!servicesByCategory[service.category.name]) {
          servicesByCategory[service.category.name] = [];
        }
        servicesByCategory[service.category.name].push(service);
      } else {
        servicesWithoutCategory.push(service);
      }
    });

    // Mostrar servicios por categoría
    Object.entries(servicesByCategory).forEach(([categoryName, categoryServices]) => {
      console.log(`\n📁 ${categoryName}:`);
      categoryServices.forEach((service, index) => {
        console.log(
          `  ${index + 1}. ${service.name} (Posición: ${service.posicion}, Activo: ${service.active})`
        );
      });
    });

    // Mostrar servicios sin categoría
    if (servicesWithoutCategory.length > 0) {
      console.log(`\n⚠️  Servicios sin categoría: ${servicesWithoutCategory.length}`);
      servicesWithoutCategory.forEach((service, index) => {
        console.log(
          `  ${index + 1}. ${service.name} (Posición: ${service.posicion}, Activo: ${service.active})`
        );
      });
    }

    console.log("\n✅ Verificación completada");
  } catch (error) {
    console.error("❌ Error en la verificación:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la verificación
verifyCategoriesSetup()
  .then(() => {
    console.log("✅ Verificación exitosa");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en la verificación:", error);
    process.exit(1);
  });
