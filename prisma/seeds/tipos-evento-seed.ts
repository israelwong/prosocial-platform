import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTiposEvento() {
    console.log('🎭 Iniciando seed de tipos de evento...\n');

    try {
        // Buscar el proyecto demo-studio
        const demoStudio = await prisma.projects.findUnique({
            where: { slug: 'demo-studio' },
        });

        if (!demoStudio) {
            console.error('❌ Error: No se encontró el proyecto "demo-studio"');
            return;
        }

        console.log(`✅ Proyecto encontrado: ${demoStudio.name} (${demoStudio.slug})\n`);

        // Limpiar tipos de evento existentes
        await prisma.project_evento_tipos.deleteMany({
            where: { projectId: demoStudio.id },
        });

        console.log('🧹 Tipos de evento existentes eliminados\n');

        // Crear tipos de evento de ejemplo
        const tiposEvento = [
            {
                nombre: 'Bodas',
                descripcion: 'Eventos de matrimonio y ceremonias nupciales',
                color: '#EC4899',
                icono: '💒',
                posicion: 0,
            },
            {
                nombre: 'XV Años',
                descripcion: 'Celebraciones de quince años',
                color: '#8B5CF6',
                icono: '👑',
                posicion: 1,
            },
            {
                nombre: 'Bautizos',
                descripcion: 'Ceremonias de bautizo y presentaciones',
                color: '#06B6D4',
                icono: '👶',
                posicion: 2,
            },
            {
                nombre: 'Cumpleaños',
                descripcion: 'Celebraciones de cumpleaños y fiestas',
                color: '#F59E0B',
                icono: '🎂',
                posicion: 3,
            },
            {
                nombre: 'Corporativos',
                descripcion: 'Eventos empresariales y corporativos',
                color: '#10B981',
                icono: '🏢',
                posicion: 4,
            },
        ];

        for (const tipo of tiposEvento) {
            await prisma.project_evento_tipos.create({
                data: {
                    projectId: demoStudio.id,
                    ...tipo,
                    updatedAt: new Date(),
                },
            });
            console.log(`✅ Tipo de evento creado: ${tipo.nombre}`);
        }

        console.log('\n✨ ¡Seed de tipos de evento completado exitosamente!\n');
        console.log('📊 Resumen:');
        console.log(`   - Tipos de evento creados: ${tiposEvento.length}`);
        console.log(`   - Estudio: ${demoStudio.name} (${demoStudio.slug})\n`);

    } catch (error) {
        console.error('\n❌ Error durante el seed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

seedTiposEvento()
    .then(() => {
        console.log('✅ Script de tipos de evento finalizado correctamente');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Script de tipos de evento falló:', error);
        process.exit(1);
    });
