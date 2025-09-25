import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed mínimo con demo-studio...');

    try {
        // Usar transacción para evitar problemas de prepared statements
        await prisma.$transaction(async (tx) => {
            console.log('📋 Creando plan básico...');
            const planBasico = await tx.platform_plans.create({
                data: {
                    id: 'plan-basic-demo',
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

            console.log('📱 Creando redes sociales...');
            const instagram = await tx.platform_social_networks.create({
                data: {
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
                }
            });

            const facebook = await tx.platform_social_networks.create({
                data: {
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
            });
            console.log(`✅ Redes sociales: ${instagram.name}, ${facebook.name}`);

            console.log('📊 Creando canales de adquisición...');
            const canalReferidos = await tx.platform_acquisition_channels.create({
                data: {
                    id: 'canal-referidos',
                    name: 'Referidos',
                    description: 'Clientes referidos por otros clientes',
                    color: '#10B981',
                    icon: 'users',
                    isActive: true,
                    isVisible: true,
                    order: 1,
                    updatedAt: new Date()
                }
            });

            const canalRedes = await tx.platform_acquisition_channels.create({
                data: {
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
            });
            console.log(`✅ Canales: ${canalReferidos.name}, ${canalRedes.name}`);

            console.log('🔄 Creando pipeline...');
            const pipelineType = await tx.platform_pipeline_types.create({
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

            const stageNuevos = await tx.platform_pipeline_stages.create({
                data: {
                    id: 'stage-comercial-nuevos',
                    nombre: 'Nuevos Leads',
                    descripcion: 'Leads recién capturados que necesitan contacto inicial',
                    color: '#3B82F6',
                    orden: 1,
                    isActive: true,
                    pipeline_type_id: 'pipeline-comercial',
                    updatedAt: new Date()
                }
            });

            const stageContactados = await tx.platform_pipeline_stages.create({
                data: {
                    id: 'stage-comercial-contactados',
                    nombre: 'Contactados',
                    descripcion: 'Leads que han sido contactados por primera vez',
                    color: '#8B5CF6',
                    orden: 2,
                    isActive: true,
                    pipeline_type_id: 'pipeline-comercial',
                    updatedAt: new Date()
                }
            });

            const stageInteresados = await tx.platform_pipeline_stages.create({
                data: {
                    id: 'stage-comercial-interesados',
                    nombre: 'Interesados',
                    descripcion: 'Leads que mostraron interés en los servicios',
                    color: '#EAB308',
                    orden: 3,
                    isActive: true,
                    pipeline_type_id: 'pipeline-comercial',
                    updatedAt: new Date()
                }
            });
            console.log(`✅ Pipeline: ${pipelineType.nombre} con 3 etapas`);

            console.log('🏢 Creando proyecto demo-studio...');
            const demoProject = await tx.projects.create({
                data: {
                    id: 'demo-studio-project',
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
            console.log(`✅ Proyecto: ${demoProject.name}`);

            console.log('👥 Creando usuarios...');
            const photographer = await tx.project_users.create({
                data: {
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
                }
            });

            const editor = await tx.project_users.create({
                data: {
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
            });
            console.log(`✅ Usuarios: ${photographer.fullName}, ${editor.fullName}`);

            console.log('🎯 Creando perfiles profesionales dinámicos...');
            const fotografoProfile = await tx.project_professional_profiles.create({
                data: {
                    id: 'profile-fotografo',
                    projectId: demoStudio.id,
                    name: 'Fotógrafo',
                    slug: 'fotografo',
                    description: 'Especialista en captura de imágenes fotográficas',
                    color: '#3B82F6',
                    icon: 'Camera',
                    isActive: true,
                    isDefault: true,
                    order: 1
                }
            });

            const editorProfile = await tx.project_professional_profiles.create({
                data: {
                    id: 'profile-editor',
                    projectId: demoStudio.id,
                    name: 'Editor',
                    slug: 'editor',
                    description: 'Especialista en edición y postproducción',
                    color: '#8B5CF6',
                    icon: 'Scissors',
                    isActive: true,
                    isDefault: true,
                    order: 2
                }
            });

            console.log('🎯 Asignando perfiles a usuarios...');
            await tx.project_user_professional_profiles.create({
                data: {
                    id: 'user-profile-photographer',
                    userId: photographer.id,
                    profileId: fotografoProfile.id,
                    description: 'Perfil profesional de Juan Pérez',
                    isActive: true,
                    updatedAt: new Date()
                }
            });

            await tx.project_user_professional_profiles.create({
                data: {
                    id: 'user-profile-editor',
                    userId: editor.id,
                    profileId: editorProfile.id,
                    description: 'Perfil profesional de María García',
                    isActive: true,
                    updatedAt: new Date()
                }
            });
            console.log('✅ Perfiles profesionales creados y asignados');

            console.log('📈 Creando leads...');
            await tx.platform_leads.create({
                data: {
                    id: 'lead-demo-1',
                    name: 'Ana Martínez',
                    email: 'ana.martinez@email.com',
                    phone: '+1234567894',
                    studioName: 'Boda Ana & Carlos',
                    lastContactDate: new Date(),
                    interestedPlan: 'pro',
                    monthlyBudget: 2000.00,
                    priority: 'high',
                    stageId: stageInteresados.id,
                    acquisitionChannelId: canalReferidos.id,
                    firstInteractionDate: new Date(),
                    originalSource: 'Referido por cliente anterior',
                    interactionCount: 3,
                    leadType: 'prospect',
                    updatedAt: new Date()
                }
            });

            await tx.platform_leads.create({
                data: {
                    id: 'lead-demo-2',
                    name: 'Roberto Silva',
                    email: 'roberto.silva@email.com',
                    phone: '+1234567895',
                    studioName: 'Sesión Familiar Silva',
                    lastContactDate: new Date(),
                    interestedPlan: 'basic',
                    monthlyBudget: 500.00,
                    priority: 'medium',
                    stageId: stageContactados.id,
                    acquisitionChannelId: canalRedes.id,
                    firstInteractionDate: new Date(),
                    originalSource: 'Instagram',
                    interactionCount: 1,
                    leadType: 'prospect',
                    updatedAt: new Date()
                }
            });
            console.log('✅ Leads de ejemplo creados');

            console.log('🌐 Creando redes sociales del proyecto...');
            await tx.project_redes_sociales.create({
                data: {
                    id: 'demo-instagram',
                    projectId: demoProject.id,
                    plataformaId: instagram.id,
                    url: 'https://instagram.com/demo-studio',
                    activo: true,
                    updatedAt: new Date()
                }
            });

            await tx.project_redes_sociales.create({
                data: {
                    id: 'demo-facebook',
                    projectId: demoProject.id,
                    plataformaId: facebook.id,
                    url: 'https://facebook.com/demo-studio',
                    activo: true,
                    updatedAt: new Date()
                }
            });
            console.log('✅ Redes sociales del proyecto creadas');
        });

        console.log('🎉 Seed completado exitosamente con demo-studio!');
        console.log('📊 Resumen:');
        console.log('  - 1 plan básico');
        console.log('  - 2 redes sociales');
        console.log('  - 2 canales de adquisición');
        console.log('  - 1 pipeline con 3 etapas');
        console.log('  - 1 proyecto demo-studio');
        console.log('  - 2 usuarios con perfiles profesionales');
        console.log('  - 2 leads de ejemplo');
        console.log('  - 2 redes sociales del proyecto');

        // Seed de perfiles profesionales
        await seedProfessionalProfiles();

    } catch (error) {
        console.error('❌ Error en seed:', error);
        throw error;
    }
}

async function seedProfessionalProfiles() {
    console.log('🎭 Iniciando seed de perfiles profesionales...');

    const PROFILES_TO_SEED = [
        {
            name: "Fotógrafo",
            slug: "fotografo",
            description: "Profesional especializado en captura fotográfica",
            color: "#3B82F6",
            icon: "Camera",
            isDefault: true,
            isActive: true,
            order: 1
        },
        {
            name: "Camarógrafo",
            slug: "camarografo",
            description: "Profesional especializado en grabación de video",
            color: "#8B5CF6",
            icon: "Video",
            isDefault: true,
            isActive: true,
            order: 2
        },
        {
            name: "Operador de Dron",
            slug: "operador-dron",
            description: "Profesional especializado en operación de drones",
            color: "#06B6D4",
            icon: "Zap",
            isDefault: true,
            isActive: true,
            order: 3
        },
        {
            name: "Asistente de Producción",
            slug: "asistente-produccion",
            description: "Profesional de apoyo en producción audiovisual",
            color: "#10B981",
            icon: "User",
            isDefault: true,
            isActive: true,
            order: 4
        },
        {
            name: "Editor de Video",
            slug: "editor-video",
            description: "Profesional especializado en edición y postproducción de video",
            color: "#F59E0B",
            icon: "Edit",
            isDefault: true,
            isActive: true,
            order: 5
        },
        {
            name: "Revelado y Retoque de Fotos",
            slug: "revelado-retoque-fotos",
            description: "Profesional especializado en revelado digital y retoque fotográfico",
            color: "#EF4444",
            icon: "Image",
            isDefault: true,
            isActive: true,
            order: 6
        }
    ];

    try {
        // Obtener todos los proyectos (studios)
        const projects = await prisma.projects.findMany({
            select: { id: true, name: true, slug: true }
        });

        if (projects.length === 0) {
            console.log('❌ No se encontraron proyectos. Asegúrate de tener al menos un studio creado.');
            return;
        }

        console.log(`📊 Encontrados ${projects.length} proyectos:`);
        projects.forEach(project => {
            console.log(`   - ${project.name} (${project.slug})`);
        });

        let totalCreated = 0;
        let totalSkipped = 0;

        // Para cada proyecto, crear los perfiles si no existen
        for (const project of projects) {
            console.log(`\n🎯 Procesando proyecto: ${project.name}`);
            
            for (const profileData of PROFILES_TO_SEED) {
                try {
                    // Verificar si el perfil ya existe
                    const existingProfile = await prisma.project_professional_profiles.findFirst({
                        where: {
                            projectId: project.id,
                            slug: profileData.slug
                        }
                    });

                    if (existingProfile) {
                        console.log(`   ⏭️  Perfil "${profileData.name}" ya existe, omitiendo...`);
                        totalSkipped++;
                        continue;
                    }

                    // Crear el perfil
                    const newProfile = await prisma.project_professional_profiles.create({
                        data: {
                            ...profileData,
                            projectId: project.id
                        }
                    });

                    console.log(`   ✅ Creado perfil: ${newProfile.name}`);
                    totalCreated++;

                } catch (error) {
                    console.error(`   ❌ Error creando perfil "${profileData.name}":`, error);
                }
            }
        }

        console.log(`\n🎉 Seed de perfiles completado:`);
        console.log(`   ✅ Perfiles creados: ${totalCreated}`);
        console.log(`   ⏭️  Perfiles omitidos: ${totalSkipped}`);
        console.log(`   📊 Total procesados: ${totalCreated + totalSkipped}`);

    } catch (error) {
        console.error('❌ Error durante el seed de perfiles:', error);
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