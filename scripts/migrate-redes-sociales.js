const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function migrateRedesSociales() {
  try {
    console.log("🔄 Migrando redes sociales del studio demo...");

    // Buscar el studio demo
    const studio = await prisma.projects.findUnique({
      where: { slug: "demo-studio" },
      select: { id: true, name: true },
    });

    if (!studio) {
      console.log("❌ Studio demo-studio no encontrado");
      return;
    }

    console.log(`✅ Studio encontrado: ${studio.name} (${studio.id})`);

    // Eliminar redes sociales existentes (si las hay)
    const redesExistentes = await prisma.project_redes_sociales.findMany({
      where: { projectId: studio.id },
    });

    if (redesExistentes.length > 0) {
      console.log(
        `🗑️  Eliminando ${redesExistentes.length} redes sociales existentes...`
      );
      await prisma.project_redes_sociales.deleteMany({
        where: { projectId: studio.id },
      });
    }

    // Obtener las plataformas disponibles
    const plataformas =
      await prisma.platform_plataformas_redes_sociales.findMany({
        where: { isActive: true },
      });

    console.log(`📱 Plataformas disponibles: ${plataformas.length}`);

    // Crear redes sociales de ejemplo
    const redesSociales = [
      {
        plataformaSlug: "facebook",
        url: "https://facebook.com/studiodemo",
        activo: true,
      },
      {
        plataformaSlug: "instagram",
        url: "https://instagram.com/studiodemo",
        activo: true,
      },
    ];

    let creadas = 0;
    for (const red of redesSociales) {
      const plataforma = plataformas.find((p) => p.slug === red.plataformaSlug);
      if (plataforma) {
        await prisma.project_redes_sociales.create({
          data: {
            projectId: studio.id,
            plataformaId: plataforma.id,
            url: red.url,
            activo: red.activo,
          },
        });
        console.log(`   ✅ ${plataforma.nombre}: ${red.url}`);
        creadas++;
      } else {
        console.log(`   ⚠️  Plataforma ${red.plataformaSlug} no encontrada`);
      }
    }

    console.log(`\n🎉 Migración completada: ${creadas} redes sociales creadas`);

    // Verificar resultado
    const redesFinales = await prisma.project_redes_sociales.findMany({
      where: { projectId: studio.id },
      include: {
        plataforma: true,
      },
    });

    console.log(`📊 Redes sociales del studio:`);
    redesFinales.forEach((red) => {
      console.log(
        `   - ${red.plataforma.nombre}: ${red.url} (${red.activo ? "Activa" : "Inactiva"})`
      );
    });
  } catch (error) {
    console.error("❌ Error en migración:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
migrateRedesSociales()
  .then(() => {
    console.log("\n✅ Script completado exitosamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error en el script:", error);
    process.exit(1);
  });
