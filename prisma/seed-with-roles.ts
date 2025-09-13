import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding ProSocial Platform with Roles System...');

    // =====================================================================
    // PLANES DE SUSCRIPCIÓN
    // =====================================================================

    console.log('📋 Creating subscription plans...');

    const planBasico = await prisma.plan.upsert({
        where: { slug: 'basico' },
        update: {},
        create: {
            name: 'Básico',
            slug: 'basico',
            activeProjectLimit: 3,
            priceMonthly: 790, // $790 MXN
            priceYearly: 7900, // $7,900 MXN (2 meses gratis)
            popular: false,
            orden: 1,
            features: [
                'Hasta 3 proyectos activos',
                'Dashboard básico',
                'Gestión de cotizaciones',
                'Calendario de eventos',
                'Portal de clientes',
                'Soporte por email'
            ]
        }
    });

    const planNegocio = await prisma.plan.upsert({
        where: { slug: 'negocio' },
        update: {},
        create: {
            name: 'Negocio',
            slug: 'negocio',
            activeProjectLimit: 8,
            priceMonthly: 1490, // $1,490 MXN
            priceYearly: 14900, // $14,900 MXN (2 meses gratis)
            popular: true, // Plan recomendado
            orden: 2,
            features: [
                'Hasta 8 proyectos activos',
                'Dashboard avanzado',
                'Gestión completa de pipeline',
                'Analytics y reportes',
                'Integración con redes sociales',
                'Soporte prioritario'
            ]
        }
    });

    const planAgencia = await prisma.plan.upsert({
        where: { slug: 'agencia' },
        update: {},
        create: {
            name: 'Agencia',
            slug: 'agencia',
            activeProjectLimit: -1, // Ilimitado
            priceMonthly: 2990, // $2,990 MXN
            priceYearly: 29900, // $29,900 MXN (2 meses gratis)
            popular: false,
            orden: 3,
            features: [
                'Proyectos ilimitados',
                'Dashboard empresarial',
                'API y webhooks',
                'White-label',
                'Gestión de equipos',
                'Soporte dedicado'
            ]
        }
    });

    console.log('✅ Created plans:', planBasico.name, planNegocio.name, planAgencia.name);

    // =====================================================================
    // PRODUCTOS B2B2C
    // =====================================================================

    console.log('💰 Creating revenue products...');

    const invitacionesDigitales = await prisma.revenueProduct.upsert({
        where: { id: 'invitaciones-digitales' },
        update: {},
        create: {
            id: 'invitaciones-digitales',
            nombre: 'Invitaciones Digitales',
            descripcion: 'Sistema de invitaciones digitales personalizables',
            categoria: 'invitaciones',
            precioPublico: 299,
            comisionProsocial: 89.7, // 30%
            comisionStudio: 209.3, // 70%
            tipoFacturacion: 'unico',
            cicloVida: 30,
            activo: true,
            configuracion: {
                templates: 10,
                personalizacion: true,
                analytics: true
            }
        }
    });

    const espaciosVirtuales = await prisma.revenueProduct.upsert({
        where: { id: 'espacios-virtuales' },
        update: {},
        create: {
            id: 'espacios-virtuales',
            nombre: 'Espacios Virtuales',
            descripcion: 'Galerías virtuales para eventos',
            categoria: 'almacenamiento',
            precioPublico: 199,
            comisionProsocial: 59.7, // 30%
            comisionStudio: 139.3, // 70%
            tipoFacturacion: 'mensual',
            activo: true,
            configuracion: {
                storage: '10GB',
                bandwidth: 'unlimited',
                watermark: false
            }
        }
    });

    const whatsappMasivo = await prisma.revenueProduct.upsert({
        where: { id: 'whatsapp-masivo' },
        update: {},
        create: {
            id: 'whatsapp-masivo',
            nombre: 'WhatsApp Masivo',
            descripcion: 'Sistema de envío masivo de WhatsApp',
            categoria: 'marketing',
            precioPublico: 99,
            comisionProsocial: 29.7, // 30%
            comisionStudio: 69.3, // 70%
            tipoFacturacion: 'mensual',
            activo: true,
            configuracion: {
                messages: 1000,
                templates: 5,
                analytics: true
            }
        }
    });

    console.log('✅ Created revenue products:', invitacionesDigitales.nombre, espaciosVirtuales.nombre, whatsappMasivo.nombre);

    // =====================================================================
    // AGENTE COMERCIAL DEMO
    // =====================================================================

    console.log('👤 Creating demo sales agent...');

    const agenteDemo = await prisma.proSocialAgent.upsert({
        where: { email: 'israel@prosocial.mx' },
        update: {},
        create: {
            nombre: 'Israel Wong',
            email: 'israel@prosocial.mx',
            telefono: '+52 55 1234 5678',
            activo: true,
            metaMensualLeads: 25,
            comisionConversion: 0.05 // 5%
        }
    });

    console.log('✅ Created demo agent:', agenteDemo.nombre);

    // =====================================================================
    // LEADS DEMO
    // =====================================================================

    console.log('🎯 Creating demo leads...');

    const lead1 = await prisma.proSocialLead.upsert({
        where: { email: 'maria@fotografia.com' },
        update: {},
        create: {
            nombre: 'María González',
            email: 'maria@fotografia.com',
            telefono: '+52 55 9876 5432',
            nombreEstudio: 'Fotografía María',
            slugEstudio: 'fotografia-maria',
            etapa: 'seguimiento',
            puntaje: 8,
            prioridad: 'alta',
            fuente: 'web',
            planInteres: 'negocio',
            presupuestoMensual: 1500,
            agentId: agenteDemo.id,
            notasConversacion: 'Interesada en plan Negocio. Tiene 5 años de experiencia.',
            fechaUltimoContacto: new Date()
        }
    });

    const lead2 = await prisma.proSocialLead.upsert({
        where: { email: 'carlos@eventos.com' },
        update: {},
        create: {
            nombre: 'Carlos Rodríguez',
            email: 'carlos@eventos.com',
            telefono: '+52 55 5555 1234',
            nombreEstudio: 'Eventos Carlos',
            slugEstudio: 'eventos-carlos',
            etapa: 'nuevo',
            puntaje: 6,
            prioridad: 'media',
            fuente: 'referido',
            planInteres: 'basico',
            presupuestoMensual: 800,
            agentId: agenteDemo.id,
            notasConversacion: 'Recomendado por cliente existente.'
        }
    });

    const lead3 = await prisma.proSocialLead.upsert({
        where: { email: 'ana@estudio.com' },
        update: {},
        create: {
            nombre: 'Ana Martínez',
            email: 'ana@estudio.com',
            telefono: '+52 55 7777 8888',
            nombreEstudio: 'Estudio Ana',
            slugEstudio: 'estudio-ana',
            etapa: 'promesa',
            puntaje: 9,
            prioridad: 'alta',
            fuente: 'evento',
            planInteres: 'agencia',
            presupuestoMensual: 3000,
            agentId: agenteDemo.id,
            notasConversacion: 'Muy interesada. Reunión programada para mañana.',
            fechaUltimoContacto: new Date()
        }
    });

    console.log('✅ Created demo leads:', lead1.nombre, lead2.nombre, lead3.nombre);

    // =====================================================================
    // USUARIOS CON ROLES
    // =====================================================================

    console.log('👥 Creating users with roles...');

    // Super Admin
    const superAdmin = await prisma.userProfile.upsert({
        where: { email: 'admin@prosocial.mx' },
        update: {},
        create: {
            id: 'admin-user-id', // Este ID debe coincidir con el de Supabase Auth
            email: 'admin@prosocial.mx',
            fullName: 'Super Administrador',
            role: 'super_admin',
            isActive: true
        }
    });

    // Asesor
    const asesor = await prisma.userProfile.upsert({
        where: { email: 'asesor@prosocial.mx' },
        update: {},
        create: {
            id: 'asesor-user-id', // Este ID debe coincidir con el de Supabase Auth
            email: 'asesor@prosocial.mx',
            fullName: 'Asesor Comercial',
            role: 'asesor',
            isActive: true
        }
    });

    // Suscriptor (Studio Owner)
    const suscriptor = await prisma.userProfile.upsert({
        where: { email: 'owner@prosocial-events.com' },
        update: {},
        create: {
            id: 'suscriptor-user-id', // Este ID debe coincidir con el de Supabase Auth
            email: 'owner@prosocial-events.com',
            fullName: 'Propietario Studio',
            role: 'suscriptor',
            isActive: true
        }
    });

    console.log('✅ Created users with roles:', superAdmin.role, asesor.role, suscriptor.role);

    // =====================================================================
    // STUDIO DEMO
    // =====================================================================

    console.log('🏢 Creating demo studio...');

    const studioDemo = await prisma.studio.upsert({
        where: { slug: 'prosocial-events' },
        update: {},
        create: {
            name: 'ProSocial Events',
            slug: 'prosocial-events',
            email: 'contacto@prosocial-events.com',
            phone: '+52 55 1234 5678',
            address: 'Ciudad de México, México',
            website: 'https://prosocial-events.com',
            planId: planNegocio.id,
            subscriptionStatus: 'active',
            subscriptionStart: new Date(),
            subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            commissionRate: 0.30, // 30% para ProSocial
            active: true
        }
    });

    // Actualizar el suscriptor para que pertenezca al studio
    await prisma.userProfile.update({
        where: { id: suscriptor.id },
        data: { studioId: studioDemo.id }
    });

    console.log('✅ Created demo studio:', studioDemo.name);

    // =====================================================================
    // ACTIVIDADES DEMO
    // =====================================================================

    console.log('📝 Creating demo activities...');

    const actividad1 = await prisma.proSocialActivity.create({
        data: {
            leadId: lead1.id,
            userId: asesor.id,
            tipo: 'llamada',
            descripcion: 'Llamada inicial para presentar la plataforma',
            resultado: 'interesado',
            proximaAccion: 'Enviar propuesta comercial',
            fechaProximaAccion: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 días
        }
    });

    const actividad2 = await prisma.proSocialActivity.create({
        data: {
            leadId: lead2.id,
            userId: asesor.id,
            tipo: 'email',
            descripcion: 'Envío de información sobre planes y precios',
            resultado: 'sin_interes',
            proximaAccion: 'Seguimiento en 1 mes'
        }
    });

    console.log('✅ Created demo activities');

    console.log('🎉 ProSocial Platform seed with roles completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
