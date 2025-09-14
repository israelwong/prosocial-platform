const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCampanasManagement() {
    try {
        console.log('🧪 Probando funcionalidades de gestión de campañas...');

        // Obtener una campaña para probar las funcionalidades
        const campaña = await prisma.proSocialCampaña.findFirst({
            include: {
                plataformas: {
                    include: {
                        plataforma: true
                    }
                }
            }
        });

        if (!campaña) {
            console.log('❌ No hay campañas para probar');
            return;
        }

        console.log(`📋 Campaña seleccionada: ${campaña.nombre} (${campaña.status})`);

        // Probar duplicación
        console.log('\n🔧 Probando duplicación de campaña...');
        const campañaDuplicada = await prisma.proSocialCampaña.create({
            data: {
                nombre: `${campaña.nombre} (Copia)`,
                descripcion: campaña.descripcion,
                presupuestoTotal: campaña.presupuestoTotal,
                fechaInicio: new Date(),
                fechaFin: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 días
                status: 'planificada',
                isActive: true,
                leadsGenerados: 0,
                leadsSuscritos: 0,
                gastoReal: 0,
                plataformas: {
                    create: campaña.plataformas.map(p => ({
                        plataformaId: p.plataforma.id,
                        presupuesto: p.presupuesto,
                        gastoReal: 0,
                        leads: 0,
                        conversiones: 0
                    }))
                }
            },
            include: {
                plataformas: {
                    include: {
                        plataforma: true
                    }
                }
            }
        });

        console.log(`✅ Campaña duplicada: ${campañaDuplicada.nombre}`);
        console.log(`📊 Plataformas duplicadas: ${campañaDuplicada.plataformas.length}`);

        // Probar archivado
        console.log('\n🔧 Probando archivado de campaña...');
        const campañaArchivada = await prisma.proSocialCampaña.update({
            where: { id: campañaDuplicada.id },
            data: {
                isActive: false,
                status: 'finalizada'
            }
        });

        console.log(`✅ Campaña archivada: ${campañaArchivada.nombre} (${campañaArchivada.status})`);

        // Verificar que aparece en historial
        console.log('\n📊 Verificando que aparece en historial...');
        const campanasHistorial = await prisma.proSocialCampaña.findMany({
            where: { isActive: false },
            select: { id: true, nombre: true, status: true }
        });

        const enHistorial = campanasHistorial.find(c => c.id === campañaDuplicada.id);
        if (enHistorial) {
            console.log(`✅ Campaña archivada aparece en historial: ${enHistorial.nombre}`);
        } else {
            console.log('❌ Campaña archivada no aparece en historial');
        }

        // Probar eliminación
        console.log('\n🗑️ Probando eliminación de campaña...');
        await prisma.proSocialCampaña.delete({
            where: { id: campañaDuplicada.id }
        });

        console.log('✅ Campaña eliminada exitosamente');

        // Verificar que ya no existe
        const campañaEliminada = await prisma.proSocialCampaña.findUnique({
            where: { id: campañaDuplicada.id }
        });

        if (!campañaEliminada) {
            console.log('✅ Verificación: Campaña eliminada correctamente');
        } else {
            console.log('❌ Error: Campaña no fue eliminada');
        }

        // Probar filtros por estado
        console.log('\n🔍 Probando filtros por estado...');
        
        const campanasActivas = await prisma.proSocialCampaña.count({
            where: { isActive: true }
        });
        console.log(`📊 Campañas activas: ${campanasActivas}`);

        const campanasFinalizadas = await prisma.proSocialCampaña.count({
            where: { status: 'finalizada' }
        });
        console.log(`📊 Campañas finalizadas: ${campanasFinalizadas}`);

        const campanasPausadas = await prisma.proSocialCampaña.count({
            where: { status: 'pausada' }
        });
        console.log(`📊 Campañas pausadas: ${campanasPausadas}`);

        const campanasPlanificadas = await prisma.proSocialCampaña.count({
            where: { status: 'planificada' }
        });
        console.log(`📊 Campañas planificadas: ${campanasPlanificadas}`);

        console.log('\n🎉 Todas las pruebas de gestión exitosas!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar las pruebas
testCampanasManagement()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
