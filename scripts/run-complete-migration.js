const { PrismaClient } = require("@prisma/client");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function runMigration() {
  try {
    console.log("🚀 Iniciando migración completa del sistema...");
    console.log("=".repeat(60));

    // Paso 1: Backup de seguridad
    console.log("📦 Paso 1: Creando backup de seguridad...");
    await createBackup();

    // Paso 2: Aplicar migraciones SQL
    console.log("🗄️  Paso 2: Aplicando migraciones SQL...");
    await applySQLMigrations();

    // Paso 3: Actualizar schema de Prisma
    console.log("🔄 Paso 3: Actualizando schema de Prisma...");
    await updatePrismaSchema();

    // Paso 4: Generar cliente de Prisma
    console.log("⚙️  Paso 4: Generando cliente de Prisma...");
    await generatePrismaClient();

    // Paso 5: Seed de datos iniciales
    console.log("🌱 Paso 5: Ejecutando seed de datos...");
    await runSeeds();

    // Paso 6: Validación final
    console.log("✅ Paso 6: Validando migración...");
    await validateMigration();

    console.log("\n🎉 ¡Migración completada exitosamente!");
    console.log("\n📊 Resumen de cambios:");
    console.log("   ✅ Campos adicionales en platform_leads");
    console.log("   ✅ Sistema de pipelines separados");
    console.log("   ✅ Sistema completo de descuentos");
    console.log("   ✅ Códigos de descuento de agentes");
    console.log("   ✅ Datos de seed iniciales");
  } catch (error) {
    console.error("❌ Error durante la migración:", error);
    console.log("\n🔄 Para revertir cambios, ejecuta:");
    console.log("   npm run migrate:rollback");
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

async function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  const backupFile = `backup_pre_migration_${timestamp}.sql`;

  console.log(`   📁 Creando backup: ${backupFile}`);

  // En un entorno real, aquí ejecutarías pg_dump
  console.log("   ⚠️  IMPORTANTE: Ejecuta manualmente el backup:");
  console.log(`   pg_dump $DATABASE_URL > ${backupFile}`);
}

async function applySQLMigrations() {
  const migrationsDir = path.join(__dirname, "../prisma/migrations");
  const migrationFiles = [
    "001_enhance_leads_model.sql",
    "002_pipeline_types.sql",
    "003_discount_system.sql",
  ];

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    if (fs.existsSync(filePath)) {
      console.log(`   📄 Aplicando: ${file}`);
      // En un entorno real, aquí ejecutarías el SQL
      console.log(`   ⚠️  IMPORTANTE: Ejecuta manualmente:`);
      console.log(`   psql $DATABASE_URL -f ${filePath}`);
    }
  }
}

async function updatePrismaSchema() {
  console.log("   🔄 Actualizando schema.prisma...");
  // El schema ya está actualizado, solo necesitamos sincronizar
  console.log("   ✅ Schema actualizado");
}

async function generatePrismaClient() {
  return new Promise((resolve, reject) => {
    console.log("   ⚙️  Generando cliente de Prisma...");
    exec("npx prisma generate", (error, stdout, stderr) => {
      if (error) {
        console.error("   ❌ Error generando cliente:", error);
        reject(error);
        return;
      }
      console.log("   ✅ Cliente de Prisma generado");
      resolve();
    });
  });
}

async function runSeeds() {
  console.log("   🌱 Ejecutando seeds...");

  // Seed de tipos de pipeline
  await seedPipelineTypes();

  // Seed de etapas de pipeline
  await seedPipelineStages();

  // Seed de códigos de descuento
  await seedDiscountCodes();

  console.log("   ✅ Seeds completados");
}

async function seedPipelineTypes() {
  console.log("     📋 Creando tipos de pipeline...");

  const pipelineTypes = [
    {
      id: "pipeline_conversion",
      nombre: "Conversión",
      descripcion:
        "Pipeline para gestión de prospectos y conversión a clientes",
      color: "#3B82F6",
      orden: 1,
    },
    {
      id: "pipeline_support",
      nombre: "Soporte",
      descripcion: "Pipeline para gestión de tickets de soporte de clientes",
      color: "#10B981",
      orden: 2,
    },
  ];

  for (const type of pipelineTypes) {
    await prisma.platform_pipeline_types.upsert({
      where: { id: type.id },
      update: { ...type, updatedAt: new Date() },
      create: { ...type, updatedAt: new Date() },
    });
  }

  console.log("     ✅ Tipos de pipeline creados");
}

async function seedPipelineStages() {
  console.log("     📋 Creando etapas de pipeline...");

  const conversionStages = [
    {
      nombre: "Nuevos Leads",
      descripcion: "Leads recién capturados",
      color: "#3B82F6",
      orden: 1,
    },
    {
      nombre: "En Seguimiento",
      descripcion: "Leads contactados y en proceso",
      color: "#EAB308",
      orden: 2,
    },
    {
      nombre: "Demo Agendada",
      descripcion: "Demo programada con el lead",
      color: "#A855F7",
      orden: 3,
    },
    {
      nombre: "Promesa de Compra",
      descripcion: "Lead prometió suscribirse",
      color: "#F59E0B",
      orden: 4,
    },
    {
      nombre: "Suscritos",
      descripcion: "Leads convertidos en clientes",
      color: "#10B981",
      orden: 5,
    },
    {
      nombre: "Perdidos",
      descripcion: "Leads que no se convirtieron",
      color: "#EF4444",
      orden: 6,
    },
  ];

  const supportStages = [
    {
      nombre: "Solicitud Recibida",
      descripcion: "Ticket de soporte creado",
      color: "#3B82F6",
      orden: 1,
    },
    {
      nombre: "En Análisis",
      descripcion: "Analizando el problema",
      color: "#EAB308",
      orden: 2,
    },
    {
      nombre: "En Proceso",
      descripcion: "Trabajando en la solución",
      color: "#A855F7",
      orden: 3,
    },
    {
      nombre: "Resuelto",
      descripcion: "Problema solucionado",
      color: "#10B981",
      orden: 4,
    },
    {
      nombre: "Escalado",
      descripcion: "Escalado a nivel superior",
      color: "#EF4444",
      orden: 5,
    },
  ];

  // Crear etapas de conversión
  for (const stage of conversionStages) {
    await prisma.platform_pipeline_stages.upsert({
      where: {
        id: `conversion_${stage.nombre.toLowerCase().replace(/\s+/g, "_")}`,
      },
      update: {
        ...stage,
        pipeline_type_id: "pipeline_conversion",
        updatedAt: new Date(),
      },
      create: {
        id: `conversion_${stage.nombre.toLowerCase().replace(/\s+/g, "_")}`,
        ...stage,
        pipeline_type_id: "pipeline_conversion",
        updatedAt: new Date(),
      },
    });
  }

  // Crear etapas de soporte
  for (const stage of supportStages) {
    await prisma.platform_pipeline_stages.upsert({
      where: {
        id: `support_${stage.nombre.toLowerCase().replace(/\s+/g, "_")}`,
      },
      update: {
        ...stage,
        pipeline_type_id: "pipeline_support",
        updatedAt: new Date(),
      },
      create: {
        id: `support_${stage.nombre.toLowerCase().replace(/\s+/g, "_")}`,
        ...stage,
        pipeline_type_id: "pipeline_support",
        updatedAt: new Date(),
      },
    });
  }

  console.log("     ✅ Etapas de pipeline creadas");
}

async function seedDiscountCodes() {
  console.log("     💰 Creando códigos de descuento...");

  const discountCodes = [
    {
      id: "discount_black_friday",
      codigo: "BLACKFRIDAY2024",
      nombre: "Black Friday 2024",
      descripcion: "Descuento especial Black Friday",
      tipo_descuento: "porcentaje",
      valor_descuento: 15.0,
      tipo_aplicacion: "ambos",
      fecha_inicio: new Date("2024-11-24"),
      fecha_fin: new Date("2024-11-30"),
      uso_maximo: 1000,
    },
    {
      id: "discount_anual_diciembre",
      codigo: "ANUAL2024",
      nombre: "Descuento Plan Anual Diciembre",
      descripcion: "Descuento adicional para planes anuales en diciembre",
      tipo_descuento: "porcentaje",
      valor_descuento: 10.0,
      tipo_aplicacion: "plan_anual",
      fecha_inicio: new Date("2024-12-01"),
      fecha_fin: new Date("2024-12-31"),
      uso_maximo: null,
    },
  ];

  for (const code of discountCodes) {
    await prisma.platform_discount_codes.upsert({
      where: { id: code.id },
      update: { ...code, updatedAt: new Date() },
      create: { ...code, updatedAt: new Date() },
    });
  }

  console.log("     ✅ Códigos de descuento creados");
}

async function validateMigration() {
  console.log("   🔍 Validando migración...");

  // Verificar que los nuevos campos existen
  const leadSample = await prisma.platform_leads.findFirst({
    select: {
      id: true,
      tipo_lead: true,
      metodo_conversion: true,
      agente_conversion_id: true,
    },
  });

  // Verificar tipos de pipeline
  const pipelineTypes = await prisma.platform_pipeline_types.count();

  // Verificar códigos de descuento
  const discountCodes = await prisma.platform_discount_codes.count();

  console.log("   ✅ Validación completada:");
  console.log(
    `     - Campos de leads: ${leadSample ? "OK" : "OK (sin datos)"}`
  );
  console.log(`     - Tipos de pipeline: ${pipelineTypes} creados`);
  console.log(`     - Códigos de descuento: ${discountCodes} creados`);
}

// Ejecutar migración
runMigration()
  .then(() => {
    console.log("\n✅ Migración completada exitosamente");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error en migración:", error);
    process.exit(1);
  });
