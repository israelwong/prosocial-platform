/**
 * Script para obtener el ID real del usuario autenticado
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Faltan variables de entorno');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function debugAuthId() {
    console.log('🔍 Obteniendo ID real del usuario autenticado...\n');

    try {
        // Autenticar con las credenciales de prueba
        const { data, error } = await supabase.auth.signInWithPassword({
            email: 'owner@demo-studio.com',
            password: 'Owner123!'
        });

        if (error) {
            console.error('❌ Error de autenticación:', error.message);
            return;
        }

        console.log('✅ Autenticación exitosa');
        console.log('Usuario ID:', data.user.id);
        console.log('Email:', data.user.email);
        console.log('Session:', !!data.session);

        // Ahora verificar si este ID existe en nuestra BD
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();

        const dbUser = await prisma.users.findUnique({
            where: { supabase_id: data.user.id }
        });

        console.log('\n🔍 Verificación en BD:');
        if (dbUser) {
            console.log('   ✅ Usuario encontrado en BD');
            console.log('   ID:', dbUser.id);
            console.log('   Email:', dbUser.email);
            console.log('   Supabase ID:', dbUser.supabase_id);
        } else {
            console.log('   ❌ Usuario NO encontrado en BD');
            console.log('   ID buscado:', data.user.id);
        }

        await prisma.$disconnect();

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

debugAuthId().catch(console.error);
