const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function verifyPipelineDefault() {
  try {
    console.log("🔍 Verificando configuración de pipelines por defecto...");

    // Verificar que existen los dos tipos de pipeline
    const pipelineTypes = await prisma.platform_pipeline_types.findMany({
      orderBy: { orden: "asc" },
    });

    console.log(`📊 Tipos de pipeline encontrados: ${pipelineTypes.length}`);

    const comercialPipeline = pipelineTypes.find(
      (type) => type.id === "pipeline-comercial"
    );
    const soportePipeline = pipelineTypes.find(
      (type) => type.id === "pipeline-soporte"
    );

    if (comercialPipeline) {
      console.log(
        `✅ Pipeline Comercial: ${comercialPipeline.nombre} (${comercialPipeline.color})`
      );
      console.log(
        `   Orden: ${comercialPipeline.orden} - Activo: ${comercialPipeline.activo}`
      );
    } else {
      console.log("❌ Pipeline Comercial no encontrado");
    }

    if (soportePipeline) {
      console.log(
        `✅ Pipeline de Soporte: ${soportePipeline.nombre} (${soportePipeline.color})`
      );
      console.log(
        `   Orden: ${soportePipeline.orden} - Activo: ${soportePipeline.activo}`
      );
    } else {
      console.log("❌ Pipeline de Soporte no encontrado");
    }

    // Verificar que el comercial está primero (orden 1)
    if (comercialPipeline && comercialPipeline.orden === 1) {
      console.log("✅ Pipeline Comercial configurado como default (orden 1)");
    } else {
      console.log("⚠️  Pipeline Comercial no está en orden 1");
    }

    // Verificar etapas
    const etapasComercial = await prisma.platform_pipeline_stages.count({
      where: { pipeline_type_id: "pipeline-comercial" },
    });

    const etapasSoporte = await prisma.platform_pipeline_stages.count({
      where: { pipeline_type_id: "pipeline-soporte" },
    });

    console.log(`📈 Etapas comerciales: ${etapasComercial}`);
    console.log(`📈 Etapas de soporte: ${etapasSoporte}`);

    console.log("\n🎯 Configuración por defecto:");
    console.log("   - URL base: /admin/pipeline → Pipeline Comercial");
    console.log(
      "   - URL soporte: /admin/pipeline?section=soporte → Pipeline de Soporte"
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPipelineDefault();
