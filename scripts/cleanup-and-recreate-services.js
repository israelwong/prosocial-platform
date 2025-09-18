const { PrismaClient } = require("@prisma/client");
require("dotenv").config({ path: ".env.local" });

const prisma = new PrismaClient();

// Servicios basados en la tabla del Plan Estratégico
const serviceCategories = [
  {
    name: "LÍMITES CLAVE",
    description: "Límites fundamentales del plan de suscripción",
    icon: "Shield",
    posicion: 1,
    services: [
      {
        name: "Usuarios del sistema",
        slug: "usuarios_sistema",
        description: "Número máximo de usuarios que pueden acceder al sistema",
        posicion: 1,
      },
      {
        name: "Eventos activos por mes",
        slug: "eventos_activos_mes",
        description:
          "Número máximo de eventos activos que se pueden gestionar por mes",
        posicion: 2,
      },
      {
        name: "Paquetes preconfigurados",
        slug: "paquetes_preconfigurados",
        description: "Número máximo de paquetes preconfigurados disponibles",
        posicion: 3,
      },
    ],
  },
  {
    name: "COMERCIAL Y VENTAS",
    description: "Herramientas para gestión comercial y ventas",
    icon: "TrendingUp",
    posicion: 2,
    services: [
      {
        name: "Portafolio (Landing Page)",
        slug: "portafolio_landing",
        description:
          "Landing page personalizada para mostrar el portafolio del estudio",
        posicion: 1,
      },
      {
        name: "CRM y Gestión de Contactos",
        slug: "crm_contactos",
        description:
          "Sistema de gestión de relaciones con clientes y contactos",
        posicion: 2,
      },
      {
        name: "Pipeline (Kanban)",
        slug: "pipeline_kanban",
        description:
          "Sistema de pipeline visual tipo Kanban para gestión de leads",
        posicion: 3,
      },
      {
        name: "Recordatorios por Email",
        slug: "recordatorios_email",
        description:
          "Sistema de recordatorios automáticos por correo electrónico",
        posicion: 4,
      },
      {
        name: "Recordatorios por WhatsApp",
        slug: "recordatorios_whatsapp",
        description: "Sistema de recordatorios automáticos por WhatsApp",
        posicion: 5,
      },
    ],
  },
  {
    name: "PORTAL DE COTIZACIÓN",
    description: "Herramientas para creación y gestión de cotizaciones",
    icon: "FileText",
    posicion: 3,
    services: [
      {
        name: "Presentación de cotizaciones",
        slug: "presentacion_cotizaciones",
        description:
          "Sistema para crear y presentar cotizaciones profesionales",
        posicion: 1,
      },
      {
        name: "Pasarela de pago",
        slug: "pasarela_pago",
        description: "Integración con pasarela de pago para cobros en línea",
        posicion: 2,
      },
      {
        name: "Comparador dinámico",
        slug: "comparador_dinamico",
        description:
          "Herramienta para comparar paquetes y servicios dinámicamente",
        posicion: 3,
      },
    ],
  },
  {
    name: "GESTIÓN Y FINANZAS",
    description: "Herramientas para gestión de eventos y finanzas",
    icon: "DollarSign",
    posicion: 4,
    services: [
      {
        name: "Gestión de Eventos",
        slug: "gestion_eventos",
        description: "Sistema completo para gestión de eventos y proyectos",
        posicion: 1,
      },
      {
        name: "Calendario de Eventos",
        slug: "calendario_eventos",
        description:
          "Calendario integrado para visualización y gestión de eventos",
        posicion: 2,
      },
      {
        name: "Gestión de Catálogos",
        slug: "gestion_catalogos",
        description: "Sistema para crear y gestionar catálogos de servicios",
        posicion: 3,
      },
      {
        name: "Dashboard Financiero",
        slug: "dashboard_financiero",
        description:
          "Panel de control con métricas financieras y de rendimiento",
        posicion: 4,
      },
      {
        name: "Métricas de Rendimiento",
        slug: "metricas_rendimiento",
        description:
          "Herramientas para análisis de métricas y rendimiento del negocio",
        posicion: 5,
      },
      {
        name: "Cálculo de Rentabilidad",
        slug: "calculo_rentabilidad",
        description:
          "Sistema para calcular rentabilidad de servicios y proyectos",
        posicion: 6,
      },
    ],
  },
  {
    name: "PERSONALIZACIÓN Y EQUIPO",
    description: "Herramientas de personalización y gestión de equipo",
    icon: "Users",
    posicion: 5,
    services: [
      {
        name: "Portal de Cliente",
        slug: "portal_cliente",
        description:
          "Portal privado para que los clientes accedan a su información",
        posicion: 1,
      },
      {
        name: "Personalización Avanzada (Marca Blanca)",
        slug: "personalizacion_marca_blanca",
        description: "Personalización completa con marca blanca del estudio",
        posicion: 2,
      },
      {
        name: "Gestión de Personal y Roles",
        slug: "gestion_personal_roles",
        description:
          "Sistema para gestionar personal y asignar roles y permisos",
        posicion: 3,
      },
      {
        name: "Parámetros de Utilidad/Comisión",
        slug: "parametros_utilidad_comision",
        description: "Configuración de parámetros de utilidad y comisiones",
        posicion: 4,
      },
    ],
  },
  {
    name: "INTEGRACIONES",
    description: "Integraciones con servicios externos",
    icon: "Zap",
    posicion: 6,
    services: [
      {
        name: "Stripe (Pasarela de Pago)",
        slug: "stripe_pasarela_pago",
        description: "Integración con Stripe para procesamiento de pagos",
        posicion: 1,
      },
      {
        name: "ManyChat (API Key)",
        slug: "manychat_api_key",
        description: "Integración con ManyChat para automatización de mensajes",
        posicion: 2,
      },
    ],
  },
];

async function cleanupAndRecreateServices() {
  try {
    console.log("🧹 Iniciando limpieza y recreación de servicios...");

    // 1. Eliminar todas las relaciones plan_services
    console.log("🗑️  Eliminando relaciones plan_services...");
    await prisma.plan_services.deleteMany({});
    console.log("✅ Relaciones plan_services eliminadas");

    // 2. Eliminar todos los servicios existentes
    console.log("🗑️  Eliminando servicios existentes...");
    await prisma.platform_services.deleteMany({});
    console.log("✅ Servicios eliminados");

    // 3. Eliminar todas las categorías existentes
    console.log("🗑️  Eliminando categorías existentes...");
    await prisma.service_categories.deleteMany({});
    console.log("✅ Categorías eliminadas");

    // 4. Crear nuevas categorías y servicios
    console.log("🌱 Creando nuevas categorías y servicios...");

    for (const categoryData of serviceCategories) {
      // Crear categoría
      const category = await prisma.service_categories.create({
        data: {
          name: categoryData.name,
          description: categoryData.description,
          icon: categoryData.icon,
          posicion: categoryData.posicion,
          active: true,
        },
      });

      console.log(
        `✅ Categoría "${category.name}" creada (ID: ${category.id})`
      );

      // Crear servicios de la categoría
      for (const serviceData of categoryData.services) {
        const service = await prisma.platform_services.create({
          data: {
            name: serviceData.name,
            slug: serviceData.slug,
            description: serviceData.description,
            categoryId: category.id,
            posicion: serviceData.posicion,
            active: true,
          },
        });

        console.log(
          `  ✅ Servicio "${service.name}" creado (ID: ${service.id})`
        );
      }
    }

    // 5. Verificar la creación
    console.log("\n📊 Verificando servicios creados...");
    const allCategories = await prisma.service_categories.findMany({
      include: {
        services: {
          orderBy: { posicion: "asc" },
        },
      },
      orderBy: { posicion: "asc" },
    });

    console.log(`\n📋 Resumen de categorías y servicios creados:`);
    allCategories.forEach((category, index) => {
      console.log(
        `\n${index + 1}. ${category.name} (${category.services.length} servicios)`
      );
      category.services.forEach((service, serviceIndex) => {
        console.log(
          `   ${serviceIndex + 1}. ${service.name} (${service.slug})`
        );
      });
    });

    console.log(
      "\n🎉 Limpieza y recreación de servicios completada exitosamente"
    );
  } catch (error) {
    console.error(
      "❌ Error durante la limpieza y recreación de servicios:",
      error
    );
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
cleanupAndRecreateServices()
  .then(() => {
    console.log("✅ Proceso completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
