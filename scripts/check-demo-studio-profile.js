const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkDemoStudioProfile() {
  try {
    console.log("🔍 Verificando perfil de demo-studio...\n");

    // 1. Buscar el proyecto demo-studio
    console.log("1. Buscando proyecto demo-studio...");
    const proyecto = await prisma.projects.findUnique({
      where: { slug: "demo-studio" },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        phone: true,
        createdAt: true,
      },
    });

    if (!proyecto) {
      console.log("❌ No se encontró el proyecto demo-studio");
      return;
    }

    console.log("✅ Proyecto encontrado:");
    console.log(`   ID: ${proyecto.id}`);
    console.log(`   Nombre: ${proyecto.name}`);
    console.log(`   Slug: ${proyecto.slug}`);
    console.log(`   Email: ${proyecto.email}`);
    console.log(`   Teléfono: ${proyecto.phone}`);
    console.log(`   Creado: ${proyecto.createdAt}\n`);

    // 2. Buscar el lead asociado al proyecto
    console.log("2. Buscando lead asociado al proyecto...");
    const lead = await prisma.platform_leads.findFirst({
      where: { studioId: proyecto.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        studioName: true,
        studioSlug: true,
        lastContactDate: true,
        interestedPlan: true,
        monthlyBudget: true,
        probableStartDate: true,
        agentId: true,
        score: true,
        priority: true,
        conversionDate: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!lead) {
      console.log("❌ No se encontró un lead asociado al proyecto demo-studio");
      console.log(
        "   Esto significa que no hay perfil de usuario configurado."
      );
      return;
    }

    console.log("✅ Lead encontrado:");
    console.log(`   ID: ${lead.id}`);
    console.log(`   Nombre: ${lead.name}`);
    console.log(`   Email: ${lead.email}`);
    console.log(`   Teléfono: ${lead.phone}`);
    console.log(`   Estudio: ${lead.studioName || "No configurado"}`);
    console.log(`   Slug del Estudio: ${lead.studioSlug || "No configurado"}`);
    console.log(
      `   Último Contacto: ${lead.lastContactDate || "No registrado"}`
    );
    console.log(
      `   Plan de Interés: ${lead.interestedPlan || "No especificado"}`
    );
    console.log(
      `   Presupuesto Mensual: ${lead.monthlyBudget ? `$${lead.monthlyBudget}` : "No especificado"}`
    );
    console.log(
      `   Fecha Probable de Inicio: ${lead.probableStartDate || "No especificada"}`
    );
    console.log(`   Agente ID: ${lead.agentId || "No asignado"}`);
    console.log(`   Puntuación: ${lead.score || "No evaluado"}`);
    console.log(`   Prioridad: ${lead.priority}`);
    console.log(
      `   Fecha de Conversión: ${lead.conversionDate || "No convertido"}`
    );
    console.log(`   Creado: ${lead.createdAt}`);
    console.log(`   Actualizado: ${lead.updatedAt}\n`);

    // 3. Verificar si hay otros leads con el mismo email
    console.log("3. Verificando si hay otros leads con el mismo email...");
    const leadsDuplicados = await prisma.platform_leads.findMany({
      where: {
        email: lead.email,
        id: { not: lead.id },
      },
      select: {
        id: true,
        name: true,
        studioId: true,
        createdAt: true,
      },
    });

    if (leadsDuplicados.length > 0) {
      console.log("⚠️  Se encontraron otros leads con el mismo email:");
      leadsDuplicados.forEach((duplicado) => {
        console.log(
          `   - ID: ${duplicado.id}, Nombre: ${duplicado.name}, Studio ID: ${duplicado.studioId || "Sin estudio"}`
        );
      });
    } else {
      console.log("✅ No hay otros leads con el mismo email");
    }

    // 4. Verificar la relación completa
    console.log("\n4. Verificando relación completa...");
    const relacionCompleta = await prisma.projects.findUnique({
      where: { id: proyecto.id },
      include: {
        platform_leads: true,
      },
    });

    if (relacionCompleta?.platform_leads) {
      console.log("✅ Relación 1:1 confirmada entre proyecto y lead");
    } else {
      console.log("❌ No se pudo confirmar la relación");
    }

    console.log("\n🎯 RESUMEN:");
    console.log(`   - Proyecto: ${proyecto.name} (${proyecto.slug})`);
    console.log(`   - Lead: ${lead.name} (${lead.email})`);
    console.log(
      `   - Estado: ${lead.conversionDate ? "Convertido" : "No convertido"}`
    );
    console.log(`   - Perfil disponible: ${lead.name ? "Sí" : "No"}`);
  } catch (error) {
    console.error("❌ Error al verificar perfil:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDemoStudioProfile();
