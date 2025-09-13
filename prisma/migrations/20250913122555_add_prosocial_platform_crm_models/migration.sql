-- CreateTable
CREATE TABLE "prosocial_leads" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "nombreEstudio" TEXT,
    "slugEstudio" TEXT,
    "etapa" TEXT NOT NULL DEFAULT 'nuevo',
    "fechaUltimoContacto" TIMESTAMP(3),
    "notasConversacion" TEXT,
    "planInteres" TEXT,
    "presupuestoMensual" DECIMAL(65,30),
    "fechaProbableInicio" TIMESTAMP(3),
    "agentId" TEXT,
    "puntaje" INTEGER,
    "prioridad" TEXT NOT NULL DEFAULT 'media',
    "fuente" TEXT,
    "fechaConversion" TIMESTAMP(3),
    "studioId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prosocial_leads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prosocial_agents" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "metaMensualLeads" INTEGER NOT NULL DEFAULT 20,
    "comisionConversion" DECIMAL(65,30) NOT NULL DEFAULT 0.05,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "prosocial_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prosocial_activities" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "agentId" TEXT,
    "tipo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "resultado" TEXT,
    "proximaAccion" TEXT,
    "fechaProximaAccion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prosocial_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "revenue_products" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "precioPublico" DECIMAL(65,30) NOT NULL,
    "comisionProsocial" DECIMAL(65,30) NOT NULL,
    "comisionStudio" DECIMAL(65,30) NOT NULL,
    "tipoFacturacion" TEXT NOT NULL,
    "cicloVida" INTEGER,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "configuracion" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "revenue_products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "studio_revenue_products" (
    "id" TEXT NOT NULL,
    "studioId" TEXT NOT NULL,
    "revenueProductId" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "precioCustom" DECIMAL(65,30),
    "comisionCustom" DECIMAL(65,30),
    "configuracionStudio" JSONB,
    "activadoEn" TIMESTAMP(3),
    "desactivadoEn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "studio_revenue_products_pkey" PRIMARY KEY ("id")
);

-- DropIndex
DROP INDEX "plans_active_idx";

-- AlterTable
ALTER TABLE "plans" DROP COLUMN "stripePriceId",
ADD COLUMN     "orden" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "popular" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "stripePriceIdMonthly" TEXT,
ADD COLUMN     "stripePriceIdYearly" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "prosocial_leads_email_key" ON "prosocial_leads"("email");

-- CreateIndex
CREATE UNIQUE INDEX "prosocial_leads_studioId_key" ON "prosocial_leads"("studioId");

-- CreateIndex
CREATE INDEX "prosocial_leads_etapa_prioridad_idx" ON "prosocial_leads"("etapa", "prioridad");

-- CreateIndex
CREATE INDEX "prosocial_leads_agentId_idx" ON "prosocial_leads"("agentId");

-- CreateIndex
CREATE UNIQUE INDEX "prosocial_agents_email_key" ON "prosocial_agents"("email");

-- CreateIndex
CREATE INDEX "prosocial_agents_activo_idx" ON "prosocial_agents"("activo");

-- CreateIndex
CREATE INDEX "prosocial_activities_leadId_createdAt_idx" ON "prosocial_activities"("leadId", "createdAt");

-- CreateIndex
CREATE INDEX "prosocial_activities_agentId_createdAt_idx" ON "prosocial_activities"("agentId", "createdAt");

-- CreateIndex
CREATE INDEX "revenue_products_categoria_activo_idx" ON "revenue_products"("categoria", "activo");

-- CreateIndex
CREATE UNIQUE INDEX "studio_revenue_products_studioId_revenueProductId_key" ON "studio_revenue_products"("studioId", "revenueProductId");

-- CreateIndex
CREATE INDEX "studio_revenue_products_studioId_activo_idx" ON "studio_revenue_products"("studioId", "activo");

-- CreateIndex
CREATE INDEX "plans_active_orden_idx" ON "plans"("active", "orden");

-- AddForeignKey
ALTER TABLE "prosocial_leads" ADD CONSTRAINT "prosocial_leads_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "prosocial_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prosocial_leads" ADD CONSTRAINT "prosocial_leads_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "studios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prosocial_activities" ADD CONSTRAINT "prosocial_activities_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "prosocial_leads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prosocial_activities" ADD CONSTRAINT "prosocial_activities_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "prosocial_agents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studio_revenue_products" ADD CONSTRAINT "studio_revenue_products_studioId_fkey" FOREIGN KEY ("studioId") REFERENCES "studios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "studio_revenue_products" ADD CONSTRAINT "studio_revenue_products_revenueProductId_fkey" FOREIGN KEY ("revenueProductId") REFERENCES "revenue_products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
