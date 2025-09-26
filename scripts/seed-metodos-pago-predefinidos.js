#!/usr/bin/env node

/**
 * Script para crear métodos de pago predefinidos para todos los estudios
 * Métodos: Efectivo, Depósito Bancario, Transferencia, OXXO
 */

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

// Métodos predefinidos
const metodosPredefinidos = [
  {
    metodo_pago: "Efectivo",
    payment_method: "cash",
    status: "active",
    orden: 1,
    comision_porcentaje_base: null,
    comision_fija_monto: null,
    num_msi: null,
    comision_msi_porcentaje: null,
  },
  {
    metodo_pago: "Depósito Bancario",
    payment_method: "deposit",
    status: "active",
    orden: 2,
    comision_porcentaje_base: null,
    comision_fija_monto: null,
    num_msi: null,
    comision_msi_porcentaje: null,
  },
  {
    metodo_pago: "Transferencia",
    payment_method: "transfer",
    status: "active",
    orden: 3,
    comision_porcentaje_base: null,
    comision_fija_monto: null,
    num_msi: null,
    comision_msi_porcentaje: null,
  },
  {
    metodo_pago: "OXXO",
    payment_method: "oxxo",
    status: "active",
    orden: 4,
    comision_porcentaje_base: null,
    comision_fija_monto: null,
    num_msi: null,
    comision_msi_porcentaje: null,
  },
];

async function seedMetodosPredefinidos() {
  try {
    console.log("🚀 Iniciando seed de métodos de pago predefinidos...");

    // Obtener todos los estudios
    const estudios = await prisma.projects.findMany({
      select: { id: true, slug: true, name: true },
    });

    console.log(`📊 Encontrados ${estudios.length} estudios`);

    let totalMetodosCreados = 0;
    let estudiosProcesados = 0;

    for (const estudio of estudios) {
      console.log(`\n🏢 Procesando estudio: ${estudio.name} (${estudio.slug})`);

      // Verificar si ya tiene métodos de pago
      const metodosExistentes = await prisma.project_metodos_pago.findMany({
        where: { projectId: estudio.id },
      });

      if (metodosExistentes.length > 0) {
        console.log(
          `   ⚠️  El estudio ya tiene ${metodosExistentes.length} métodos de pago. Saltando...`
        );
        continue;
      }

      // Crear métodos predefinidos para este estudio
      for (const metodo of metodosPredefinidos) {
        try {
          await prisma.project_metodos_pago.create({
            data: {
              ...metodo,
              projectId: estudio.id,
              updatedAt: new Date(),
            },
          });
          totalMetodosCreados++;
          console.log(`   ✅ Creado: ${metodo.metodo_pago}`);
        } catch (error) {
          console.error(
            `   ❌ Error creando ${metodo.metodo_pago}:`,
            error.message
          );
        }
      }

      estudiosProcesados++;
    }

    console.log("\n🎉 Seed completado!");
    console.log(`📈 Resumen:`);
    console.log(`   - Estudios procesados: ${estudiosProcesados}`);
    console.log(`   - Métodos creados: ${totalMetodosCreados}`);
    console.log(`   - Métodos por estudio: ${metodosPredefinidos.length}`);
  } catch (error) {
    console.error("❌ Error durante el seed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  seedMetodosPredefinidos()
    .then(() => {
      console.log("✅ Script completado exitosamente");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Error en el script:", error);
      process.exit(1);
    });
}

module.exports = { seedMetodosPredefinidos, metodosPredefinidos };
