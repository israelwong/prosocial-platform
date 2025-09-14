const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function runMigration() {
    try {
        console.log('🚀 Iniciando migración del sistema de bitácora de leads...');

        // Crear el enum LeadBitacoraTipo
        console.log('📋 Creando enum LeadBitacoraTipo...');
        await prisma.$executeRawUnsafe(`
            CREATE TYPE "LeadBitacoraTipo" AS ENUM (
                'NOTA_PERSONALIZADA',
                'CAMBIO_ETAPA',
                'ASIGNACION_ASESOR',
                'DESASIGNACION_ASESOR',
                'CREACION_LEAD',
                'ACTUALIZACION_DATOS',
                'LLAMADA_REALIZADA',
                'EMAIL_ENVIADO',
                'REUNION_AGENDADA',
                'CONTRATO_FIRMADO',
                'SUSCRIPCION_ACTIVA',
                'CANCELACION'
            );
        `);

        // Crear la tabla ProSocialLeadBitacora
        console.log('📋 Creando tabla prosocial_lead_bitacora...');
        await prisma.$executeRawUnsafe(`
            CREATE TABLE "prosocial_lead_bitacora" (
                "id" TEXT NOT NULL,
                "leadId" TEXT NOT NULL,
                "tipo" "LeadBitacoraTipo" NOT NULL,
                "titulo" TEXT,
                "descripcion" TEXT NOT NULL,
                "metadata" JSONB,
                "usuarioId" TEXT,
                "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
                "updatedAt" TIMESTAMP(3) NOT NULL,

                CONSTRAINT "prosocial_lead_bitacora_pkey" PRIMARY KEY ("id")
            );
        `);

        // Crear índices
        console.log('📋 Creando índices...');
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_lead_bitacora_leadId_idx" ON "prosocial_lead_bitacora"("leadId");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_lead_bitacora_tipo_idx" ON "prosocial_lead_bitacora"("tipo");`);
        await prisma.$executeRawUnsafe(`CREATE INDEX "prosocial_lead_bitacora_createdAt_idx" ON "prosocial_lead_bitacora"("createdAt");`);

        // Agregar foreign keys
        console.log('📋 Agregando foreign keys...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "prosocial_lead_bitacora" ADD CONSTRAINT "prosocial_lead_bitacora_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "prosocial_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;`);
        await prisma.$executeRawUnsafe(`ALTER TABLE "prosocial_lead_bitacora" ADD CONSTRAINT "prosocial_lead_bitacora_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;`);

        // Remover el campo notasConversacion
        console.log('📋 Removiendo campo notasConversacion...');
        await prisma.$executeRawUnsafe(`ALTER TABLE "prosocial_leads" DROP COLUMN IF EXISTS "notasConversacion";`);

        console.log('✅ Tablas creadas exitosamente');

        // Verificar que todo funcionó
        const bitacoraCount = await prisma.proSocialLeadBitacora.count();
        console.log(`📈 Total de entradas en bitácora: ${bitacoraCount}`);

        const leadsCount = await prisma.proSocialLead.count();
        console.log(`👥 Total de leads: ${leadsCount}`);

        console.log('🎉 Migración completada exitosamente!');

    } catch (error) {
        console.error('❌ Error durante la migración:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

// Ejecutar la migración
runMigration()
    .then(() => {
        console.log('✅ Migración finalizada');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
