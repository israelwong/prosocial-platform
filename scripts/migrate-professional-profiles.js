const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Perfiles por defecto del sistema
const DEFAULT_PROFILES = [
  {
    name: "Fotógrafo",
    slug: "fotografo",
    description: "Especialista en captura de imágenes fotográficas",
    color: "#3B82F6",
    icon: "Camera",
    isDefault: true,
    order: 1,
  },
  {
    name: "Camarógrafo",
    slug: "camarografo",
    description: "Especialista en grabación de video",
    color: "#10B981",
    icon: "Video",
    isDefault: true,
    order: 2,
  },
  {
    name: "Editor",
    slug: "editor",
    description: "Especialista en edición y postproducción",
    color: "#8B5CF6",
    icon: "Scissors",
    isDefault: true,
    order: 3,
  },
  {
    name: "Retocador",
    slug: "retocador",
    description: "Especialista en retoque fotográfico",
    color: "#F59E0B",
    icon: "Palette",
    isDefault: true,
    order: 4,
  },
  {
    name: "Operador de Dron",
    slug: "operador-dron",
    description: "Piloto certificado de drones para tomas aéreas",
    color: "#EF4444",
    icon: "Zap",
    isDefault: true,
    order: 5,
  },
  {
    name: "Asistente",
    slug: "asistente",
    description: "Apoyo general en producciones",
    color: "#6B7280",
    icon: "User",
    isDefault: true,
    order: 6,
  },
  {
    name: "Coordinador",
    slug: "coordinador",
    description: "Coordinación de equipos y producciones",
    color: "#8B5CF6",
    icon: "Users",
    isDefault: true,
    order: 7,
  },
];

async function migrateProfessionalProfiles() {
  try {
    console.log("🚀 Iniciando migración de perfiles profesionales...");

    // 1. Obtener todos los proyectos
    const projects = await prisma.projects.findMany({
      select: { id: true, slug: true, name: true },
    });

    console.log(`📊 Encontrados ${projects.length} proyectos`);

    for (const project of projects) {
      console.log(
        `\n🏢 Procesando proyecto: ${project.name} (${project.slug})`
      );

      // 2. Verificar si ya tiene perfiles
      const existingProfiles = await prisma.project_professional_profiles.count(
        {
          where: { projectId: project.id },
        }
      );

      if (existingProfiles > 0) {
        console.log(
          `   ⚠️  Ya tiene ${existingProfiles} perfiles, saltando...`
        );
        continue;
      }

      // 3. Crear perfiles por defecto para este proyecto
      const profilesToCreate = DEFAULT_PROFILES.map((profile) => ({
        ...profile,
        projectId: project.id,
      }));

      const createdProfiles =
        await prisma.project_professional_profiles.createMany({
          data: profilesToCreate,
        });

      console.log(
        `   ✅ Creados ${createdProfiles.count} perfiles por defecto`
      );

      // 4. Migrar perfiles existentes de usuarios (si los hay)
      const usersWithProfiles = await prisma.project_users.findMany({
        where: {
          projectId: project.id,
          professional_profiles: {
            some: { isActive: true },
          },
        },
        include: {
          professional_profiles: {
            where: { isActive: true },
          },
        },
      });

      if (usersWithProfiles.length > 0) {
        console.log(
          `   🔄 Migrando ${usersWithProfiles.length} usuarios con perfiles existentes...`
        );

        for (const user of usersWithProfiles) {
          // Obtener los perfiles del proyecto
          const projectProfiles =
            await prisma.project_professional_profiles.findMany({
              where: { projectId: project.id },
            });

          // Mapear perfiles antiguos a nuevos
          const profileMapping = {
            FOTOGRAFO: "fotografo",
            CAMAROGRAFO: "camarografo",
            EDITOR: "editor",
            RETOCADOR: "retocador",
            OPERADOR_DRON: "operador-dron",
            ASISTENTE: "asistente",
            COORDINADOR: "coordinador",
          };

          // Crear nuevas asignaciones
          for (const oldProfile of user.professional_profiles) {
            const newSlug = profileMapping[oldProfile.profile];
            if (newSlug) {
              const newProfile = projectProfiles.find(
                (p) => p.slug === newSlug
              );
              if (newProfile) {
                // Verificar si ya existe la asignación
                const existingAssignment =
                  await prisma.project_user_professional_profiles.findFirst({
                    where: {
                      userId: user.id,
                      profileId: newProfile.id,
                    },
                  });

                if (!existingAssignment) {
                  await prisma.project_user_professional_profiles.create({
                    data: {
                      userId: user.id,
                      profileId: newProfile.id,
                      description: oldProfile.description,
                      isActive: true,
                    },
                  });
                }
              }
            }
          }

          // Desactivar perfiles antiguos
          await prisma.project_user_professional_profiles.updateMany({
            where: {
              userId: user.id,
              profile: {
                in: [
                  "FOTOGRAFO",
                  "CAMAROGRAFO",
                  "EDITOR",
                  "RETOCADOR",
                  "OPERADOR_DRON",
                  "ASISTENTE",
                  "COORDINADOR",
                ],
              },
            },
            data: { isActive: false },
          });
        }

        console.log(`   ✅ Migración de usuarios completada`);
      }
    }

    console.log("\n🎉 Migración completada exitosamente!");

    // 5. Estadísticas finales
    const totalProfiles = await prisma.project_professional_profiles.count();
    const totalAssignments =
      await prisma.project_user_professional_profiles.count({
        where: { isActive: true },
      });

    console.log(`\n📊 Estadísticas finales:`);
    console.log(`   - Total de perfiles creados: ${totalProfiles}`);
    console.log(`   - Total de asignaciones activas: ${totalAssignments}`);
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar migración
if (require.main === module) {
  migrateProfessionalProfiles()
    .then(() => {
      console.log("✅ Script completado");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error:", error);
      process.exit(1);
    });
}

module.exports = { migrateProfessionalProfiles };
