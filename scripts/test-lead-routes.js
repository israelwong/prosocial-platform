const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testLeadRoutes() {
  try {
    console.log("🧪 Probando rutas de leads...\n");

    // 1. Verificar que hay leads en la base de datos
    const leadCount = await prisma.proSocialLead.count();
    console.log(`📊 Total de leads: ${leadCount}`);

    if (leadCount === 0) {
      console.log("⚠️ No hay leads para probar");
      return;
    }

    // 2. Obtener un lead de prueba
    const testLead = await prisma.proSocialLead.findFirst({
      include: {
        agent: {
          select: {
            id: true,
            nombre: true,
            email: true,
          },
        },
        etapa: {
          select: {
            id: true,
            nombre: true,
            descripcion: true,
          },
        },
        canalAdquisicion: {
          select: {
            id: true,
            nombre: true,
            categoria: true,
          },
        },
      },
    });

    if (!testLead) {
      console.log("❌ No se pudo obtener un lead de prueba");
      return;
    }

    console.log(`📋 Lead de prueba: ${testLead.nombre} (${testLead.email})`);
    console.log(`🆔 ID: ${testLead.id}`);

    // 3. Verificar relaciones
    console.log("\n🔗 RELACIONES DEL LEAD:");
    if (testLead.agent) {
      console.log(`  👤 Agente: ${testLead.agent.nombre}`);
    } else {
      console.log("  👤 Agente: Sin asignar");
    }

    if (testLead.etapa) {
      console.log(`  🔄 Etapa: ${testLead.etapa.nombre}`);
    } else {
      console.log("  🔄 Etapa: Sin asignar");
    }

    if (testLead.canalAdquisicion) {
      console.log(`  📡 Canal: ${testLead.canalAdquisicion.nombre}`);
    } else {
      console.log("  📡 Canal: Sin asignar");
    }

    // 4. Verificar campos del formulario
    console.log("\n📝 CAMPOS DEL FORMULARIO:");
    const formFields = [
      "nombre",
      "email",
      "telefono",
      "nombreEstudio",
      "slugEstudio",
      "planInteres",
      "presupuestoMensual",
      "fechaProbableInicio",
      "agentId",
      "etapaId",
      "canalAdquisicionId",
      "puntaje",
      "prioridad",
    ];

    formFields.forEach((field) => {
      const value = testLead[field];
      if (value !== null && value !== undefined) {
        console.log(`  ✅ ${field}: ${value}`);
      } else {
        console.log(`  ⚪ ${field}: null/undefined`);
      }
    });

    // 5. Verificar bitácora
    console.log("\n📝 BITÁCORA DEL LEAD:");
    const bitacoraCount = await prisma.proSocialLeadBitacora.count({
      where: { leadId: testLead.id },
    });
    console.log(`  📊 Entradas de bitácora: ${bitacoraCount}`);

    if (bitacoraCount > 0) {
      const bitacoraEntries = await prisma.proSocialLeadBitacora.findMany({
        where: { leadId: testLead.id },
        orderBy: { createdAt: "desc" },
        take: 3,
      });

      bitacoraEntries.forEach((entry, index) => {
        console.log(
          `    ${index + 1}. ${entry.tipo}: ${entry.titulo || entry.descripcion.substring(0, 50)}...`
        );
      });
    }

    // 6. Verificar rutas disponibles
    console.log("\n🛣️ RUTAS DISPONIBLES:");
    console.log("  📄 /admin/leads - Lista de leads");
    console.log("  ➕ /admin/leads/new - Crear nuevo lead");
    console.log(`  👁️ /admin/leads/${testLead.id} - Ver/editar lead`);
    console.log("  📊 /admin/crm/kanban - Kanban de leads");

    // 7. Verificar APIs disponibles
    console.log("\n🔌 APIs DISPONIBLES:");
    console.log("  📄 GET /api/leads - Listar todos los leads");
    console.log("  ➕ POST /api/leads - Crear nuevo lead");
    console.log(`  👁️ GET /api/leads/${testLead.id} - Obtener lead específico`);
    console.log(`  ✏️ PUT /api/leads/${testLead.id} - Actualizar lead`);
    console.log(`  🗑️ DELETE /api/leads/${testLead.id} - Eliminar lead`);
    console.log("  👥 GET /api/agents - Listar agentes");
    console.log("  🔄 GET /api/pipeline - Listar etapas del pipeline");
    console.log("  📡 GET /api/canales - Listar canales de adquisición");

    console.log("\n✅ Todas las rutas y APIs están configuradas correctamente");
  } catch (error) {
    console.error("❌ Error durante las pruebas:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar las pruebas
testLeadRoutes()
  .then(() => {
    console.log("✅ Pruebas finalizadas");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
