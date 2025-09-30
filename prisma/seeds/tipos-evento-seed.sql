-- Seed de tipos de evento para demo-studio
-- Limpiar tipos de evento existentes
DELETE FROM project_evento_tipos WHERE "projectId" = 'demo-studio-project';

-- Insertar tipos de evento de ejemplo
INSERT INTO project_evento_tipos (
    id,
    "projectId",
    nombre,
    descripcion,
    color,
    icono,
    status,
    posicion,
    "createdAt",
    "updatedAt"
) VALUES 
(
    gen_random_uuid()::TEXT,
    'demo-studio-project',
    'Bodas',
    'Eventos de matrimonio y ceremonias nupciales',
    '#EC4899',
    '💒',
    'active',
    0,
    NOW(),
    NOW()
),
(
    gen_random_uuid()::TEXT,
    'demo-studio-project',
    'XV Años',
    'Celebraciones de quince años',
    '#8B5CF6',
    '👑',
    'active',
    1,
    NOW(),
    NOW()
),
(
    gen_random_uuid()::TEXT,
    'demo-studio-project',
    'Bautizos',
    'Ceremonias de bautizo y presentaciones',
    '#06B6D4',
    '👶',
    'active',
    2,
    NOW(),
    NOW()
),
(
    gen_random_uuid()::TEXT,
    'demo-studio-project',
    'Cumpleaños',
    'Celebraciones de cumpleaños y fiestas',
    '#F59E0B',
    '🎂',
    'active',
    3,
    NOW(),
    NOW()
),
(
    gen_random_uuid()::TEXT,
    'demo-studio-project',
    'Corporativos',
    'Eventos empresariales y corporativos',
    '#10B981',
    '🏢',
    'active',
    4,
    NOW(),
    NOW()
);

-- Verificar inserción
SELECT 
    nombre,
    descripcion,
    color,
    icono,
    posicion
FROM project_evento_tipos 
WHERE "projectId" = 'demo-studio-project'
ORDER BY posicion;
