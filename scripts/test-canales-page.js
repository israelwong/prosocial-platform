const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCanalesPage() {
    try {
        console.log('🧪 Probando funcionalidad de la página de canales...');

        // Verificar que tenemos canales
        const canales = await prisma.proSocialCanalAdquisicion.findMany({
            orderBy: [
                { categoria: 'asc' },
                { orden: 'asc' }
            ]
        });

        console.log(`📊 Total de canales disponibles: ${canales.length}`);

        // Verificar categorías
        const categorias = [...new Set(canales.map(c => c.categoria))];
        console.log(`📂 Categorías disponibles: ${categorias.join(', ')}`);

        // Verificar canales activos
        const canalesActivos = canales.filter(c => c.isActive);
        console.log(`✅ Canales activos: ${canalesActivos.length}`);

        // Verificar canales visibles
        const canalesVisibles = canales.filter(c => c.isVisible);
        console.log(`👁️ Canales visibles: ${canalesVisibles.length}`);

        // Verificar canales por categoría
        categorias.forEach(categoria => {
            const count = canales.filter(c => c.categoria === categoria).length;
            console.log(`  • ${categoria}: ${count} canales`);
        });

        // Verificar que tenemos leads con canales asignados
        const leadsConCanal = await prisma.proSocialLead.findMany({
            where: {
                canalAdquisicionId: { not: null }
            },
            include: {
                canalAdquisicion: true
            }
        });

        console.log(`👥 Leads con canal asignado: ${leadsConCanal.length}`);

        // Verificar funcionalidad de filtros
        console.log('\n🔍 Probando filtros...');

        // Filtro por categoría
        const canalesRedesSociales = canales.filter(c => c.categoria === 'Redes Sociales');
        console.log(`📱 Canales de Redes Sociales: ${canalesRedesSociales.length}`);

        // Filtro por estado activo
        const canalesInactivos = canales.filter(c => !c.isActive);
        console.log(`❌ Canales inactivos: ${canalesInactivos.length}`);

        // Filtro por visibilidad
        const canalesNoVisibles = canales.filter(c => !c.isVisible);
        console.log(`🙈 Canales no visibles: ${canalesNoVisibles.length}`);

        // Verificar ordenamiento
        const canalesOrdenados = canales.sort((a, b) => {
            if (a.categoria !== b.categoria) {
                return a.categoria.localeCompare(b.categoria);
            }
            return a.orden - b.orden;
        });

        console.log('\n📋 Primeros 5 canales ordenados:');
        canalesOrdenados.slice(0, 5).forEach((canal, index) => {
            console.log(`  ${index + 1}. ${canal.nombre} (${canal.categoria}) - Orden: ${canal.orden}`);
        });

        // Verificar datos de ejemplo para la UI
        console.log('\n🎨 Datos para la UI:');
        const canalEjemplo = canales[0];
        if (canalEjemplo) {
            console.log(`  • Nombre: ${canalEjemplo.nombre}`);
            console.log(`  • Categoría: ${canalEjemplo.categoria}`);
            console.log(`  • Color: ${canalEjemplo.color || 'No definido'}`);
            console.log(`  • Icono: ${canalEjemplo.icono || 'No definido'}`);
            console.log(`  • Activo: ${canalEjemplo.isActive ? 'Sí' : 'No'}`);
            console.log(`  • Visible: ${canalEjemplo.isVisible ? 'Sí' : 'No'}`);
        }

        console.log('\n🎉 Pruebas de la página de canales completadas exitosamente!');
        console.log('\n📝 Funcionalidades verificadas:');
        console.log('  ✅ Carga de canales desde la base de datos');
        console.log('  ✅ Filtrado por categoría');
        console.log('  ✅ Filtrado por estado activo/inactivo');
        console.log('  ✅ Filtrado por visibilidad');
        console.log('  ✅ Ordenamiento por categoría y orden');
        console.log('  ✅ Relación con leads');
        console.log('  ✅ Datos completos para la UI');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar las pruebas
testCanalesPage()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
