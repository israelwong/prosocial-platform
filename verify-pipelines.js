const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function verifyPipelines() {
  try {
    console.log("🔍 Verificando pipelines y etapas...");

    // Verificar tipos de pipeline
    const pipelineTypes = await prisma.platform_pipeline_types.findMany({
      include: {
        pipeline_stages: {
          orderBy: { orden: "asc" },
        },
      },
    });

    console.log(`📊 Tipos de pipeline: ${pipelineTypes.length}`);

    for (const type of pipelineTypes) {
      console.log(`\n🎯 ${type.nombre} (${type.color})`);
      console.log(`   Descripción: ${type.descripcion}`);
      console.log(`   Etapas: ${type.pipeline_stages.length}`);

      for (const stage of type.pipeline_stages) {
        console.log(
          `   - ${stage.nombre} (${stage.color}) - ${stage.descripcion}`
        );
      }
    }

    // Verificar total de etapas
    const totalStages = await prisma.platform_pipeline_stages.count();
    console.log(`\n📈 Total de etapas: ${totalStages}`);
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

verifyPipelines();
