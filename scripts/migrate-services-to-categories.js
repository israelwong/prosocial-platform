const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function migrateServicesToCategories() {
  try {
    console.log("🔄 Iniciando migración de servicios a categorías...");

    // Primero, crear las categorías si no existen
    const categories = [
      {
        name: "Gestión de Clientes y Leads",
        description:
          "Unifica toda la información de tus clientes y prospectos para un seguimiento eficiente y una visión completa de tus interacciones comerciales.",
        icon: "Users",
        posicion: 1,
      },
      {
        name: "Ventas y Cotizaciones",
        description:
          "Genera propuestas detalladas con secciones, categorías, control de versiones y gestión de expiración para proyectar profesionalismo y controlar tus ofertas.",
        icon: "DollarSign",
        posicion: 2,
      },
      {
        name: "Gestión de Proyectos y Operaciones",
        description:
          "Organiza y visualiza todas las etapas y fechas clave de tus proyectos en una agenda integrada, con recordatorios y flujos de trabajo automatizados.",
        icon: "Calendar",
        posicion: 3,
      },
      {
        name: "Comunicación y Experiencia del Cliente",
        description:
          "Mantén a tu equipo y clientes informados con alertas y recordatorios relevantes a través de múltiples canales de comunicación.",
        icon: "MessageSquare",
        posicion: 4,
      },
      {
        name: "Personalización y Marca",
        description:
          "Personaliza la plataforma con el logo, marca, horarios de operación y enlaces a redes sociales de tu negocio, proyectando una imagen profesional.",
        icon: "Palette",
        posicion: 5,
      },
      {
        name: "Infraestructura y Soporte",
        description:
          "Disfruta de un espacio de almacenamiento dedicado, integraciones abiertas y soporte técnico especializado para asegurar la operación continua.",
        icon: "Server",
        posicion: 6,
      },
    ];

    console.log("📋 Creando categorías...");
    const createdCategories = [];

    for (const categoryData of categories) {
      const existingCategory = await prisma.service_categories.findUnique({
        where: { name: categoryData.name },
      });

      if (existingCategory) {
        console.log(`⚠️  Categoría "${categoryData.name}" ya existe`);
        createdCategories.push(existingCategory);
      } else {
        const category = await prisma.service_categories.create({
          data: categoryData,
        });
        console.log(
          `✅ Categoría "${category.name}" creada (ID: ${category.id})`
        );
        createdCategories.push(category);
      }
    }

    // Obtener la categoría por defecto (primera categoría)
    const defaultCategory = createdCategories[0];
    console.log(
      `📌 Usando categoría por defecto: "${defaultCategory.name}" (ID: ${defaultCategory.id})`
    );

    // Obtener todos los servicios existentes
    const existingServices = await prisma.platform_services.findMany({
      orderBy: { createdAt: "asc" },
    });

    console.log(
      `📋 Encontrados ${existingServices.length} servicios para migrar`
    );

    // Asignar todos los servicios a la categoría por defecto
    for (const service of existingServices) {
      await prisma.platform_services.update({
        where: { id: service.id },
        data: { categoryId: defaultCategory.id },
      });
      console.log(
        `✅ Servicio "${service.name}" asignado a categoría "${defaultCategory.name}"`
      );
    }

    console.log("\n🎉 Migración completada exitosamente");
    console.log(`📊 Resumen:`);
    console.log(`  - Categorías creadas: ${createdCategories.length}`);
    console.log(`  - Servicios migrados: ${existingServices.length}`);
    console.log(`  - Categoría por defecto: "${defaultCategory.name}"`);
  } catch (error) {
    console.error("❌ Error en la migración:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la migración
migrateServicesToCategories()
  .then(() => {
    console.log("✅ Migración completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en la migración:", error);
    process.exit(1);
  });
