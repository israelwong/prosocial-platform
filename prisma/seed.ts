import { prisma } from '../src/lib/prisma';

async function main() {
    console.log('🌱 Iniciando seed con nueva arquitectura Supabase Auth...');

    // 1. Seed de plataformas de redes sociales
    await seedSocialNetworks();

    // 2. Seed de canales de adquisición
    await seedAcquisitionChannels();

    // 3. Seed de plataformas de publicidad
    await seedAdvertisingPlatforms();

    // 4. Seed de categorías y servicios
    await seedCategoriasYServicios();

    // 5. Seed de pipelines y etapas
    await seedPipelineStages();

    // 6. Seed de planes
    await seedPlans();

    // 7. Seed de métodos de pago
    await seedMetodosPago();

    // 8. Seed de usuarios de plataforma
    await seedPlatformUsers();

    // 9. Seed de proyecto demo-studio
    await seedDemoStudio();

    console.log('🎉 Seed completado exitosamente!');
}

async function seedSocialNetworks() {
    console.log('📱 Seeding plataformas de redes sociales...');

    const plataformas = [
        {
            id: 'facebook',
            name: 'Facebook',
            slug: 'facebook',
            description: 'Red social para conectar con amigos y familia',
            color: '#1877F2',
            icon: 'facebook',
            baseUrl: 'https://facebook.com/',
            order: 1,
            isActive: true,
            updatedAt: new Date()
        },
        {
            id: 'instagram',
            name: 'Instagram',
            slug: 'instagram',
            description: 'Plataforma para compartir fotos y videos',
            color: '#E4405F',
            icon: 'instagram',
            baseUrl: 'https://instagram.com/',
            order: 2,
            isActive: true,
            updatedAt: new Date()
        },
        {
            id: 'threads',
            name: 'Threads',
            slug: 'threads',
            description: 'Red social de conversaciones de Meta',
            color: '#000000',
            icon: 'threads',
            baseUrl: 'https://threads.net/',
            order: 3,
            isActive: true,
            updatedAt: new Date()
        },
        {
            id: 'youtube',
            name: 'YouTube',
            slug: 'youtube',
            description: 'Plataforma de videos y contenido multimedia',
            color: '#FF0000',
            icon: 'youtube',
            baseUrl: 'https://youtube.com/',
            order: 4,
            isActive: true,
            updatedAt: new Date()
        },
        {
            id: 'tiktok',
            name: 'TikTok',
            slug: 'tiktok',
            description: 'Plataforma de videos cortos y entretenimiento',
            color: '#000000',
            icon: 'tiktok',
            baseUrl: 'https://tiktok.com/',
            order: 5,
            isActive: true,
            updatedAt: new Date()
        }
    ];

    for (const plataforma of plataformas) {
        await prisma.platform_social_networks.upsert({
            where: { id: plataforma.id },
            update: plataforma,
            create: plataforma
        });
        console.log(`✅ Plataforma: ${plataforma.name}`);
    }
}

async function seedAcquisitionChannels() {
    console.log('📊 Seeding canales de adquisición...');

    const canales = [
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
        },
        {
            id: 'canal-google-ads',
            name: 'Google Ads',
            description: 'Publicidad en Google Ads',
            color: '#F59E0B',
            icon: 'search',
            isActive: true,
            isVisible: true,
            order: 3,
            updatedAt: new Date()
        },
        {
            id: 'canal-web-organico',
            name: 'Web Orgánico',
            description: 'Tráfico orgánico del sitio web',
            color: '#8B5CF6',
            icon: 'globe',
            isActive: true,
            isVisible: true,
            order: 4,
            updatedAt: new Date()
        },
        {
            id: 'canal-eventos',
            name: 'Eventos',
            description: 'Ferias, bodas, eventos presenciales',
            color: '#EF4444',
            icon: 'calendar',
            isActive: true,
            isVisible: true,
            order: 5,
            updatedAt: new Date()
        }
    ];

    for (const canal of canales) {
        await prisma.platform_acquisition_channels.upsert({
            where: { id: canal.id },
            update: canal,
            create: canal
        });
        console.log(`✅ Canal: ${canal.name}`);
    }
}

async function seedAdvertisingPlatforms() {
    console.log('📢 Seeding plataformas de publicidad...');

    const plataformas = [
        {
            id: 'google-ads',
            name: 'Google Ads',
            description: 'Plataforma de publicidad de Google',
            type: 'search',
            color: '#4285F4',
            icon: 'search',
            isActive: true,
            order: 1,
            updatedAt: new Date()
        },
        {
            id: 'facebook-ads',
            name: 'Facebook Ads',
            description: 'Plataforma de publicidad de Meta (Facebook/Instagram)',
            type: 'social',
            color: '#1877F2',
            icon: 'facebook',
            isActive: true,
            order: 2,
            updatedAt: new Date()
        },
        {
            id: 'instagram-ads',
            name: 'Instagram Ads',
            description: 'Publicidad en Instagram',
            type: 'social',
            color: '#E4405F',
            icon: 'instagram',
            isActive: true,
            order: 3,
            updatedAt: new Date()
        },
        {
            id: 'youtube-ads',
            name: 'YouTube Ads',
            description: 'Publicidad en YouTube',
            type: 'video',
            color: '#FF0000',
            icon: 'youtube',
            isActive: true,
            order: 4,
            updatedAt: new Date()
        }
    ];

    for (const plataforma of plataformas) {
        await prisma.platform_advertising_platforms.upsert({
            where: { id: plataforma.id },
            update: plataforma,
            create: plataforma
        });
        console.log(`✅ Plataforma publicitaria: ${plataforma.name}`);
    }
}

async function seedCategoriasYServicios() {
    console.log('📂 Seeding categorías y servicios...');

    // Crear categorías de servicios
    const categorias = [
        {
            id: 'cat-comercial-ventas',
            name: 'Comercial y Ventas',
            description: 'Herramientas para gestión comercial y ventas',
            icon: 'DollarSign',
            posicion: 1,
            active: true
        },
        {
            id: 'cat-portal-cotizacion',
            name: 'Portal de Cotización',
            description: 'Sistema de cotizaciones y presentaciones',
            icon: 'FileText',
            posicion: 2,
            active: true
        },
        {
            id: 'cat-gestion-finanzas',
            name: 'Gestión y Finanzas',
            description: 'Herramientas de gestión empresarial y financiera',
            icon: 'BarChart3',
            posicion: 3,
            active: true
        }
    ];

    for (const categoria of categorias) {
        await prisma.service_categories.upsert({
            where: { id: categoria.id },
            update: categoria,
            create: categoria
        });
        console.log(`✅ Categoría: ${categoria.name}`);
    }

    // Crear servicios básicos
    const servicios = [
        {
            id: 'srv-portafolio-landing',
            name: 'Portafolio (Landing Page)',
            slug: 'portafolio-landing-page',
            description: 'Landing page personalizada para mostrar el portafolio del estudio',
            categoryId: 'cat-comercial-ventas',
            active: true,
            posicion: 1
        },
        {
            id: 'srv-crm-gestion-contactos',
            name: 'CRM y Gestión de Contactos',
            slug: 'crm-gestion-contactos',
            description: 'Sistema de gestión de relaciones con clientes y contactos',
            categoryId: 'cat-comercial-ventas',
            active: true,
            posicion: 2
        },
        {
            id: 'srv-pipeline-kanban-estandar',
            name: 'Pipeline (Kanban) Estándar',
            slug: 'pipeline-kanban-estandar',
            description: 'Pipeline de ventas con Kanban estándar',
            categoryId: 'cat-comercial-ventas',
            active: true,
            posicion: 3
        }
    ];

    for (const servicio of servicios) {
        await prisma.platform_services.upsert({
            where: { id: servicio.id },
            update: servicio,
            create: servicio
        });
        console.log(`✅ Servicio: ${servicio.name}`);
    }
}

async function seedPipelineStages() {
    console.log('🌱 Seeding pipeline types and stages...');

    // Crear tipo de pipeline comercial
    const pipelineType = await prisma.platform_pipeline_types.upsert({
        where: { id: 'pipeline-comercial' },
        update: {
            nombre: 'Pipeline Comercial',
            descripcion: 'Pipeline para gestión de leads comerciales y ventas',
            color: '#3B82F6',
            activo: true,
            orden: 1,
            updatedAt: new Date()
        },
        create: {
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

    // Etapas para Pipeline Comercial
    const etapasComercial = [
        {
            id: 'stage-comercial-nuevos',
            nombre: 'Nuevos Leads',
            descripcion: 'Leads recién capturados que necesitan contacto inicial',
            color: '#3B82F6',
            orden: 1,
            isActive: true,
            pipeline_type_id: 'pipeline-comercial'
        },
        {
            id: 'stage-comercial-contactados',
            nombre: 'Contactados',
            descripcion: 'Leads que han sido contactados por primera vez',
            color: '#8B5CF6',
            orden: 2,
            isActive: true,
            pipeline_type_id: 'pipeline-comercial'
        },
        {
            id: 'stage-comercial-interesados',
            nombre: 'Interesados',
            descripcion: 'Leads que mostraron interés en los servicios',
            color: '#EAB308',
            orden: 3,
            isActive: true,
            pipeline_type_id: 'pipeline-comercial'
        },
        {
            id: 'stage-comercial-cotizacion',
            nombre: 'En Cotización',
            descripcion: 'Leads que están en proceso de cotización',
            color: '#F59E0B',
            orden: 4,
            isActive: true,
            pipeline_type_id: 'pipeline-comercial'
        },
        {
            id: 'stage-comercial-convertidos',
            nombre: 'Convertidos',
            descripcion: 'Leads que se convirtieron en clientes',
            color: '#10B981',
            orden: 5,
            isActive: true,
            pipeline_type_id: 'pipeline-comercial'
        },
        {
            id: 'stage-comercial-perdidos',
            nombre: 'Perdidos',
            descripcion: 'Leads que no se pudieron convertir',
            color: '#6B7280',
            orden: 6,
            isActive: true,
            pipeline_type_id: 'pipeline-comercial'
        }
    ];

    for (const etapa of etapasComercial) {
        await prisma.platform_pipeline_stages.upsert({
            where: { id: etapa.id },
            update: {
                ...etapa,
                updatedAt: new Date()
            },
            create: {
                ...etapa,
                updatedAt: new Date()
            }
        });
        console.log(`✅ Etapa comercial: ${etapa.nombre}`);
    }
}

async function seedPlans() {
    console.log('🌱 Seeding plans...');

    // Plan Básico
    const planBasico = await prisma.platform_plans.upsert({
        where: { slug: 'basic' },
        update: {},
        create: {
            name: 'Plan Básico',
            description: 'Perfecto para estudios pequeños que están comenzando',
            slug: 'basic',
            price_monthly: 29.99,
            price_yearly: 299.99,
            features: {
                eventos_mensuales: 10,
                clientes_maximos: 50,
                storage_gb: 5,
                soporte: 'email',
                reportes_basicos: true,
                integracion_stripe: true,
                dominio_personalizado: false,
                api_access: false
            },
            limits: {
                eventos_simultaneos: 3,
                usuarios_equipo: 2,
                cotizaciones_mensuales: 20,
                backup_automatico: false
            },
            stripe_price_id: 'price_demo_basic',
            stripe_product_id: 'prod_demo_basic',
            popular: false,
            active: true,
            orden: 1
        }
    });

    // Plan Pro
    const planPro = await prisma.platform_plans.upsert({
        where: { slug: 'pro' },
        update: {},
        create: {
            name: 'Plan Pro',
            description: 'Ideal para estudios en crecimiento',
            slug: 'pro',
            price_monthly: 59.99,
            price_yearly: 599.99,
            features: {
                eventos_mensuales: 50,
                clientes_maximos: 200,
                storage_gb: 25,
                soporte: 'email_telefono',
                reportes_avanzados: true,
                integracion_stripe: true,
                dominio_personalizado: true,
                api_access: true
            },
            limits: {
                eventos_simultaneos: 10,
                usuarios_equipo: 5,
                cotizaciones_mensuales: 100,
                backup_automatico: true
            },
            stripe_price_id: 'price_demo_pro',
            stripe_product_id: 'prod_demo_pro',
            popular: true,
            active: true,
            orden: 2
        }
    });

    console.log('✅ Plans seeded successfully:');
    console.log(`  - ${planBasico.name} (${planBasico.slug})`);
    console.log(`  - ${planPro.name} (${planPro.slug})`);
}

async function seedPlatformUsers() {
    console.log('👥 Seeding usuarios de plataforma...');

    // Super Admin
    const superAdmin = await prisma.platform_user_profiles.upsert({
        where: { email: 'admin@prosocial.mx' },
        update: {},
        create: {
            supabaseUserId: 'admin-supabase-id', // ID simulado de Supabase Auth
            email: 'admin@prosocial.mx',
            role: 'SUPER_ADMIN',
            fullName: 'Super Administrador',
            isActive: true,
            updatedAt: new Date()
        }
    });
    console.log(`✅ Super Admin: ${superAdmin.fullName}`);

    // Agente
    const agente = await prisma.platform_user_profiles.upsert({
        where: { email: 'agente@prosocial.mx' },
        update: {},
        create: {
            supabaseUserId: 'agente-supabase-id', // ID simulado de Supabase Auth
            email: 'agente@prosocial.mx',
            role: 'AGENTE',
            fullName: 'Agente Comercial',
            isActive: true,
            updatedAt: new Date()
        }
    });
    console.log(`✅ Agente: ${agente.fullName}`);

    // Suscriptor (dueño del demo-studio)
    const suscriptor = await prisma.platform_user_profiles.upsert({
        where: { email: 'owner@demo-studio.com' },
        update: {},
        create: {
            supabaseUserId: 'suscriptor-supabase-id', // ID simulado de Supabase Auth
            email: 'owner@demo-studio.com',
            role: 'SUSCRIPTOR',
            fullName: 'Propietario Demo Studio',
            isActive: true,
            updatedAt: new Date()
        }
    });
    console.log(`✅ Suscriptor: ${suscriptor.fullName}`);

    return { superAdmin, agente, suscriptor };
}

async function seedDemoStudio() {
    console.log('🏢 Seeding demo-studio project...');

    // Obtener el suscriptor
    const suscriptor = await prisma.platform_user_profiles.findUnique({
        where: { email: 'owner@demo-studio.com' }
    });

    if (!suscriptor) {
        throw new Error('Suscriptor no encontrado');
    }

    // Crear el proyecto demo-studio
    const demoProject = await prisma.projects.upsert({
        where: { slug: 'demo-studio' },
        update: {},
        create: {
            name: 'Demo Studio',
            slug: 'demo-studio',
            email: 'contacto@demo-studio.com',
            address: '123 Demo Street, Demo City',
            descripcion: 'Estudio de fotografía demo para pruebas y desarrollo',
            subscriptionStatus: 'TRIAL',
            planId: 'basic', // Referencia al plan básico
            active: true,
            platformUserId: suscriptor.id, // Asociar con el suscriptor
            updatedAt: new Date()
        }
    });
    console.log(`✅ Proyecto: ${demoProject.name} (${demoProject.slug})`);

    // Crear personal del estudio (con/sin login)
    const demoPersonal = [
        {
            id: 'demo-photographer',
            fullName: 'Juan Pérez',
            phone: '+1234567891',
            type: 'EMPLEADO' as const,
            role: 'photographer',
            status: 'active',
            isActive: true,
            projectId: demoProject.id,
            platformUserId: null // Sin login
        },
        {
            id: 'demo-editor',
            fullName: 'María García',
            phone: '+1234567892',
            type: 'EMPLEADO' as const,
            role: 'editor',
            status: 'active',
            isActive: true,
            projectId: demoProject.id,
            platformUserId: null // Sin login
        },
        {
            id: 'demo-provider',
            fullName: 'Carlos Rodríguez',
            phone: '+1234567893',
            type: 'PROVEEDOR' as const,
            role: 'provider',
            status: 'active',
            isActive: true,
            projectId: demoProject.id,
            platformUserId: null // Sin login
        }
    ];

    for (const personal of demoPersonal) {
        const createdPersonal = await prisma.project_users.upsert({
            where: { id: personal.id },
            update: personal,
            create: personal
        });
        console.log(`✅ Personal: ${createdPersonal.fullName} (${createdPersonal.type})`);

        // Crear perfiles profesionales para los usuarios
        if (personal.type === 'EMPLEADO') {
            let profile: 'FOTOGRAFO' | 'EDITOR' | 'RETOCADOR' | 'CAMAROGRAFO' | 'OPERADOR_DRON' | 'ASISTENTE' | 'COORDINADOR';

            if (personal.role === 'photographer') {
                profile = 'FOTOGRAFO';
            } else if (personal.role === 'editor') {
                profile = 'EDITOR';
            } else {
                profile = 'ASISTENTE';
            }

            await prisma.project_user_professional_profiles.create({
                data: {
                    userId: createdPersonal.id,
                    profile: profile,
                    description: `Perfil profesional de ${createdPersonal.fullName}`,
                    isActive: true
                }
            });
            console.log(`  ✅ Perfil profesional: ${profile}`);
        }
    }

    // Crear algunos leads de ejemplo
    const demoLeads = [
        {
            id: 'lead-demo-1',
            name: 'Ana Martínez',
            email: 'ana.martinez@email.com',
            phone: '+1234567894',
            studioName: 'Boda Ana & Carlos',
            studioSlug: null,
            lastContactDate: new Date(),
            interestedPlan: 'pro',
            monthlyBudget: 2000.00,
            probableStartDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
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
            studioSlug: null,
            lastContactDate: new Date(),
            interestedPlan: 'basic',
            monthlyBudget: 500.00,
            probableStartDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 días
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

    for (const lead of demoLeads) {
        await prisma.platform_leads.upsert({
            where: { id: lead.id },
            update: lead,
            create: lead
        });
        console.log(`✅ Lead: ${lead.name} (${lead.studioName})`);
    }

    // Crear redes sociales del demo studio
    const demoSocialNetworks = [
        {
            projectId: demoProject.id,
            plataformaId: 'instagram',
            url: 'https://instagram.com/demo-studio',
            activo: true
        },
        {
            projectId: demoProject.id,
            plataformaId: 'facebook',
            url: 'https://facebook.com/demo-studio',
            activo: true
        }
    ];

    for (const socialNetwork of demoSocialNetworks) {
        await prisma.project_redes_sociales.create({
            data: socialNetwork
        });
        console.log(`✅ Red social: ${socialNetwork.url}`);
    }

    console.log('🎉 Demo studio seeded successfully!');
}

async function seedMetodosPago() {
    console.log('💳 Seeding métodos de pago...');

    // Obtener el proyecto demo-studio
    const demoProject = await prisma.projects.findFirst({
        where: { slug: 'demo-studio' }
    });

    if (!demoProject) {
        console.log('⚠️ No se encontró el proyecto demo-studio, saltando seed de métodos de pago');
        return;
    }

    const metodosPago = [
        {
            metodo_pago: 'Efectivo',
            comision_porcentaje_base: 0,
            comision_fija_monto: 0,
            num_msi: 0,
            comision_msi_porcentaje: 0,
            orden: 1,
            payment_method: 'cash',
            status: 'active',
            projectId: demoProject.id,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            metodo_pago: 'Depósito Bancario',
            comision_porcentaje_base: 0,
            comision_fija_monto: 0,
            num_msi: 0,
            comision_msi_porcentaje: 0,
            orden: 2,
            payment_method: 'bank_transfer',
            status: 'active',
            projectId: demoProject.id,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            metodo_pago: 'Transferencia SPEI',
            comision_porcentaje_base: 0,
            comision_fija_monto: 0,
            num_msi: 0,
            comision_msi_porcentaje: 0,
            orden: 3,
            payment_method: 'spei',
            status: 'active',
            projectId: demoProject.id,
            createdAt: new Date(),
            updatedAt: new Date()
        },
        {
            metodo_pago: 'OXXO',
            comision_porcentaje_base: 0,
            comision_fija_monto: 0,
            num_msi: 0,
            comision_msi_porcentaje: 0,
            orden: 4,
            payment_method: 'oxxo',
            status: 'active',
            projectId: demoProject.id,
            createdAt: new Date(),
            updatedAt: new Date()
        }
    ];

    for (const metodo of metodosPago) {
        // Verificar si ya existe
        const existingMetodo = await prisma.project_metodos_pago.findFirst({
            where: {
                projectId: demoProject.id,
                metodo_pago: metodo.metodo_pago
            }
        });

        if (!existingMetodo) {
            await prisma.project_metodos_pago.create({
                data: metodo
            });
            console.log(`✅ Método de pago: ${metodo.metodo_pago}`);
        } else {
            console.log(`⚠️ Método de pago ya existe: ${metodo.metodo_pago}`);
        }
    }

    console.log('🎉 Métodos de pago seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    });
