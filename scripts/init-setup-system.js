const { PrismaClient } = require('@prisma/client');

async function initSetupSystem() {
    const prisma = new PrismaClient();
    
    try {
        console.log('🚀 Inicializando sistema de setup...\n');
        
        // 1. Crear configuración de secciones si no existe
        const sectionsConfig = [
            {
                sectionId: 'identidad',
                sectionName: 'Identidad del Estudio',
                description: 'Configuración básica del estudio (nombre, logo, descripción)',
                requiredFields: ['name', 'logoUrl'],
                optionalFields: ['slogan', 'descripcion', 'palabras_clave'],
                dependencies: [],
                weight: 20,
                isActive: true
            },
            {
                sectionId: 'contacto',
                sectionName: 'Información de Contacto',
                description: 'Datos de contacto del estudio (email, teléfono, dirección)',
                requiredFields: ['email', 'phone'],
                optionalFields: ['address', 'website'],
                dependencies: ['identidad'],
                weight: 15,
                isActive: true
            },
            {
                sectionId: 'redes-sociales',
                sectionName: 'Redes Sociales',
                description: 'Configuración de redes sociales del estudio',
                requiredFields: ['redes_sociales'],
                optionalFields: [],
                dependencies: ['identidad'],
                weight: 10,
                isActive: true
            },
            {
                sectionId: 'precios',
                sectionName: 'Configuración de Precios',
                description: 'Configuración de precios y utilidades',
                requiredFields: ['basePrice', 'profitMargin'],
                optionalFields: ['sobreprecio', 'comision_venta'],
                dependencies: ['identidad'],
                weight: 25,
                isActive: true
            },
            {
                sectionId: 'condiciones',
                sectionName: 'Condiciones Comerciales',
                description: 'Términos y condiciones comerciales',
                requiredFields: ['condiciones_comerciales'],
                optionalFields: [],
                dependencies: ['precios'],
                weight: 15,
                isActive: true
            },
            {
                sectionId: 'servicios',
                sectionName: 'Servicios',
                description: 'Catálogo de servicios del estudio',
                requiredFields: ['servicios'],
                optionalFields: ['paquetes'],
                dependencies: ['precios'],
                weight: 15,
                isActive: true
            }
        ];
        
        for (const config of sectionsConfig) {
            try {
                await prisma.setup_section_config.upsert({
                    where: { sectionId: config.sectionId },
                    update: config,
                    create: config
                });
                console.log(`✅ Sección ${config.sectionId} configurada`);
            } catch (error) {
                console.log(`❌ Error en sección ${config.sectionId}: ${error.message}`);
            }
        }
        
        console.log('\n🎉 Sistema de setup inicializado correctamente');
        
    } catch (error) {
        console.error('❌ Error al inicializar sistema:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

initSetupSystem();
