import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed completo de la base de datos...');

    // Seed de plataformas de redes sociales
    await seedRedesSociales();

    // Seed de categorías y servicios
    await seedCategoriasYServicios();

    // Seed de pipelines y etapas
    await seedPipelineStages();

    // Seed de planes con servicios
    await seedPlans();

    console.log('🎉 Seed completado exitosamente!');
}

async function seedRedesSociales() {
    console.log('📱 Seeding plataformas de redes sociales...');

    const plataformas = [
        {
            id: 'facebook',
            nombre: 'Facebook',
            slug: 'facebook',
            descripcion: 'Red social para conectar con amigos y familia',
            color: '#1877F2',
            icono: 'facebook',
            urlBase: 'https://facebook.com/',
            orden: 1,
            isActive: true,
            updatedAt: new Date()
        },
        {
            id: 'instagram',
            nombre: 'Instagram',
            slug: 'instagram',
            descripcion: 'Plataforma para compartir fotos y videos',
            color: '#E4405F',
            icono: 'instagram',
            urlBase: 'https://instagram.com/',
            orden: 2,
            isActive: true,
            updatedAt: new Date()
        },
        {
            id: 'threads',
            nombre: 'Threads',
            slug: 'threads',
            descripcion: 'Red social de conversaciones de Meta',
            color: '#000000',
            icono: 'threads',
            urlBase: 'https://threads.net/',
            orden: 3,
            isActive: true,
            updatedAt: new Date()
        },
        {
            id: 'youtube',
            nombre: 'YouTube',
            slug: 'youtube',
            descripcion: 'Plataforma de videos y contenido multimedia',
            color: '#FF0000',
            icono: 'youtube',
            urlBase: 'https://youtube.com/',
            orden: 4,
            isActive: true,
            updatedAt: new Date()
        },
        {
            id: 'tiktok',
            nombre: 'TikTok',
            slug: 'tiktok',
            descripcion: 'Plataforma de videos cortos y entretenimiento',
            color: '#000000',
            icono: 'tiktok',
            urlBase: 'https://tiktok.com/',
            orden: 5,
            isActive: true,
            updatedAt: new Date()
        },
        {
            id: 'linkedin',
            nombre: 'LinkedIn',
            slug: 'linkedin',
            descripcion: 'Red social profesional y de networking',
            color: '#0A66C2',
            icono: 'linkedin',
            urlBase: 'https://linkedin.com/in/',
            orden: 6,
            isActive: true,
            updatedAt: new Date()
        },
        {
            id: 'spotify',
            nombre: 'Spotify',
            slug: 'spotify',
            descripcion: 'Plataforma de música y podcasts',
            color: '#1DB954',
            icono: 'spotify',
            urlBase: 'https://open.spotify.com/',
            orden: 7,
            isActive: true,
            updatedAt: new Date()
        }
    ];

    for (const plataforma of plataformas) {
        await prisma.platform_plataformas_redes_sociales.upsert({
            where: { id: plataforma.id },
            update: plataforma,
            create: plataforma
        });
        console.log(`✅ Plataforma: ${plataforma.nombre}`);
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
        },
        {
            id: 'cat-personalizacion-equipo',
            name: 'Personalización y Equipo',
            description: 'Herramientas de personalización y gestión de equipo',
            icon: 'Users',
            posicion: 4,
            active: true
        },
        {
            id: 'cat-integraciones',
            name: 'Integraciones',
            description: 'Integraciones con servicios externos',
            icon: 'Server',
            posicion: 5,
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

    // Crear servicios
    const servicios = [
        // COMERCIAL Y VENTAS
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
        },
        {
            id: 'srv-pipeline-kanban-personalizable',
            name: 'Pipeline (Kanban) Personalizable',
            slug: 'pipeline-kanban-personalizable',
            description: 'Pipeline de ventas con Kanban personalizable',
            categoryId: 'cat-comercial-ventas',
            active: true,
            posicion: 4
        },
        {
            id: 'srv-pipeline-multiples',
            name: 'Múltiples Pipelines',
            slug: 'pipeline-multiples',
            description: 'Sistema de múltiples pipelines de ventas',
            categoryId: 'cat-comercial-ventas',
            active: true,
            posicion: 5
        },
        {
            id: 'srv-recordatorios-email',
            name: 'Recordatorios por Email',
            slug: 'recordatorios-email',
            description: 'Sistema de recordatorios automáticos por email',
            categoryId: 'cat-comercial-ventas',
            active: true,
            posicion: 6
        },
        {
            id: 'srv-recordatorios-whatsapp',
            name: 'Recordatorios por WhatsApp',
            slug: 'recordatorios-whatsapp',
            description: 'Sistema de recordatorios automáticos por WhatsApp',
            categoryId: 'cat-comercial-ventas',
            active: true,
            posicion: 7
        },

        // PORTAL DE COTIZACIÓN
        {
            id: 'srv-presentacion-cotizaciones',
            name: 'Presentación de Cotizaciones',
            slug: 'presentacion-cotizaciones',
            description: 'Sistema para crear y presentar cotizaciones profesionales',
            categoryId: 'cat-portal-cotizacion',
            active: true,
            posicion: 1
        },
        {
            id: 'srv-pasarela-pago',
            name: 'Pasarela de Pago',
            slug: 'pasarela-pago',
            description: 'Integración con pasarela de pagos para cobros online',
            categoryId: 'cat-portal-cotizacion',
            active: true,
            posicion: 2
        },
        {
            id: 'srv-comparador-dinamico',
            name: 'Comparador Dinámico',
            slug: 'comparador-dinamico',
            description: 'Herramienta para comparar diferentes opciones de servicios',
            categoryId: 'cat-portal-cotizacion',
            active: true,
            posicion: 3
        },

        // GESTIÓN Y FINANZAS
        {
            id: 'srv-gestion-eventos',
            name: 'Gestión de Eventos',
            slug: 'gestion-eventos',
            description: 'Sistema completo de gestión de eventos fotográficos',
            categoryId: 'cat-gestion-finanzas',
            active: true,
            posicion: 1
        },
        {
            id: 'srv-calendario-eventos',
            name: 'Calendario de Eventos',
            slug: 'calendario-eventos',
            description: 'Calendario integrado para gestión de eventos',
            categoryId: 'cat-gestion-finanzas',
            active: true,
            posicion: 2
        },
        {
            id: 'srv-gestion-catalogos',
            name: 'Gestión de Catálogos',
            slug: 'gestion-catalogos',
            description: 'Sistema de gestión de catálogos de servicios y productos',
            categoryId: 'cat-gestion-finanzas',
            active: true,
            posicion: 3
        },
        {
            id: 'srv-dashboard-financiero',
            name: 'Dashboard Financiero',
            slug: 'dashboard-financiero',
            description: 'Panel de control financiero con métricas y reportes',
            categoryId: 'cat-gestion-finanzas',
            active: true,
            posicion: 4
        },
        {
            id: 'srv-metricas-rendimiento',
            name: 'Métricas de Rendimiento',
            slug: 'metricas-rendimiento',
            description: 'Herramientas de análisis y métricas de rendimiento',
            categoryId: 'cat-gestion-finanzas',
            active: true,
            posicion: 5
        },
        {
            id: 'srv-calculo-rentabilidad',
            name: 'Cálculo de Rentabilidad',
            slug: 'calculo-rentabilidad',
            description: 'Sistema de cálculo automático de rentabilidad por proyecto',
            categoryId: 'cat-gestion-finanzas',
            active: true,
            posicion: 6
        },

        // PERSONALIZACIÓN Y EQUIPO
        {
            id: 'srv-portal-cliente',
            name: 'Portal de Cliente',
            slug: 'portal-cliente',
            description: 'Portal personalizado para clientes del estudio',
            categoryId: 'cat-personalizacion-equipo',
            active: true,
            posicion: 1
        },
        {
            id: 'srv-personalizacion-avanzada',
            name: 'Personalización Avanzada (Marca Blanca)',
            slug: 'personalizacion-avanzada',
            description: 'Personalización completa con marca blanca',
            categoryId: 'cat-personalizacion-equipo',
            active: true,
            posicion: 2
        },
        {
            id: 'srv-gestion-personal-roles',
            name: 'Gestión de Personal y Roles',
            slug: 'gestion-personal-roles',
            description: 'Sistema de gestión de personal y asignación de roles',
            categoryId: 'cat-personalizacion-equipo',
            active: true,
            posicion: 3
        },
        {
            id: 'srv-parametros-utilidad-comision',
            name: 'Parámetros de Utilidad/Comisión',
            slug: 'parametros-utilidad-comision',
            description: 'Configuración de parámetros de utilidad y comisiones',
            categoryId: 'cat-personalizacion-equipo',
            active: true,
            posicion: 4
        },

        // INTEGRACIONES
        {
            id: 'srv-stripe-pasarela-pago',
            name: 'Stripe (Pasarela de Pago)',
            slug: 'stripe-pasarela-pago',
            description: 'Integración con Stripe para procesamiento de pagos',
            categoryId: 'cat-integraciones',
            active: true,
            posicion: 1
        },
        {
            id: 'srv-manychat-api',
            name: 'ManyChat (API Key)',
            slug: 'manychat-api',
            description: 'Integración con ManyChat para automatización de WhatsApp',
            categoryId: 'cat-integraciones',
            active: true,
            posicion: 2
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

    try {
        // Crear tipos de pipeline
        const pipelineTypes = [
            {
                id: 'pipeline-comercial',
                nombre: 'Pipeline Comercial',
                descripcion: 'Pipeline para gestión de leads comerciales y ventas',
                color: '#3B82F6', // blue-500
                activo: true,
                orden: 1
            },
            {
                id: 'pipeline-soporte',
                nombre: 'Pipeline de Soporte',
                descripcion: 'Pipeline para gestión de tickets de soporte y atención al cliente',
                color: '#10B981', // green-500
                activo: true,
                orden: 2
            }
        ];

        // Crear tipos de pipeline
        for (const type of pipelineTypes) {
            await prisma.platform_pipeline_types.upsert({
                where: { id: type.id },
                update: {
                    ...type,
                    updatedAt: new Date()
                },
                create: {
                    ...type,
                    updatedAt: new Date()
                }
            });
            console.log(`✅ Pipeline type: ${type.nombre}`);
        }

        // Etapas para Pipeline Comercial
        const etapasComercial = [
            {
                id: 'stage-comercial-nuevos',
                nombre: 'Nuevos Leads',
                descripcion: 'Leads recién capturados que necesitan contacto inicial',
                color: '#3B82F6', // blue-500
                orden: 1,
                isActive: true,
                pipeline_type_id: 'pipeline-comercial'
            },
            {
                id: 'stage-comercial-contactados',
                nombre: 'Contactados',
                descripcion: 'Leads que han sido contactados por primera vez',
                color: '#8B5CF6', // violet-500
                orden: 2,
                isActive: true,
                pipeline_type_id: 'pipeline-comercial'
            },
            {
                id: 'stage-comercial-interesados',
                nombre: 'Interesados',
                descripcion: 'Leads que mostraron interés en los servicios',
                color: '#EAB308', // yellow-500
                orden: 3,
                isActive: true,
                pipeline_type_id: 'pipeline-comercial'
            },
            {
                id: 'stage-comercial-cotizacion',
                nombre: 'En Cotización',
                descripcion: 'Leads que están en proceso de cotización',
                color: '#F59E0B', // amber-500
                orden: 4,
                isActive: true,
                pipeline_type_id: 'pipeline-comercial'
            },
            {
                id: 'stage-comercial-negociacion',
                nombre: 'En Negociación',
                descripcion: 'Leads en proceso de negociación de términos',
                color: '#EF4444', // red-500
                orden: 5,
                isActive: true,
                pipeline_type_id: 'pipeline-comercial'
            },
            {
                id: 'stage-comercial-convertidos',
                nombre: 'Convertidos',
                descripcion: 'Leads que se convirtieron en clientes',
                color: '#10B981', // green-500
                orden: 6,
                isActive: true,
                pipeline_type_id: 'pipeline-comercial'
            },
            {
                id: 'stage-comercial-perdidos',
                nombre: 'Perdidos',
                descripcion: 'Leads que no se pudieron convertir',
                color: '#6B7280', // gray-500
                orden: 7,
                isActive: true,
                pipeline_type_id: 'pipeline-comercial'
            }
        ];

        // Etapas para Pipeline de Soporte
        const etapasSoporte = [
            {
                id: 'stage-soporte-nuevo',
                nombre: 'Nuevo Ticket',
                descripcion: 'Tickets de soporte recién creados',
                color: '#3B82F6', // blue-500
                orden: 1,
                isActive: true,
                pipeline_type_id: 'pipeline-soporte'
            },
            {
                id: 'stage-soporte-asignado',
                nombre: 'Asignado',
                descripcion: 'Tickets asignados a un agente de soporte',
                color: '#8B5CF6', // violet-500
                orden: 2,
                isActive: true,
                pipeline_type_id: 'pipeline-soporte'
            },
            {
                id: 'stage-soporte-en-proceso',
                nombre: 'En Proceso',
                descripcion: 'Tickets siendo atendidos por el agente',
                color: '#EAB308', // yellow-500
                orden: 3,
                isActive: true,
                pipeline_type_id: 'pipeline-soporte'
            },
            {
                id: 'stage-soporte-esperando-cliente',
                nombre: 'Esperando Cliente',
                descripcion: 'Tickets esperando respuesta del cliente',
                color: '#F59E0B', // amber-500
                orden: 4,
                isActive: true,
                pipeline_type_id: 'pipeline-soporte'
            },
            {
                id: 'stage-soporte-resuelto',
                nombre: 'Resuelto',
                descripcion: 'Tickets resueltos exitosamente',
                color: '#10B981', // green-500
                orden: 5,
                isActive: true,
                pipeline_type_id: 'pipeline-soporte'
            },
            {
                id: 'stage-soporte-cerrado',
                nombre: 'Cerrado',
                descripcion: 'Tickets cerrados definitivamente',
                color: '#6B7280', // gray-500
                orden: 6,
                isActive: true,
                pipeline_type_id: 'pipeline-soporte'
            }
        ];

        // Crear etapas comerciales
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

        // Crear etapas de soporte
        for (const etapa of etapasSoporte) {
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
            console.log(`✅ Etapa soporte: ${etapa.nombre}`);
        }

        console.log('🎉 Pipeline types and stages seeded successfully!');
        console.log('📊 Resumen:');
        console.log('  - 2 tipos de pipeline (Comercial, Soporte)');
        console.log('  - 7 etapas comerciales');
        console.log('  - 6 etapas de soporte');

    } catch (error) {
        console.error('❌ Error seeding pipeline stages:', error);
        throw error;
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
            stripe_price_id: 'price_1S73QoHxyreVzp11ZcP1hGea', // Mensual
            stripe_product_id: 'prod_T39jUez5Bkutia',
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
            stripe_price_id: 'price_1S73R2HxyreVzp11gswaqc6w', // Mensual
            stripe_product_id: 'prod_T39kWvt4LTTEve',
            popular: true,
            active: true,
            orden: 2
        }
    });

    // Plan Enterprise
    const planEnterprise = await prisma.platform_plans.upsert({
        where: { slug: 'enterprise' },
        update: {},
        create: {
            name: 'Plan Enterprise',
            description: 'Para estudios grandes con necesidades avanzadas',
            slug: 'enterprise',
            price_monthly: 99.99,
            price_yearly: 999.99,
            features: {
                eventos_mensuales: -1, // Ilimitado
                clientes_maximos: -1, // Ilimitado
                storage_gb: 100,
                soporte: 'dedicado',
                reportes_enterprise: true,
                integracion_stripe: true,
                dominio_personalizado: true,
                api_access: true,
                sso: true,
                webhooks: true
            },
            limits: {
                eventos_simultaneos: -1, // Ilimitado
                usuarios_equipo: -1, // Ilimitado
                cotizaciones_mensuales: -1, // Ilimitado
                backup_automatico: true,
                sla: '99.9%'
            },
            stripe_price_id: 'price_1S73RJHxyreVzp11czpvJxqg', // Mensual
            stripe_product_id: 'prod_T39ky4iJ11SGUu',
            popular: false,
            active: true,
            orden: 3
        }
    });

    console.log('✅ Plans seeded successfully:');
    console.log(`  - ${planBasico.name} (${planBasico.slug})`);
    console.log(`  - ${planPro.name} (${planPro.slug})`);
    console.log(`  - ${planEnterprise.name} (${planEnterprise.slug})`);

    // Crear también los precios anuales como planes separados
    const planBasicoAnual = await prisma.platform_plans.upsert({
        where: { slug: 'basic-yearly' },
        update: {},
        create: {
            name: 'Plan Básico (Anual)',
            description: 'Plan Básico con descuento anual - 2 meses gratis',
            slug: 'basic-yearly',
            price_monthly: 24.99, // Precio efectivo mensual
            price_yearly: 299.99,
            features: {
                eventos_mensuales: 10,
                clientes_maximos: 50,
                storage_gb: 5,
                soporte: 'email',
                reportes_basicos: true,
                integracion_stripe: true,
                dominio_personalizado: false,
                api_access: false,
                descuento_anual: '2 meses gratis'
            },
            limits: {
                eventos_simultaneos: 3,
                usuarios_equipo: 2,
                cotizaciones_mensuales: 20,
                backup_automatico: false
            },
            stripe_price_id: 'price_1S73QtHxyreVzp11m17YEJyN', // Anual
            stripe_product_id: 'prod_T39jUez5Bkutia',
            popular: false,
            active: true,
            orden: 4
        }
    });

    const planProAnual = await prisma.platform_plans.upsert({
        where: { slug: 'pro-yearly' },
        update: {},
        create: {
            name: 'Plan Pro (Anual)',
            description: 'Plan Pro con descuento anual - 2 meses gratis',
            slug: 'pro-yearly',
            price_monthly: 49.99, // Precio efectivo mensual
            price_yearly: 599.99,
            features: {
                eventos_mensuales: 50,
                clientes_maximos: 200,
                storage_gb: 25,
                soporte: 'email_telefono',
                reportes_avanzados: true,
                integracion_stripe: true,
                dominio_personalizado: true,
                api_access: true,
                descuento_anual: '2 meses gratis'
            },
            limits: {
                eventos_simultaneos: 10,
                usuarios_equipo: 5,
                cotizaciones_mensuales: 100,
                backup_automatico: true
            },
            stripe_price_id: 'price_1S73R7HxyreVzp11qeP4xd1a', // Anual
            stripe_product_id: 'prod_T39kWvt4LTTEve',
            popular: true,
            active: true,
            orden: 5
        }
    });

    const planEnterpriseAnual = await prisma.platform_plans.upsert({
        where: { slug: 'enterprise-yearly' },
        update: {},
        create: {
            name: 'Plan Enterprise (Anual)',
            description: 'Plan Enterprise con descuento anual - 2 meses gratis',
            slug: 'enterprise-yearly',
            price_monthly: 83.33, // Precio efectivo mensual
            price_yearly: 999.99,
            features: {
                eventos_mensuales: -1, // Ilimitado
                clientes_maximos: -1, // Ilimitado
                storage_gb: 100,
                soporte: 'dedicado',
                reportes_enterprise: true,
                integracion_stripe: true,
                dominio_personalizado: true,
                api_access: true,
                sso: true,
                webhooks: true,
                descuento_anual: '2 meses gratis'
            },
            limits: {
                eventos_simultaneos: -1, // Ilimitado
                usuarios_equipo: -1, // Ilimitado
                cotizaciones_mensuales: -1, // Ilimitado
                backup_automatico: true,
                sla: '99.9%'
            },
            stripe_price_id: 'price_1S73ROHxyreVzp11lpjQn3f4', // Anual
            stripe_product_id: 'prod_T39ky4iJ11SGUu',
            popular: false,
            active: true,
            orden: 6
        }
    });

    console.log('✅ Annual plans seeded successfully:');
    console.log(`  - ${planBasicoAnual.name} (${planBasicoAnual.slug})`);
    console.log(`  - ${planProAnual.name} (${planProAnual.slug})`);
    console.log(`  - ${planEnterpriseAnual.name} (${planEnterpriseAnual.slug})`);

    console.log('🎉 All plans seeded successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
