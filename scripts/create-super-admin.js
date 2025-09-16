const { PrismaClient } = require('@prisma/client');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Faltan variables de entorno de Supabase');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createSuperAdmin() {
    try {
        console.log('🚀 Creando super administrador...');

        const email = 'admin@prosocial.mx';
        const password = 'wong0admin';
        const fullName = 'Super Administrador';

        // 1. Crear o obtener usuario en Supabase Auth
        console.log('📧 Creando/obteniendo usuario en Supabase Auth...');
        let authUser;
        
        try {
            const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
                email: email,
                password: password,
                email_confirm: true,
                user_metadata: {
                    full_name: fullName,
                    role: 'super_admin'
                }
            });

            if (createError && createError.code === 'email_exists') {
                console.log('👤 Usuario ya existe, obteniendo información...');
                const { data: existingUser, error: listError } = await supabase.auth.admin.listUsers();
                
                if (listError) {
                    console.error('❌ Error obteniendo usuarios:', listError);
                    return;
                }

                const user = existingUser.users.find(u => u.email === email);
                if (!user) {
                    console.error('❌ Usuario no encontrado');
                    return;
                }

                authUser = { user };
                console.log('✅ Usuario existente encontrado:', user.id);
            } else if (createError) {
                console.error('❌ Error creando usuario en Auth:', createError);
                return;
            } else {
                authUser = newUser;
                console.log('✅ Usuario creado en Auth:', newUser.user.id);
            }
        } catch (error) {
            console.error('❌ Error inesperado:', error);
            return;
        }

        // 2. Crear o actualizar perfil de usuario en la base de datos
        console.log('👤 Creando/actualizando perfil de usuario...');
        const userProfile = await prisma.project_user_profiles.upsert({
            where: { id: authUser.user.id },
            update: {
                email: email,
                fullName: fullName,
                role: 'super_admin',
                isActive: true,
                updatedAt: new Date()
            },
            create: {
                id: authUser.user.id,
                email: email,
                fullName: fullName,
                role: 'super_admin',
                isActive: true,
                updatedAt: new Date()
            }
        });

        console.log('✅ Perfil de usuario creado:', userProfile.id);

        // 3. Crear o actualizar configuración de plataforma por defecto
        console.log('⚙️ Creando/actualizando configuración de plataforma...');
        const platformConfig = await prisma.platform_config.upsert({
            where: { id: 'platform-config-1' },
            update: {
                nombre_empresa: 'ProSocial Platform',
                logo_url: null,
                favicon_url: null,
                comercial_telefono: '+52 55 1234 5678',
                comercial_email: 'comercial@prosocial.mx',
                comercial_whatsapp: '+52 55 1234 5678',
                soporte_telefono: '+52 55 8765 4321',
                soporte_email: 'soporte@prosocial.mx',
                soporte_chat_url: null,
                direccion: null,
                horarios_atencion: 'Lunes a Viernes 9:00 - 18:00',
                timezone: 'America/Mexico_City',
                facebook_url: 'https://facebook.com/prosocial',
                instagram_url: 'https://instagram.com/prosocial',
                twitter_url: 'https://twitter.com/prosocial',
                linkedin_url: 'https://linkedin.com/company/prosocial',
                terminos_condiciones: '/terminos',
                politica_privacidad: '/privacidad',
                aviso_legal: '/legal',
                meta_description: 'Plataforma SaaS para gestión completa de estudios de fotografía',
                meta_keywords: 'fotografía, estudios, gestión, CRM, SaaS',
                google_analytics_id: null,
                google_tag_manager_id: null,
                updatedAt: new Date()
            },
            create: {
                id: 'platform-config-1',
                nombre_empresa: 'ProSocial Platform',
                logo_url: null,
                favicon_url: null,
                comercial_telefono: '+52 55 1234 5678',
                comercial_email: 'comercial@prosocial.mx',
                comercial_whatsapp: '+52 55 1234 5678',
                soporte_telefono: '+52 55 8765 4321',
                soporte_email: 'soporte@prosocial.mx',
                soporte_chat_url: null,
                direccion: null,
                horarios_atencion: 'Lunes a Viernes 9:00 - 18:00',
                timezone: 'America/Mexico_City',
                facebook_url: 'https://facebook.com/prosocial',
                instagram_url: 'https://instagram.com/prosocial',
                twitter_url: 'https://twitter.com/prosocial',
                linkedin_url: 'https://linkedin.com/company/prosocial',
                terminos_condiciones: '/terminos',
                politica_privacidad: '/privacidad',
                aviso_legal: '/legal',
                meta_description: 'Plataforma SaaS para gestión completa de estudios de fotografía',
                meta_keywords: 'fotografía, estudios, gestión, CRM, SaaS',
                google_analytics_id: null,
                google_tag_manager_id: null,
                updatedAt: new Date()
            }
        });

        console.log('✅ Configuración de plataforma creada:', platformConfig.id);

        // 4. Crear algunos datos de prueba básicos
        console.log('📊 Creando datos de prueba básicos...');

        // Crear etapa de pipeline básica
        const etapa = await prisma.platform_pipeline_stages.create({
            data: {
                id: 'etapa-nuevo-1',
                nombre: 'Nuevo Lead',
                descripcion: 'Lead recién registrado',
                color: '#3B82F6',
                orden: 1,
                isActive: true,
                updatedAt: new Date()
            }
        });

        console.log('✅ Etapa de pipeline creada:', etapa.id);

        // Crear canal de adquisición básico
        const canal = await prisma.platform_canales_adquisicion.create({
            data: {
                id: 'canal-web-1',
                nombre: 'Sitio Web',
                descripcion: 'Leads que llegan desde el sitio web',
                categoria: 'Orgánico',
                color: '#10B981',
                icono: 'Globe',
                isActive: true,
                isVisible: true,
                orden: 1,
                updatedAt: new Date()
            }
        });

        console.log('✅ Canal de adquisición creado:', canal.id);

        console.log('\n🎉 ¡Super administrador creado exitosamente!');
        console.log('📧 Email:', email);
        console.log('🔑 Contraseña:', password);
        console.log('🆔 ID:', authUser.user.id);

    } catch (error) {
        console.error('❌ Error creando super administrador:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createSuperAdmin();
