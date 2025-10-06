/**
 * Script para crear usuarios de testing en Supabase Auth
 * Ejecutar con: node scripts/create-test-users.js
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

const testUsers = [
  {
    email: "admin@prosocial.mx",
    password: "Admin123!",
    full_name: "Super Administrador",
    role: "super_admin",
  },
  {
    email: "owner@demo-studio.com",
    password: "Owner123!",
    full_name: "Carlos Méndez",
    role: "studio_owner",
  },
  {
    email: "test@demo-studio.com",
    password: "Test123!",
    full_name: "Usuario de Prueba",
    role: "studio_owner",
  },
];

async function createTestUsers() {
  console.log("🔧 Creando usuarios de testing en Supabase Auth...\n");

  for (const user of testUsers) {
    try {
      console.log(`📧 Creando usuario: ${user.email}`);

      const { data, error } = await supabase.auth.admin.createUser({
        email: user.email,
        password: user.password,
        email_confirm: true,
        user_metadata: {
          full_name: user.full_name,
          role: user.role,
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          console.log(`  ⚠️  Usuario ya existe: ${user.email}`);
        } else {
          console.error(`  ❌ Error: ${error.message}`);
        }
      } else {
        console.log(`  ✅ Usuario creado: ${user.email}`);
        console.log(`     ID: ${data.user.id}`);
        console.log(`     Contraseña: ${user.password}`);
      }
    } catch (error) {
      console.error(`  ❌ Error inesperado: ${error.message}`);
    }
    console.log("");
  }

  console.log("🎯 Usuarios de testing creados:");
  console.log("");
  console.log("📧 admin@prosocial.mx");
  console.log("   Contraseña: Admin123!");
  console.log("   Rol: Super Admin");
  console.log("");
  console.log("📧 owner@demo-studio.com");
  console.log("   Contraseña: Owner123!");
  console.log("   Rol: Studio Owner");
  console.log("");
  console.log("📧 test@demo-studio.com");
  console.log("   Contraseña: Test123!");
  console.log("   Rol: Studio Owner");
  console.log("");
  console.log("🔗 URLs de acceso:");
  console.log("   Admin: /admin");
  console.log("   Studio: /studio/demo-studio");
  console.log("");
}

createTestUsers().catch(console.error);
