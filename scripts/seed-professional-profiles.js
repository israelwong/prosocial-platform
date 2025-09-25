const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

const PROFILES_TO_SEED = [
    {
        name: "Fotógrafo",
        slug: "fotografo",
        description: "Profesional especializado en captura fotográfica",
        color: "#3B82F6",
        icon: "Camera",
        isDefault: true,
        isActive: true,
        order: 1
    },
    {
        name: "Camarógrafo",
        slug: "camarografo",
        description: "Profesional especializado en grabación de video",
        color: "#8B5CF6",
        icon: "Video",
        isDefault: true,
        isActive: true,
        order: 2
    },
    {
        name: "Operador de Dron",
        slug: "operador-dron",
        description: "Profesional especializado en operación de drones",
        color: "#06B6D4",
        icon: "Zap",
        isDefault: true,
        isActive: true,
        order: 3
    },
    {
        name: "Asistente de Producción",
        slug: "asistente-produccion",
        description: "Profesional de apoyo en producción audiovisual",
        color: "#10B981",
        icon: "User",
        isDefault: true,
        isActive: true,
        order: 4
    },
    {
        name: "Editor de Video",
        slug: "editor-video",
        description: "Profesional especializado en edición y postproducción de video",
        color: "#F59E0B",
        icon: "Edit",
        isDefault: true,
        isActive: true,
        order: 5
    },
    {
        name: "Revelado y Retoque de Fotos",
        slug: "revelado-retoque-fotos",
        description: "Profesional especializado en revelado digital y retoque fotográfico",
        color: "#EF4444",
        icon: "Image",
        isDefault: true,
        isActive: true,
        order: 6
    }
];

async function seedProfessionalProfiles() {
    try {
        console.log('🌱 Iniciando seed de perfiles profesionales...');

        // Obtener todos los proyectos (studios)
        const projects = await prisma.projects.findMany({
            select: { id: true, name: true, slug: true }
        });

        if (projects.length === 0) {
            console.log('❌ No se encontraron proyectos. Asegúrate de tener al menos un studio creado.');
            return;
        }

        console.log(`📊 Encontrados ${projects.length} proyectos:`);
        projects.forEach(project => {
            console.log(`   - ${project.name} (${project.slug})`);
        });

        let totalCreated = 0;
        let totalSkipped = 0;

        // Para cada proyecto, crear los perfiles si no existen
        for (const project of projects) {
            console.log(`\n🎯 Procesando proyecto: ${project.name}`);
            
            for (const profileData of PROFILES_TO_SEED) {
                try {
                    // Verificar si el perfil ya existe
                    const existingProfile = await prisma.project_professional_profiles.findFirst({
                        where: {
                            projectId: project.id,
                            slug: profileData.slug
                        }
                    });

                    if (existingProfile) {
                        console.log(`   ⏭️  Perfil "${profileData.name}" ya existe, omitiendo...`);
                        totalSkipped++;
                        continue;
                    }

                    // Crear el perfil
                    const newProfile = await prisma.project_professional_profiles.create({
                        data: {
                            ...profileData,
                            projectId: project.id
                        }
                    });

                    console.log(`   ✅ Creado perfil: ${newProfile.name}`);
                    totalCreated++;

                } catch (error) {
                    console.error(`   ❌ Error creando perfil "${profileData.name}":`, error.message);
                }
            }
        }

        console.log(`\n🎉 Seed completado:`);
        console.log(`   ✅ Perfiles creados: ${totalCreated}`);
        console.log(`   ⏭️  Perfiles omitidos: ${totalSkipped}`);
        console.log(`   📊 Total procesados: ${totalCreated + totalSkipped}`);

    } catch (error) {
        console.error('❌ Error durante el seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar el seed
if (require.main === module) {
    seedProfessionalProfiles()
        .then(() => {
            console.log('\n✨ Seed de perfiles profesionales completado exitosamente');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n💥 Error en el seed:', error);
            process.exit(1);
        });
}

module.exports = { seedProfessionalProfiles };
