const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log("🔍 Probando conexión a la base de datos...");

    // Probar conexión básica
    await prisma.$connect();
    console.log("✅ Conexión exitosa");

    // Probar consulta simple
    const count = await prisma.projects.count();
    console.log(`📊 Total de proyectos: ${count}`);

    // Probar consulta de plataformas
    const plataformas =
      await prisma.platform_plataformas_redes_sociales.count();
    console.log(`📱 Total de plataformas: ${plataformas}`);

    // Probar consulta de redes sociales
    const redes = await prisma.project_redes_sociales.count();
    console.log(`🔗 Total de redes sociales: ${redes}`);
  } catch (error) {
    console.error("❌ Error de conexión:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
