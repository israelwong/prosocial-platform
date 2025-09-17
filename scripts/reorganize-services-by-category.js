const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function reorganizeServicesByCategory() {
  try {
    console.log("🔄 Reorganizando servicios por categorías...");

    // Obtener todas las categorías
    const categories = await prisma.service_categories.findMany({
      orderBy: { posicion: "asc" },
    });

    console.log(`📋 Categorías disponibles: ${categories.length}`);

    // Mapeo de servicios a categorías apropiadas
    const serviceCategoryMapping = {
      // Gestión de Clientes y Leads
      Clientes: "Gestión de Clientes y Leads",
      "Landing Pages": "Gestión de Clientes y Leads",
      "Campañas de Marketing": "Gestión de Clientes y Leads",

      // Ventas y Cotizaciones
      "Cotizaciones Activas": "Ventas y Cotizaciones",

      // Gestión de Proyectos y Operaciones
      "Proyectos Aprobados": "Gestión de Proyectos y Operaciones",
      "Eventos en Agenda": "Gestión de Proyectos y Operaciones",
      "Reportes Avanzados": "Gestión de Proyectos y Operaciones",

      // Comunicación y Experiencia del Cliente
      "Usuarios del Estudio": "Comunicación y Experiencia del Cliente",

      // Infraestructura y Soporte
      Almacenamiento: "Infraestructura y Soporte",
      Catálogos: "Infraestructura y Soporte", // Podría ir en Gestión de Clientes también
    };

    // Obtener todos los servicios
    const services = await prisma.platform_services.findMany({
      include: { category: true },
      orderBy: { createdAt: "asc" },
    });

    console.log(`📋 Servicios a reorganizar: ${services.length}`);

    // Crear un mapa de categorías por nombre
    const categoryMap = {};
    categories.forEach((category) => {
      categoryMap[category.name] = category;
    });

    // Reorganizar servicios
    const servicesByCategory = {};

    services.forEach((service) => {
      const targetCategoryName = serviceCategoryMapping[service.name];

      if (targetCategoryName && categoryMap[targetCategoryName]) {
        const targetCategory = categoryMap[targetCategoryName];

        if (!servicesByCategory[targetCategory.id]) {
          servicesByCategory[targetCategory.id] = [];
        }

        servicesByCategory[targetCategory.id].push({
          ...service,
          targetCategory,
        });

        console.log(`✅ "${service.name}" → "${targetCategoryName}"`);
      } else {
        // Servicios sin mapeo van a "Sin categoría" (null)
        if (!servicesByCategory["no-category"]) {
          servicesByCategory["no-category"] = [];
        }
        servicesByCategory["no-category"].push({
          ...service,
          targetCategory: null,
        });

        console.log(`⚠️  "${service.name}" → Sin categoría (no mapeado)`);
      }
    });

    // Actualizar servicios con nuevas categorías y posiciones
    for (const [categoryId, categoryServices] of Object.entries(
      servicesByCategory
    )) {
      console.log(
        `\n📁 Procesando categoría: ${categoryId === "no-category" ? "Sin categoría" : categoryServices[0].targetCategory.name}`
      );

      for (let i = 0; i < categoryServices.length; i++) {
        const service = categoryServices[i];
        const newPosition = i + 1; // Posiciones empiezan en 1

        await prisma.platform_services.update({
          where: { id: service.id },
          data: {
            categoryId: categoryId === "no-category" ? null : categoryId,
            posicion: newPosition,
          },
        });

        console.log(
          `  ${newPosition}. ${service.name} (Posición: ${newPosition})`
        );
      }
    }

    console.log("\n🎉 Reorganización completada exitosamente");

    // Verificar resultado
    console.log("\n📊 Verificando resultado...");
    const updatedServices = await prisma.platform_services.findMany({
      include: { category: true },
      orderBy: [{ category: { posicion: "asc" } }, { posicion: "asc" }],
    });

    const resultByCategory = {};
    updatedServices.forEach((service) => {
      const categoryName = service.category
        ? service.category.name
        : "Sin categoría";
      if (!resultByCategory[categoryName]) {
        resultByCategory[categoryName] = [];
      }
      resultByCategory[categoryName].push(service);
    });

    Object.entries(resultByCategory).forEach(
      ([categoryName, categoryServices]) => {
        console.log(`\n📁 ${categoryName}:`);
        categoryServices.forEach((service, index) => {
          console.log(
            `  ${index + 1}. ${service.name} (Posición: ${service.posicion})`
          );
        });
      }
    );
  } catch (error) {
    console.error("❌ Error en la reorganización:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la reorganización
reorganizeServicesByCategory()
  .then(() => {
    console.log("✅ Reorganización exitosa");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en la reorganización:", error);
    process.exit(1);
  });
