/**
 * Script para probar cambio de contraseña
 * Ejecutar con: node scripts/test-password-change.js
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("❌ Faltan variables de entorno:");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl);
  console.error("   NEXT_PUBLIC_SUPABASE_ANON_KEY:", !!supabaseAnonKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false
  }
});

async function testPasswordChange() {
  console.log("🧪 Probando cambio de contraseña...\n");

  const testUser = {
    email: "owner@demo-studio.com",
    currentPassword: "Owner123!",
    newPassword: "NewPassword123!"
  };

  try {
    console.log(`📧 Autenticando usuario: ${testUser.email}`);
    
    // 1. Autenticar con contraseña actual
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.currentPassword
    });

    if (authError) {
      console.error("❌ Error de autenticación:", authError.message);
      return;
    }

    console.log("✅ Autenticación exitosa!");
    console.log("   Usuario ID:", authData.user.id);
    console.log("   Email:", authData.user.email);

    // 2. Cambiar contraseña
    console.log("\n🔄 Cambiando contraseña...");
    const { error: updateError } = await supabase.auth.updateUser({
      password: testUser.newPassword
    });

    if (updateError) {
      console.error("❌ Error al cambiar contraseña:", updateError.message);
    } else {
      console.log("✅ Contraseña cambiada exitosamente!");
      console.log("   Nueva contraseña:", testUser.newPassword);
    }

    // 3. Verificar nueva contraseña
    console.log("\n🔍 Verificando nueva contraseña...");
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.newPassword
    });

    if (verifyError) {
      console.error("❌ Error al verificar nueva contraseña:", verifyError.message);
    } else {
      console.log("✅ Nueva contraseña verificada correctamente!");
    }

  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
  }
}

testPasswordChange().catch(console.error);
