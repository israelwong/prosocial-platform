/**
 * Script para debuggear cuando NO hay autenticación
 * Simula exactamente lo que pasa cuando el usuario no está autenticado
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

async function debugNoAuth() {
  console.log("🔍 Debuggeando cuando NO hay autenticación...\n");

  try {
    // 1. Verificar sesión (sin autenticar)
    console.log("1️⃣ Verificando sesión (sin autenticar)...");
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.log("❌ Error al obtener usuario:", userError.message);
      console.log(
        "   Este es el error que debería aparecer en la aplicación web"
      );
      return;
    }

    if (!user) {
      console.log("❌ No hay usuario autenticado");
      console.log(
        "   Este es el error que debería aparecer en la aplicación web"
      );
      return;
    }

    console.log(
      "✅ Usuario encontrado (esto no debería pasar sin autenticación):"
    );
    console.log("   ID:", user.id);
    console.log("   Email:", user.email);

    // 2. Si llegamos aquí, significa que hay un usuario autenticado
    console.log("\n2️⃣ Usuario autenticado encontrado, continuando...");

    // Buscar el usuario en nuestra tabla usando supabase_id
    const dbUser = await prisma.users.findUnique({
      where: { supabase_id: user.id },
    });

    if (!dbUser) {
      console.log("❌ Usuario no encontrado en BD");
      console.log("   ID buscado:", user.id);
      return;
    }

    console.log("✅ Usuario encontrado en BD:");
    console.log("   ID:", dbUser.id);
    console.log("   Email:", dbUser.email);

    // Buscar el studio del usuario
    const userStudioRole = await prisma.user_studio_roles.findFirst({
      where: {
        user_id: dbUser.id,
        role: "OWNER",
      },
      include: { studio: true },
    });

    if (!userStudioRole) {
      console.log("❌ No se encontró rol OWNER");
      console.log("   Este es el error que aparece en la aplicación web");
      return;
    }

    console.log("✅ Rol OWNER encontrado:");
    console.log("   Studio:", userStudioRole.studio.studio_name);
    console.log("   Studio ID:", userStudioRole.studio.id);
  } catch (error) {
    console.error("❌ Error inesperado:", error);
  } finally {
    await prisma.$disconnect();
  }
}

debugNoAuth().catch(console.error);
