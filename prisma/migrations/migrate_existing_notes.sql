-- Script para migrar notas existentes a la nueva tabla de bitácora
-- Ejecutar después de crear la tabla prosocial_lead_bitacora

-- Migrar notas existentes (si las hay) a la nueva tabla de bitácora
INSERT INTO "prosocial_lead_bitacora" (
    "id",
    "leadId", 
    "tipo",
    "titulo",
    "descripcion",
    "usuarioId",
    "createdAt",
    "updatedAt"
)
SELECT 
    gen_random_uuid()::text as "id",
    "id" as "leadId",
    'NOTA_PERSONALIZADA'::"LeadBitacoraTipo" as "tipo",
    'Nota migrada' as "titulo",
    COALESCE("notasConversacion", 'Nota inicial del lead') as "descripcion",
    NULL as "usuarioId", -- No tenemos información del usuario que creó la nota
    "createdAt" as "createdAt",
    "updatedAt" as "updatedAt"
FROM "prosocial_leads" 
WHERE "notasConversacion" IS NOT NULL 
AND "notasConversacion" != '';

-- Crear entrada de bitácora para la creación de cada lead existente
INSERT INTO "prosocial_lead_bitacora" (
    "id",
    "leadId",
    "tipo", 
    "titulo",
    "descripcion",
    "usuarioId",
    "createdAt",
    "updatedAt"
)
SELECT 
    gen_random_uuid()::text as "id",
    "id" as "leadId",
    'CREACION_LEAD'::"LeadBitacoraTipo" as "tipo",
    'Lead creado' as "titulo",
    'Lead "' || "nombre" || '" creado en el sistema' as "descripcion",
    NULL as "usuarioId",
    "createdAt" as "createdAt", 
    "updatedAt" as "updatedAt"
FROM "prosocial_leads";
