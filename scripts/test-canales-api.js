const fetch = require('node-fetch');

const BASE_URL = 'http://localhost:3000';

async function testCanalesAPI() {
    try {
        console.log('🧪 Probando API routes de canales...');

        // Probar GET /api/canales
        console.log('📊 Probando GET /api/canales...');
        const getResponse = await fetch(`${BASE_URL}/api/canales`);
        
        if (!getResponse.ok) {
            throw new Error(`GET failed: ${getResponse.status} ${getResponse.statusText}`);
        }
        
        const canales = await getResponse.json();
        console.log(`✅ GET exitoso: ${canales.length} canales encontrados`);
        
        if (canales.length > 0) {
            console.log('📋 Primeros 3 canales:');
            canales.slice(0, 3).forEach((canal, index) => {
                console.log(`  ${index + 1}. ${canal.nombre} (${canal.categoria})`);
            });
        }

        // Probar POST /api/canales
        console.log('\n🔧 Probando POST /api/canales...');
        const nuevoCanal = {
            nombre: 'Canal API Test',
            descripcion: 'Canal creado para testing de API',
            categoria: 'Otros',
            color: '#FF0000',
            icono: 'TestTube',
            isActive: true,
            isVisible: true,
            orden: 999
        };

        const postResponse = await fetch(`${BASE_URL}/api/canales`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(nuevoCanal),
        });

        if (!postResponse.ok) {
            throw new Error(`POST failed: ${postResponse.status} ${postResponse.statusText}`);
        }

        const canalCreado = await postResponse.json();
        console.log(`✅ POST exitoso: Canal creado con ID ${canalCreado.id}`);

        // Probar PUT /api/canales/[id]
        console.log('\n🔄 Probando PUT /api/canales/[id]...');
        const canalActualizado = {
            ...canalCreado,
            descripcion: 'Canal actualizado para testing de API'
        };

        const putResponse = await fetch(`${BASE_URL}/api/canales/${canalCreado.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(canalActualizado),
        });

        if (!putResponse.ok) {
            throw new Error(`PUT failed: ${putResponse.status} ${putResponse.statusText}`);
        }

        const canalActualizadoResponse = await putResponse.json();
        console.log(`✅ PUT exitoso: Canal actualizado - ${canalActualizadoResponse.descripcion}`);

        // Probar DELETE /api/canales/[id]
        console.log('\n🗑️ Probando DELETE /api/canales/[id]...');
        const deleteResponse = await fetch(`${BASE_URL}/api/canales/${canalCreado.id}`, {
            method: 'DELETE',
        });

        if (!deleteResponse.ok) {
            throw new Error(`DELETE failed: ${deleteResponse.status} ${deleteResponse.statusText}`);
        }

        console.log('✅ DELETE exitoso: Canal eliminado');

        // Verificar que el canal fue eliminado
        console.log('\n🔍 Verificando eliminación...');
        const getResponseAfterDelete = await fetch(`${BASE_URL}/api/canales`);
        const canalesAfterDelete = await getResponseAfterDelete.json();
        
        const canalEliminado = canalesAfterDelete.find(c => c.id === canalCreado.id);
        if (!canalEliminado) {
            console.log('✅ Verificación exitosa: Canal eliminado correctamente');
        } else {
            console.log('❌ Error: Canal no fue eliminado');
        }

        console.log('\n🎉 Todas las pruebas de API exitosas!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    }
}

// Ejecutar las pruebas
testCanalesAPI()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
