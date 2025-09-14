const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testSupabaseConnection() {
    try {
        console.log('🧪 Probando conexión a Supabase...');

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

        console.log('📋 Variables de entorno:');
        console.log(`  • URL: ${supabaseUrl ? '✅ Definida' : '❌ No definida'}`);
        console.log(`  • Key: ${supabaseKey ? '✅ Definida' : '❌ No definida'}`);

        if (!supabaseUrl || !supabaseKey) {
            throw new Error('Variables de entorno de Supabase no definidas');
        }

        const supabase = createClient(supabaseUrl, supabaseKey);

        // Probar conexión básica
        console.log('\n🔌 Probando conexión básica...');
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError && authError.message !== 'Auth session missing!') {
            console.log('⚠️ Error de autenticación (esperado):', authError.message);
        } else {
            console.log('✅ Conexión básica exitosa');
        }

        // Probar consulta a la tabla de canales
        console.log('\n📊 Probando consulta a canales...');
        const { data: canales, error: canalesError } = await supabase
            .from('prosocial_canales_adquisicion')
            .select('*')
            .limit(5);

        if (canalesError) {
            console.error('❌ Error en consulta de canales:', canalesError);
            throw canalesError;
        }

        console.log(`✅ Consulta exitosa: ${canales.length} canales encontrados`);
        
        if (canales.length > 0) {
            console.log('\n📋 Primeros canales:');
            canales.forEach((canal, index) => {
                console.log(`  ${index + 1}. ${canal.nombre} (${canal.categoria})`);
            });
        }

        // Probar consulta con ordenamiento
        console.log('\n🔄 Probando consulta con ordenamiento...');
        const { data: canalesOrdenados, error: ordenError } = await supabase
            .from('prosocial_canales_adquisicion')
            .select('*')
            .order('categoria', { ascending: true })
            .order('orden', { ascending: true })
            .limit(3);

        if (ordenError) {
            console.error('❌ Error en consulta ordenada:', ordenError);
            throw ordenError;
        }

        console.log(`✅ Consulta ordenada exitosa: ${canalesOrdenados.length} canales`);
        
        if (canalesOrdenados.length > 0) {
            console.log('\n📋 Canales ordenados:');
            canalesOrdenados.forEach((canal, index) => {
                console.log(`  ${index + 1}. ${canal.nombre} (${canal.categoria}) - Orden: ${canal.orden}`);
            });
        }

        console.log('\n🎉 Todas las pruebas de conexión exitosas!');

    } catch (error) {
        console.error('❌ Error durante las pruebas:', error);
        throw error;
    }
}

// Ejecutar las pruebas
testSupabaseConnection()
    .then(() => {
        console.log('✅ Pruebas finalizadas');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
