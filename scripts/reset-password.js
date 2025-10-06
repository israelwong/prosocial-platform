/**
 * Script para resetear contraseña de usuario
 * Ejecutar con: node scripts/reset-password.js
 */

const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Faltan variables de entorno:");
  console.error("   NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl);
  console.error("   SUPABASE_SERVICE_ROLE_KEY:", !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetPassword() {
  console.log("🔧 Reseteando contraseña de usuario...\n");

  const userEmail = "owner@demo-studio.com";
  const newPassword = "Owner123!";

  try {
    console.log(`📧 Reseteando contraseña para: ${userEmail}`);
    
    // Obtener usuario por email
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();
    
    if (listError) {
      console.error("❌ Error al listar usuarios:", listError.message);
      return;
    }

    const user = users.users.find(u => u.email === userEmail);
    
    if (!user) {
      console.error("❌ Usuario no encontrado:", userEmail);
      return;
    }

    console.log("✅ Usuario encontrado:", user.id);

    // Resetear contraseña
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
      password: newPassword
    });

    if (error) {
      console.error("❌ Error al resetear contraseña:", error.message);
    } else {
      console.log("✅ Contraseña reseteada exitosamente!");
      console.log("   Email:", userEmail);
      console.log("   Nueva contraseña:", newPassword);
    }

  } catch (error) {
    console.error("❌ Error inesperado:", error.message);
  }
}

resetPassword().catch(console.error);
