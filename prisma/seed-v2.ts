/**
 * Seed V2.0 - Arquitectura Multi-Contexto
 * 
 * Este seed inicializa:
 * - Módulos de plataforma (Manager, Magic, Marketing, Payment, etc.)
 * - Studio demo con módulos activos
 * - Pipelines V2.0 (Marketing + Manager)
 * - Usuarios multi-contexto
 * - Templates Gantt básicos
 */

import { prisma } from '../src/lib/prisma';
import { seedModules } from './seeds/modules-seed';
import { seedPipelinesV2 } from './seeds/pipelines-v2-seed';

async function main() {
    console.log('🌱 Iniciando seed V2.0 - Arquitectura Multi-Contexto...\n');

    // ========================================
    // 1. MÓDULOS DE PLATAFORMA
    // ========================================
    await seedModules();
    console.log('');

    // ========================================
    // 2. CREAR STUDIO DEMO
    // ========================================
    console.log('🏢 Creating demo studio...');

    const demoStudio = await prisma.studios.upsert({
        where: { slug: 'demo-studio' },
        update: {
            updated_at: new Date()
        },
        create: {
            id: 'demo-studio-id',
            studio_name: 'Demo Studio',
            slug: 'demo-studio',
            email: 'contacto@demo-studio.com',
            address: '123 Demo Street, Demo City',
            descripcion: 'Estudio de fotografía demo para V2.0',
            subscription_status: 'TRIAL',
            plan_id: null, // Sin plan por ahora (V1 usaba string, V2 será relación con platform_plans)
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        }
    });
    console.log(`✅ Studio: ${demoStudio.studio_name} (${demoStudio.slug})\n`);

    // ========================================
    // 3. ACTIVAR MÓDULOS EN DEMO STUDIO
    // ========================================
    console.log('🧩 Activating modules for demo studio...');

    const modulesToActivate = ['manager', 'magic', 'marketing', 'pages'];

    for (const module_slug of modulesToActivate) {
        const module = await prisma.platform_modules.findUnique({
            where: { slug: module_slug }
        });

        if (module) {
            await prisma.studio_modules.upsert({
                where: {
                    studio_id_module_id: {
                        studio_id: demoStudio.id,
                        module_id: module.id
                    }
                },
                update: {
                    is_active: true,
                    updated_at: new Date()
                },
                create: {
                    studio_id: demoStudio.id,
                    module_id: module.id,
                    is_active: true,
                    activated_at: new Date(),
                    created_at: new Date(),
                    updated_at: new Date()
                }
            });
            console.log(`  ✅ Activated: ${module.name}`);
        }
    }
    console.log('');

    // ========================================
    // 4. USUARIOS MULTI-CONTEXTO
    // ========================================
    console.log('👥 Creating users...');

    // Super Admin
    const superAdmin = await prisma.users.upsert({
        where: { email: 'admin@prosocial.mx' },
        update: {
            updated_at: new Date()
        },
        create: {
            id: 'user-superadmin',
            supabase_id: 'superadmin-supabase-uuid',
            email: 'admin@prosocial.mx',
            full_name: 'Super Administrador',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        }
    });

    // Rol de plataforma: SUPER_ADMIN
    await prisma.user_platform_roles.upsert({
        where: {
            user_id_role: {
                user_id: superAdmin.id,
                role: 'SUPER_ADMIN'
            }
        },
        update: {
            is_active: true
        },
        create: {
            id: 'role-platform-superadmin',
            user_id: superAdmin.id,
            role: 'SUPER_ADMIN',
            is_active: true,
            granted_at: new Date()
        }
    });
    console.log(`✅ Super Admin: ${superAdmin.full_name}`);

    // Studio Owner
    const studioOwner = await prisma.users.upsert({
        where: { email: 'owner@demo-studio.com' },
        update: {
            updated_at: new Date()
        },
        create: {
            id: 'user-owner',
            supabase_id: 'owner-supabase-uuid',
            email: 'owner@demo-studio.com',
            full_name: 'Propietario Demo Studio',
            is_active: true,
            created_at: new Date(),
            updated_at: new Date()
        }
    });

    // Rol de plataforma: SUSCRIPTOR
    await prisma.user_platform_roles.upsert({
        where: {
            user_id_role: {
                user_id: studioOwner.id,
                role: 'SUSCRIPTOR'
            }
        },
        update: {
            is_active: true
        },
        create: {
            id: 'role-platform-owner',
            user_id: studioOwner.id,
            role: 'SUSCRIPTOR',
            is_active: true,
            granted_at: new Date()
        }
    });

    // Rol de studio: OWNER
    await prisma.user_studio_roles.upsert({
        where: {
            user_id_studio_id_role: {
                user_id: studioOwner.id,
                studio_id: demoStudio.id,
                role: 'OWNER'
            }
        },
        update: {
            is_active: true
        },
        create: {
            id: 'role-studio-owner',
            user_id: studioOwner.id,
            studio_id: demoStudio.id,
            role: 'OWNER',
            is_active: true,
            invited_at: new Date(),
            accepted_at: new Date()
        }
    });
    console.log(`✅ Studio Owner: ${studioOwner.full_name}`);

    // ========================================
    // 5. PIPELINES V2.0
    // ========================================
    await seedPipelinesV2(demoStudio.id);
    console.log('');

    // ========================================
    // 6. TIPOS DE EVENTO (Studio-specific)
    // ========================================
    console.log('🎉 Creating event types...');

    const eventTypes = [
        { slug: 'boda', name: 'Boda', descripcion: 'Cobertura completa de boda' },
        { slug: 'xv-anos', name: 'XV Años', descripcion: 'Celebración de XV Años' },
        { slug: 'sesion-familiar', name: 'Sesión Familiar', descripcion: 'Sesión fotográfica familiar' },
        { slug: 'sesion-embarazo', name: 'Sesión Embarazo', descripcion: 'Sesión de maternidad' }
    ];

    for (const eventType of eventTypes) {
        await prisma.studio_evento_tipos.upsert({
            where: {
                id: `${demoStudio.id}-${eventType.slug}`
            },
            update: {
                updatedAt: new Date()
            },
            create: {
                id: `${demoStudio.id}-${eventType.slug}`,
                studio_id: demoStudio.id,
                nombre: eventType.name,
                status: 'active',
                orden: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            }
        });
        console.log(`  ✅ Event type: ${eventType.name}`);
    }

    console.log('\n🎉 Seed V2.0 completado exitosamente!');
    console.log('\n📝 Resumen:');
    console.log('  - ✅ Módulos de plataforma creados');
    console.log('  - ✅ Demo studio configurado');
    console.log('  - ✅ Módulos core activados');
    console.log('  - ✅ Usuarios multi-contexto creados');
    console.log('  - ✅ Pipelines Marketing + Manager creados');
    console.log('  - ✅ Tipos de evento creados');
    console.log('\n🔗 Acceso:');
    console.log('  - Super Admin: admin@prosocial.mx');
    console.log('  - Studio Owner: owner@demo-studio.com');
    console.log('  - Studio Slug: demo-studio');
}

main()
    .catch((e) => {
        console.error('❌ Error en seed V2.0:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

