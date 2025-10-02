import { prisma } from '../../src/lib/prisma';

/**
 * Seed para los pipelines V2.0:
 * - Marketing Pipeline (CRM Pre-Venta)
 * - Manager Pipeline (Operacional Post-Venta)
 */
export async function seedPipelinesV2(studioId: string) {
    console.log('🔄 Seeding V2.0 pipelines for studio:', studioId);

    // ========================================
    // MARKETING PIPELINE (CRM)
    // ========================================
    console.log('📊 Creating Marketing Pipeline stages...');

    const marketingStages = [
        {
            id: `marketing-${studioId}-new`,
            studio_id: studioId,
            slug: 'lead-nuevo',
            name: 'Lead Nuevo',
            description: 'Lead recién capturado que necesita contacto inicial',
            stage_type: 'PROSPECTING',
            color: '#3B82F6',
            display_order: 0,
            is_active: true,
            is_system: false
        },
        {
            id: `marketing-${studioId}-contacted`,
            studio_id: studioId,
            slug: 'contactado',
            name: 'Contactado',
            description: 'Lead contactado exitosamente',
            stage_type: 'PROSPECTING',
            color: '#8B5CF6',
            display_order: 1,
            is_active: true,
            is_system: false
        },
        {
            id: `marketing-${studioId}-qualified`,
            studio_id: studioId,
            slug: 'calificado',
            name: 'Calificado',
            description: 'Lead calificado con interés real',
            stage_type: 'QUALIFICATION',
            color: '#10B981',
            display_order: 2,
            is_active: true,
            is_system: false
        },
        {
            id: `marketing-${studioId}-proposal`,
            studio_id: studioId,
            slug: 'propuesta-enviada',
            name: 'Propuesta Enviada',
            description: 'Cotización o propuesta enviada al cliente',
            stage_type: 'PROPOSAL',
            color: '#F59E0B',
            display_order: 3,
            is_active: true,
            is_system: false
        },
        {
            id: `marketing-${studioId}-negotiation`,
            studio_id: studioId,
            slug: 'negociacion',
            name: 'Negociación',
            description: 'En proceso de negociación de términos',
            stage_type: 'PROPOSAL',
            color: '#EF4444',
            display_order: 4,
            is_active: true,
            is_system: false
        },
        {
            id: `marketing-${studioId}-won`,
            studio_id: studioId,
            slug: 'ganado',
            name: 'Ganado (Convertido)',
            description: 'Lead convertido en cliente - se crea evento en Manager',
            stage_type: 'CONVERSION',
            color: '#059669',
            display_order: 5,
            is_active: true,
            is_system: true
        },
        {
            id: `marketing-${studioId}-lost`,
            studio_id: studioId,
            slug: 'perdido',
            name: 'Perdido',
            description: 'Lead no convertido',
            stage_type: 'CLOSED_LOST',
            color: '#6B7280',
            display_order: 6,
            is_active: true,
            is_system: true
        }
    ];

    for (const stage of marketingStages) {
        await prisma.marketing_pipeline_stages.upsert({
            where: { id: stage.id },
            update: {
                ...stage,
                updated_at: new Date()
            },
            create: {
                ...stage,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        console.log(`  ✅ Marketing: ${stage.name} (${stage.stage_type})`);
    }

    // ========================================
    // MANAGER PIPELINE (Operacional)
    // ========================================
    console.log('📋 Creating Manager Pipeline stages...');

    const managerStages = [
        {
            id: `manager-${studioId}-planning`,
            studio_id: studioId,
            name: 'Planeación',
            description: 'Planeación inicial del evento',
            stage_type: 'PLANNING',
            color: '#3B82F6', // Azul
            display_order: 0,
            is_active: true,
            is_system: false
        },
        {
            id: `manager-${studioId}-preparation`,
            studio_id: studioId,
            name: 'Preparación',
            description: 'Preparación de equipo y logística',
            stage_type: 'PLANNING',
            color: '#8B5CF6', // Púrpura
            display_order: 1,
            is_active: true,
            is_system: false
        },
        {
            id: `manager-${studioId}-production`,
            studio_id: studioId,
            name: 'Producción',
            description: 'Ejecución del evento (cobertura)',
            stage_type: 'PRODUCTION',
            color: '#EF4444', // Rojo (en vivo)
            display_order: 2,
            is_active: true,
            is_system: false
        },
        {
            id: `manager-${studioId}-post-production`,
            studio_id: studioId,
            name: 'Post-Producción',
            description: 'Edición y retoque de material',
            stage_type: 'POST_PRODUCTION',
            color: '#F59E0B', // Ámbar
            display_order: 3,
            is_active: true,
            is_system: false
        },
        {
            id: `manager-${studioId}-review`,
            studio_id: studioId,
            name: 'Revisión Cliente',
            description: 'Cliente revisando material antes de entrega final',
            stage_type: 'REVIEW',
            color: '#10B981', // Verde
            display_order: 4,
            is_active: true,
            is_system: false
        },
        {
            id: `manager-${studioId}-delivery`,
            studio_id: studioId,
            name: 'Entrega',
            description: 'Entrega final del material al cliente',
            stage_type: 'DELIVERY',
            color: '#06B6D4', // Cyan
            display_order: 5,
            is_active: true,
            is_system: false
        },
        {
            id: `manager-${studioId}-completed`,
            studio_id: studioId,
            name: 'Completado',
            description: 'Evento completado exitosamente',
            stage_type: 'COMPLETED',
            color: '#059669', // Verde oscuro
            display_order: 6,
            is_active: true,
            is_system: true // No se puede editar/eliminar
        },
        {
            id: `manager-${studioId}-cancelled`,
            studio_id: studioId,
            name: 'Cancelado',
            description: 'Evento cancelado',
            stage_type: 'CANCELLED',
            color: '#6B7280', // Gris
            display_order: 7,
            is_active: true,
            is_system: true
        }
    ];

    for (const stage of managerStages) {
        await prisma.manager_pipeline_stages.upsert({
            where: { id: stage.id },
            update: {
                ...stage,
                updated_at: new Date()
            },
            create: {
                ...stage,
                created_at: new Date(),
                updated_at: new Date()
            }
        });
        console.log(`  ✅ Manager: ${stage.name} (${stage.stage_type})`);
    }

    console.log('🎉 V2.0 Pipelines seeded successfully!');
}

