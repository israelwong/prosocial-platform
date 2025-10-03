import { prisma } from '../../src/lib/prisma';

export async function seedModules() {
    console.log('🧩 Seeding platform modules...');

    const modules = [
        // CORE MODULES
        {
            slug: 'manager',
            name: 'ZEN Manager',
            description: 'Sistema de gestión operacional de eventos y proyectos - Kanban, Gantt, equipo y tareas',
            type: 'CORE',
        },
        {
            slug: 'magic',
            name: 'ZEN Magic',
            description: 'Asistente inteligente con IA - Chat, function calling, Claude integration',
            type: 'CORE',
        },
        {
            slug: 'marketing',
            name: 'ZEN Marketing',
            description: 'CRM y pipeline de ventas - Leads, cotizaciones, conversión',
            type: 'CORE',
        },
        {
            slug: 'pages',
            name: 'ZEN Pages',
            description: 'Landing page pública - Portfolios, lead forms, presencia online',
            type: 'CORE',
        },

        // ADDON MODULES
        {
            slug: 'payment',
            name: 'ZEN Payment',
            description: 'Procesamiento de pagos - Stripe Connect, cuotas, reportes financieros',
            type: 'ADDON',
        },
        {
            slug: 'cloud',
            name: 'ZEN Cloud',
            description: 'Almacenamiento y galerías - CDN, descargas, watermarking',
            type: 'ADDON',
        },
        {
            slug: 'conversations',
            name: 'ZEN Conversations',
            description: 'Chat en tiempo real - WhatsApp, SMS, notificaciones',
            type: 'ADDON',
        },
        {
            slug: 'invitation',
            name: 'ZEN Invitation',
            description: 'Invitaciones digitales - RSVP, lista de invitados, QR codes',
            type: 'ADDON',
        }
    ];

    for (const module of modules) {
        await prisma.platform_modules.upsert({
            where: { slug: module.slug },
            update: module,
            create: module,
        });
        console.log(`✅ Módulo: ${module.name} (${module.type})`);
    }

    console.log('🎉 Platform modules seeded successfully!');
}

