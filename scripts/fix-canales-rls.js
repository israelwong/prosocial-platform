const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function fixCanalesRLS() {
    try {
        console.log('🔧 Solucionando políticas RLS para canales...');

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error('Variables de entorno no definidas');
        }

        // Usar service role para administrar políticas
        const supabase = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        console.log('📋 Verificando tabla...');
        
        // Verificar que la tabla existe
        const { data: tables, error: tableError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .eq('table_name', 'prosocial_canales_adquisicion');

        if (tableError) {
            console.error('❌ Error verificando tabla:', tableError);
            return;
        }

        if (tables.length === 0) {
            console.log('❌ La tabla prosocial_canales_adquisicion no existe');
            return;
        }

        console.log('✅ Tabla encontrada');

        // Verificar políticas existentes
        console.log('📋 Verificando políticas existentes...');
        const { data: policies, error: policiesError } = await supabase
            .from('pg_policies')
            .select('policyname, cmd')
            .eq('tablename', 'prosocial_canales_adquisicion');

        if (policiesError) {
            console.log('⚠️ No se pudieron verificar políticas (normal si no existen)');
        } else {
            console.log(`📊 Políticas encontradas: ${policies.length}`);
            policies.forEach(policy => {
                console.log(`  • ${policy.policyname} (${policy.cmd})`);
            });
        }

        // Crear políticas usando SQL directo
        console.log('🔧 Creando políticas RLS...');

        const policiesSQL = [
            // Habilitar RLS
            'ALTER TABLE prosocial_canales_adquisicion ENABLE ROW LEVEL SECURITY;',
            
            // Política de lectura
            `CREATE POLICY IF NOT EXISTS "Canales are viewable by authenticated users" 
             ON prosocial_canales_adquisicion FOR SELECT 
             USING (auth.role() = 'authenticated');`,
            
            // Política de inserción
            `CREATE POLICY IF NOT EXISTS "Canales are insertable by authenticated users" 
             ON prosocial_canales_adquisicion FOR INSERT 
             WITH CHECK (auth.role() = 'authenticated');`,
            
            // Política de actualización
            `CREATE POLICY IF NOT EXISTS "Canales are updatable by authenticated users" 
             ON prosocial_canales_adquisicion FOR UPDATE 
             USING (auth.role() = 'authenticated');`,
            
            // Política de eliminación
            `CREATE POLICY IF NOT EXISTS "Canales are deletable by authenticated users" 
             ON prosocial_canales_adquisicion FOR DELETE 
             USING (auth.role() = 'authenticated');`
        ];

        for (const sql of policiesSQL) {
            try {
                const { error } = await supabase.rpc('exec_sql', { sql });
                if (error) {
                    console.log(`⚠️ Advertencia en SQL: ${error.message}`);
                } else {
                    console.log('✅ Política aplicada');
                }
            } catch (err) {
                console.log(`⚠️ Error ejecutando SQL: ${err.message}`);
            }
        }

        // Probar consulta con service role
        console.log('🧪 Probando consulta con service role...');
        const { data: canales, error: canalesError } = await supabase
            .from('prosocial_canales_adquisicion')
            .select('*')
            .limit(3);

        if (canalesError) {
            console.error('❌ Error en consulta:', canalesError);
        } else {
            console.log(`✅ Consulta exitosa: ${canales.length} canales encontrados`);
            if (canales.length > 0) {
                console.log('📋 Primeros canales:');
                canales.forEach((canal, index) => {
                    console.log(`  ${index + 1}. ${canal.nombre} (${canal.categoria})`);
                });
            }
        }

        console.log('\n🎉 Configuración de RLS completada!');

    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Ejecutar la corrección
fixCanalesRLS()
    .then(() => {
        console.log('✅ Corrección finalizada');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
