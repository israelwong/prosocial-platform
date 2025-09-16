import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPlans() {
    console.log('🌱 Seeding plans...');

    // Plan Básico
    const planBasico = await prisma.platform_plans.upsert({
        where: { slug: 'basic' },
        update: {},
        create: {
            name: 'Plan Básico',
            description: 'Perfecto para estudios pequeños que están comenzando',
            slug: 'basic',
            price_monthly: 29.99,
            price_yearly: 299.99,
            features: {
                eventos_mensuales: 10,
                clientes_maximos: 50,
                storage_gb: 5,
                soporte: 'email',
                reportes_basicos: true,
                integracion_stripe: true,
                dominio_personalizado: false,
                api_access: false
            },
            limits: {
                eventos_simultaneos: 3,
                usuarios_equipo: 2,
                cotizaciones_mensuales: 20,
                backup_automatico: false
            },
            stripe_price_id: 'price_1S73QoHxyreVzp11ZcP1hGea', // Mensual
            stripe_product_id: 'prod_T39jUez5Bkutia',
            popular: false,
            active: true,
            orden: 1
        }
    });

    // Plan Pro
    const planPro = await prisma.platform_plans.upsert({
        where: { slug: 'pro' },
        update: {},
        create: {
            name: 'Plan Pro',
            description: 'Ideal para estudios en crecimiento',
            slug: 'pro',
            price_monthly: 59.99,
            price_yearly: 599.99,
            features: {
                eventos_mensuales: 50,
                clientes_maximos: 200,
                storage_gb: 25,
                soporte: 'email_telefono',
                reportes_avanzados: true,
                integracion_stripe: true,
                dominio_personalizado: true,
                api_access: true
            },
            limits: {
                eventos_simultaneos: 10,
                usuarios_equipo: 5,
                cotizaciones_mensuales: 100,
                backup_automatico: true
            },
            stripe_price_id: 'price_1S73R2HxyreVzp11gswaqc6w', // Mensual
            stripe_product_id: 'prod_T39kWvt4LTTEve',
            popular: true,
            active: true,
            orden: 2
        }
    });

    // Plan Enterprise
    const planEnterprise = await prisma.platform_plans.upsert({
        where: { slug: 'enterprise' },
        update: {},
        create: {
            name: 'Plan Enterprise',
            description: 'Para estudios grandes con necesidades avanzadas',
            slug: 'enterprise',
            price_monthly: 99.99,
            price_yearly: 999.99,
            features: {
                eventos_mensuales: -1, // Ilimitado
                clientes_maximos: -1, // Ilimitado
                storage_gb: 100,
                soporte: 'dedicado',
                reportes_enterprise: true,
                integracion_stripe: true,
                dominio_personalizado: true,
                api_access: true,
                sso: true,
                webhooks: true
            },
            limits: {
                eventos_simultaneos: -1, // Ilimitado
                usuarios_equipo: -1, // Ilimitado
                cotizaciones_mensuales: -1, // Ilimitado
                backup_automatico: true,
                sla: '99.9%'
            },
            stripe_price_id: 'price_1S73RJHxyreVzp11czpvJxqg', // Mensual
            stripe_product_id: 'prod_T39ky4iJ11SGUu',
            popular: false,
            active: true,
            orden: 3
        }
    });

    console.log('✅ Plans seeded successfully:');
    console.log(`  - ${planBasico.name} (${planBasico.slug})`);
    console.log(`  - ${planPro.name} (${planPro.slug})`);
    console.log(`  - ${planEnterprise.name} (${planEnterprise.slug})`);

    // Crear también los precios anuales como planes separados
    const planBasicoAnual = await prisma.platform_plans.upsert({
        where: { slug: 'basic-yearly' },
        update: {},
        create: {
            name: 'Plan Básico (Anual)',
            description: 'Plan Básico con descuento anual - 2 meses gratis',
            slug: 'basic-yearly',
            price_monthly: 24.99, // Precio efectivo mensual
            price_yearly: 299.99,
            features: {
                eventos_mensuales: 10,
                clientes_maximos: 50,
                storage_gb: 5,
                soporte: 'email',
                reportes_basicos: true,
                integracion_stripe: true,
                dominio_personalizado: false,
                api_access: false,
                descuento_anual: '2 meses gratis'
            },
            limits: {
                eventos_simultaneos: 3,
                usuarios_equipo: 2,
                cotizaciones_mensuales: 20,
                backup_automatico: false
            },
            stripe_price_id: 'price_1S73QtHxyreVzp11m17YEJyN', // Anual
            stripe_product_id: 'prod_T39jUez5Bkutia',
            popular: false,
            active: true,
            orden: 4
        }
    });

    const planProAnual = await prisma.platform_plans.upsert({
        where: { slug: 'pro-yearly' },
        update: {},
        create: {
            name: 'Plan Pro (Anual)',
            description: 'Plan Pro con descuento anual - 2 meses gratis',
            slug: 'pro-yearly',
            price_monthly: 49.99, // Precio efectivo mensual
            price_yearly: 599.99,
            features: {
                eventos_mensuales: 50,
                clientes_maximos: 200,
                storage_gb: 25,
                soporte: 'email_telefono',
                reportes_avanzados: true,
                integracion_stripe: true,
                dominio_personalizado: true,
                api_access: true,
                descuento_anual: '2 meses gratis'
            },
            limits: {
                eventos_simultaneos: 10,
                usuarios_equipo: 5,
                cotizaciones_mensuales: 100,
                backup_automatico: true
            },
            stripe_price_id: 'price_1S73R7HxyreVzp11qeP4xd1a', // Anual
            stripe_product_id: 'prod_T39kWvt4LTTEve',
            popular: true,
            active: true,
            orden: 5
        }
    });

    const planEnterpriseAnual = await prisma.platform_plans.upsert({
        where: { slug: 'enterprise-yearly' },
        update: {},
        create: {
            name: 'Plan Enterprise (Anual)',
            description: 'Plan Enterprise con descuento anual - 2 meses gratis',
            slug: 'enterprise-yearly',
            price_monthly: 83.33, // Precio efectivo mensual
            price_yearly: 999.99,
            features: {
                eventos_mensuales: -1, // Ilimitado
                clientes_maximos: -1, // Ilimitado
                storage_gb: 100,
                soporte: 'dedicado',
                reportes_enterprise: true,
                integracion_stripe: true,
                dominio_personalizado: true,
                api_access: true,
                sso: true,
                webhooks: true,
                descuento_anual: '2 meses gratis'
            },
            limits: {
                eventos_simultaneos: -1, // Ilimitado
                usuarios_equipo: -1, // Ilimitado
                cotizaciones_mensuales: -1, // Ilimitado
                backup_automatico: true,
                sla: '99.9%'
            },
            stripe_price_id: 'price_1S73ROHxyreVzp11lpjQn3f4', // Anual
            stripe_product_id: 'prod_T39ky4iJ11SGUu',
            popular: false,
            active: true,
            orden: 6
        }
    });

    console.log('✅ Annual plans seeded successfully:');
    console.log(`  - ${planBasicoAnual.name} (${planBasicoAnual.slug})`);
    console.log(`  - ${planProAnual.name} (${planProAnual.slug})`);
    console.log(`  - ${planEnterpriseAnual.name} (${planEnterpriseAnual.slug})`);

    console.log('🎉 All plans seeded successfully!');
}

seedPlans()
    .catch((e) => {
        console.error('❌ Error seeding plans:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
