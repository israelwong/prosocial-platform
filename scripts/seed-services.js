const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

const initialServices = [
    {
        name: 'Catálogos',
        slug: 'catalogos',
        description: 'Número máximo de catálogos que puede crear el estudio'
    },
    {
        name: 'Proyectos Aprobados',
        slug: 'proyectos_aprobados',
        description: 'Proyectos en etapa aprobada simultáneamente'
    },
    {
        name: 'Cotizaciones Activas',
        slug: 'cotizaciones_activas',
        description: 'Cotizaciones activas simultáneamente'
    },
    {
        name: 'Landing Pages',
        slug: 'landing_pages',
        description: 'Landing pages personalizadas'
    },
    {
        name: 'Almacenamiento',
        slug: 'almacenamiento',
        description: 'Espacio de almacenamiento en la nube'
    },
    {
        name: 'Usuarios del Estudio',
        slug: 'usuarios_estudio',
        description: 'Número máximo de usuarios que puede tener el estudio'
    },
    {
        name: 'Clientes',
        slug: 'clientes',
        description: 'Número máximo de clientes registrados'
    },
    {
        name: 'Eventos en Agenda',
        slug: 'eventos_agenda',
        description: 'Eventos que puede programar en la agenda'
    },
    {
        name: 'Campañas de Marketing',
        slug: 'campanas_marketing',
        description: 'Campañas de marketing activas'
    },
    {
        name: 'Reportes Avanzados',
        slug: 'reportes_avanzados',
        description: 'Acceso a reportes y analytics avanzados'
    }
];

async function seedServices() {
    try {
        console.log('🌱 Iniciando seed de servicios...');

        for (const service of initialServices) {
            const existingService = await prisma.platform_services.findUnique({
                where: { slug: service.slug }
            });

            if (existingService) {
                console.log(`✅ Servicio "${service.name}" ya existe`);
                continue;
            }

            await prisma.platform_services.create({
                data: service
            });

            console.log(`✅ Servicio "${service.name}" creado exitosamente`);
        }

        console.log('🎉 Seed de servicios completado exitosamente');
    } catch (error) {
        console.error('❌ Error durante el seed de servicios:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar el seed
seedServices()
    .then(() => {
        console.log('✅ Proceso completado');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
