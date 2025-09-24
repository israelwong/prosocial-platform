const { PrismaClient } = require('@prisma/client');

async function checkSetupTables() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🔍 Verificando tablas del sistema de setup...\n');
        
        // Verificar si las tablas existen
        const tables = [
            'studio_setup_status',
            'setup_section_progress', 
            'setup_section_config',
            'setup_progress_log'
        ];
        
        for (const table of tables) {
            try {
                const result = await prisma.$queryRaw`SELECT COUNT(*) as count FROM ${table}`;
                console.log(`✅ ${table}: ${result[0].count} registros`);
            } catch (error) {
                console.log(`❌ ${table}: No existe - ${error.message}`);
            }
        }
        
        // Verificar si hay datos de configuración de secciones
        try {
            const sectionsConfig = await prisma.setup_section_config.findMany();
            console.log(`\n📋 Configuración de secciones: ${sectionsConfig.length} secciones`);
            
            if (sectionsConfig.length === 0) {
                console.log('⚠️  No hay configuración de secciones. Necesitamos inicializar...');
            }
        } catch (error) {
            console.log(`❌ Error al verificar configuración de secciones: ${error.message}`);
        }
        
    } catch (error) {
        console.error('❌ Error general:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

checkSetupTables();
