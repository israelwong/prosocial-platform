-- Migración manual para configurar RLS en prosocial_leads
-- Ejecutar directamente en la base de datos

-- Habilitar RLS en la tabla prosocial_leads
ALTER TABLE "prosocial_leads" ENABLE ROW LEVEL SECURITY;

-- Política para que los agentes puedan leer sus leads asignados
CREATE POLICY "Agents can read their assigned leads" ON "prosocial_leads"
    FOR SELECT 
    USING (
        "agentId" = auth.uid()::text
    );

-- Política para que los agentes puedan actualizar sus leads asignados
CREATE POLICY "Agents can update their assigned leads" ON "prosocial_leads"
    FOR UPDATE 
    USING (
        "agentId" = auth.uid()::text
    )
    WITH CHECK (
        "agentId" = auth.uid()::text
    );

-- Política para que los super admins puedan hacer todo
CREATE POLICY "Super admins can do everything on leads" ON "prosocial_leads"
    FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM "user_profiles" 
            WHERE id = auth.uid()::text 
            AND role = 'super_admin'
        )
    );

-- Política para que los agentes puedan insertar nuevos leads (si es necesario)
CREATE POLICY "Agents can insert leads" ON "prosocial_leads"
    FOR INSERT 
    WITH CHECK (
        "agentId" = auth.uid()::text
    );

-- Crear índices para optimizar las consultas RLS
CREATE INDEX "prosocial_leads_agentId_idx" ON "prosocial_leads"("agentId");
CREATE INDEX "prosocial_leads_etapaId_idx" ON "prosocial_leads"("etapaId");
CREATE INDEX "prosocial_leads_createdAt_idx" ON "prosocial_leads"("createdAt");
