-- Verificar si la tabla existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'prosocial_canales_adquisicion';

-- Verificar políticas existentes
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'prosocial_canales_adquisicion';

-- Habilitar RLS en la tabla
ALTER TABLE prosocial_canales_adquisicion ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura a usuarios autenticados
CREATE POLICY "Canales are viewable by authenticated users" ON prosocial_canales_adquisicion
    FOR SELECT USING (auth.role() = 'authenticated');

-- Crear política para permitir inserción a usuarios autenticados
CREATE POLICY "Canales are insertable by authenticated users" ON prosocial_canales_adquisicion
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Crear política para permitir actualización a usuarios autenticados
CREATE POLICY "Canales are updatable by authenticated users" ON prosocial_canales_adquisicion
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Crear política para permitir eliminación a usuarios autenticados
CREATE POLICY "Canales are deletable by authenticated users" ON prosocial_canales_adquisicion
    FOR DELETE USING (auth.role() = 'authenticated');

-- Verificar que las políticas se crearon correctamente
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'prosocial_canales_adquisicion';
