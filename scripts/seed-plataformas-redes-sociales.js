const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function seedPlataformasRedesSociales() {
  try {
    console.log("🌱 Sembrando plataformas de redes sociales...");

    const plataformas = [
      {
        nombre: "Facebook",
        slug: "facebook",
        descripcion: "Red social para conectar con amigos y familia",
        color: "#1877F2",
        icono: "facebook",
        urlBase: "https://facebook.com/",
        isActive: true,
        orden: 1,
      },
      {
        nombre: "Instagram",
        slug: "instagram",
        descripcion: "Plataforma para compartir fotos y videos",
        color: "#E4405F",
        icono: "instagram",
        urlBase: "https://instagram.com/",
        isActive: true,
        orden: 2,
      },
      {
        nombre: "X",
        slug: "x",
        descripcion: "Red social de microblogging (antes Twitter)",
        color: "#000000",
        icono: "twitter", // Usamos el ícono de twitter para X
        urlBase: "https://x.com/",
        isActive: true,
        orden: 3,
      },
      {
        nombre: "TikTok",
        slug: "tiktok",
        descripcion: "Plataforma de videos cortos",
        color: "#000000",
        icono: "music", // Usamos music como ícono para TikTok
        urlBase: "https://tiktok.com/",
        isActive: true,
        orden: 4,
      },
      {
        nombre: "YouTube",
        slug: "youtube",
        descripcion: "Plataforma de videos y contenido",
        color: "#FF0000",
        icono: "youtube",
        urlBase: "https://youtube.com/",
        isActive: true,
        orden: 5,
      },
      {
        nombre: "LinkedIn",
        slug: "linkedin",
        descripcion: "Red social profesional",
        color: "#0077B5",
        icono: "linkedin",
        urlBase: "https://linkedin.com/",
        isActive: true,
        orden: 6,
      },
    ];

    for (const plataforma of plataformas) {
      const existing =
        await prisma.platform_plataformas_redes_sociales.findUnique({
          where: { slug: plataforma.slug },
        });

      if (existing) {
        console.log(`   ⚠️  ${plataforma.nombre} ya existe, actualizando...`);
        await prisma.platform_plataformas_redes_sociales.update({
          where: { slug: plataforma.slug },
          data: plataforma,
        });
      } else {
        console.log(`   ✅ Creando ${plataforma.nombre}...`);
        await prisma.platform_plataformas_redes_sociales.create({
          data: plataforma,
        });
      }
    }

    console.log("🎉 Plataformas de redes sociales sembradas exitosamente!");

    // Mostrar resumen
    const total = await prisma.platform_plataformas_redes_sociales.count();
    const activas = await prisma.platform_plataformas_redes_sociales.count({
      where: { isActive: true },
    });

    console.log(`📊 Resumen:`);
    console.log(`   - Total plataformas: ${total}`);
    console.log(`   - Plataformas activas: ${activas}`);
  } catch (error) {
    console.error("❌ Error sembrando plataformas:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
seedPlataformasRedesSociales()
  .then(() => {
    console.log("\n✅ Script completado exitosamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error en el script:", error);
    process.exit(1);
  });
