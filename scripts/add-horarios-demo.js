const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function addHorariosDemo() {
  try {
    console.log("🔍 Buscando studio demo-studio...");

    const studio = await prisma.projects.findUnique({
      where: { slug: "demo-studio" },
      select: { id: true, name: true },
    });

    if (!studio) {
      console.log("❌ Studio demo-studio no encontrado");
      return;
    }

    console.log(`✅ Studio encontrado: ${studio.name} (${studio.id})`);

    // Verificar horarios existentes
    const horariosExistentes = await prisma.project_horarios_atencion.findMany({
      where: { projectId: studio.id },
    });

    console.log(`📊 Horarios existentes: ${horariosExistentes.length}`);

    if (horariosExistentes.length > 0) {
      console.log("⚠️  Ya existen horarios. Eliminando existentes...");
      await prisma.project_horarios_atencion.deleteMany({
        where: { projectId: studio.id },
      });
    }

    // Crear horarios de ejemplo
    console.log("🕐 Creando horarios de ejemplo...");

    const horarios = [
      {
        dia_semana: "lunes",
        hora_inicio: "09:00",
        hora_fin: "18:00",
        activo: true,
      },
      {
        dia_semana: "martes",
        hora_inicio: "09:00",
        hora_fin: "18:00",
        activo: true,
      },
      {
        dia_semana: "miercoles",
        hora_inicio: "09:00",
        hora_fin: "18:00",
        activo: true,
      },
      {
        dia_semana: "jueves",
        hora_inicio: "09:00",
        hora_fin: "18:00",
        activo: true,
      },
      {
        dia_semana: "viernes",
        hora_inicio: "09:00",
        hora_fin: "18:00",
        activo: true,
      },
      {
        dia_semana: "sabado",
        hora_inicio: "10:00",
        hora_fin: "16:00",
        activo: true,
      },
      {
        dia_semana: "domingo",
        hora_inicio: "10:00",
        hora_fin: "14:00",
        activo: false,
      },
    ];

    for (const horario of horarios) {
      await prisma.project_horarios_atencion.create({
        data: {
          projectId: studio.id,
          ...horario,
        },
      });
      console.log(
        `   ✅ ${horario.dia_semana}: ${horario.hora_inicio} - ${horario.hora_fin} (${horario.activo ? "Activo" : "Inactivo"})`
      );
    }

    console.log(`\n🎉 Horarios creados exitosamente: ${horarios.length}`);
  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
addHorariosDemo()
  .then(() => {
    console.log("\n✅ Script completado exitosamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error en el script:", error);
    process.exit(1);
  });
