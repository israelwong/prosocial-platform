const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function seedServiceCategories() {
  try {
    console.log("🌱 Iniciando seed de categorías de servicios...");

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

    console.log(`📋 Creando ${categories.length} categorías de servicios...`);

    for (const categoryData of categories) {
      const existingCategory = await prisma.service_categories.findUnique({
        where: { name: categoryData.name },
      });

      if (existingCategory) {
        console.log(
          `⚠️  Categoría "${categoryData.name}" ya existe, actualizando...`
        );
        await prisma.service_categories.update({
          where: { id: existingCategory.id },
          data: {
            description: categoryData.description,
            icon: categoryData.icon,
            posicion: categoryData.posicion,
            active: true,
          },
        });
        console.log(`✅ Categoría "${categoryData.name}" actualizada`);
      } else {
        const category = await prisma.service_categories.create({
          data: categoryData,
        });
        console.log(
          `✅ Categoría "${category.name}" creada (ID: ${category.id})`
        );
      }
    }

    // Verificar las categorías creadas
    const allCategories = await prisma.service_categories.findMany({
      orderBy: { posicion: "asc" },
      select: { id: true, name: true, posicion: true, active: true },
    });

    console.log("\n📊 Categorías de servicios creadas:");
    allCategories.forEach((category, index) => {
      console.log(
        `  ${index + 1}. ${category.name} (Posición: ${category.posicion}, Activa: ${category.active})`
      );
    });

    console.log("\n🎉 Seed de categorías de servicios completado exitosamente");
  } catch (error) {
    console.error("❌ Error en el seed de categorías de servicios:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el seed
seedServiceCategories()
  .then(() => {
    console.log("✅ Seed completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error en el seed:", error);
    process.exit(1);
  });
