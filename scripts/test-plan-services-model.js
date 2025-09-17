const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPlanServicesModel() {
    try {
        console.log('🔍 Testing plan_services model...');

        // Verificar si el modelo existe
        console.log('📋 Prisma client methods:');
        console.log('  - prisma.plan_services:', typeof prisma.plan_services);
        console.log('  - prisma.platform_plans:', typeof prisma.platform_plans);
        console.log('  - prisma.platform_services:', typeof prisma.platform_services);

        // Intentar hacer una consulta simple
        try {
            const count = await prisma.plan_services.count();
            console.log('✅ plan_services.count() funciona:', count);
        } catch (error) {
            console.log('❌ Error en plan_services.count():', error.message);
        }

        // Intentar hacer una consulta con findMany
        try {
            const services = await prisma.plan_services.findMany();
            console.log('✅ plan_services.findMany() funciona:', services.length);
        } catch (error) {
            console.log('❌ Error en plan_services.findMany():', error.message);
        }

        // Verificar si hay algún problema con el constraint único
        try {
            const services = await prisma.plan_services.findMany({
                where: { plan_id: 'test' }
            });
            console.log('✅ plan_services.findMany() con where funciona:', services.length);
        } catch (error) {
            console.log('❌ Error en plan_services.findMany() con where:', error.message);
        }

    } catch (error) {
        console.error('❌ Error general:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testPlanServicesModel();
