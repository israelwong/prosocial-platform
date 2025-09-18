const { PrismaClient } = require("@prisma/client");
require("dotenv").config({ path: ".env.local" });

const prisma = new PrismaClient();

// Configuración de planes basada en la tabla del Plan Estratégico
const plansConfig = [
  {
    name: "Plan Personal",
    slug: "plan-personal",
    description:
      "Para el fotógrafo independiente que busca eficiencia personal",
    popular: false,
    orden: 1,
    price_monthly: 399,
    price_yearly: 3999,
    features: {
      "LÍMITES CLAVE": {
        "Usuarios del sistema": "1 Usuario",
        "Eventos activos por mes": "Hasta 5",
        "Paquetes preconfigurados": "Hasta 5",
      },
      "COMERCIAL Y VENTAS": {
        "Portafolio (Landing Page)": "✓",
        "CRM y Gestión de Contactos": "✓",
        "Pipeline (Kanban)": "Estándar",
        "Recordatorios por Email": "✓",
        "Recordatorios por WhatsApp": "-",
      },
      "PORTAL DE COTIZACIÓN": {
        "Presentación de cotizaciones": "✓",
        "Pasarela de pago": "✓",
        "Comparador dinámico": "-",
      },
      "GESTIÓN Y FINANZAS": {
        "Gestión de Eventos": "✓",
        "Calendario de Eventos": "✓",
        "Gestión de Catálogos": "✓",
        "Dashboard Financiero": "-",
        "Métricas de Rendimiento": "-",
        "Cálculo de Rentabilidad": "-",
      },
      "PERSONALIZACIÓN Y EQUIPO": {
        "Portal de Cliente": "✓",
        "Personalización Avanzada (Marca Blanca)": "-",
        "Gestión de Personal y Roles": "-",
        "Parámetros de Utilidad/Comisión": "-",
      },
      INTEGRACIONES: {
        "Stripe (Pasarela de Pago)": "✓",
        "ManyChat (API Key)": "-",
      },
    },
    limits: {
      usuarios_sistema: 1,
      eventos_activos_mes: 5,
      paquetes_preconfigurados: 5,
    },
  },
  {
    name: "Plan Pro",
    slug: "plan-pro",
    description:
      "Para el negocio en crecimiento que necesita colaborar y estandarizar procesos",
    popular: true,
    orden: 2,
    price_monthly: 599,
    price_yearly: 5999,
    features: {
      "LÍMITES CLAVE": {
        "Usuarios del sistema": "Hasta 5",
        "Eventos activos por mes": "Ilimitados",
        "Paquetes preconfigurados": "Ilimitados",
      },
      "COMERCIAL Y VENTAS": {
        "Portafolio (Landing Page)": "✓",
        "CRM y Gestión de Contactos": "✓",
        "Pipeline (Kanban)": "Personalizable",
        "Recordatorios por Email": "✓",
        "Recordatorios por WhatsApp": "✓",
      },
      "PORTAL DE COTIZACIÓN": {
        "Presentación de cotizaciones": "✓",
        "Pasarela de pago": "✓",
        "Comparador dinámico": "✓",
      },
      "GESTIÓN Y FINANZAS": {
        "Gestión de Eventos": "✓",
        "Calendario de Eventos": "✓",
        "Gestión de Catálogos": "✓",
        "Dashboard Financiero": "✓",
        "Métricas de Rendimiento": "✓",
        "Cálculo de Rentabilidad": "-",
      },
      "PERSONALIZACIÓN Y EQUIPO": {
        "Portal de Cliente": "✓",
        "Personalización Avanzada (Marca Blanca)": "-",
        "Gestión de Personal y Roles": "✓",
        "Parámetros de Utilidad/Comisión": "✓",
      },
      INTEGRACIONES: {
        "Stripe (Pasarela de Pago)": "✓",
        "ManyChat (API Key)": "-",
      },
    },
    limits: {
      usuarios_sistema: 5,
      eventos_activos_mes: null, // ilimitado
      paquetes_preconfigurados: null, // ilimitado
    },
  },
  {
    name: "Plan Premium",
    slug: "plan-premium",
    description:
      "Para la agencia consolidada que busca control total, marca blanca y automatización",
    popular: false,
    orden: 3,
    price_monthly: 999,
    price_yearly: 9999,
    features: {
      "LÍMITES CLAVE": {
        "Usuarios del sistema": "10+",
        "Eventos activos por mes": "Ilimitados",
        "Paquetes preconfigurados": "Ilimitados",
      },
      "COMERCIAL Y VENTAS": {
        "Portafolio (Landing Page)": "✓",
        "CRM y Gestión de Contactos": "✓",
        "Pipeline (Kanban)": "Múltiples Pipelines",
        "Recordatorios por Email": "✓",
        "Recordatorios por WhatsApp": "✓",
      },
      "PORTAL DE COTIZACIÓN": {
        "Presentación de cotizaciones": "✓",
        "Pasarela de pago": "✓",
        "Comparador dinámico": "✓",
      },
      "GESTIÓN Y FINANZAS": {
        "Gestión de Eventos": "✓",
        "Calendario de Eventos": "✓",
        "Gestión de Catálogos": "✓",
        "Dashboard Financiero": "✓",
        "Métricas de Rendimiento": "✓",
        "Cálculo de Rentabilidad": "✓",
      },
      "PERSONALIZACIÓN Y EQUIPO": {
        "Portal de Cliente": "✓",
        "Personalización Avanzada (Marca Blanca)": "✓",
        "Gestión de Personal y Roles": "✓",
        "Parámetros de Utilidad/Comisión": "✓",
      },
      INTEGRACIONES: {
        "Stripe (Pasarela de Pago)": "✓",
        "ManyChat (API Key)": "✓",
      },
    },
    limits: {
      usuarios_sistema: 10,
      eventos_activos_mes: null, // ilimitado
      paquetes_preconfigurados: null, // ilimitado
    },
  },
];

async function cleanupAndRecreatePlans() {
  try {
    console.log("🧹 Iniciando limpieza y recreación de planes...");

    // 1. Eliminar todas las relaciones plan_services
    console.log("🗑️  Eliminando relaciones plan_services...");
    await prisma.plan_services.deleteMany({});
    console.log("✅ Relaciones plan_services eliminadas");

    // 2. Eliminar todos los planes existentes
    console.log("🗑️  Eliminando planes existentes...");
    await prisma.platform_plans.deleteMany({});
    console.log("✅ Planes eliminados");

    // 3. Obtener todos los servicios disponibles
    console.log("📋 Obteniendo servicios disponibles...");
    const allServices = await prisma.platform_services.findMany({
      include: {
        category: true,
      },
      orderBy: [{ category: { posicion: "asc" } }, { posicion: "asc" }],
    });

    console.log(`✅ ${allServices.length} servicios encontrados`);

    // 4. Crear nuevos planes
    console.log("🌱 Creando nuevos planes...");

    for (const planData of plansConfig) {
      // Crear plan
      const plan = await prisma.platform_plans.create({
        data: {
          name: planData.name,
          slug: planData.slug,
          description: planData.description,
          popular: planData.popular,
          orden: planData.orden,
          price_monthly: planData.price_monthly,
          price_yearly: planData.price_yearly,
          features: planData.features,
          limits: planData.limits,
          active: true,
        },
      });

      console.log(`✅ Plan "${plan.name}" creado (ID: ${plan.id})`);

      // Crear relaciones plan_services basadas en la tabla
      let servicesAdded = 0;
      for (const service of allServices) {
        let active = false;
        let limite = 0;
        let unidad = null;

        // Determinar si el servicio está activo en este plan basado en la tabla
        const categoryName = service.category.name;
        const serviceName = service.name;

        if (
          planData.features[categoryName] &&
          planData.features[categoryName][serviceName]
        ) {
          const featureValue = planData.features[categoryName][serviceName];

          if (featureValue === "✓") {
            active = true;
            // Si tiene límite específico, usarlo
            if (planData.limits[service.slug] !== undefined) {
              limite = planData.limits[service.slug];
              unidad = "CANTIDAD";
            } else {
              // Sin límite (ilimitado)
              limite = null;
            }
          } else if (featureValue === "-") {
            active = false;
            limite = 0;
          } else {
            // Para valores como "Estándar", "Personalizable", "Múltiples Pipelines"
            active = true;
            limite = null;
          }
        }

        // Crear relación plan_service
        await prisma.plan_services.create({
          data: {
            plan_id: plan.id,
            service_id: service.id,
            active: active,
            limite: limite,
            unidad: unidad,
          },
        });

        if (active) {
          servicesAdded++;
        }
      }

      console.log(
        `  ✅ ${servicesAdded} servicios configurados para el plan "${plan.name}"`
      );
    }

    // 5. Verificar la creación
    console.log("\n📊 Verificando planes creados...");
    const allPlans = await prisma.platform_plans.findMany({
      include: {
        plan_services: {
          include: {
            service: {
              include: {
                category: true,
              },
            },
          },
        },
      },
      orderBy: { orden: "asc" },
    });

    console.log(`\n📋 Resumen de planes creados:`);
    allPlans.forEach((plan, index) => {
      const activeServices = plan.plan_services.filter((ps) => ps.active);
      console.log(
        `\n${index + 1}. ${plan.name} (${activeServices.length} servicios activos)`
      );
      console.log(`   Precio mensual: $${plan.price_monthly}`);
      console.log(`   Precio anual: $${plan.price_yearly}`);
      console.log(`   Popular: ${plan.popular ? "Sí" : "No"}`);

      // Agrupar servicios por categoría
      const servicesByCategory = {};
      activeServices.forEach((ps) => {
        const categoryName = ps.service.category.name;
        if (!servicesByCategory[categoryName]) {
          servicesByCategory[categoryName] = [];
        }
        servicesByCategory[categoryName].push(ps.service.name);
      });

      Object.keys(servicesByCategory).forEach((categoryName) => {
        console.log(
          `   ${categoryName}: ${servicesByCategory[categoryName].join(", ")}`
        );
      });
    });

    console.log("\n🎉 Limpieza y recreación de planes completada exitosamente");
  } catch (error) {
    console.error(
      "❌ Error durante la limpieza y recreación de planes:",
      error
    );
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar el script
cleanupAndRecreatePlans()
  .then(() => {
    console.log("✅ Proceso completado");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });
