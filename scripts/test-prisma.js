const { PrismaClient } = require("@prisma/client");

async function testPrisma() {
  const prisma = new PrismaClient();

  try {
    console.log("🔍 Probando conexión a Prisma...");

    // Verificar si las tablas del sistema de setup existen
    const setupStatus = await prisma.studio_setup_status.findMany();
    console.log(`✅ studio_setup_status: ${setupStatus.length} registros`);

    const sectionsConfig = await prisma.setup_section_config.findMany();
    console.log(`✅ setup_section_config: ${sectionsConfig.length} registros`);

    // Verificar si hay un proyecto demo-studio
    const project = await prisma.projects.findFirst({
      where: { slug: "demo-studio" },
    });

    if (project) {
      console.log(`✅ Proyecto demo-studio encontrado: ${project.id}`);
    } else {
      console.log("❌ Proyecto demo-studio no encontrado");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

testPrisma();
