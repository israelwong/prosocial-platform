const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testLeadBitacora() {
    try {
        console.log('🧪 Probando sistema de bitácora de leads...');

        // Obtener un lead existente
        const lead = await prisma.proSocialLead.findFirst();
        if (!lead) {
            console.log('❌ No hay leads en la base de datos');
            return;
        }

        console.log(`📋 Lead encontrado: ${lead.nombre} (${lead.email})`);

        // Crear una entrada de bitácora de prueba
        const bitacoraEntry = await prisma.proSocialLeadBitacora.create({
            data: {
                leadId: lead.id,
                tipo: 'NOTA_PERSONALIZADA',
                titulo: 'Nota de prueba',
                descripcion: 'Esta es una nota de prueba para verificar que el sistema funciona correctamente.',
                metadata: {
                    test: true,
                    version: '1.0'
                }
            }
        });

        console.log('✅ Entrada de bitácora creada:', bitacoraEntry.id);

        // Crear una entrada de cambio de etapa
        const cambioEtapa = await prisma.proSocialLeadBitacora.create({
            data: {
                leadId: lead.id,
                tipo: 'CAMBIO_ETAPA',
                titulo: 'Cambio de etapa',
                descripcion: 'Lead movido de "Nuevos Leads" a "En Seguimiento"',
                metadata: {
                    etapaAnterior: 'Nuevos Leads',
                    etapaNueva: 'En Seguimiento'
                }
            }
        });

        console.log('✅ Entrada de cambio de etapa creada:', cambioEtapa.id);

        // Obtener todas las entradas de bitácora para este lead
        const bitacoraEntries = await prisma.proSocialLeadBitacora.findMany({
            where: { leadId: lead.id },
            orderBy: { createdAt: 'desc' }
        });

        console.log(`📊 Total de entradas en bitácora para ${lead.nombre}: ${bitacoraEntries.length}`);

        // Mostrar las entradas
        bitacoraEntries.forEach((entry, index) => {
            console.log(`${index + 1}. [${entry.tipo}] ${entry.titulo}`);
            console.log(`   ${entry.descripcion}`);
            console.log(`   ${entry.createdAt.toISOString()}`);
            console.log('');
        });

        // Probar la relación desde el lead
        const leadWithBitacora = await prisma.proSocialLead.findUnique({
            where: { id: lead.id },
            include: {
                bitacora: {
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        console.log(`🔗 Lead con bitácora: ${leadWithBitacora.bitacora.length} entradas`);

        console.log('🎉 Pruebas completadas exitosamente!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar las pruebas
testLeadBitacora()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
