const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCanalesAdquisicion() {
    try {
        console.log('🧪 Probando sistema de canales de adquisición...');

        // Obtener todos los canales
        const canales = await prisma.proSocialCanalAdquisicion.findMany({
            orderBy: [
                { categoria: 'asc' },
                { orden: 'asc' }
            ]
        });

        console.log(`📊 Total de canales: ${canales.length}`);

        // Mostrar canales por categoría
        const categorias = [...new Set(canales.map(c => c.categoria))];
        categorias.forEach(categoria => {
            const canalesCategoria = canales.filter(c => c.categoria === categoria);
            console.log(`\n📂 ${categoria} (${canalesCategoria.length} canales):`);
            canalesCategoria.forEach(canal => {
                console.log(`  • ${canal.nombre} ${canal.isActive ? '✅' : '❌'} ${canal.isVisible ? '👁️' : '🙈'}`);
            });
        });

        // Obtener un lead existente
        const lead = await prisma.proSocialLead.findFirst();
        if (!lead) {
            console.log('❌ No hay leads en la base de datos');
            return;
        }

        console.log(`\n📋 Lead encontrado: ${lead.nombre} (${lead.email})`);

        // Asignar un canal al lead
        const canalFacebook = await prisma.proSocialCanalAdquisicion.findFirst({
            where: { nombre: 'Facebook' }
        });

        if (canalFacebook) {
            const leadActualizado = await prisma.proSocialLead.update({
                where: { id: lead.id },
                data: {
                    canalAdquisicionId: canalFacebook.id
                },
                include: {
                    canalAdquisicion: true
                }
            });

            console.log(`✅ Lead actualizado con canal: ${leadActualizado.canalAdquisicion?.nombre}`);
        }

        // Probar consultas con filtros
        console.log('\n🔍 Probando consultas con filtros...');

        // Canales activos y visibles
        const canalesActivos = await prisma.proSocialCanalAdquisicion.findMany({
            where: {
                isActive: true,
                isVisible: true
            },
            orderBy: { orden: 'asc' }
        });

        console.log(`📈 Canales activos y visibles: ${canalesActivos.length}`);

        // Canales por categoría
        const canalesRedesSociales = await prisma.proSocialCanalAdquisicion.findMany({
            where: {
                categoria: 'Redes Sociales',
                isActive: true
            }
        });

        console.log(`📱 Canales de Redes Sociales: ${canalesRedesSociales.length}`);

        // Leads con canal asignado
        const leadsConCanal = await prisma.proSocialLead.findMany({
            where: {
                canalAdquisicionId: { not: null }
            },
            include: {
                canalAdquisicion: true
            }
        });

        console.log(`👥 Leads con canal asignado: ${leadsConCanal.length}`);

        if (leadsConCanal.length > 0) {
            console.log('\n📋 Leads con canales:');
            leadsConCanal.forEach(lead => {
                console.log(`  • ${lead.nombre} → ${lead.canalAdquisicion?.nombre} (${lead.canalAdquisicion?.categoria})`);
            });
        }

        console.log('\n🎉 Pruebas completadas exitosamente!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar las pruebas
testCanalesAdquisicion()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
