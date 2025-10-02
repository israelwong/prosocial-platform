import { prisma } from '../../src/lib/prisma';

export async function seedModules() {
    console.log('🧩 Seeding platform modules...');

    const modules = [
        // CORE MODULES (incluidos en todos los planes)
        {
            id: 'module-manager',
            slug: 'manager',
            name: 'ZEN Manager',
            description: 'Sistema de gestión operacional de eventos y proyectos - Kanban, Gantt, equipo y tareas',
            category: 'CORE',
            base_price: null, // Incluido en todos los planes
            billing_type: 'MONTHLY',
            version: '1.0.0',
            is_active: true
        },
        {
            id: 'module-magic',
            slug: 'magic',
            name: 'ZEN Magic',
            description: 'Asistente inteligente con IA - Chat, function calling, Claude integration',
            category: 'CORE',
            base_price: null, // Incluido en planes Pro+
            billing_type: 'MONTHLY',
            version: '1.0.0',
            is_active: true
        },
        {
            id: 'module-marketing',
            slug: 'marketing',
            name: 'ZEN Marketing',
            description: 'CRM y pipeline de ventas - Leads, cotizaciones, conversión',
            category: 'CORE',
            base_price: null, // Incluido en planes Pro+
            billing_type: 'MONTHLY',
            version: '1.0.0',
            is_active: true
        },
        {
            id: 'module-pages',
            slug: 'pages',
            name: 'ZEN Pages',
            description: 'Landing page pública - Portfolios, lead forms, presencia online',
            category: 'CORE',
            base_price: null, // Incluido en todos los planes
            billing_type: 'MONTHLY',
            version: '1.0.0',
            is_active: true
        },

        // ADDON MODULES (adicionales con precio)
        {
            id: 'module-payment',
            slug: 'payment',
            name: 'ZEN Payment',
            description: 'Procesamiento de pagos - Stripe Connect, cuotas, reportes financieros',
            category: 'ADDON',
            base_price: 10.00, // $10 USD/mes
            billing_type: 'MONTHLY',
            version: '1.0.0',
            is_active: true
        },
        {
            id: 'module-cloud',
            slug: 'cloud',
            name: 'ZEN Cloud',
            description: 'Almacenamiento y galerías - CDN, descargas, watermarking',
            category: 'ADDON',
            base_price: 15.00, // $15 USD/mes
            billing_type: 'MONTHLY',
            version: '1.0.0',
            is_active: true
        },
        {
            id: 'module-conversations',
            slug: 'conversations',
            name: 'ZEN Conversations',
            description: 'Chat en tiempo real - WhatsApp, SMS, notificaciones',
            category: 'ADDON',
            base_price: 15.00, // $15 USD/mes
            billing_type: 'MONTHLY',
            version: '1.0.0',
            is_active: true
        },
        {
            id: 'module-invitation',
            slug: 'invitation',
            name: 'ZEN Invitation',
            description: 'Invitaciones digitales - RSVP, lista de invitados, QR codes',
            category: 'ADDON',
            base_price: 12.00, // $12 USD/mes
            billing_type: 'MONTHLY',
            version: '1.0.0',
            is_active: true
        }
    ];

    for (const module of modules) {
        await prisma.platform_modules.upsert({
            where: { id: module.id },
            update: {
                ...module,
                updated_at: new Date()
            },
            create: {
                ...module,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        const priceInfo = module.base_price ? ` - $${module.base_price}/mes` : ' - Incluido';
        console.log(`✅ Módulo: ${module.name} (${module.category}${priceInfo})`);
    }

    console.log('🎉 Platform modules seeded successfully!');
}

