import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAgents() {
    console.log('🌱 Seeding agents...');

    const agents = [
        {
            nombre: 'María González',
            email: 'maria.gonzalez@prosocial.mx',
            telefono: '+52 55 1234 5678',
            activo: true,
            metaMensualLeads: 25,
            comisionConversion: 0.05
        },
        {
            nombre: 'Carlos Rodríguez',
            email: 'carlos.rodriguez@prosocial.mx',
            telefono: '+52 55 2345 6789',
            activo: true,
            metaMensualLeads: 30,
            comisionConversion: 0.06
        },
        {
            nombre: 'Ana Martínez',
            email: 'ana.martinez@prosocial.mx',
            telefono: '+52 55 3456 7890',
            activo: true,
            metaMensualLeads: 20,
            comisionConversion: 0.05
        },
        {
            nombre: 'Luis Hernández',
            email: 'luis.hernandez@prosocial.mx',
            telefono: '+52 55 4567 8901',
            activo: false,
            metaMensualLeads: 15,
            comisionConversion: 0.04
        },
        {
            nombre: 'Sofia López',
            email: 'sofia.lopez@prosocial.mx',
            telefono: '+52 55 5678 9012',
            activo: true,
            metaMensualLeads: 35,
            comisionConversion: 0.07
        }
    ];

    for (const agentData of agents) {
        try {
            const agent = await prisma.proSocialAgent.upsert({
                where: { email: agentData.email },
                update: {},
                create: agentData
            });

            console.log(`✅ Agent created/updated: ${agent.nombre} (${agent.email})`);
        } catch (error) {
            console.error(`❌ Error creating agent ${agentData.nombre}:`, error);
        }
    }

    console.log('🎉 Agents seeding completed!');
}

seedAgents()
    .catch((e) => {
        console.error('❌ Error seeding agents:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
