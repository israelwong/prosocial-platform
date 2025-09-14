const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCampanasHistorial() {
    try {
        console.log('🧪 Probando funcionalidad de historial de campañas...');

        // Crear algunas campañas de prueba con diferentes estados
        console.log('🔧 Creando campañas de prueba...');
        
        const campañasPrueba = [
            {
                nombre: 'Campaña Q1 2024 - Fotografía',
                descripcion: 'Campaña de fotografía profesional Q1',
                presupuestoTotal: 5000.00,
                fechaInicio: new Date('2024-01-01'),
                fechaFin: new Date('2024-03-31'),
                status: 'finalizada',
                isActive: false,
                leadsGenerados: 200,
                leadsSuscritos: 40,
                gastoReal: 4500.00
            },
            {
                nombre: 'Campaña Q2 2024 - Video',
                descripcion: 'Campaña de video corporativo Q2',
                presupuestoTotal: 8000.00,
                fechaInicio: new Date('2024-04-01'),
                fechaFin: new Date('2024-06-30'),
                status: 'pausada',
                isActive: false,
                leadsGenerados: 150,
                leadsSuscritos: 25,
                gastoReal: 3200.00
            },
            {
                nombre: 'Campaña Q3 2024 - Social Media',
                descripcion: 'Campaña de redes sociales Q3',
                presupuestoTotal: 3000.00,
                fechaInicio: new Date('2024-07-01'),
                fechaFin: new Date('2024-09-30'),
                status: 'planificada',
                isActive: false,
                leadsGenerados: 0,
                leadsSuscritos: 0,
                gastoReal: 0
            }
        ];

        const campañasCreadas = [];
        for (const campañaData of campañasPrueba) {
            const campaña = await prisma.proSocialCampaña.create({
                data: campañaData
            });
            campañasCreadas.push(campaña);
            console.log(`✅ Campaña creada: ${campaña.nombre} (${campaña.status})`);
        }

        // Probar consultas de historial
        console.log('\n📊 Probando consultas de historial...');
        
        // Campañas inactivas (historial)
        const campanasHistorial = await prisma.proSocialCampaña.findMany({
            where: {
                isActive: false
            },
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

        console.log(`✅ Campañas en historial: ${campanasHistorial.length}`);

        // Filtrar por estado
        const campanasFinalizadas = campanasHistorial.filter(c => c.status === 'finalizada');
        const campanasPausadas = campanasHistorial.filter(c => c.status === 'pausada');
        const campanasPlanificadas = campanasHistorial.filter(c => c.status === 'planificada');

        console.log(`📋 Campañas finalizadas: ${campanasFinalizadas.length}`);
        console.log(`📋 Campañas pausadas: ${campanasPausadas.length}`);
        console.log(`📋 Campañas planificadas: ${campanasPlanificadas.length}`);

        // Calcular estadísticas generales
        console.log('\n📈 Calculando estadísticas generales...');
        
        const totalPresupuesto = campanasHistorial.reduce((sum, c) => sum + c.presupuestoTotal, 0);
        const totalGasto = campanasHistorial.reduce((sum, c) => sum + c.gastoReal, 0);
        const totalLeads = campanasHistorial.reduce((sum, c) => sum + c.leadsGenerados, 0);
        const totalConversiones = campanasHistorial.reduce((sum, c) => sum + c.leadsSuscritos, 0);
        const promedioConversion = totalLeads > 0 ? (totalConversiones / totalLeads) * 100 : 0;

        console.log(`💰 Presupuesto total: $${totalPresupuesto.toLocaleString()}`);
        console.log(`💸 Gasto total: $${totalGasto.toLocaleString()}`);
        console.log(`👥 Total leads: ${totalLeads}`);
        console.log(`🎯 Total conversiones: ${totalConversiones}`);
        console.log(`📊 Tasa de conversión promedio: ${promedioConversion.toFixed(1)}%`);

        // Calcular métricas por campaña
        console.log('\n📊 Métricas por campaña:');
        campanasHistorial.forEach((campaña, index) => {
            const costoAdquisicion = campaña.leadsGenerados > 0 ? campaña.gastoReal / campaña.leadsGenerados : 0;
            const costoConversion = campaña.leadsSuscritos > 0 ? campaña.gastoReal / campaña.leadsSuscritos : 0;
            const tasaConversion = campaña.leadsGenerados > 0 ? (campaña.leadsSuscritos / campaña.leadsGenerados) * 100 : 0;
            const roi = campaña.presupuestoTotal > 0 ? ((campaña.gastoReal / campaña.presupuestoTotal) * 100) : 0;

            console.log(`\n${index + 1}. ${campaña.nombre} (${campaña.status}):`);
            console.log(`   • Costo adquisición: $${costoAdquisicion.toFixed(2)}`);
            console.log(`   • Costo conversión: $${costoConversion.toFixed(2)}`);
            console.log(`   • Tasa conversión: ${tasaConversion.toFixed(1)}%`);
            console.log(`   • ROI: ${roi.toFixed(1)}%`);

            // Clasificar rendimiento
            let rendimiento = 'Baja';
            if (tasaConversion >= 20) rendimiento = 'Excelente';
            else if (tasaConversion >= 10) rendimiento = 'Buena';
            else if (tasaConversion >= 5) rendimiento = 'Regular';

            console.log(`   • Rendimiento: ${rendimiento}`);
        });

        // Probar filtros por período
        console.log('\n📅 Probando filtros por período...');
        
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        const last3Months = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());

        const campanasLastMonth = campanasHistorial.filter(c => new Date(c.fechaInicio) >= lastMonth);
        const campanasLast3Months = campanasHistorial.filter(c => new Date(c.fechaInicio) >= last3Months);

        console.log(`📋 Campañas último mes: ${campanasLastMonth.length}`);
        console.log(`📋 Campañas últimos 3 meses: ${campanasLast3Months.length}`);

        // Limpiar datos de prueba
        console.log('\n🧹 Limpiando datos de prueba...');
        for (const campaña of campañasCreadas) {
            await prisma.proSocialCampaña.delete({
                where: { id: campaña.id }
            });
        }
        console.log('✅ Campañas de prueba eliminadas');

        console.log('\n🎉 Todas las pruebas de historial exitosas!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar las pruebas
testCampanasHistorial()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
