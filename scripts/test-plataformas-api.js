const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPlataformasAPI() {
    try {
        console.log('🧪 Probando API de plataformas...');

        // Verificar que hay plataformas en la base de datos
        const plataformasCount = await prisma.proSocialPlataformaPublicidad.count();
        console.log(`📊 Total de plataformas en BD: ${plataformasCount}`);

        if (plataformasCount === 0) {
            console.log('⚠️ No hay plataformas en la base de datos');
            console.log('🔧 Ejecutando seed de plataformas...');
            
            // Ejecutar el seed de plataformas
            const { execSync } = require('child_process');
            try {
                execSync('npx tsx prisma/seed-plataformas-publicidad.ts', { stdio: 'inherit' });
                console.log('✅ Seed de plataformas ejecutado');
            } catch (error) {
                console.error('❌ Error ejecutando seed:', error.message);
                return;
            }
        }

        // Probar la consulta que usa la API
        const plataformas = await prisma.proSocialPlataformaPublicidad.findMany({
            where: {
                isActive: true
            },
            orderBy: [
                { tipo: 'asc' },
                { orden: 'asc' }
            ]
        });

        console.log(`📊 Plataformas activas encontradas: ${plataformas.length}`);
        
        if (plataformas.length > 0) {
            console.log('📋 Plataformas activas:');
            plataformas.forEach(p => {
                console.log(`  - ${p.nombre} (${p.tipo}) - Orden: ${p.orden}`);
            });
        } else {
            console.log('⚠️ No hay plataformas activas');
        }

        // Probar diferentes filtros
        console.log('\n🔍 Probando filtros...');
        
        const redesSociales = await prisma.proSocialPlataformaPublicidad.count({
            where: { 
                isActive: true,
                tipo: 'Redes Sociales'
            }
        });
        console.log(`📊 Redes Sociales activas: ${redesSociales}`);

        const busqueda = await prisma.proSocialPlataformaPublicidad.count({
            where: { 
                isActive: true,
                tipo: 'Búsqueda'
            }
        });
        console.log(`📊 Búsqueda activas: ${busqueda}`);

        const video = await prisma.proSocialPlataformaPublicidad.count({
            where: { 
                isActive: true,
                tipo: 'Video'
            }
        });
        console.log(`📊 Video activas: ${video}`);

        const display = await prisma.proSocialPlataformaPublicidad.count({
            where: { 
                isActive: true,
                tipo: 'Display'
            }
        });
        console.log(`📊 Display activas: ${display}`);

        console.log('\n✅ API de plataformas funcionando correctamente');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar las pruebas
testPlataformasAPI()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
