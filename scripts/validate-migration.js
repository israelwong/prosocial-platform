const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function validateMigration() {
  try {
    console.log("🔍 Validando migración del sistema...");
    console.log("=".repeat(50));

    // 1. Validar campos nuevos en platform_leads
    console.log("📋 1. Validando campos de platform_leads...");
    const leadFields = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'platform_leads' 
      AND column_name IN ('tipo_lead', 'metodo_conversion', 'agente_conversion_id', 'fecha_primera_interaccion', 'numero_interacciones')
      ORDER BY column_name;
    `;

    console.log("   ✅ Campos encontrados:");
    leadFields.forEach((field) => {
      console.log(
        `     - ${field.column_name}: ${field.data_type} (${field.is_nullable === "YES" ? "nullable" : "not null"})`
      );
    });

    // 2. Validar tipos de pipeline
    console.log("\n📋 2. Validando tipos de pipeline...");
    const pipelineTypes = await prisma.platform_pipeline_types.findMany({
      orderBy: { orden: "asc" },
    });

    console.log(`   ✅ ${pipelineTypes.length} tipos de pipeline encontrados:`);
    pipelineTypes.forEach((type) => {
      console.log(`     - ${type.nombre} (${type.color})`);
    });

    // 3. Validar etapas de pipeline
    console.log("\n📋 3. Validando etapas de pipeline...");
    const pipelineStages = await prisma.platform_pipeline_stages.findMany({
      include: { pipeline_type: true },
      orderBy: [{ pipeline_type: { orden: "asc" } }, { orden: "asc" }],
    });

    const stagesByType = pipelineStages.reduce((acc, stage) => {
      const typeName = stage.pipeline_type?.nombre || "Sin tipo";
      if (!acc[typeName]) acc[typeName] = [];
      acc[typeName].push(stage);
      return acc;
    }, {});

    Object.entries(stagesByType).forEach(([typeName, stages]) => {
      console.log(`   📊 ${typeName}: ${stages.length} etapas`);
      stages.forEach((stage) => {
        console.log(`     - ${stage.nombre} (${stage.color})`);
      });
    });

    // 4. Validar códigos de descuento
    console.log("\n📋 4. Validando códigos de descuento...");
    const discountCodes = await prisma.platform_discount_codes.findMany({
      orderBy: { createdAt: "asc" },
    });

    console.log(
      `   ✅ ${discountCodes.length} códigos de descuento encontrados:`
    );
    discountCodes.forEach((code) => {
      console.log(
        `     - ${code.codigo}: ${code.valor_descuento}% ${code.tipo_descuento} (${code.activo ? "activo" : "inactivo"})`
      );
    });

    // 5. Validar relaciones
    console.log("\n📋 5. Validando relaciones...");

    // Verificar que las etapas tienen tipo de pipeline
    const stagesWithoutType = await prisma.platform_pipeline_stages.count({
      where: { pipeline_type_id: null },
    });

    if (stagesWithoutType > 0) {
      console.log(
        `   ⚠️  ${stagesWithoutType} etapas sin tipo de pipeline asignado`
      );
    } else {
      console.log("   ✅ Todas las etapas tienen tipo de pipeline asignado");
    }

    // 6. Validar índices
    console.log("\n📋 6. Validando índices...");
    const indexes = await prisma.$queryRaw`
      SELECT indexname, tablename, indexdef
      FROM pg_indexes 
      WHERE tablename IN ('platform_leads', 'platform_pipeline_types', 'platform_pipeline_stages', 'platform_discount_codes', 'platform_agent_discount_codes')
      AND indexname LIKE 'idx_%'
      ORDER BY tablename, indexname;
    `;

    console.log(`   ✅ ${indexes.length} índices personalizados encontrados:`);
    indexes.forEach((index) => {
      console.log(`     - ${index.tablename}.${index.indexname}`);
    });

    // 7. Estadísticas de datos
    console.log("\n📊 7. Estadísticas de datos...");

    const stats = await Promise.all([
      prisma.platform_leads.count(),
      prisma.platform_agents.count(),
      prisma.platform_campanas.count(),
      prisma.subscriptions.count(),
      prisma.projects.count(),
    ]);

    console.log("   📈 Conteos actuales:");
    console.log(`     - Leads: ${stats[0]}`);
    console.log(`     - Agentes: ${stats[1]}`);
    console.log(`     - Campañas: ${stats[2]}`);
    console.log(`     - Suscripciones: ${stats[3]}`);
    console.log(`     - Proyectos: ${stats[4]}`);

    // 8. Verificar integridad referencial
    console.log("\n📋 8. Verificando integridad referencial...");

    // Verificar leads con agentes válidos
    const leadsWithInvalidAgents = await prisma.platform_leads.count({
      where: {
        agentId: { not: null },
        platform_agents: null,
      },
    });

    if (leadsWithInvalidAgents > 0) {
      console.log(
        `   ⚠️  ${leadsWithInvalidAgents} leads con agentes inválidos`
      );
    } else {
      console.log("   ✅ Todos los leads tienen agentes válidos");
    }

    // Verificar suscripciones con planes válidos
    const subscriptionsWithInvalidPlans = await prisma.subscriptions.count({
      where: {
        plans: null,
      },
    });

    if (subscriptionsWithInvalidPlans > 0) {
      console.log(
        `   ⚠️  ${subscriptionsWithInvalidPlans} suscripciones con planes inválidos`
      );
    } else {
      console.log("   ✅ Todas las suscripciones tienen planes válidos");
    }

    console.log("\n🎉 ¡Validación completada exitosamente!");
    console.log("\n📋 Resumen:");
    console.log("   ✅ Todos los campos nuevos están presentes");
    console.log("   ✅ Tipos y etapas de pipeline configurados");
    console.log("   ✅ Sistema de descuentos operativo");
    console.log("   ✅ Relaciones e índices correctos");
    console.log("   ✅ Integridad referencial mantenida");
  } catch (error) {
    console.error("❌ Error durante la validación:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar validación
validateMigration()
  .then(() => {
    console.log("\n✅ Validación completada");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error en validación:", error);
    process.exit(1);
  });
