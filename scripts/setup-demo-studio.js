const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function setupDemoStudio() {
  try {
    console.log("🔍 Verificando si existe el studio demo-studio...");

    // Verificar si existe el studio demo-studio
    const existingStudio = await prisma.projects.findUnique({
      where: { slug: "demo-studio" },
      include: {
        plans: true,
        _count: {
          select: {
            telefonos: true,
            horarios_atencion: true,
            redes_sociales: true,
          },
        },
      },
    });

    if (existingStudio) {
      console.log("✅ Studio demo-studio ya existe:");
      console.log(`   - ID: ${existingStudio.id}`);
      console.log(`   - Nombre: ${existingStudio.name}`);
      console.log(`   - Slug: ${existingStudio.slug}`);
      console.log(`   - Email: ${existingStudio.email}`);
      console.log(`   - Plan: ${existingStudio.plans?.name || "Sin plan"}`);
      console.log(`   - Teléfonos: ${existingStudio._count.telefonos}`);
      console.log(`   - Horarios: ${existingStudio._count.horarios_atencion}`);
      console.log(
        `   - Redes sociales: ${existingStudio._count.redes_sociales}`
      );
      console.log(`   - Activo: ${existingStudio.active}`);
      return existingStudio;
    }

    console.log("❌ Studio demo-studio no existe. Creándolo...");

    // Buscar un plan básico para asignar
    const planBasico = await prisma.platform_plans.findFirst({
      where: {
        OR: [
          { slug: "basico" },
          { slug: "starter" },
          { name: { contains: "Básico", mode: "insensitive" } },
        ],
      },
    });

    if (!planBasico) {
      console.log(
        "⚠️  No se encontró un plan básico. Creando studio sin plan..."
      );
    }

    // Crear el studio demo
    const demoStudio = await prisma.projects.create({
      data: {
        name: "Studio Demo",
        slug: "demo-studio",
        email: "demo@studiodemo.com",
        phone: "+52 55 1234 5678",
        address: "Av. Principal 123, Col. Centro, Ciudad, CP 12345",
        website: "https://www.studiodemo.com",
        slogan: "Capturando momentos únicos",
        descripcion:
          "Estudio de fotografía especializado en bodas, eventos y sesiones de retrato. Más de 10 años de experiencia creando recuerdos inolvidables.",
        palabras_clave: JSON.stringify([
          "fotografía",
          "bodas",
          "eventos",
          "retratos",
          "estudio",
        ]),
        planId: planBasico?.id || null,
        subscriptionStatus: "trial",
        subscriptionStart: new Date(),
        commissionRate: 0.3,
        active: true,
        updatedAt: new Date(),
      },
      include: {
        plans: true,
      },
    });

    console.log("✅ Studio demo-studio creado exitosamente:");
    console.log(`   - ID: ${demoStudio.id}`);
    console.log(`   - Nombre: ${demoStudio.name}`);
    console.log(`   - Slug: ${demoStudio.slug}`);
    console.log(`   - Email: ${demoStudio.email}`);
    console.log(`   - Plan: ${demoStudio.plans?.name || "Sin plan"}`);

    // Crear datos de ejemplo para redes sociales
    console.log("📱 Creando redes sociales de ejemplo...");

    // Obtener las plataformas disponibles
    const plataformas =
      await prisma.platform_plataformas_redes_sociales.findMany({
        where: { isActive: true },
      });

    const redesSociales = [
      {
        projectId: demoStudio.id,
        plataformaSlug: "facebook",
        url: "https://facebook.com/studiodemo",
        activo: true,
      },
      {
        projectId: demoStudio.id,
        plataformaSlug: "instagram",
        url: "https://instagram.com/studiodemo",
        activo: true,
      },
    ];

    for (const red of redesSociales) {
      const plataforma = plataformas.find((p) => p.slug === red.plataformaSlug);
      if (plataforma) {
        await prisma.project_redes_sociales.create({
          data: {
            projectId: red.projectId,
            plataformaId: plataforma.id,
            url: red.url,
            activo: red.activo,
          },
        });
      }
    }

    console.log("✅ Redes sociales creadas:", redesSociales.length);

    // Crear teléfonos de ejemplo
    console.log("📞 Creando teléfonos de ejemplo...");

    const telefonos = [
      {
        projectId: demoStudio.id,
        numero: "+52 55 1234 5678",
        tipo: "principal",
        activo: true,
      },
      {
        projectId: demoStudio.id,
        numero: "+52 55 9876 5432",
        tipo: "whatsapp",
        activo: true,
      },
    ];

    for (const telefono of telefonos) {
      await prisma.project_telefonos.create({
        data: telefono,
      });
    }

    console.log("✅ Teléfonos creados:", telefonos.length);

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
          projectId: demoStudio.id,
          ...horario,
        },
      });
    }

    console.log("✅ Horarios creados:", horarios.length);

    console.log("\n🎉 Setup completo del studio demo-studio!");
    console.log("📊 Resumen:");
    console.log(`   - Studio: ${demoStudio.name} (${demoStudio.slug})`);
    console.log(`   - Redes sociales: ${redesSociales.length}`);
    console.log(`   - Teléfonos: ${telefonos.length}`);
    console.log(`   - Horarios: ${horarios.length}`);

    return demoStudio;
  } catch (error) {
    console.error("❌ Error en setup del studio demo:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
setupDemoStudio()
  .then(() => {
    console.log("\n✅ Script completado exitosamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error en el script:", error);
    process.exit(1);
  });
