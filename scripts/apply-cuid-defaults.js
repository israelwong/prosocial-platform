#!/usr/bin/env node

/**
 * Script para aplicar los defaults de CUID a la base de datos
 * Ejecutar cuando la conexión a Supabase se restablezca
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function applyCuidDefaults() {
    try {
        console.log('🔄 Aplicando defaults de CUID a la base de datos...');
        
        // Leer el archivo SQL de migración
        const migrationPath = path.join(__dirname, '../prisma/migrations/manual_add_cuid_defaults.sql');
        const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
        
        // Dividir en statements individuales
        const statements = migrationSQL
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        console.log(`📝 Ejecutando ${statements.length} statements...`);
        
        // Ejecutar cada statement
        for (let i = 0; i < statements.length; i++) {
            const statement = statements[i];
            if (statement.trim()) {
                console.log(`  ${i + 1}. ${statement.substring(0, 50)}...`);
                await prisma.$executeRawUnsafe(statement);
            }
        }
        
        console.log('✅ Defaults de CUID aplicados correctamente');
        console.log('🎉 La creación de pipeline stages ahora debería funcionar');
        
    } catch (error) {
        console.error('❌ Error aplicando defaults de CUID:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    applyCuidDefaults();
}

module.exports = { applyCuidDefaults };
