const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugCampanasAPI() {
    try {
        console.log('🔍 Diagnosticando API de campañas...');

        // Verificar si hay campañas en la base de datos
        console.log('📊 Verificando campañas en la base de datos...');
        const totalCampanas = await prisma.proSocialCampaña.count();
        console.log(`Total de campañas: ${totalCampanas}`);

        // Verificar campañas activas
        const campanasActivas = await prisma.proSocialCampaña.count({
            where: { isActive: true }
        });
        console.log(`Campañas activas: ${campanasActivas}`);

        // Verificar campañas inactivas
        const campanasInactivas = await prisma.proSocialCampaña.count({
            where: { isActive: false }
        });
        console.log(`Campañas inactivas: ${campanasInactivas}`);

        // Probar consulta simple
        console.log('\n🔧 Probando consulta simple...');
        const campanasSimple = await prisma.proSocialCampaña.findMany({
            take: 5
        });
        console.log(`✅ Consulta simple exitosa: ${campanasSimple.length} campañas`);

        // Probar consulta con filtro isActive=false
        console.log('\n🔧 Probando consulta con isActive=false...');
        const campanasInactivasQuery = await prisma.proSocialCampaña.findMany({
            where: { isActive: false },
            take: 5
        });
        console.log(`✅ Consulta isActive=false exitosa: ${campanasInactivasQuery.length} campañas`);

        // Probar consulta con include (sin _count)
        console.log('\n🔧 Probando consulta con include...');
        const campanasWithInclude = await prisma.proSocialCampaña.findMany({
            where: { isActive: false },
            include: {
                plataformas: {
                    include: {
                        plataforma: true
                    }
                }
            },
            take: 5
        });
        console.log(`✅ Consulta con include exitosa: ${campanasWithInclude.length} campañas`);

        // Probar consulta completa (como en la API)
        console.log('\n🔧 Probando consulta completa (como en la API)...');
        try {
            const campanasCompleta = await prisma.proSocialCampaña.findMany({
                where: { isActive: false },
                include: {
                    plataformas: {
                        include: {
                            plataforma: true
                        }
                    },
                    _count: {
                        select: {
                            leads: true
                        }
                    }
                },
                orderBy: [
                    { fechaInicio: 'desc' },
                    { createdAt: 'desc' }
                ]
            });
            console.log(`✅ Consulta completa exitosa: ${campanasCompleta.length} campañas`);
            
            if (campanasCompleta.length > 0) {
                console.log('📋 Primera campaña:');
                const primera = campanasCompleta[0];
                console.log(`  • Nombre: ${primera.nombre}`);
                console.log(`  • Estado: ${primera.status}`);
                console.log(`  • Plataformas: ${primera.plataformas.length}`);
                console.log(`  • Leads: ${primera._count.leads}`);
            }
        } catch (error) {
            console.error('❌ Error en consulta completa:', error);
        }

        // Crear una campaña de prueba si no hay ninguna
        if (totalCampanas === 0) {
            console.log('\n🔧 Creando campaña de prueba...');
            const campañaPrueba = await prisma.proSocialCampaña.create({
                data: {
                    nombre: 'Campaña de Prueba',
                    descripcion: 'Campaña creada para testing',
                    presupuestoTotal: 1000.00,
                    fechaInicio: new Date('2024-01-01'),
                    fechaFin: new Date('2024-12-31'),
                    status: 'finalizada',
                    isActive: false,
                    leadsGenerados: 50,
                    leadsSuscritos: 10,
                    gastoReal: 800.00
                }
            });
            console.log(`✅ Campaña de prueba creada: ${campañaPrueba.id}`);
        }

        console.log('\n🎉 Diagnóstico completado!');

    } catch (error) {
        console.error('❌ Error durante el diagnóstico:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar el diagnóstico
debugCampanasAPI()
    .then(() => {
        console.log('✅ Diagnóstico finalizado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
