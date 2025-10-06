/**
 * Script para debuggear la página de suscripción
 * Simula exactamente lo que hace la página
 */

const { PrismaClient } = require("@prisma/client");
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const prisma = new PrismaClient();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Faltan variables de entorno");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simular la función obtenerDatosSuscripcion exactamente como está en el código
async function obtenerDatosSuscripcion(studioSlug) {
  console.log("🔍 Ejecutando obtenerDatosSuscripcion desde la página...");
  console.log("   studioSlug:", studioSlug);

  try {
    // Obtener usuario actual
    console.log("\n1️⃣ Obteniendo usuario actual...");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.log("❌ Error de autenticación:", userError?.message);
      return {
        success: false,
        error: "Usuario no autenticado",
      };
    }

    console.log("✅ Usuario obtenido:");
    console.log("   ID:", user.id);
    console.log("   Email:", user.email);

    // Buscar el usuario en nuestra tabla usando supabase_id
    console.log("\n2️⃣ Buscando usuario en BD...");
    const dbUser = await prisma.users.findUnique({
      where: { supabase_id: user.id },
    });

    if (!dbUser) {
      console.log("❌ Usuario no encontrado en BD");
      console.log("   ID buscado:", user.id);
      return {
        success: false,
        error: "Usuario no encontrado en la base de datos",
      };
    }

    console.log("✅ Usuario encontrado en BD:");
    console.log("   ID:", dbUser.id);
    console.log("   Email:", dbUser.email);

    // Buscar el studio del usuario
    console.log("\n3️⃣ Buscando studio del usuario...");
    const userStudioRole = await prisma.user_studio_roles.findFirst({
      where: {
        user_id: dbUser.id,
        role: "OWNER",
      },
      include: { studio: true },
    });

    if (!userStudioRole) {
      console.log("❌ No se encontró rol OWNER");
      console.log("   user_id buscado:", dbUser.id);
      console.log("   role buscado: OWNER");

      // Verificar qué roles tiene el usuario
      const allRoles = await prisma.user_studio_roles.findMany({
        where: { user_id: dbUser.id },
        include: { studio: true },
      });
      console.log(
        "   Roles disponibles:",
        allRoles.map((r) => ({
          studio: r.studio.studio_name,
          role: r.role,
          active: r.is_active,
        }))
      );

      return {
        success: false,
        error: "Usuario no tiene rol OWNER en ningún studio",
      };
    }

    console.log("✅ Studio encontrado:");
    console.log("   Studio:", userStudioRole.studio.studio_name);
    console.log("   Studio ID:", userStudioRole.studio.id);
    console.log("   Studio Slug:", userStudioRole.studio.slug);

    // Verificar que el slug coincida
    if (userStudioRole.studio.slug !== studioSlug) {
      console.log("❌ El slug del studio no coincide");
      console.log("   Slug esperado:", studioSlug);
      console.log("   Slug del studio:", userStudioRole.studio.slug);
      return {
        success: false,
        error: "Studio no encontrado o no autorizado",
      };
    }

    console.log("✅ Slug del studio coincide");

    // Obtener suscripción actual
    console.log("\n4️⃣ Buscando suscripción...");
    const subscription = await prisma.subscriptions.findFirst({
      where: { studio_id: userStudioRole.studio.id },
      include: {
        plans: true,
        items: {
          where: { deactivated_at: null },
          include: { plan: true },
        },
      },
    });

    if (!subscription) {
      console.log("❌ No se encontró suscripción");
      return {
        success: false,
        error: "No se encontró suscripción para este studio",
      };
    }

    console.log("✅ Suscripción encontrada:");
    console.log("   ID:", subscription.id);
    console.log("   Plan:", subscription.plans.name);
    console.log("   Status:", subscription.status);

    // Obtener límites del plan
    console.log("\n5️⃣ Buscando límites del plan...");
    const limits = await prisma.plan_limits.findMany({
      where: { plan_id: subscription.plan_id },
    });

    console.log("✅ Límites encontrados:", limits.length);

    // Obtener historial de facturación (simulado)
    console.log("\n6️⃣ Creando historial de facturación...");
    const billing_history = [
      {
        id: "demo_bill_1",
        subscription_id: subscription.id,
        amount: subscription.plans.price_monthly?.toNumber() || 0,
        currency: "MXN",
        status: "paid",
        description: `Factura ${subscription.plans.name} - ${new Date().toLocaleDateString("es-ES")}`,
        created_at: new Date(),
      },
    ];

    console.log("✅ Historial creado");

    // Mapear datos para que coincidan con los tipos
    console.log("\n7️⃣ Mapeando datos...");
    const plan = {
      id: subscription.plans.id,
      name: subscription.plans.name,
      slug: subscription.plans.slug,
      description: subscription.plans.description || "",
      price_monthly: subscription.plans.price_monthly?.toNumber() || 0,
      price_yearly: subscription.plans.price_yearly?.toNumber() || 0,
      features: subscription.plans.features,
      popular: subscription.plans.popular,
      active: subscription.plans.active,
      orden: subscription.plans.orden,
    };

    const mappedLimits = limits.map((limit) => ({
      id: limit.id,
      plan_id: limit.plan_id,
      limit_type: limit.limit_type,
      limit_value: limit.limit_value,
      unit: limit.unit || "",
    }));

    const mappedItems = subscription.items.map((item) => ({
      id: item.id,
      subscription_id: item.subscription_id,
      item_type: item.item_type,
      plan_id: item.plan_id || undefined,
      module_id: item.module_id || undefined,
      overage_type: item.overage_type || undefined,
      overage_quantity: item.overage_quantity || undefined,
      unit_price: item.unit_price.toNumber(),
      quantity: item.quantity,
      subtotal: item.subtotal.toNumber(),
      description: item.description || undefined,
      activated_at: item.activated_at,
      deactivated_at: item.deactivated_at || undefined,
    }));

    const mappedBillingHistory = billing_history.map((bill) => ({
      id: bill.id,
      subscription_id: bill.subscription_id,
      amount: bill.amount,
      currency: bill.currency,
      status: bill.status,
      description: bill.description,
      created_at: bill.created_at,
    }));

    const subscriptionData = {
      id: subscription.id,
      studio_id: subscription.studio_id,
      stripe_subscription_id: subscription.stripe_subscription_id,
      stripe_customer_id: subscription.stripe_customer_id,
      plan_id: subscription.plan_id,
      status: subscription.status,
      current_period_start: subscription.current_period_start,
      current_period_end: subscription.current_period_end,
      billing_cycle_anchor: subscription.billing_cycle_anchor,
      created_at: subscription.created_at,
      updated_at: subscription.updated_at,
      plan: {
        id: plan.id,
        name: plan.name,
        slug: plan.slug,
        description: plan.description,
        price_monthly: plan.price_monthly,
        price_yearly: plan.price_yearly,
        features: plan.features,
        popular: plan.popular,
        active: plan.active,
        orden: plan.orden,
      },
    };

    const data = {
      subscription: subscriptionData,
      plan,
      limits: mappedLimits,
      items: mappedItems,
      billing_history: mappedBillingHistory,
    };

    console.log("✅ Datos mapeados correctamente");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("❌ Error inesperado:", error);
    return {
      success: false,
      error: "Error interno del servidor",
    };
  }
}

async function debugPaginaSuscripcion() {
  console.log("🔍 Debuggeando página de suscripción...\n");

  try {
    // Autenticar primero
    const { data, error } = await supabase.auth.signInWithPassword({
      email: "owner@demo-studio.com",
      password: "Owner123!",
    });

    if (error) {
      console.error("❌ Error de autenticación:", error.message);
      return;
    }

    console.log("✅ Autenticado correctamente");

    // Llamar a la función con el slug correcto
    const result = await obtenerDatosSuscripcion("demo-studio");

    console.log("\n🎯 RESULTADO:");
    console.log("Success:", result.success);
    if (result.success) {
      console.log("✅ Función ejecutada correctamente");
      console.log("Plan:", result.data.plan.name);
      console.log("Límites:", result.data.limits.length);
      console.log("Items:", result.data.items.length);
      console.log("Historial:", result.data.billing_history.length);
    } else {
      console.log("❌ Error:", result.error);
    }
  } catch (error) {
    console.error("❌ Error inesperado:", error);
  } finally {
    await prisma.$disconnect();
  }
}

debugPaginaSuscripcion().catch(console.error);
