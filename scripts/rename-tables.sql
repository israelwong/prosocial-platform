-- Script simple para renombrar tablas existentes
-- Ejecutar directamente en la base de datos

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

-- 4. Recrear políticas RLS con los nuevos nombres de tabla
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
