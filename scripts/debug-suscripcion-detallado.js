/**
 * Script para debuggear el problema de suscripción paso a paso
 */

const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function debugSuscripcionDetallado() {
    console.log('🔍 Debuggeando problema de suscripción paso a paso...\n');

    try {
        // 1. Simular el usuario de Supabase Auth
        const supabaseUserId = 'owner-supabase-uuid'; // Este es el ID que devuelve Supabase Auth
        console.log('1. Supabase User ID:', supabaseUserId);

        // 2. Buscar el usuario en nuestra tabla usando supabase_id
        const dbUser = await prisma.users.findUnique({
            where: { supabase_id: supabaseUserId }
        });

        console.log('\n2. Usuario en BD:');
        if (dbUser) {
            console.log('   ✅ Encontrado:', dbUser.email);
            console.log('   ID:', dbUser.id);
            console.log('   Supabase ID:', dbUser.supabase_id);
        } else {
            console.log('   ❌ No encontrado');
            return;
        }

        // 3. Buscar roles del usuario
        const userStudioRoles = await prisma.user_studio_roles.findMany({
            where: { 
                user_id: dbUser.id
            },
            include: { studio: true }
        });

        console.log('\n3. Roles del usuario:');
        userStudioRoles.forEach(role => {
            console.log(`   - Studio: ${role.studio.studio_name} (${role.studio.slug})`);
            console.log(`     Rol: ${role.role}`);
            console.log(`     Activo: ${role.is_active}`);
        });

        // 4. Buscar específicamente rol OWNER
        const ownerRole = await prisma.user_studio_roles.findFirst({
            where: { 
                user_id: dbUser.id,
                role: 'OWNER'
            },
            include: { studio: true }
        });

        console.log('\n4. Rol OWNER:');
        if (ownerRole) {
            console.log('   ✅ Encontrado');
            console.log('   Studio:', ownerRole.studio.studio_name);
            console.log('   Studio ID:', ownerRole.studio.id);
            console.log('   Studio Slug:', ownerRole.studio.slug);
        } else {
            console.log('   ❌ No encontrado');
            
            // Verificar si hay roles pero no OWNER
            const allRoles = await prisma.user_studio_roles.findMany({
                where: { user_id: dbUser.id }
            });
            console.log('   Roles disponibles:', allRoles.map(r => r.role));
        }

        // 5. Si encontramos el rol OWNER, buscar suscripción
        if (ownerRole) {
            const subscription = await prisma.subscriptions.findFirst({
                where: { studio_id: ownerRole.studio.id },
                include: {
                    plans: true,
                    items: {
                        where: { deactivated_at: null },
                        include: { plan: true }
                    }
                }
            });

            console.log('\n5. Suscripción:');
            if (subscription) {
                console.log('   ✅ Encontrada');
                console.log('   ID:', subscription.id);
                console.log('   Plan:', subscription.plans.name);
                console.log('   Status:', subscription.status);
                console.log('   Items:', subscription.items.length);
            } else {
                console.log('   ❌ No encontrada');
            }
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debugSuscripcionDetallado().catch(console.error);
