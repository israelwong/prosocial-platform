/**
 * Script para debuggear el contexto de autenticación
 * Simula exactamente lo que hace la aplicación web
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

async function debugAuthContext() {
  console.log("🔍 Debuggeando contexto de autenticación...\n");

  try {
    // 1. Verificar si hay una sesión activa
    console.log("1️⃣ Verificando sesión activa...");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.log("❌ Error al obtener sesión:", sessionError.message);
    } else if (session) {
      console.log("✅ Sesión activa encontrada:");
      console.log("   Usuario ID:", session.user.id);
      console.log("   Email:", session.user.email);
      console.log("   Expires at:", new Date(session.expires_at * 1000));
    } else {
      console.log("❌ No hay sesión activa");
    }

    // 2. Intentar autenticar
    console.log("\n2️⃣ Intentando autenticar...");
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email: "owner@demo-studio.com",
        password: "Owner123!",
      });

    if (authError) {
      console.log("❌ Error de autenticación:", authError.message);
      return;
    }

    console.log("✅ Autenticación exitosa:");
    console.log("   Usuario ID:", authData.user.id);
    console.log("   Email:", authData.user.email);
    console.log("   Sesión:", !!authData.session);

    // 3. Verificar sesión después de autenticar
    console.log("\n3️⃣ Verificando sesión después de autenticar...");
    const {
      data: { session: newSession },
      error: newSessionError,
    } = await supabase.auth.getSession();

    if (newSessionError) {
      console.log("❌ Error al obtener nueva sesión:", newSessionError.message);
    } else if (newSession) {
      console.log("✅ Nueva sesión activa:");
      console.log("   Usuario ID:", newSession.user.id);
      console.log("   Email:", newSession.user.email);
      console.log("   Expires at:", new Date(newSession.expires_at * 1000));
    } else {
      console.log("❌ No hay nueva sesión activa");
    }

    // 4. Verificar usuario actual
    console.log("\n4️⃣ Verificando usuario actual...");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.log("❌ Error al obtener usuario:", userError.message);
    } else if (user) {
      console.log("✅ Usuario actual:");
      console.log("   ID:", user.id);
      console.log("   Email:", user.email);
    } else {
      console.log("❌ No hay usuario actual");
    }

    // 5. Verificar en base de datos
    console.log("\n5️⃣ Verificando en base de datos...");
    const dbUser = await prisma.users.findUnique({
      where: { supabase_id: authData.user.id },
    });

    if (!dbUser) {
      console.log("❌ Usuario no encontrado en BD");
      console.log("   ID buscado:", authData.user.id);
      return;
    }

    console.log("✅ Usuario encontrado en BD:");
    console.log("   ID:", dbUser.id);
    console.log("   Email:", dbUser.email);
    console.log("   Supabase ID:", dbUser.supabase_id);

    // 6. Verificar roles
    console.log("\n6️⃣ Verificando roles...");
    const userStudioRoles = await prisma.user_studio_roles.findMany({
      where: { user_id: dbUser.id },
      include: { studio: true },
    });

    console.log("   Roles encontrados:", userStudioRoles.length);
    userStudioRoles.forEach((role, index) => {
      console.log(
        `   ${index + 1}. Studio: ${role.studio.studio_name} (${role.studio.slug})`
      );
      console.log(`      Rol: ${role.role}`);
      console.log(`      Activo: ${role.is_active}`);
    });

    // 7. Verificar rol OWNER específicamente
    console.log("\n7️⃣ Verificando rol OWNER...");
    const ownerRole = await prisma.user_studio_roles.findFirst({
      where: {
        user_id: dbUser.id,
        role: "OWNER",
      },
      include: { studio: true },
    });

    if (!ownerRole) {
      console.log("❌ No se encontró rol OWNER");
      return;
    }

    console.log("✅ Rol OWNER encontrado:");
    console.log("   Studio:", ownerRole.studio.studio_name);
    console.log("   Studio ID:", ownerRole.studio.id);
    console.log("   Studio Slug:", ownerRole.studio.slug);

    console.log("\n🎯 RESUMEN:");
    console.log("✅ Autenticación exitosa");
    console.log("✅ Usuario encontrado en BD");
    console.log("✅ Rol OWNER encontrado");
    console.log("✅ Studio encontrado");
    console.log("\n🔍 El problema NO está en los datos de BD");
  } catch (error) {
    console.error("❌ Error inesperado:", error);
  } finally {
    await prisma.$disconnect();
  }
}

debugAuthContext().catch(console.error);
