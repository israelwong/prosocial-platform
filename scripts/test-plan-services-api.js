const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testPlanServicesAPI() {
    try {
        console.log('🔍 Testing plan services API...');

        // Obtener un plan existente
        const plan = await prisma.platform_plans.findFirst();
        if (!plan) {
            console.log('❌ No hay planes en la base de datos');
            return;
        }
        console.log('📋 Plan encontrado:', plan.id, plan.name);

        // Obtener todos los servicios
        const allServices = await prisma.platform_services.findMany({
            orderBy: [
                { posicion: 'asc' },
                { name: 'asc' }
            ]
        });
        console.log('📋 Servicios encontrados:', allServices.length);

        // Obtener configuración de servicios para este plan
        const planServices = await prisma.plan_services.findMany({
            where: { plan_id: plan.id },
            include: {
                service: true
            }
        });
        console.log('📋 Configuraciones de servicios encontradas:', planServices.length);

        // Crear un mapa de servicios configurados
        const planServicesMap = new Map(
            planServices.map(ps => [ps.service_id, ps])
        );

        // Combinar servicios con su configuración en el plan
        const servicesWithConfig = allServices.map(service => ({
            ...service,
            planService: planServicesMap.get(service.id) || null
        }));

        console.log('✅ Datos procesados correctamente');
        console.log('📊 Servicios con configuración:', servicesWithConfig.length);
        
        // Mostrar algunos ejemplos
        servicesWithConfig.slice(0, 3).forEach(service => {
            console.log(`  - ${service.name}: ${service.planService ? 'Configurado' : 'Sin configurar'}`);
        });

    } catch (error) {
        console.error('❌ Error en test:', error);
        console.error('Error details:', {
            message: error.message,
            stack: error.stack
        });
    } finally {
        await prisma.$disconnect();
    }
}

testPlanServicesAPI();
