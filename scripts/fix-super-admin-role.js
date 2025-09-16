const { createClient } = require("@supabase/supabase-js");
require("dotenv").config({ path: ".env.local" });

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Error: Faltan variables de entorno");
  console.error("NEXT_PUBLIC_SUPABASE_URL:", !!supabaseUrl);
  console.error("SUPABASE_SERVICE_ROLE_KEY:", !!supabaseServiceKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixSuperAdminRole() {
  try {
    console.log("🔧 Iniciando corrección del rol de super admin...");

    // Buscar el usuario super admin por email
    const { data: users, error: searchError } =
      await supabase.auth.admin.listUsers();

    if (searchError) {
      console.error("❌ Error buscando usuarios:", searchError);
      return;
    }

    const superAdminUser = users.users.find(
      (user) => user.email === "admin@prosocial.mx"
    );

    if (!superAdminUser) {
      console.error("❌ No se encontró el usuario super admin");
      return;
    }

    console.log("✅ Usuario super admin encontrado:", superAdminUser.email);
    console.log("📋 Metadatos actuales:", superAdminUser.user_metadata);

    // Actualizar los metadatos del usuario para incluir el rol
    const updatedMetadata = {
      ...superAdminUser.user_metadata,
      role: "super_admin",
      full_name: "Super Administrador",
    };

    const { data: updatedUser, error: updateError } =
      await supabase.auth.admin.updateUserById(superAdminUser.id, {
        user_metadata: updatedMetadata,
      });

    if (updateError) {
      console.error("❌ Error actualizando usuario:", updateError);
      return;
    }

    console.log("✅ Usuario super admin actualizado exitosamente");
    console.log("📋 Nuevos metadatos:", updatedUser.user.user_metadata);

    // Verificar que el rol se guardó correctamente
    const { data: verifyUser, error: verifyError } =
      await supabase.auth.admin.getUserById(superAdminUser.id);

    if (verifyError) {
      console.error("❌ Error verificando usuario:", verifyError);
      return;
    }

    console.log("🔍 Verificación final:");
    console.log("📧 Email:", verifyUser.user.email);
    console.log("👤 Rol:", verifyUser.user.user_metadata?.role);
    console.log("📝 Metadatos completos:", verifyUser.user.user_metadata);

    if (verifyUser.user.user_metadata?.role === "super_admin") {
      console.log("🎉 ¡Rol de super admin configurado correctamente!");
    } else {
      console.error("❌ El rol no se configuró correctamente");
    }
  } catch (error) {
    console.error("❌ Error inesperado:", error);
  }
}

// Ejecutar la función
fixSuperAdminRole();
