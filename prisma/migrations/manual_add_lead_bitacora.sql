-- Migración manual para agregar sistema de bitácora de leads
-- Ejecutar directamente en la base de datos

-- Crear el enum LeadBitacoraTipo
CREATE TYPE "LeadBitacoraTipo" AS ENUM (
    'NOTA_PERSONALIZADA',
    'CAMBIO_ETAPA',
    'ASIGNACION_AGENTE',
    'DESASIGNACION_AGENTE',
    'CREACION_LEAD',
    'ACTUALIZACION_DATOS',
    'LLAMADA_REALIZADA',
    'EMAIL_ENVIADO',
    'REUNION_AGENDADA',
    'CONTRATO_FIRMADO',
    'SUSCRIPCION_ACTIVA',
    'CANCELACION'
);

-- Crear la tabla ProSocialLeadBitacora
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

-- Crear índices
CREATE INDEX "prosocial_lead_bitacora_leadId_idx" ON "prosocial_lead_bitacora"("leadId");
CREATE INDEX "prosocial_lead_bitacora_tipo_idx" ON "prosocial_lead_bitacora"("tipo");
CREATE INDEX "prosocial_lead_bitacora_createdAt_idx" ON "prosocial_lead_bitacora"("createdAt");

-- Agregar foreign keys
ALTER TABLE "prosocial_lead_bitacora" ADD CONSTRAINT "prosocial_lead_bitacora_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "prosocial_leads"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "prosocial_lead_bitacora" ADD CONSTRAINT "prosocial_lead_bitacora_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "user_profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Remover el campo notasConversacion de la tabla prosocial_leads
ALTER TABLE "prosocial_leads" DROP COLUMN IF EXISTS "notasConversacion";
