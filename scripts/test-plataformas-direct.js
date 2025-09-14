const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPlataformasDirect() {
    try {
        console.log('🧪 Probando acceso directo a plataformas...');

        const plataformas = await prisma.proSocialPlataformaPublicidad.findMany({
            where: {
                isActive: true
            },
            orderBy: [
                { tipo: 'asc' },
                { orden: 'asc' }
            ]
        });

        console.log(`✅ Total de plataformas: ${plataformas.length}`);

        if (plataformas.length > 0) {
            console.log('\n📋 Primeras 5 plataformas:');
            plataformas.slice(0, 5).forEach((plataforma, index) => {
                console.log(`  ${index + 1}. ${plataforma.nombre} (${plataforma.tipo})`);
            });
        }

        // Probar campañas también
        console.log('\n📊 Probando campañas...');
        const campanas = await prisma.proSocialCampaña.findMany({
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
            }
        });

        console.log(`✅ Total de campañas: ${campanas.length}`);

        console.log('\n🎉 Pruebas directas exitosas!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar las pruebas
testPlataformasDirect()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
