const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkData() {
    try {
        console.log('🔍 Checking database data...');

        // Verificar planes
        const plans = await prisma.platform_plans.findMany();
        console.log('📋 Planes encontrados:', plans.length);
        plans.forEach(plan => {
            console.log(`  - ${plan.id}: ${plan.name}`);
        });

        // Verificar servicios
        const services = await prisma.platform_services.findMany();
        console.log('📋 Servicios encontrados:', services.length);
        services.forEach(service => {
            console.log(`  - ${service.id}: ${service.name} (posicion: ${service.posicion})`);
        });

        // Verificar configuraciones de servicios en planes
        const planServices = await prisma.plan_services.findMany();
        console.log('📋 Configuraciones de servicios en planes:', planServices.length);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkData();
