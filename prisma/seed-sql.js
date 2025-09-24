const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed demo con SQL directo...');

    try {
        // Limpiar prepared statements
        await prisma.$disconnect();
        await prisma.$connect();

        // 1. Crear plan básico usando SQL directo
        console.log('📋 Creando plan básico...');
        await prisma.$executeRaw`
            INSERT INTO platform_plans (id, name, description, slug, price_monthly, price_yearly, features, limits, stripe_price_id, stripe_product_id, popular, active, orden, "createdAt", "updatedAt")
            VALUES (
                'plan-basic-demo',
                'Plan Básico',
                'Perfecto para estudios pequeños que están comenzando',
                'basic',
                29.99,
                299.99,
                '{"eventos_mensuales": 10, "clientes_maximos": 50, "storage_gb": 5, "soporte": "email"}',
                '{"eventos_simultaneos": 3, "usuarios_equipo": 2}',
                'price_demo_basic',
                'prod_demo_basic',
                false,
                true,
                1,
                NOW(),
                NOW()
            )
        `;
        console.log('✅ Plan básico creado');

        // 2. Crear redes sociales
        console.log('📱 Creando redes sociales...');
        await prisma.$executeRaw`
            INSERT INTO platform_social_networks (id, name, slug, description, color, icon, "baseUrl", "order", "isActive", "createdAt", "updatedAt")
            VALUES 
                ('instagram', 'Instagram', 'instagram', 'Plataforma para compartir fotos y videos', '#E4405F', 'instagram', 'https://instagram.com/', 1, true, NOW(), NOW()),
                ('facebook', 'Facebook', 'facebook', 'Red social para conectar con amigos y familia', '#1877F2', 'facebook', 'https://facebook.com/', 2, true, NOW(), NOW())
        `;
        console.log('✅ Redes sociales creadas');

        // 3. Crear canales de adquisición
        console.log('📊 Creando canales de adquisición...');
        await prisma.$executeRaw`
            INSERT INTO platform_acquisition_channels (id, name, description, color, icon, "isActive", "isVisible", "order", "updatedAt")
            VALUES 
                ('canal-referidos', 'Referidos', 'Clientes referidos por otros clientes', '#10B981', 'users', true, true, 1, NOW()),
                ('canal-redes-sociales', 'Redes Sociales', 'Leads provenientes de redes sociales', '#3B82F6', 'share-2', true, true, 2, NOW())
        `;
        console.log('✅ Canales de adquisición creados');

        // 4. Crear pipeline type
        console.log('🔄 Creando pipeline type...');
        await prisma.$executeRaw`
            INSERT INTO platform_pipeline_types (id, nombre, descripcion, color, activo, orden, "updatedAt")
            VALUES ('pipeline-comercial', 'Pipeline Comercial', 'Pipeline para gestión de leads comerciales y ventas', '#3B82F6', true, 1, NOW())
        `;
        console.log('✅ Pipeline type creado');

        // 5. Crear pipeline stages
        console.log('📋 Creando pipeline stages...');
        await prisma.$executeRaw`
            INSERT INTO platform_pipeline_stages (id, nombre, descripcion, color, orden, "isActive", pipeline_type_id, "updatedAt")
            VALUES 
                ('stage-comercial-nuevos', 'Nuevos Leads', 'Leads recién capturados que necesitan contacto inicial', '#3B82F6', 1, true, 'pipeline-comercial', NOW()),
                ('stage-comercial-contactados', 'Contactados', 'Leads que han sido contactados por primera vez', '#8B5CF6', 2, true, 'pipeline-comercial', NOW()),
                ('stage-comercial-interesados', 'Interesados', 'Leads que mostraron interés en los servicios', '#EAB308', 3, true, 'pipeline-comercial', NOW())
        `;
        console.log('✅ Pipeline stages creados');

        // 6. Crear demo-studio project
        console.log('🏢 Creando proyecto demo-studio...');
        await prisma.$executeRaw`
            INSERT INTO projects (id, name, slug, email, address, descripcion, "subscriptionStatus", "planId", active, "updatedAt")
            VALUES ('demo-studio-project', 'Demo Studio', 'demo-studio', 'contacto@demo-studio.com', '123 Demo Street, Demo City', 'Estudio de fotografía demo para pruebas y desarrollo', 'TRIAL', 'plan-basic-demo', true, NOW())
        `;
        console.log('✅ Proyecto demo-studio creado');

        // 7. Crear usuarios del estudio
        console.log('👥 Creando usuarios del estudio...');
        await prisma.$executeRaw`
            INSERT INTO project_users (id, username, email, "fullName", phone, type, role, status, "isActive", "projectId", "updatedAt")
            VALUES 
                ('demo-photographer', 'fotografo_demo', 'fotografo@demo-studio.com', 'Juan Pérez', '+1234567891', 'EMPLEADO', 'photographer', 'active', true, 'demo-studio-project', NOW()),
                ('demo-editor', 'editor_demo', 'editor@demo-studio.com', 'María García', '+1234567892', 'EMPLEADO', 'editor', 'active', true, 'demo-studio-project', NOW())
        `;
        console.log('✅ Usuarios del estudio creados');

        // 8. Crear perfiles profesionales
        console.log('🎯 Creando perfiles profesionales...');
        await prisma.$executeRaw`
            INSERT INTO project_user_professional_profiles (id, "userId", profile, description, "isActive", "updatedAt")
            VALUES 
                ('profile-photographer', 'demo-photographer', 'FOTOGRAFO', 'Perfil profesional de Juan Pérez', true, NOW()),
                ('profile-editor', 'demo-editor', 'EDITOR', 'Perfil profesional de María García', true, NOW())
        `;
        console.log('✅ Perfiles profesionales creados');

        // 9. Crear leads de ejemplo
        console.log('📈 Creando leads de ejemplo...');
        await prisma.$executeRaw`
            INSERT INTO platform_leads (id, name, email, phone, "studioName", "lastContactDate", "interestedPlan", "monthlyBudget", priority, "stageId", "acquisitionChannelId", "firstInteractionDate", "originalSource", "interactionCount", "leadType", "updatedAt")
            VALUES 
                ('lead-demo-1', 'Ana Martínez', 'ana.martinez@email.com', '+1234567894', 'Boda Ana & Carlos', NOW(), 'pro', 2000.00, 'high', 'stage-comercial-interesados', 'canal-referidos', NOW(), 'Referido por cliente anterior', 3, 'prospect', NOW()),
                ('lead-demo-2', 'Roberto Silva', 'roberto.silva@email.com', '+1234567895', 'Sesión Familiar Silva', NOW(), 'basic', 500.00, 'medium', 'stage-comercial-contactados', 'canal-redes-sociales', NOW(), 'Instagram', 1, 'prospect', NOW())
        `;
        console.log('✅ Leads de ejemplo creados');

        // 10. Crear redes sociales del proyecto
        console.log('🌐 Creando redes sociales del proyecto...');
        await prisma.$executeRaw`
            INSERT INTO project_redes_sociales (id, "projectId", "plataformaId", url, activo, "updatedAt")
            VALUES 
                ('demo-instagram', 'demo-studio-project', 'instagram', 'https://instagram.com/demo-studio', true, NOW()),
                ('demo-facebook', 'demo-studio-project', 'facebook', 'https://facebook.com/demo-studio', true, NOW())
        `;
        console.log('✅ Redes sociales del proyecto creadas');

        console.log('🎉 Seed demo completado exitosamente con SQL directo!');
        console.log('📊 Resumen:');
        console.log('  - 1 plan básico');
        console.log('  - 2 redes sociales');
        console.log('  - 2 canales de adquisición');
        console.log('  - 1 pipeline con 3 etapas');
        console.log('  - 1 proyecto demo-studio');
        console.log('  - 2 usuarios con perfiles profesionales');
        console.log('  - 2 leads de ejemplo');
        console.log('  - 2 redes sociales del proyecto');

    } catch (error) {
        console.error('❌ Error en seed:', error);
        throw error;
    }
}

main()
    .catch((e) => {
        console.error('❌ Error fatal:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
