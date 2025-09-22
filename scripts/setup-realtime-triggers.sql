-- =====================================================
-- SUPABASE REALTIME TRIGGERS PARA PROSOCIAL PLATFORM
-- =====================================================

-- Habilitar Realtime en la tabla projects
ALTER PUBLICATION supabase_realtime ADD TABLE projects;

-- Función para notificar cambios en la tabla projects
CREATE OR REPLACE FUNCTION notify_projects_changes()
RETURNS TRIGGER AS $$
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  -- Notificar cambios específicos del studio
  PERFORM realtime.broadcast_changes(
    'studio:' || COALESCE(NEW.slug, OLD.slug)::text,
    TG_OP,
    TG_OP,
    TG_TABLE_NAME,
    TG_TABLE_SCHEMA,
    NEW,
    OLD
  );
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Trigger para la tabla projects
DROP TRIGGER IF EXISTS projects_broadcast_trigger ON projects;
CREATE TRIGGER projects_broadcast_trigger
  AFTER INSERT OR UPDATE OR DELETE ON projects
  FOR EACH ROW EXECUTE FUNCTION notify_projects_changes();

-- Política RLS para permitir lectura de mensajes de realtime
-- (Solo para usuarios autenticados que pertenecen al studio)
CREATE POLICY "studio_members_can_read_realtime" ON realtime.messages
FOR SELECT TO authenticated
USING (
  topic LIKE 'studio:%' AND
  EXISTS (
    SELECT 1 FROM projects
    WHERE slug = SPLIT_PART(topic, ':', 2)::text
    AND (
      -- En modo desarrollo, permitir acceso a todos los estudios
      -- En producción, agregar validación de membresía
      true
    )
  )
);

-- Política RLS para permitir escritura de mensajes de realtime
-- (Solo para usuarios autenticados que pertenecen al studio)
CREATE POLICY "studio_members_can_write_realtime" ON realtime.messages
FOR INSERT TO authenticated
USING (
  topic LIKE 'studio:%' AND
  EXISTS (
    SELECT 1 FROM projects
    WHERE slug = SPLIT_PART(topic, ':', 2)::text
    AND (
      -- En modo desarrollo, permitir acceso a todos los estudios
      -- En producción, agregar validación de membresía
      true
    )
  )
);

-- Índice para optimizar las consultas RLS
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Comentarios para documentación
COMMENT ON FUNCTION notify_projects_changes() IS 'Notifica cambios en la tabla projects via Supabase Realtime';
COMMENT ON TRIGGER projects_broadcast_trigger ON projects IS 'Trigger que ejecuta notify_projects_changes() en cambios de projects';
