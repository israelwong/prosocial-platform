/**
 * Script para debuggear problema de suscripción
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function debugSuscripcion() {
    console.log('🔍 Debuggeando problema de suscripción...\n');

    try {
        // 1. Buscar usuario por email
        const user = await prisma.users.findUnique({
            where: { email: 'owner@demo-studio.com' },
            include: {
                studio_roles: {
                    include: { studio: true }
                }
            }
        });

        console.log('1. Usuario encontrado:');
        console.log('   ID:', user?.id);
        console.log('   Email:', user?.email);
        console.log('   Supabase ID:', user?.supabase_id);
        console.log('   Roles:', user?.studio_roles.map(role => ({
            studio: role.studio.studio_name,
            role: role.role,
            is_active: role.is_active
        })));

        // 2. Buscar suscripción
        if (user?.studio_roles?.[0]?.studio) {
            const studio = user.studio_roles[0].studio;
            console.log('\n2. Studio encontrado:');
            console.log('   ID:', studio.id);
            console.log('   Nombre:', studio.studio_name);
            console.log('   Slug:', studio.slug);

            const subscription = await prisma.subscriptions.findFirst({
                where: { studio_id: studio.id },
                include: {
                    plans: true,
                    items: {
                        where: { deactivated_at: null },
                        include: { plan: true }
                    }
                }
            });

            console.log('\n3. Suscripción:');
            if (subscription) {
                console.log('   ID:', subscription.id);
                console.log('   Plan:', subscription.plans.name);
                console.log('   Status:', subscription.status);
                console.log('   Items:', subscription.items.length);
            } else {
                console.log('   ❌ No se encontró suscripción');
            }
        }

        // 3. Verificar planes
        const plans = await prisma.platform_plans.findMany({
            where: { active: true }
        });

        console.log('\n4. Planes disponibles:');
        plans.forEach(plan => {
            console.log(`   ${plan.name} (${plan.slug}): ${plan.price_monthly} MXN/mes`);
        });

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debugSuscripcion().catch(console.error);
