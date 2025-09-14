const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCampanasModels() {
    try {
        console.log('🧪 Probando modelos de campañas...');

        // Probar plataformas
        console.log('📊 Probando plataformas de publicidad...');
        const plataformas = await prisma.proSocialPlataformaPublicidad.findMany({
            orderBy: [
                { tipo: 'asc' },
                { orden: 'asc' }
            ]
        });

        console.log(`✅ Total de plataformas: ${plataformas.length}`);

        // Mostrar plataformas por tipo
        const tipos = [...new Set(plataformas.map(p => p.tipo))];
        tipos.forEach(tipo => {
            const plataformasTipo = plataformas.filter(p => p.tipo === tipo);
            console.log(`\n📂 ${tipo} (${plataformasTipo.length} plataformas):`);
            plataformasTipo.forEach(plataforma => {
                console.log(`  • ${plataforma.nombre} ${plataforma.isActive ? '✅' : '❌'}`);
            });
        });

        // Crear una campaña de prueba
        console.log('\n🔧 Probando creación de campaña...');
        const campañaPrueba = await prisma.proSocialCampaña.create({
            data: {
                nombre: 'Campaña de Prueba Q1 2024',
                descripcion: 'Campaña creada para testing',
                presupuestoTotal: 5000.00,
                fechaInicio: new Date('2024-01-01'),
                fechaFin: new Date('2024-03-31'),
                status: 'activa',
                leadsGenerados: 0,
                leadsSuscritos: 0,
                gastoReal: 0
            }
        });

        console.log(`✅ Campaña creada: ${campañaPrueba.nombre} (ID: ${campañaPrueba.id})`);

        // Asignar plataformas a la campaña
        console.log('\n🔗 Probando asignación de plataformas...');
        const plataformasSeleccionadas = plataformas.slice(0, 3); // Tomar las primeras 3

        for (const plataforma of plataformasSeleccionadas) {
            const presupuesto = Math.floor(Math.random() * 1000) + 500; // Presupuesto aleatorio entre 500-1500
            
            const campañaPlataforma = await prisma.proSocialCampañaPlataforma.create({
                data: {
                    campañaId: campañaPrueba.id,
                    plataformaId: plataforma.id,
                    presupuesto: presupuesto,
                    gastoReal: 0,
                    leads: 0,
                    conversiones: 0
                }
            });

            console.log(`  ✅ ${plataforma.nombre}: $${presupuesto} asignados`);
        }

        // Probar consultas con relaciones
        console.log('\n🔍 Probando consultas con relaciones...');
        const campañaConPlataformas = await prisma.proSocialCampaña.findUnique({
            where: { id: campañaPrueba.id },
            include: {
                plataformas: {
                    include: {
                        plataforma: true
                    }
                }
            }
        });

        if (campañaConPlataformas) {
            console.log(`📋 Campaña: ${campañaConPlataformas.nombre}`);
            console.log(`💰 Presupuesto total: $${campañaConPlataformas.presupuestoTotal}`);
            console.log(`📅 Período: ${campañaConPlataformas.fechaInicio.toLocaleDateString()} - ${campañaConPlataformas.fechaFin.toLocaleDateString()}`);
            console.log(`📊 Plataformas asignadas: ${campañaConPlataformas.plataformas.length}`);
            
            campañaConPlataformas.plataformas.forEach(cp => {
                console.log(`  • ${cp.plataforma.nombre}: $${cp.presupuesto} (${cp.plataforma.tipo})`);
            });
        }

        // Probar actualización de métricas
        console.log('\n📈 Probando actualización de métricas...');
        const campañaActualizada = await prisma.proSocialCampaña.update({
            where: { id: campañaPrueba.id },
            data: {
                leadsGenerados: 150,
                leadsSuscritos: 25,
                gastoReal: 2500.00
            }
        });

        console.log(`✅ Métricas actualizadas:`);
        console.log(`  • Leads generados: ${campañaActualizada.leadsGenerados}`);
        console.log(`  • Leads suscritos: ${campañaActualizada.leadsSuscritos}`);
        console.log(`  • Gasto real: $${campañaActualizada.gastoReal}`);

        // Calcular métricas
        const costoAdquisicion = campañaActualizada.gastoReal / campañaActualizada.leadsGenerados;
        const costoConversion = campañaActualizada.gastoReal / campañaActualizada.leadsSuscritos;
        const tasaConversion = (campañaActualizada.leadsSuscritos / campañaActualizada.leadsGenerados) * 100;

        console.log(`\n📊 Métricas calculadas:`);
        console.log(`  • Costo de adquisición: $${costoAdquisicion.toFixed(2)}`);
        console.log(`  • Costo de conversión: $${costoConversion.toFixed(2)}`);
        console.log(`  • Tasa de conversión: ${tasaConversion.toFixed(1)}%`);

        // Limpiar datos de prueba
        console.log('\n🧹 Limpiando datos de prueba...');
        await prisma.proSocialCampaña.delete({
            where: { id: campañaPrueba.id }
        });
        console.log('✅ Campaña de prueba eliminada');

        console.log('\n🎉 Todas las pruebas de modelos exitosas!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar las pruebas
testCampanasModels()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
