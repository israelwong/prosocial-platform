import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding ProSocial Platform data...');

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
        'Calendario con disponibilidad',
        'Portal de clientes personalizado',
        'Sistema de pagos integrado',
        'Reportes financieros',
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
        'Pipeline multi-usuario',
        'Calendario compartido',
        'Portal white-label',
        'Pasarela de pagos completa',
        'Reportes avanzados',
        'API access',
        'Soporte dedicado 24/7'
      ]
    }
  });

  console.log(`✅ Created plans: ${planBasico.name}, ${planNegocio.name}, ${planAgencia.name}`);

  // =====================================================================
  // PRODUCTOS REVENUE B2B2C
  // =====================================================================
  
  console.log('💰 Creating revenue products...');

  const invitacionesDigitales = await prisma.revenueProduct.upsert({
    where: { id: 'invitaciones-digitales' },
    update: {},
    create: {
      id: 'invitaciones-digitales',
      nombre: 'Invitaciones Digitales',
      descripcion: 'Sistema completo de invitaciones digitales personalizables con gestión de confirmaciones, mesas y códigos QR',
      categoria: 'invitaciones',
      precioPublico: 599, // $599 MXN por evento
      comisionProsocial: 179.70, // 30% para ProSocial
      comisionStudio: 419.30, // 70% para Studio
      tipoFacturacion: 'unico', // Pago único por evento
      cicloVida: 90, // 90 días de vida útil
      configuracion: {
        maxInvitados: 500,
        temas: ['clasico', 'moderno', 'elegante', 'bohemio'],
        incluye: [
          'Landing page personalizable',
          'Gestión de confirmaciones',
          'Organización de mesas',
          'Códigos QR únicos',
          'Música de fondo',
          'Galería de fotos',
          'Mapa de ubicación',
          'Cuenta regresiva'
        ]
      }
    }
  });

  const espaciosVirtuales = await prisma.revenueProduct.upsert({
    where: { id: 'espacios-virtuales' },
    update: {},
    create: {
      id: 'espacios-virtuales',
      nombre: 'Espacios Virtuales',
      descripcion: 'Galerías multimedia en la nube para almacenamiento y compartición de fotos y videos organizados por categorías',
      categoria: 'almacenamiento',
      precioPublico: 199, // $199 MXN por mes
      comisionProsocial: 59.70, // 30% para ProSocial
      comisionStudio: 139.30, // 70% para Studio
      tipoFacturacion: 'mensual',
      configuracion: {
        almacenamiento: '50GB',
        categorias: ['Ceremonia', 'Recepción', 'Sesión', 'Detrás de cámaras'],
        features: [
          'Galerías organizadas',
          'Descarga masiva',
          'Compartir con contraseña',
          'Slideshow automático',
          'Responsive design',
          'Backup automático'
        ]
      }
    }
  });

  const whatsappMasivo = await prisma.revenueProduct.upsert({
    where: { id: 'whatsapp-masivo' },
    update: {},
    create: {
      id: 'whatsapp-masivo',
      nombre: 'WhatsApp Masivo',
      descripcion: 'Envío de mensajes masivos vía WhatsApp API para invitaciones, confirmaciones y recordatorios',
      categoria: 'marketing',
      precioPublico: 299, // $299 MXN por paquete de 1000 mensajes
      comisionProsocial: 89.70, // 30% para ProSocial
      comisionStudio: 209.30, // 70% para Studio
      tipoFacturacion: 'unico', // Por paquete de mensajes
      configuracion: {
        mensajesIncluidos: 1000,
        tipos: ['invitacion', 'confirmacion', 'recordatorio'],
        templates: [
          'Invitación inicial',
          'Recordatorio confirmación',
          'Mensaje día del evento',
          'Agradecimiento post-evento'
        ],
        estimacion: {
          invitacionPromedio: 250,
          confirmacionPromedio: 150,
          recordatorioPromedio: 100
        }
      }
    }
  });

  console.log(`✅ Created revenue products: ${invitacionesDigitales.nombre}, ${espaciosVirtuales.nombre}, ${whatsappMasivo.nombre}`);

  // =====================================================================
  // AGENTE COMERCIAL DEMO
  // =====================================================================
  
  console.log('👤 Creating demo sales agent...');

  const agentDemo = await prisma.proSocialAgent.upsert({
    where: { email: 'israel@prosocial.mx' },
    update: {},
    create: {
      nombre: 'Israel Wong',
      email: 'israel@prosocial.mx',
      telefono: '+52 555 123 4567',
      activo: true,
      metaMensualLeads: 25,
      comisionConversion: 0.05 // 5% por conversión
    }
  });

  console.log(`✅ Created demo agent: ${agentDemo.nombre}`);

  // =====================================================================
  // LEADS DEMO
  // =====================================================================
  
  console.log('🎯 Creating demo leads...');

  const leads = [
    {
      nombre: 'Ana García',
      email: 'ana@estudiogarcia.com',
      telefono: '+52 555 987 6543',
      nombreEstudio: 'Estudio García',
      slugEstudio: 'estudio-garcia',
      etapa: 'seguimiento',
      planInteres: 'negocio',
      presupuestoMensual: 1500,
      prioridad: 'alta',
      fuente: 'web',
      notasConversacion: 'Muy interesada, necesita migrar de su sistema actual. Tiene 15 años de experiencia.'
    },
    {
      nombre: 'Carlos Mendoza',
      email: 'carlos@fotomendoza.mx',
      telefono: '+52 555 456 7890',
      nombreEstudio: 'Foto Mendoza',
      slugEstudio: 'foto-mendoza',
      etapa: 'promesa',
      planInteres: 'basico',
      presupuestoMensual: 800,
      prioridad: 'media',
      fuente: 'referido',
      notasConversacion: 'Está evaluando opciones. Tiene un negocio pequeño pero en crecimiento.'
    },
    {
      nombre: 'Sofia Herrera',
      email: 'sofia@creativaherrera.com',
      telefono: '+52 555 321 0987',
      nombreEstudio: 'Creativa Herrera',
      slugEstudio: 'creativa-herrera',
      etapa: 'nuevo',
      planInteres: 'agencia',
      presupuestoMensual: 3000,
      prioridad: 'alta',
      fuente: 'evento',
      notasConversacion: 'Agencia establecida buscando digitalizar procesos. Maneja múltiples fotógrafos.'
    }
  ];

  for (const leadData of leads) {
    await prisma.proSocialLead.upsert({
      where: { email: leadData.email },
      update: {},
      create: {
        ...leadData,
        agentId: agentDemo.id,
        fechaUltimoContacto: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Últimos 7 días
      }
    });
  }

  console.log(`✅ Created ${leads.length} demo leads`);

  console.log('🎉 ProSocial Platform seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
