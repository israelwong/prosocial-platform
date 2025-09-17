#!/usr/bin/env node

/**
 * Script para verificar el estado de la base de datos
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabaseStatus() {
    try {
        console.log('🔍 Verificando estado de la base de datos...\n');
        
        // Verificar canales de adquisición
        const canalesCount = await prisma.platform_canales_adquisicion.count();
        console.log(`📊 Canales de adquisición: ${canalesCount}`);
        
        if (canalesCount > 0) {
            const canales = await prisma.platform_canales_adquisicion.findMany({
                select: { id: true, nombre: true, orden: true, isActive: true }
            });
            console.log('   Canales encontrados:');
            canales.forEach(canal => {
                console.log(`   - ${canal.nombre} (orden: ${canal.orden}, activo: ${canal.isActive})`);
            });
        }
        
        // Verificar etapas del pipeline
        const etapasCount = await prisma.platform_pipeline_stages.count();
        console.log(`\n📊 Etapas del pipeline: ${etapasCount}`);
        
        if (etapasCount > 0) {
            const etapas = await prisma.platform_pipeline_stages.findMany({
                select: { id: true, nombre: true, orden: true, isActive: true }
            });
            console.log('   Etapas encontradas:');
            etapas.forEach(etapa => {
                console.log(`   - ${etapa.nombre} (orden: ${etapa.orden}, activo: ${etapa.isActive})`);
            });
        }
        
        // Verificar leads
        const leadsCount = await prisma.platform_leads.count();
        console.log(`\n📊 Leads: ${leadsCount}`);
        
        // Verificar agentes
        const agentesCount = await prisma.platform_agents.count();
        console.log(`📊 Agentes: ${agentesCount}`);
        
        // Verificar configuración de plataforma
        const configCount = await prisma.platform_config.count();
        console.log(`📊 Configuración de plataforma: ${configCount}`);
        
        console.log('\n✅ Verificación completada');
        
        // Si no hay datos básicos, sugerir crear algunos
        if (canalesCount === 0 || etapasCount === 0) {
            console.log('\n⚠️  No se encontraron datos básicos. ¿Quieres crear algunos datos de prueba?');
            console.log('   Ejecuta: node scripts/create-basic-data.js');
        }
        
    } catch (error) {
        console.error('❌ Error verificando base de datos:', error);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    checkDatabaseStatus();
}

module.exports = { checkDatabaseStatus };
