const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function checkServicesSchema() {
  try {
    console.log("🔍 Verificando schema de platform_services...");

    // Intentar obtener un servicio para ver qué campos están disponibles
    const services = await prisma.platform_services.findMany({
      take: 1,
    });

    if (services.length > 0) {
      const service = services[0];
      console.log("📋 Campos disponibles en platform_services:");
      console.log(Object.keys(service));

      // Verificar si posicion existe
      if ("posicion" in service) {
        console.log('✅ Campo "posicion" existe');
        console.log("Valor de posicion:", service.posicion);
      } else {
        console.log('❌ Campo "posicion" NO existe');
      }
    } else {
      console.log("⚠️ No hay servicios en la base de datos");
    }

    // Intentar hacer una consulta con orderBy posicion
    try {
      const orderedServices = await prisma.platform_services.findMany({
        orderBy: { posicion: "asc" },
        take: 3,
      });
      console.log("✅ Consulta con orderBy posicion funciona");
      console.log(
        "Servicios ordenados:",
        orderedServices.map((s) => ({ name: s.name, posicion: s.posicion }))
      );
    } catch (error) {
      console.log("❌ Error en consulta con orderBy posicion:", error.message);
    }
  } catch (error) {
    console.error("❌ Error verificando schema:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkServicesSchema();
