#!/usr/bin/env node

/**
 * Script para configurar Supabase Realtime en ProSocial Platform
 * 
 * Este script:
 * 1. Ejecuta los triggers SQL para habilitar Realtime
 * 2. Configura las políticas RLS necesarias
 * 3. Verifica que la configuración sea correcta
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Variables de entorno de Supabase no configuradas');
  console.error('Necesitas: NEXT_PUBLIC_SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupRealtime() {
  try {
    console.log('🚀 Configurando Supabase Realtime...');

    // Leer el archivo SQL
    const sqlPath = path.join(__dirname, 'setup-realtime-triggers.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    // Ejecutar el SQL
    console.log('📝 Ejecutando triggers SQL...');
    const { data, error } = await supabase.rpc('exec_sql', { sql: sqlContent });

    if (error) {
      console.error('❌ Error ejecutando SQL:', error);
      return false;
    }

    console.log('✅ Triggers SQL ejecutados correctamente');

    // Verificar que la tabla projects esté en la publicación de Realtime
    console.log('🔍 Verificando configuración de Realtime...');
    
    const { data: tables, error: tablesError } = await supabase
      .from('pg_publication_tables')
      .select('*')
      .eq('pubname', 'supabase_realtime')
      .eq('tablename', 'projects');

    if (tablesError) {
      console.error('❌ Error verificando tablas de Realtime:', tablesError);
      return false;
    }

    if (tables && tables.length > 0) {
      console.log('✅ Tabla projects habilitada en Realtime');
    } else {
      console.log('⚠️  Tabla projects no encontrada en Realtime, ejecutando comando manual...');
      
      // Ejecutar comando manual para habilitar Realtime
      const { error: alterError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER PUBLICATION supabase_realtime ADD TABLE projects;'
      });

      if (alterError) {
        console.error('❌ Error habilitando Realtime en projects:', alterError);
        return false;
      }

      console.log('✅ Tabla projects habilitada manualmente en Realtime');
    }

    // Verificar que el trigger exista
    const { data: triggers, error: triggersError } = await supabase
      .from('pg_trigger')
      .select('*')
      .eq('tgname', 'projects_broadcast_trigger');

    if (triggersError) {
      console.error('❌ Error verificando triggers:', triggersError);
      return false;
    }

    if (triggers && triggers.length > 0) {
      console.log('✅ Trigger projects_broadcast_trigger configurado');
    } else {
      console.log('❌ Trigger projects_broadcast_trigger no encontrado');
      return false;
    }

    console.log('🎉 ¡Configuración de Realtime completada exitosamente!');
    console.log('');
    console.log('📋 Resumen:');
    console.log('  ✅ Tabla projects habilitada en Realtime');
    console.log('  ✅ Trigger projects_broadcast_trigger creado');
    console.log('  ✅ Políticas RLS configuradas');
    console.log('  ✅ Función notify_projects_changes() creada');
    console.log('');
    console.log('🔧 Próximos pasos:');
    console.log('  1. Reinicia tu aplicación Next.js');
    console.log('  2. Prueba actualizando el nombre o isotipo del studio');
    console.log('  3. Verifica que el navbar se actualice automáticamente');

    return true;

  } catch (error) {
    console.error('❌ Error inesperado:', error);
    return false;
  }
}

// Ejecutar si es llamado directamente
if (require.main === module) {
  setupRealtime()
    .then((success) => {
      process.exit(success ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Error fatal:', error);
      process.exit(1);
    });
}

module.exports = { setupRealtime };
