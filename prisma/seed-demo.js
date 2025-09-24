const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed demo con demo-studio...');

    try {
        // 1. Crear plan básico
        console.log('📋 Creando plan básico...');
        const planBasico = await prisma.platform_plans.create({
            data: {
                name: 'Plan Básico',
                description: 'Perfecto para estudios pequeños que están comenzando',
                slug: 'basic',
                price_monthly: 29.99,
                price_yearly: 299.99,
                features: {
                    eventos_mensuales: 10,
                    clientes_maximos: 50,
                    storage_gb: 5,
                    soporte: 'email'
                },
                limits: {
                    eventos_simultaneos: 3,
                    usuarios_equipo: 2
                },
                stripe_price_id: 'price_demo_basic',
                stripe_product_id: 'prod_demo_basic',
                popular: false,
                active: true,
                orden: 1
            }
        });
        console.log(`✅ Plan: ${planBasico.name}`);

        // 2. Crear redes sociales
        console.log('📱 Creando redes sociales...');
        const socialNetworks = [
            {
                id: 'instagram',
                name: 'Instagram',
                slug: 'instagram',
                description: 'Plataforma para compartir fotos y videos',
                color: '#E4405F',
                icon: 'instagram',
                baseUrl: 'https://instagram.com/',
                order: 1,
                isActive: true,
                updatedAt: new Date()
            },
            {
                id: 'facebook',
                name: 'Facebook',
                slug: 'facebook',
                description: 'Red social para conectar con amigos y familia',
                color: '#1877F2',
                icon: 'facebook',
                baseUrl: 'https://facebook.com/',
                order: 2,
                isActive: true,
                updatedAt: new Date()
            }
        ];

        for (const network of socialNetworks) {
            await prisma.platform_social_networks.create({
                data: network
            });
            console.log(`✅ Red social: ${network.name}`);
        }

        // 3. Crear canales de adquisición
        console.log('📊 Creando canales de adquisición...');
        const channels = [
            {
                id: 'canal-referidos',
                name: 'Referidos',
                description: 'Clientes referidos por otros clientes',
                color: '#10B981',
                icon: 'users',
                isActive: true,
                isVisible: true,
                order: 1,
                updatedAt: new Date()
            },
            {
                id: 'canal-redes-sociales',
                name: 'Redes Sociales',
                description: 'Leads provenientes de redes sociales',
                color: '#3B82F6',
                icon: 'share-2',
                isActive: true,
                isVisible: true,
                order: 2,
                updatedAt: new Date()
            }
        ];

        for (const channel of channels) {
            await prisma.platform_acquisition_channels.create({
                data: channel
            });
            console.log(`✅ Canal: ${channel.name}`);
        }

        // 4. Crear pipeline type y stages
        console.log('🔄 Creando pipeline...');
        const pipelineType = await prisma.platform_pipeline_types.create({
            data: {
                id: 'pipeline-comercial',
                nombre: 'Pipeline Comercial',
                descripcion: 'Pipeline para gestión de leads comerciales y ventas',
                color: '#3B82F6',
                activo: true,
                orden: 1,
                updatedAt: new Date()
            }
        });
        console.log(`✅ Pipeline type: ${pipelineType.nombre}`);

        const stages = [
            {
                id: 'stage-comercial-nuevos',
                nombre: 'Nuevos Leads',
                descripcion: 'Leads recién capturados que necesitan contacto inicial',
                color: '#3B82F6',
                orden: 1,
                isActive: true,
                pipeline_type_id: 'pipeline-comercial',
                updatedAt: new Date()
            },
            {
                id: 'stage-comercial-contactados',
                nombre: 'Contactados',
                descripcion: 'Leads que han sido contactados por primera vez',
                color: '#8B5CF6',
                orden: 2,
                isActive: true,
                pipeline_type_id: 'pipeline-comercial',
                updatedAt: new Date()
            },
            {
                id: 'stage-comercial-interesados',
                nombre: 'Interesados',
                descripcion: 'Leads que mostraron interés en los servicios',
                color: '#EAB308',
                orden: 3,
                isActive: true,
                pipeline_type_id: 'pipeline-comercial',
                updatedAt: new Date()
            }
        ];

        for (const stage of stages) {
            await prisma.platform_pipeline_stages.create({
                data: stage
            });
            console.log(`✅ Stage: ${stage.nombre}`);
        }

        // 5. Crear demo-studio project
        console.log('🏢 Creando proyecto demo-studio...');
        const demoProject = await prisma.projects.create({
            data: {
                name: 'Demo Studio',
                slug: 'demo-studio',
                email: 'contacto@demo-studio.com',
                address: '123 Demo Street, Demo City',
                descripcion: 'Estudio de fotografía demo para pruebas y desarrollo',
                subscriptionStatus: 'TRIAL',
                planId: planBasico.id,
                active: true,
                updatedAt: new Date()
            }
        });
        console.log(`✅ Proyecto: ${demoProject.name} (${demoProject.slug})`);

        // 6. Crear usuarios del estudio
        console.log('👥 Creando usuarios del estudio...');
        const users = [
            {
                id: 'demo-photographer',
                username: 'fotografo_demo',
                email: 'fotografo@demo-studio.com',
                fullName: 'Juan Pérez',
                phone: '+1234567891',
                type: 'EMPLEADO',
                role: 'photographer',
                status: 'active',
                isActive: true,
                projectId: demoProject.id,
                updatedAt: new Date()
            },
            {
                id: 'demo-editor',
                username: 'editor_demo',
                email: 'editor@demo-studio.com',
                fullName: 'María García',
                phone: '+1234567892',
                type: 'EMPLEADO',
                role: 'editor',
                status: 'active',
                isActive: true,
                projectId: demoProject.id,
                updatedAt: new Date()
            }
        ];

        for (const user of users) {
            const createdUser = await prisma.project_users.create({
                data: user
            });
            console.log(`✅ Usuario: ${createdUser.fullName} (${createdUser.type})`);

            // Crear perfil profesional
            let profile = user.role === 'photographer' ? 'FOTOGRAFO' : 'EDITOR';
            
            await prisma.project_user_professional_profiles.create({
                data: {
                    userId: createdUser.id,
                    profile: profile,
                    description: `Perfil profesional de ${createdUser.fullName}`,
                    isActive: true,
                    updatedAt: new Date()
                }
            });
            console.log(`  ✅ Perfil profesional: ${profile}`);
        }

        // 7. Crear leads de ejemplo
        console.log('🎯 Creando leads de ejemplo...');
        const leads = [
            {
                id: 'lead-demo-1',
                name: 'Ana Martínez',
                email: 'ana.martinez@email.com',
                phone: '+1234567894',
                studioName: 'Boda Ana & Carlos',
                lastContactDate: new Date(),
                interestedPlan: 'pro',
                monthlyBudget: 2000.00,
                priority: 'high',
                stageId: 'stage-comercial-interesados',
                acquisitionChannelId: 'canal-referidos',
                firstInteractionDate: new Date(),
                originalSource: 'Referido por cliente anterior',
                interactionCount: 3,
                leadType: 'prospect',
                updatedAt: new Date()
            },
            {
                id: 'lead-demo-2',
                name: 'Roberto Silva',
                email: 'roberto.silva@email.com',
                phone: '+1234567895',
                studioName: 'Sesión Familiar Silva',
                lastContactDate: new Date(),
                interestedPlan: 'basic',
                monthlyBudget: 500.00,
                priority: 'medium',
                stageId: 'stage-comercial-contactados',
                acquisitionChannelId: 'canal-redes-sociales',
                firstInteractionDate: new Date(),
                originalSource: 'Instagram',
                interactionCount: 1,
                leadType: 'prospect',
                updatedAt: new Date()
            }
        ];

        for (const lead of leads) {
            await prisma.platform_leads.create({
                data: lead
            });
            console.log(`✅ Lead: ${lead.name} (${lead.studioName})`);
        }

        // 8. Crear redes sociales del proyecto
        console.log('🌐 Creando redes sociales del proyecto...');
        const projectSocialNetworks = [
            {
                projectId: demoProject.id,
                plataformaId: 'instagram',
                url: 'https://instagram.com/demo-studio',
                activo: true,
                updatedAt: new Date()
            },
            {
                projectId: demoProject.id,
                plataformaId: 'facebook',
                url: 'https://facebook.com/demo-studio',
                activo: true,
                updatedAt: new Date()
            }
        ];

        for (const socialNetwork of projectSocialNetworks) {
            await prisma.project_redes_sociales.create({
                data: socialNetwork
            });
            console.log(`✅ Red social del proyecto: ${socialNetwork.url}`);
        }

        console.log('🎉 Seed demo completado exitosamente!');
        console.log('📊 Resumen:');
        console.log(`  - 1 plan (${planBasico.name})`);
        console.log(`  - 2 redes sociales`);
        console.log(`  - 2 canales de adquisición`);
        console.log(`  - 1 pipeline con 3 etapas`);
        console.log(`  - 1 proyecto (${demoProject.name})`);
        console.log(`  - 2 usuarios con perfiles profesionales`);
        console.log(`  - 2 leads de ejemplo`);
        console.log(`  - 2 redes sociales del proyecto`);

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
