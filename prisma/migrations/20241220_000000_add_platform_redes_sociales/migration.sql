-- CreateTable
CREATE TABLE "platform_plataformas_redes_sociales" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcion" TEXT,
    "color" TEXT,
    "icono" TEXT,
    "urlBase" TEXT,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "platform_plataformas_redes_sociales_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "platform_plataformas_redes_sociales_nombre_key" ON "platform_plataformas_redes_sociales"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "platform_plataformas_redes_sociales_slug_key" ON "platform_plataformas_redes_sociales"("slug");

-- CreateIndex
CREATE INDEX "platform_plataformas_redes_sociales_isActive_idx" ON "platform_plataformas_redes_sociales"("isActive");

-- CreateIndex
CREATE INDEX "platform_plataformas_redes_sociales_orden_idx" ON "platform_plataformas_redes_sociales"("orden");

-- Add new column to existing table
ALTER TABLE "project_redes_sociales" ADD COLUMN "plataformaId" TEXT;

-- CreateIndex for the new foreign key
CREATE INDEX "project_redes_sociales_plataformaId_idx" ON "project_redes_sociales"("plataformaId");

-- Insert default social media platforms
INSERT INTO "platform_plataformas_redes_sociales" ("id", "nombre", "slug", "descripcion", "color", "icono", "urlBase", "orden", "isActive", "createdAt", "updatedAt") VALUES
('clr00000000000000000000001', 'Facebook', 'facebook', 'Red social de Facebook', '#1877F2', 'facebook', 'https://facebook.com/', 1, true, NOW(), NOW()),
('clr00000000000000000000002', 'Instagram', 'instagram', 'Red social de Instagram', '#E4405F', 'instagram', 'https://instagram.com/', 2, true, NOW(), NOW()),
('clr00000000000000000000003', 'Twitter', 'twitter', 'Red social de Twitter/X', '#1DA1F2', 'twitter', 'https://twitter.com/', 3, true, NOW(), NOW()),
('clr00000000000000000000004', 'YouTube', 'youtube', 'Plataforma de videos de YouTube', '#FF0000', 'youtube', 'https://youtube.com/', 4, true, NOW(), NOW()),
('clr00000000000000000000005', 'LinkedIn', 'linkedin', 'Red social profesional LinkedIn', '#0077B5', 'linkedin', 'https://linkedin.com/', 5, true, NOW(), NOW()),
('clr00000000000000000000006', 'TikTok', 'tiktok', 'Plataforma de videos cortos TikTok', '#000000', 'music', 'https://tiktok.com/', 6, true, NOW(), NOW()),
('clr00000000000000000000007', 'WhatsApp', 'whatsapp', 'Aplicación de mensajería WhatsApp', '#25D366', 'message-circle', 'https://wa.me/', 7, true, NOW(), NOW()),
('clr00000000000000000000008', 'Sitio Web', 'website', 'Sitio web oficial', '#6B7280', 'globe', 'https://', 8, true, NOW(), NOW());

-- Migrate existing data: Map old plataforma strings to new platform IDs
UPDATE "project_redes_sociales" 
SET "plataformaId" = CASE 
    WHEN LOWER("plataforma") = 'facebook' THEN 'clr00000000000000000000001'
    WHEN LOWER("plataforma") = 'instagram' THEN 'clr00000000000000000000002'
    WHEN LOWER("plataforma") = 'twitter' THEN 'clr00000000000000000000003'
    WHEN LOWER("plataforma") = 'youtube' THEN 'clr00000000000000000000004'
    WHEN LOWER("plataforma") = 'linkedin' THEN 'clr00000000000000000000005'
    WHEN LOWER("plataforma") = 'tiktok' THEN 'clr00000000000000000000006'
    WHEN LOWER("plataforma") = 'whatsapp' THEN 'clr00000000000000000000007'
    WHEN LOWER("plataforma") = 'website' OR LOWER("plataforma") = 'sitio web' THEN 'clr00000000000000000000008'
    ELSE 'clr00000000000000000000008' -- Default to website for unknown platforms
END
WHERE "plataforma" IS NOT NULL;

-- Add foreign key constraint
ALTER TABLE "project_redes_sociales" ADD CONSTRAINT "project_redes_sociales_plataformaId_fkey" FOREIGN KEY ("plataformaId") REFERENCES "platform_plataformas_redes_sociales"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Drop the old plataforma column (commented out for safety - uncomment after testing)
-- ALTER TABLE "project_redes_sociales" DROP COLUMN "plataforma";
