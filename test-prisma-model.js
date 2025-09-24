const { PrismaClient } = require('@prisma/client');

async function testModel() {
    const prisma = new PrismaClient();
    
    try {
        console.log('✅ Prisma Client inicializado correctamente');
        
        // Verificar que el modelo existe
        if (prisma.project_cuentas_bancarias) {
            console.log('✅ Modelo project_cuentas_bancarias disponible');
            
            // Intentar hacer una consulta simple
            const count = await prisma.project_cuentas_bancarias.count();
            console.log(`✅ Consulta exitosa. Total de cuentas: ${count}`);
        } else {
            console.log('❌ Modelo project_cuentas_bancarias NO disponible');
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testModel();
