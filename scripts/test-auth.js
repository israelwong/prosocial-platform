/**
 * Script para probar autenticación con Supabase
 * Ejecutar con: node scripts/test-auth.js
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

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuth() {
  console.log("🧪 Probando autenticación con Supabase...\n");

  const testUser = {
    email: "owner@demo-studio.com",
    password: "Owner123!"
  };

  try {
    console.log(`📧 Intentando autenticar: ${testUser.email}`);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    });

    if (error) {
      console.error("❌ Error de autenticación:", error.message);
      console.error("   Código:", error.status);
      return;
    }

    console.log("✅ Autenticación exitosa!");
    console.log("   Usuario ID:", data.user.id);
    console.log("   Email:", data.user.email);
    console.log("   Sesión activa:", !!data.session);

    // Probar cambio de contraseña
    console.log("\n🔄 Probando cambio de contraseña...");
    const newPassword = "NewPassword123!";
    
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      console.error("❌ Error al cambiar contraseña:", updateError.message);
    } else {
      console.log("✅ Contraseña cambiada exitosamente!");
      console.log("   Nueva contraseña:", newPassword);
    }

  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
  }
}

testAuth().catch(console.error);
