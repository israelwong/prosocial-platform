-- Aplicar CASCADE DELETE a project_servicio_gastos

-- 1. Verificar constraint actual
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints rc 
    ON tc.constraint_name = rc.constraint_name
WHERE tc.table_name = 'project_servicio_gastos'
    AND tc.constraint_type = 'FOREIGN KEY';

-- 2. Drop existing constraint
ALTER TABLE "project_servicio_gastos" 
DROP CONSTRAINT IF EXISTS "project_servicio_gastos_servicioId_fkey";

-- 3. Add new constraint with CASCADE
ALTER TABLE "project_servicio_gastos"
ADD CONSTRAINT "project_servicio_gastos_servicioId_fkey" 
FOREIGN KEY ("servicioId") 
REFERENCES "project_servicios"("id") 
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- 4. Verificar que se aplicó correctamente
SELECT 
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    rc.update_rule,
    rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.referential_constraints rc 
    ON tc.constraint_name = rc.constraint_name
WHERE tc.table_name = 'project_servicio_gastos'
    AND tc.constraint_type = 'FOREIGN KEY';
