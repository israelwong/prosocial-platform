const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
  errorFormat: "pretty",
});

async function createDemoStudioLead() {
  try {
    console.log("🔍 Creando lead para demo-studio...\n");

    // 1. Verificar que el proyecto existe
    console.log("1. Verificando proyecto demo-studio...");
    const proyecto = await prisma.projects.findUnique({
      where: { slug: "demo-studio" },
      select: { id: true, name: true, slug: true },
    });

    if (!proyecto) {
      console.log("❌ No se encontró el proyecto demo-studio");
      return;
    }

    console.log("✅ Proyecto encontrado:", proyecto.name);

    // 2. Verificar si ya existe un lead asociado
    console.log("\n2. Verificando si ya existe un lead asociado...");
    const leadExistente = await prisma.platform_leads.findFirst({
      where: { studioId: proyecto.id },
    });

    if (leadExistente) {
      console.log("⚠️  Ya existe un lead asociado al proyecto:");
      console.log(`   ID: ${leadExistente.id}`);
      console.log(`   Nombre: ${leadExistente.name}`);
      console.log(`   Email: ${leadExistente.email}`);
      return;
    }

    // 3. Crear el lead asociado al proyecto
    console.log("\n3. Creando lead asociado al proyecto...");
    const nuevoLead = await prisma.platform_leads.create({
      data: {
        name: "Juan Carlos Pérez",
        email: "juan.perez@demo-studio.com",
        phone: "+52 55 1234 5678",
        studioName: "Demo Studio Pro",
        studioSlug: "demo-studio",
        studioId: proyecto.id,
        lastContactDate: new Date(),
        interestedPlan: "Professional",
        monthlyBudget: 50000,
        probableStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días desde ahora
        agentId: null,
        score: 85,
        priority: "high",
        conversionDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("✅ Lead creado exitosamente:");
    console.log(`   ID: ${nuevoLead.id}`);
    console.log(`   Nombre: ${nuevoLead.name}`);
    console.log(`   Email: ${nuevoLead.email}`);
    console.log(`   Teléfono: ${nuevoLead.phone}`);
    console.log(`   Estudio: ${nuevoLead.studioName}`);
    console.log(`   Slug: ${nuevoLead.studioSlug}`);
    console.log(`   Studio ID: ${nuevoLead.studioId}`);
    console.log(`   Plan: ${nuevoLead.interestedPlan}`);
    console.log(`   Presupuesto: $${nuevoLead.monthlyBudget}`);
    console.log(`   Puntuación: ${nuevoLead.score}`);
    console.log(`   Prioridad: ${nuevoLead.priority}`);
    console.log(`   Convertido: ${nuevoLead.conversionDate ? "Sí" : "No"}`);

    // 4. Verificar la relación
    console.log("\n4. Verificando relación...");
    const relacionVerificada = await prisma.projects.findUnique({
      where: { id: proyecto.id },
      include: {
        platform_leads: true,
      },
    });

    if (relacionVerificada?.platform_leads) {
      console.log("✅ Relación 1:1 confirmada");
      console.log(`   Proyecto: ${relacionVerificada.name}`);
      console.log(`   Lead: ${relacionVerificada.platform_leads.name}`);
    } else {
      console.log("❌ No se pudo verificar la relación");
    }

    console.log("\n🎯 RESUMEN:");
    console.log("   - Lead creado exitosamente");
    console.log("   - Relación 1:1 establecida");
    console.log("   - Perfil de usuario disponible");
    console.log("   - Listo para probar la funcionalidad del perfil");
  } catch (error) {
    console.error("❌ Error al crear lead:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createDemoStudioLead();
