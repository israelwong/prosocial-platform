const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPrismaCanales() {
    try {
        console.log('🧪 Probando acceso a canales con Prisma...');

        // Probar consulta básica
        console.log('📊 Probando consulta básica...');
        const canales = await prisma.proSocialCanalAdquisicion.findMany({
            orderBy: [
                { categoria: 'asc' },
                { orden: 'asc' }
            ]
        });

        console.log(`✅ Consulta exitosa: ${canales.length} canales encontrados`);

        if (canales.length > 0) {
            console.log('\n📋 Primeros 5 canales:');
            canales.slice(0, 5).forEach((canal, index) => {
                console.log(`  ${index + 1}. ${canal.nombre} (${canal.categoria}) - Orden: ${canal.orden}`);
            });
        }

        // Probar filtros
        console.log('\n🔍 Probando filtros...');
        
        const canalesActivos = await prisma.proSocialCanalAdquisicion.findMany({
            where: { isActive: true },
            orderBy: { nombre: 'asc' }
        });
        console.log(`✅ Canales activos: ${canalesActivos.length}`);

        const canalesRedesSociales = await prisma.proSocialCanalAdquisicion.findMany({
            where: { categoria: 'Redes Sociales' },
            orderBy: { orden: 'asc' }
        });
        console.log(`✅ Canales de Redes Sociales: ${canalesRedesSociales.length}`);

        // Probar operaciones CRUD
        console.log('\n🔧 Probando operaciones CRUD...');
        
        // Crear un canal de prueba
        const canalPrueba = await prisma.proSocialCanalAdquisicion.create({
            data: {
                nombre: 'Canal de Prueba',
                descripcion: 'Canal creado para testing',
                categoria: 'Otros',
                color: '#FF0000',
                icono: 'TestTube',
                isActive: true,
                isVisible: true,
                orden: 999
            }
        });
        console.log(`✅ Canal creado: ${canalPrueba.nombre} (ID: ${canalPrueba.id})`);

        // Actualizar el canal
        const canalActualizado = await prisma.proSocialCanalAdquisicion.update({
            where: { id: canalPrueba.id },
            data: { descripcion: 'Canal actualizado para testing' }
        });
        console.log(`✅ Canal actualizado: ${canalActualizado.descripcion}`);

        // Eliminar el canal de prueba
        await prisma.proSocialCanalAdquisicion.delete({
            where: { id: canalPrueba.id }
        });
        console.log(`✅ Canal eliminado: ${canalPrueba.nombre}`);

        console.log('\n🎉 Todas las pruebas de Prisma exitosas!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar las pruebas
testPrismaCanales()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
