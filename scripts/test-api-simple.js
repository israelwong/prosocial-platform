const fetch = require('node-fetch');

async function testAPISimple() {
    try {
        console.log('🧪 Probando API simple...');

        // Probar endpoint básico
        console.log('📊 Probando GET /api/plataformas...');
        const response = await fetch('http://localhost:3000/api/plataformas');
        
        console.log(`Status: ${response.status}`);
        console.log(`Status Text: ${response.statusText}`);
        
        const text = await response.text();
        console.log(`Response: ${text}`);
        
        if (response.ok) {
            const data = JSON.parse(text);
            console.log(`✅ API funcionando: ${data.length} plataformas`);
        } else {
            console.log('❌ API con error');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testAPISimple();
