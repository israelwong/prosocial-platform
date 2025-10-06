/**
 * Script para debuggear el problema de suscripción paso a paso
 * Simula exactamente lo que hace la función obtenerDatosSuscripcion
 */

const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Faltan variables de entorno');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugSuscripcionCompleto() {
    console.log('🔍 Debuggeando problema de suscripción paso a paso...\n');

    try {
        // PASO 1: Autenticar usuario (simular lo que hace la función)
        console.log('1️⃣ Autenticando usuario...');
        const { data: { user }, error: userError } = await supabase.auth.signInWithPassword({
            email: 'owner@demo-studio.com',
            password: 'Owner123!'
        });

        if (userError || !user) {
            console.log('❌ Error de autenticación:', userError?.message);
            return;
        }

        console.log('✅ Usuario autenticado:');
        console.log('   ID Supabase:', user.id);
        console.log('   Email:', user.email);

        // PASO 2: Buscar usuario en nuestra tabla usando supabase_id
        console.log('\n2️⃣ Buscando usuario en BD...');
        const dbUser = await prisma.users.findUnique({
            where: { supabase_id: user.id }
        });

        if (!dbUser) {
            console.log('❌ Usuario no encontrado en BD');
            console.log('   ID buscado:', user.id);
            
            // Mostrar todos los usuarios para comparar
            const allUsers = await prisma.users.findMany({
                select: { id: true, email: true, supabase_id: true }
            });
            console.log('   Usuarios en BD:', allUsers);
            return;
        }

        console.log('✅ Usuario encontrado en BD:');
        console.log('   ID BD:', dbUser.id);
        console.log('   Email:', dbUser.email);
        console.log('   Supabase ID:', dbUser.supabase_id);

        // PASO 3: Buscar roles del usuario
        console.log('\n3️⃣ Buscando roles del usuario...');
        const userStudioRoles = await prisma.user_studio_roles.findMany({
            where: { user_id: dbUser.id },
            include: { studio: true }
        });

        console.log('   Roles encontrados:', userStudioRoles.length);
        userStudioRoles.forEach((role, index) => {
            console.log(`   ${index + 1}. Studio: ${role.studio.studio_name} (${role.studio.slug})`);
            console.log(`      Rol: ${role.role}`);
            console.log(`      Activo: ${role.is_active}`);
            console.log(`      Studio ID: ${role.studio.id}`);
        });

        // PASO 4: Buscar específicamente rol OWNER
        console.log('\n4️⃣ Buscando rol OWNER...');
        const userStudioRole = await prisma.user_studio_roles.findFirst({
            where: { 
                user_id: dbUser.id,
                role: 'OWNER'
            },
            include: { studio: true }
        });

        if (!userStudioRole) {
            console.log('❌ No se encontró rol OWNER');
            console.log('   Roles disponibles:', userStudioRoles.map(r => r.role));
            return;
        }

        console.log('✅ Rol OWNER encontrado:');
        console.log('   Studio:', userStudioRole.studio.studio_name);
        console.log('   Studio ID:', userStudioRole.studio.id);
        console.log('   Studio Slug:', userStudioRole.studio.slug);

        // PASO 5: Buscar suscripción
        console.log('\n5️⃣ Buscando suscripción...');
        const subscription = await prisma.subscriptions.findFirst({
            where: { studio_id: userStudioRole.studio.id },
            include: {
                plans: true,
                items: {
                    where: { deactivated_at: null },
                    include: { plan: true }
                }
            }
        });

        if (!subscription) {
            console.log('❌ No se encontró suscripción');
            return;
        }

        console.log('✅ Suscripción encontrada:');
        console.log('   ID:', subscription.id);
        console.log('   Plan:', subscription.plans.name);
        console.log('   Status:', subscription.status);
        console.log('   Items:', subscription.items.length);

        // PASO 6: Buscar límites del plan
        console.log('\n6️⃣ Buscando límites del plan...');
        const limits = await prisma.plan_limits.findMany({
            where: { plan_id: subscription.plan_id }
        });

        console.log('   Límites encontrados:', limits.length);
        limits.forEach(limit => {
            console.log(`   - ${limit.limit_type}: ${limit.limit_value} ${limit.unit || ''}`);
        });

        console.log('\n🎯 RESUMEN:');
        console.log('✅ Usuario autenticado correctamente');
        console.log('✅ Usuario encontrado en BD');
        console.log('✅ Rol OWNER encontrado');
        console.log('✅ Suscripción encontrada');
        console.log('✅ Límites del plan encontrados');
        console.log('\n🔍 El problema NO está en los datos de BD');

    } catch (error) {
        console.error('❌ Error inesperado:', error);
    } finally {
        await prisma.$disconnect();
    }
}

debugSuscripcionCompleto().catch(console.error);
