const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testCampanasAPI() {
    try {
        console.log('🧪 Probando API routes de campañas...');

        // Probar GET /api/plataformas
        console.log('📊 Probando GET /api/plataformas...');
        const plataformasResponse = await fetch(`${BASE_URL}/api/plataformas`);
        
        if (!plataformasResponse.ok) {
            throw new Error(`GET plataformas failed: ${plataformasResponse.status} ${plataformasResponse.statusText}`);
        }
        
        const plataformas = await plataformasResponse.json();
        console.log(`✅ GET plataformas exitoso: ${plataformas.length} plataformas encontradas`);
        
        if (plataformas.length > 0) {
            console.log('📋 Primeras 3 plataformas:');
            plataformas.slice(0, 3).forEach((plataforma, index) => {
                console.log(`  ${index + 1}. ${plataforma.nombre} (${plataforma.tipo})`);
            });
        }

        // Probar GET /api/campanas
        console.log('\n📊 Probando GET /api/campanas...');
        const campanasResponse = await fetch(`${BASE_URL}/api/campanas`);
        
        if (!campanasResponse.ok) {
            throw new Error(`GET campanas failed: ${campanasResponse.status} ${campanasResponse.statusText}`);
        }
        
        const campanas = await campanasResponse.json();
        console.log(`✅ GET campanas exitoso: ${campanas.length} campañas encontradas`);

        // Probar POST /api/campanas
        console.log('\n🔧 Probando POST /api/campanas...');
        const nuevaCampaña = {
            nombre: 'Campaña API Test Q1 2024',
            descripcion: 'Campaña creada para testing de API',
            presupuestoTotal: 5000.00,
            fechaInicio: new Date('2024-01-01'),
            fechaFin: new Date('2024-03-31'),
            status: 'activa',
            isActive: true,
            leadsGenerados: 0,
            leadsSuscritos: 0,
            gastoReal: 0,
            plataformas: plataformas.slice(0, 2).map(p => ({
                plataformaId: p.id,
                presupuesto: 1000,
                gastoReal: 0,
                leads: 0,
                conversiones: 0
            }))
        };

        const postResponse = await fetch(`${BASE_URL}/api/campanas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevaCampaña),
        });

        if (!postResponse.ok) {
            throw new Error(`POST failed: ${postResponse.status} ${postResponse.statusText}`);
        }

        const campañaCreada = await postResponse.json();
        console.log(`✅ POST exitoso: Campaña creada con ID ${campañaCreada.id}`);
        console.log(`📋 Campaña: ${campañaCreada.nombre}`);
        console.log(`💰 Presupuesto: $${campañaCreada.presupuestoTotal}`);
        console.log(`📊 Plataformas: ${campañaCreada.plataformas.length}`);

        // Probar GET /api/campanas/[id]
        console.log('\n🔍 Probando GET /api/campanas/[id]...');
        const getCampañaResponse = await fetch(`${BASE_URL}/api/campanas/${campañaCreada.id}`);
        
        if (!getCampañaResponse.ok) {
            throw new Error(`GET campaña failed: ${getCampañaResponse.status} ${getCampañaResponse.statusText}`);
        }
        
        const campañaDetalle = await getCampañaResponse.json();
        console.log(`✅ GET campaña exitoso: ${campañaDetalle.nombre}`);
        console.log(`📊 Leads asociados: ${campañaDetalle._count.leads}`);

        // Probar PUT /api/campanas/[id]
        console.log('\n🔄 Probando PUT /api/campanas/[id]...');
        const campañaActualizada = {
            ...campañaCreada,
            leadsGenerados: 150,
            leadsSuscritos: 25,
            gastoReal: 2500.00,
            descripcion: 'Campaña actualizada para testing de API'
        };

        const putResponse = await fetch(`${BASE_URL}/api/campanas/${campañaCreada.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(campañaActualizada),
        });

        if (!putResponse.ok) {
            throw new Error(`PUT failed: ${putResponse.status} ${putResponse.statusText}`);
        }

        const campañaActualizadaResponse = await putResponse.json();
        console.log(`✅ PUT exitoso: Campaña actualizada`);
        console.log(`📊 Leads generados: ${campañaActualizadaResponse.leadsGenerados}`);
        console.log(`📊 Leads suscritos: ${campañaActualizadaResponse.leadsSuscritos}`);
        console.log(`💰 Gasto real: $${campañaActualizadaResponse.gastoReal}`);

        // Calcular métricas
        const costoAdquisicion = campañaActualizadaResponse.leadsGenerados > 0 ? 
            campañaActualizadaResponse.gastoReal / campañaActualizadaResponse.leadsGenerados : 0;
        const costoConversion = campañaActualizadaResponse.leadsSuscritos > 0 ? 
            campañaActualizadaResponse.gastoReal / campañaActualizadaResponse.leadsSuscritos : 0;
        const tasaConversion = campañaActualizadaResponse.leadsGenerados > 0 ? 
            (campañaActualizadaResponse.leadsSuscritos / campañaActualizadaResponse.leadsGenerados) * 100 : 0;

        console.log(`\n📈 Métricas calculadas:`);
        console.log(`  • Costo de adquisición: $${costoAdquisicion.toFixed(2)}`);
        console.log(`  • Costo de conversión: $${costoConversion.toFixed(2)}`);
        console.log(`  • Tasa de conversión: ${tasaConversion.toFixed(1)}%`);

        // Probar DELETE /api/campanas/[id]
        console.log('\n🗑️ Probando DELETE /api/campanas/[id]...');
        const deleteResponse = await fetch(`${BASE_URL}/api/campanas/${campañaCreada.id}`, {
            method: 'DELETE',
        });

        if (!deleteResponse.ok) {
            throw new Error(`DELETE failed: ${deleteResponse.status} ${deleteResponse.statusText}`);
        }

        console.log('✅ DELETE exitoso: Campaña eliminada');

        // Verificar que la campaña fue eliminada
        console.log('\n🔍 Verificando eliminación...');
        const getResponseAfterDelete = await fetch(`${BASE_URL}/api/campanas`);
        const campanasAfterDelete = await getResponseAfterDelete.json();
        
        const campañaEliminada = campanasAfterDelete.find(c => c.id === campañaCreada.id);
        if (!campañaEliminada) {
            console.log('✅ Verificación exitosa: Campaña eliminada correctamente');
        } else {
            console.log('❌ Error: Campaña no fue eliminada');
        }

        console.log('\n🎉 Todas las pruebas de API de campañas exitosas!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    }
}

// Ejecutar las pruebas
testCampanasAPI()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
