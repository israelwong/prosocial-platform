/**
 * Seed para planes de suscripción y suscripción demo
 * Basado en: docs/revisar/Estrategia de Pricing ZEN.md
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ========================================
// PLANES DE SUSCRIPCIÓN
// ========================================

async function seedPlans() {
    console.log('📋 Seeding planes de suscripción...');

    // 1. FREE PLAN
    const freePlan = await prisma.platform_plans.upsert({
        where: { slug: 'free' },
        update: {},
        create: {
            name: 'FREE',
            slug: 'free',
            description: 'Perfecto para empezar. Incluye lo esencial para gestionar tu estudio.',
            price_monthly: 0,
            price_yearly: 0,
            stripe_product_id: null, // Sin Stripe por ahora
            stripe_price_id: null,
            features: {
                highlights: [
                    'ZEN Manager completo',
                    '2 eventos activos',
                    '10 cotizaciones/mes',
                    '3 GB almacenamiento',
                    '20 mensajes IA/mes',
                    '1 portfolio',
                    '1 landing page'
                ],
                modules: ['manager']
            },
            popular: false,
            active: true,
            orden: 1,
            created_at: new Date(),
            updated_at: new Date()
        }
    });

    // 2. PRO PLAN (Más Popular)
    const proPlan = await prisma.platform_plans.upsert({
        where: { slug: 'pro' },
        update: {},
        create: {
            name: 'PRO',
            slug: 'pro',
            description: 'El plan más popular. Perfecto para estudios en crecimiento.',
            price_monthly: 799,
            price_yearly: 7990, // 2 meses gratis
            stripe_product_id: null,
            stripe_price_id: null,
            features: {
                highlights: [
                    'TODO de FREE +',
                    'ZEN Marketing (CRM)',
                    '25 eventos activos',
                    'Cotizaciones ilimitadas',
                    '75 GB almacenamiento',
                    '500 mensajes IA/mes',
                    '5 portfolios',
                    '1 landing page sin marca ZEN',
                    '5 usuarios adicionales'
                ],
                modules: ['manager', 'marketing']
            },
            popular: true,
            active: true,
            orden: 2,
            created_at: new Date(),
            updated_at: new Date()
        }
    });

    // 3. ENTERPRISE PLAN
    const enterprisePlan = await prisma.platform_plans.upsert({
        where: { slug: 'enterprise' },
        update: {},
        create: {
            name: 'ENTERPRISE',
            slug: 'enterprise',
            description: 'Para agencias grandes y estudios premium. White label completo.',
            price_monthly: 1499,
            price_yearly: 14990, // 2 meses gratis
            stripe_product_id: null,
            stripe_price_id: null,
            features: {
                highlights: [
                    'TODO de PRO +',
                    'White label completo',
                    'Eventos ilimitados',
                    '300 GB almacenamiento',
                    '2000 mensajes IA/mes',
                    'Portfolios ilimitados',
                    'Landing pages ilimitadas',
                    'Usuarios ilimitados',
                    'Soporte prioritario'
                ],
                modules: ['manager', 'marketing', 'pages']
            },
            popular: false,
            active: true,
            orden: 3,
            created_at: new Date(),
            updated_at: new Date()
        }
    });

    console.log(`  ✅ FREE Plan: ${freePlan.name} (${freePlan.price_monthly} MXN/mes)`);
    console.log(`  ✅ PRO Plan: ${proPlan.name} (${proPlan.price_monthly} MXN/mes) - POPULAR`);
    console.log(`  ✅ ENTERPRISE Plan: ${enterprisePlan.name} (${enterprisePlan.price_monthly} MXN/mes)`);

    return { freePlan, proPlan, enterprisePlan };
}

// ========================================
// LÍMITES POR PLAN
// ========================================

async function seedPlanLimits(plans: any) {
    console.log('📊 Seeding límites por plan...');

    // FREE PLAN LIMITS
    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.freePlan.id,
                limit_type: 'EVENTS_PER_MONTH'
            }
        },
        update: {},
        create: {
            plan_id: plans.freePlan.id,
            limit_type: 'EVENTS_PER_MONTH',
            limit_value: 2,
            unit: 'eventos'
        }
    });

    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.freePlan.id,
                limit_type: 'STORAGE_GB'
            }
        },
        update: {},
        create: {
            plan_id: plans.freePlan.id,
            limit_type: 'STORAGE_GB',
            limit_value: 3,
            unit: 'GB'
        }
    });

    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.freePlan.id,
                limit_type: 'TEAM_MEMBERS'
            }
        },
        update: {},
        create: {
            plan_id: plans.freePlan.id,
            limit_type: 'TEAM_MEMBERS',
            limit_value: 1, // Solo owner
            unit: 'usuarios'
        }
    });

    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.freePlan.id,
                limit_type: 'PORTFOLIOS'
            }
        },
        update: {},
        create: {
            plan_id: plans.freePlan.id,
            limit_type: 'PORTFOLIOS',
            limit_value: 1,
            unit: 'portfolios'
        }
    });

    // PRO PLAN LIMITS
    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.proPlan.id,
                limit_type: 'EVENTS_PER_MONTH'
            }
        },
        update: {},
        create: {
            plan_id: plans.proPlan.id,
            limit_type: 'EVENTS_PER_MONTH',
            limit_value: 25,
            unit: 'eventos'
        }
    });

    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.proPlan.id,
                limit_type: 'STORAGE_GB'
            }
        },
        update: {},
        create: {
            plan_id: plans.proPlan.id,
            limit_type: 'STORAGE_GB',
            limit_value: 75,
            unit: 'GB'
        }
    });

    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.proPlan.id,
                limit_type: 'TEAM_MEMBERS'
            }
        },
        update: {},
        create: {
            plan_id: plans.proPlan.id,
            limit_type: 'TEAM_MEMBERS',
            limit_value: 6, // Owner + 5 adicionales
            unit: 'usuarios'
        }
    });

    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.proPlan.id,
                limit_type: 'PORTFOLIOS'
            }
        },
        update: {},
        create: {
            plan_id: plans.proPlan.id,
            limit_type: 'PORTFOLIOS',
            limit_value: 5,
            unit: 'portfolios'
        }
    });

    // ENTERPRISE PLAN LIMITS (Ilimitados)
    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.enterprisePlan.id,
                limit_type: 'EVENTS_PER_MONTH'
            }
        },
        update: {},
        create: {
            plan_id: plans.enterprisePlan.id,
            limit_type: 'EVENTS_PER_MONTH',
            limit_value: -1, // Ilimitado
            unit: 'eventos'
        }
    });

    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.enterprisePlan.id,
                limit_type: 'STORAGE_GB'
            }
        },
        update: {},
        create: {
            plan_id: plans.enterprisePlan.id,
            limit_type: 'STORAGE_GB',
            limit_value: 300,
            unit: 'GB'
        }
    });

    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.enterprisePlan.id,
                limit_type: 'TEAM_MEMBERS'
            }
        },
        update: {},
        create: {
            plan_id: plans.enterprisePlan.id,
            limit_type: 'TEAM_MEMBERS',
            limit_value: -1, // Ilimitado
            unit: 'usuarios'
        }
    });

    await prisma.plan_limits.upsert({
        where: {
            plan_id_limit_type: {
                plan_id: plans.enterprisePlan.id,
                limit_type: 'PORTFOLIOS'
            }
        },
        update: {},
        create: {
            plan_id: plans.enterprisePlan.id,
            limit_type: 'PORTFOLIOS',
            limit_value: -1, // Ilimitado
            unit: 'portfolios'
        }
    });

    console.log('  ✅ Límites creados para todos los planes');
}

// ========================================
// SUSCRIPCIÓN DEMO
// ========================================

async function seedDemoSubscription() {
    console.log('👤 Creando suscripción demo...');

    // Buscar el usuario owner@demo-studio.com
    const user = await prisma.users.findUnique({
        where: { email: 'owner@demo-studio.com' }
    });

    if (!user) {
        console.error('❌ Usuario owner@demo-studio.com no encontrado');
        return;
    }

    // Buscar el studio del usuario a través de user_studio_roles
    const userStudioRole = await prisma.user_studio_roles.findFirst({
        where: { 
            user_id: user.id,
            role: 'OWNER'
        },
        include: { studio: true }
    });

    if (!userStudioRole) {
        console.error('❌ Usuario no tiene rol OWNER en ningún studio');
        return;
    }

    const studio = userStudioRole.studio;

    if (!studio) {
        console.error('❌ Studio no encontrado para el usuario');
        return;
    }

    // Buscar el plan FREE
    const freePlan = await prisma.platform_plans.findUnique({
        where: { slug: 'free' }
    });

    if (!freePlan) {
        console.error('❌ Plan FREE no encontrado');
        return;
    }

    // Verificar si ya existe una suscripción para este studio
    const existingSubscription = await prisma.subscriptions.findFirst({
        where: { studio_id: studio.id }
    });

    if (existingSubscription) {
        console.log(`  ⚠️  Ya existe suscripción para studio ${studio.name}`);
        return;
    }

    // Crear suscripción demo (sin Stripe)
    const subscription = await prisma.subscriptions.create({
        data: {
            studio_id: studio.id,
            stripe_subscription_id: `demo_sub_${studio.id}`, // ID demo
            stripe_customer_id: `demo_customer_${user.id}`, // ID demo
            plan_id: freePlan.id,
            status: 'ACTIVE',
            current_period_start: new Date(),
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            billing_cycle_anchor: new Date(),
            created_at: new Date(),
            updated_at: new Date()
        }
    });

    // Crear subscription item para el plan
    await prisma.subscription_items.create({
        data: {
            subscription_id: subscription.id,
            item_type: 'PLAN',
            plan_id: freePlan.id,
            unit_price: 0, // FREE
            quantity: 1,
            subtotal: 0,
            activated_at: new Date()
        }
    });

    console.log(`  ✅ Suscripción demo creada para ${user.email}`);
    console.log(`     Studio: ${studio.name}`);
    console.log(`     Plan: ${freePlan.name} (${freePlan.price_monthly} MXN/mes)`);
    console.log(`     Status: ${subscription.status}`);
}

// ========================================
// MAIN FUNCTION
// ========================================

async function main() {
    console.log('🌱 Seeding suscripción y planes...\n');

    try {
        // 1. Crear planes
        const plans = await seedPlans();
        
        // 2. Crear límites por plan
        await seedPlanLimits(plans);
        
        // 3. Crear suscripción demo
        await seedDemoSubscription();

        console.log('\n🎯 Seed de suscripción completado!');
        console.log('📊 Planes creados: FREE, PRO, ENTERPRISE');
        console.log('👤 Usuario demo con plan FREE');
        console.log('\n🔗 Para probar:');
        console.log('   /studio/demo-studio/configuracion/cuenta/suscripcion');

    } catch (error) {
        console.error('❌ Error en seed de suscripción:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main().catch(console.error);
