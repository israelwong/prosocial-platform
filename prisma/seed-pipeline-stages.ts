import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPipelineStages() {
    console.log('🌱 Seeding pipeline stages...');

    // Etapas por defecto del pipeline
    const defaultStages = [
        {
            nombre: 'Nuevos Leads',
            descripcion: 'Leads recién capturados',
            color: '#3B82F6', // blue-500
            orden: 1,
            isActive: true
        },
        {
            nombre: 'En Seguimiento',
            descripcion: 'Leads contactados y en proceso',
            color: '#EAB308', // yellow-500
            orden: 2,
            isActive: true
        },
        {
            nombre: 'Promesa de Compra',
            descripcion: 'Leads que prometieron comprar',
            color: '#A855F7', // purple-500
            orden: 3,
            isActive: true
        },
        {
            nombre: 'Suscritos',
            descripcion: 'Leads convertidos en clientes',
            color: '#10B981', // green-500
            orden: 4,
            isActive: true
        },
        {
            nombre: 'Cancelados',
            descripcion: 'Leads que cancelaron',
            color: '#EF4444', // red-500
            orden: 5,
            isActive: true
        },
        {
            nombre: 'Perdidos',
            descripcion: 'Leads perdidos',
            color: '#6B7280', // gray-500
            orden: 6,
            isActive: true
        }
    ];

    try {
        // Verificar si ya existen etapas
        const existingStages = await prisma.proSocialPipelineStage.count();

        if (existingStages > 0) {
            console.log('✅ Pipeline stages already exist, skipping...');
            return;
        }

        // Crear las etapas
        for (const stage of defaultStages) {
            await prisma.proSocialPipelineStage.create({
                data: stage
            });
            console.log(`✅ Created stage: ${stage.nombre}`);
        }

        console.log('🎉 Pipeline stages seeded successfully!');
    } catch (error) {
        console.error('❌ Error seeding pipeline stages:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    seedPipelineStages()
        .catch((e) => {
            console.error(e);
            process.exit(1);
        });
}

export default seedPipelineStages;
