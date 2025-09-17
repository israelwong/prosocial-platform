const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedServicesPositions() {
    try {
        console.log('🔄 Actualizando posiciones de servicios...');

        // Obtener todos los servicios ordenados por fecha de creación
        const services = await prisma.platform_services.findMany({
            orderBy: {
                createdAt: 'asc'
            }
        });

        console.log(`📋 Encontrados ${services.length} servicios`);

        // Actualizar posiciones secuencialmente
        for (let i = 0; i < services.length; i++) {
            const service = services[i];
            const newPosition = i + 1; // Posiciones empiezan en 1

            await prisma.platform_services.update({
                where: { id: service.id },
                data: { posicion: newPosition }
            });

            console.log(`✅ ${service.name} -> Posición ${newPosition}`);
        }

        console.log('🎉 Posiciones de servicios actualizadas exitosamente');
        
        // Verificar el resultado
        const updatedServices = await prisma.platform_services.findMany({
            orderBy: { posicion: 'asc' },
            select: {
                id: true,
                name: true,
                posicion: true,
                createdAt: true
            }
        });

        console.log('\n📊 Servicios ordenados por posición:');
        updatedServices.forEach(service => {
            console.log(`  ${service.posicion}. ${service.name} (ID: ${service.id})`);
        });

    } catch (error) {
        console.error('❌ Error actualizando posiciones:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar el seed
seedServicesPositions()
    .then(() => {
        console.log('✅ Seed completado exitosamente');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error en seed:', error);
        process.exit(1);
    });
