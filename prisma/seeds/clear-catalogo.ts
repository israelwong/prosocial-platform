import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function clearCatalogo() {
    console.log('🗑️  Limpiando catálogo existente...\n');

    try {
        // Buscar el proyecto "demo-studio"
        const demoStudio = await prisma.projects.findUnique({
            where: { slug: 'demo-studio' },
        });

        if (!demoStudio) {
            console.error('❌ Error: No se encontró el proyecto "demo-studio"');
            return;
        }

        console.log(`✅ Proyecto encontrado: ${demoStudio.name} (${demoStudio.slug})\n`);

        // Eliminar en el orden correcto (por foreign keys)
        console.log('🔄 Eliminando servicios...');
        const serviciosDeleted = await prisma.project_servicios.deleteMany({
            where: { studioId: demoStudio.id },
        });
        console.log(`   ✅ ${serviciosDeleted.count} servicio(s) eliminado(s)`);

        console.log('🔄 Eliminando relaciones sección-categoría...');
        const relacionesDeleted = await prisma.project_seccion_categorias.deleteMany({});
        console.log(`   ✅ ${relacionesDeleted.count} relación(es) eliminada(s)`);

        console.log('🔄 Eliminando categorías...');
        const categoriasDeleted = await prisma.project_servicio_categorias.deleteMany({});
        console.log(`   ✅ ${categoriasDeleted.count} categoría(s) eliminada(s)`);

        console.log('🔄 Eliminando secciones...');
        const seccionesDeleted = await prisma.project_servicio_secciones.deleteMany({});
        console.log(`   ✅ ${seccionesDeleted.count} sección(es) eliminada(s)`);

        console.log('\n✨ ¡Limpieza completada!\n');
    } catch (error) {
        console.error('\n❌ Error durante la limpieza:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar limpieza
clearCatalogo()
    .then(() => {
        console.log('✅ Script finalizado correctamente');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script falló:', error);
        process.exit(1);
    });
