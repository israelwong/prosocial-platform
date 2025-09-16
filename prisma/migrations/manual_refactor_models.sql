-- Migración manual para refactorizar nombres de modelos
-- De prosocial_* a platform_* y de studios a projects

-- 1. Eliminar políticas RLS que dependen de las tablas a renombrar
DROP POLICY IF EXISTS "agents_select_leads" ON prosocial_leads;
DROP POLICY IF EXISTS "agents_update_leads" ON prosocial_leads;
DROP POLICY IF EXISTS "agents_insert_leads" ON prosocial_leads;

-- 2. Renombrar tablas prosocial_* a platform_*
ALTER TABLE prosocial_agents RENAME TO platform_agents;
ALTER TABLE prosocial_canales_adquisicion RENAME TO platform_canales_adquisicion;
ALTER TABLE prosocial_campanas RENAME TO platform_campanas;
ALTER TABLE prosocial_campana_plataformas RENAME TO platform_campana_plataformas;
ALTER TABLE prosocial_leads RENAME TO platform_leads;
ALTER TABLE prosocial_lead_bitacora RENAME TO platform_lead_bitacora;
ALTER TABLE prosocial_pipeline_stages RENAME TO platform_pipeline_stages;
ALTER TABLE prosocial_plataformas_publicidad RENAME TO platform_plataformas_publicidad;
ALTER TABLE prosocial_plans RENAME TO platform_plans;
ALTER TABLE prosocial_billing_cycles RENAME TO platform_billing_cycles;

-- 3. Renombrar tablas studios a projects
ALTER TABLE studios RENAME TO projects;

-- 4. Renombrar tablas project_* (si existen)
-- Nota: Estas tablas pueden no existir aún, por lo que usamos IF EXISTS
DO $$ 
BEGIN
    -- Renombrar tablas que empiecen con project_ si existen
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'project_agenda') THEN
        -- Las tablas project_* ya deberían tener el nombre correcto
        NULL;
    END IF;
END $$;

-- 5. Actualizar referencias en foreign keys
-- Actualizar referencias a prosocial_agents
ALTER TABLE platform_leads DROP CONSTRAINT IF EXISTS prosocial_leads_agentId_fkey;
ALTER TABLE platform_leads ADD CONSTRAINT platform_leads_agentId_fkey 
    FOREIGN KEY ("agentId") REFERENCES platform_agents("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Actualizar referencias a prosocial_canales_adquisicion
ALTER TABLE platform_leads DROP CONSTRAINT IF EXISTS prosocial_leads_canalAdquisicionId_fkey;
ALTER TABLE platform_leads ADD CONSTRAINT platform_leads_canalAdquisicionId_fkey 
    FOREIGN KEY ("canalAdquisicionId") REFERENCES platform_canales_adquisicion("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Actualizar referencias a prosocial_pipeline_stages
ALTER TABLE platform_leads DROP CONSTRAINT IF EXISTS prosocial_leads_etapaId_fkey;
ALTER TABLE platform_leads ADD CONSTRAINT platform_leads_etapaId_fkey 
    FOREIGN KEY ("etapaId") REFERENCES platform_pipeline_stages("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Actualizar referencias a prosocial_campanas
ALTER TABLE platform_leads DROP CONSTRAINT IF EXISTS prosocial_leads_campa_aId_fkey;
ALTER TABLE platform_leads ADD CONSTRAINT platform_leads_campa_aId_fkey 
    FOREIGN KEY ("campa_aId") REFERENCES platform_campanas("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Actualizar referencias a platform_lead_bitacora
ALTER TABLE platform_lead_bitacora DROP CONSTRAINT IF EXISTS prosocial_lead_bitacora_leadId_fkey;
ALTER TABLE platform_lead_bitacora ADD CONSTRAINT platform_lead_bitacora_leadId_fkey 
    FOREIGN KEY ("leadId") REFERENCES platform_leads("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Actualizar referencias a platform_campana_plataformas
ALTER TABLE platform_campana_plataformas DROP CONSTRAINT IF EXISTS prosocial_campana_plataformas_campa_aId_fkey;
ALTER TABLE platform_campana_plataformas ADD CONSTRAINT platform_campana_plataformas_campa_aId_fkey 
    FOREIGN KEY ("campa_aId") REFERENCES platform_campanas("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE platform_campana_plataformas DROP CONSTRAINT IF EXISTS prosocial_campana_plataformas_plataformaId_fkey;
ALTER TABLE platform_campana_plataformas ADD CONSTRAINT platform_campana_plataformas_plataformaId_fkey 
    FOREIGN KEY ("plataformaId") REFERENCES platform_plataformas_publicidad("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Actualizar referencias a studios -> projects
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_studioId_fkey;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_studioId_fkey 
    FOREIGN KEY ("studioId") REFERENCES projects("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- 6. Recrear políticas RLS con los nuevos nombres de tabla
-- Políticas para platform_leads
CREATE POLICY "agents_select_leads" ON platform_leads
    FOR SELECT 
    USING (
        agentId = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM platform_agents 
            WHERE id = auth.uid()::text 
            AND activo = true
        )
    );

CREATE POLICY "agents_update_leads" ON platform_leads
    FOR UPDATE 
    USING (
        agentId = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM platform_agents 
            WHERE id = auth.uid()::text 
            AND activo = true
        )
    );

CREATE POLICY "agents_insert_leads" ON platform_leads
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM platform_agents 
            WHERE id = auth.uid()::text 
            AND activo = true
        )
    );

-- 7. Actualizar índices si es necesario
-- Los índices se mantienen automáticamente al renombrar las tablas

-- 8. Comentarios de finalización
COMMENT ON TABLE platform_agents IS 'Agentes de la plataforma - renombrado de prosocial_agents';
COMMENT ON TABLE platform_leads IS 'Leads de la plataforma - renombrado de prosocial_leads';
COMMENT ON TABLE projects IS 'Proyectos/Estudios - renombrado de studios';
