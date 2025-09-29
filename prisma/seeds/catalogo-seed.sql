-- Seed del Catálogo para demo-studio
-- NOTA: utilidad y precio_publico se calculan al vuelo, no se almacenan

-- Variables (obtener IDs necesarios)
DO $$
DECLARE
    v_studio_id TEXT;
    v_seccion1_id TEXT := gen_random_uuid()::TEXT;
    v_seccion2_id TEXT := gen_random_uuid()::TEXT;
    v_seccion3_id TEXT := gen_random_uuid()::TEXT;
    v_seccion4_id TEXT := gen_random_uuid()::TEXT;
BEGIN
    -- Obtener ID del studio
    SELECT id INTO v_studio_id FROM projects WHERE slug = 'demo-studio';
    
    IF v_studio_id IS NULL THEN
        RAISE EXCEPTION 'No se encontró el proyecto demo-studio';
    END IF;

    -- ==============================================
    -- SECCIÓN 1: Experiencias previas al evento
    -- ==============================================
    INSERT INTO project_servicio_secciones (id, nombre, descripcion, orden, "createdAt", "updatedAt")
    VALUES (
        v_seccion1_id,
        'Experiencias previas al evento',
        'Todo lo relacionado con las sesiones fotográficas y cinematográficas antes del evento principal',
        0,
        NOW(),
        NOW()
    );

    -- Categoría: Fotografía de sesión previa
    WITH cat1 AS (
        INSERT INTO project_servicio_categorias (id, nombre, orden, "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::TEXT, 'Fotografía de sesión previa', 0, NOW(), NOW())
        RETURNING id
    )
    INSERT INTO project_seccion_categorias (id, "seccionId", "categoriaId")
    SELECT gen_random_uuid()::TEXT, v_seccion1_id, id FROM cat1;

    -- Servicios de Fotografía de sesión previa
    WITH cat_id AS (
        SELECT sc."categoriaId" as id 
        FROM project_seccion_categorias sc 
        JOIN project_servicio_categorias c ON c.id = sc."categoriaId"
        WHERE sc."seccionId" = v_seccion1_id AND c.nombre = 'Fotografía de sesión previa'
    )
    INSERT INTO project_servicios (id, "studioId", "servicioCategoriaId", nombre, costo, gasto, tipo_utilidad, orden, status, "createdAt", "updatedAt")
    SELECT 
        gen_random_uuid()::TEXT,
        v_studio_id,
        cat_id.id,
        servicio.nombre,
        servicio.costo,
        0,
        'servicio',
        servicio.orden,
        'active',
        NOW(),
        NOW()
    FROM cat_id,
    (VALUES
        ('Shooting en estudio fotográfico hasta por 45min', 1000.0, 0),
        ('Sesión de vestido hasta 3 horas de servicio', 2500.0, 1),
        ('Shooting para cambios casuales hasta por 2 horas', 1500.0, 2),
        ('Shooting Trash the Dress hasta por 3 horas de servicio', 2000.0, 3),
        ('Asistencia en iluminación para sesión', 600.0, 4)
    ) AS servicio(nombre, costo, orden);

    -- Categoría: Revelado y retoque digital
    WITH cat2 AS (
        INSERT INTO project_servicio_categorias (id, nombre, orden, "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::TEXT, 'Revelado y retoque digital de fotos de sesión', 1, NOW(), NOW())
        RETURNING id
    )
    INSERT INTO project_seccion_categorias (id, "seccionId", "categoriaId")
    SELECT gen_random_uuid()::TEXT, v_seccion1_id, id FROM cat2;

    WITH cat_id AS (
        SELECT sc."categoriaId" as id 
        FROM project_seccion_categorias sc 
        JOIN project_servicio_categorias c ON c.id = sc."categoriaId"
        WHERE sc."seccionId" = v_seccion1_id AND c.nombre = 'Revelado y retoque digital de fotos de sesión'
    )
    INSERT INTO project_servicios (id, "studioId", "servicioCategoriaId", nombre, costo, gasto, tipo_utilidad, orden, status, "createdAt", "updatedAt")
    SELECT 
        gen_random_uuid()::TEXT,
        v_studio_id,
        cat_id.id,
        servicio.nombre,
        servicio.costo,
        0,
        'servicio',
        servicio.orden,
        'active',
        NOW(),
        NOW()
    FROM cat_id,
    (VALUES
        ('Revelado digital de todas las fotografías de sesión', 300.0, 0),
        ('Retoque avanzado de fotografía digital', 120.0, 1)
    ) AS servicio(nombre, costo, orden);

    -- Categoría: Cinematografía de sesión
    WITH cat3 AS (
        INSERT INTO project_servicio_categorias (id, nombre, orden, "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::TEXT, 'Cinematografía de sesión', 2, NOW(), NOW())
        RETURNING id
    )
    INSERT INTO project_seccion_categorias (id, "seccionId", "categoriaId")
    SELECT gen_random_uuid()::TEXT, v_seccion1_id, id FROM cat3;

    WITH cat_id AS (
        SELECT sc."categoriaId" as id 
        FROM project_seccion_categorias sc 
        JOIN project_servicio_categorias c ON c.id = sc."categoriaId"
        WHERE sc."seccionId" = v_seccion1_id AND c.nombre = 'Cinematografía de sesión'
    )
    INSERT INTO project_servicios (id, "studioId", "servicioCategoriaId", nombre, costo, gasto, tipo_utilidad, orden, status, "createdAt", "updatedAt")
    SELECT 
        gen_random_uuid()::TEXT,
        v_studio_id,
        cat_id.id,
        servicio.nombre,
        servicio.costo,
        0,
        'servicio',
        servicio.orden,
        'active',
        NOW(),
        NOW()
    FROM cat_id,
    (VALUES
        ('Servicio de grabación profesional sesión en 4k', 2000.0, 0),
        ('Grabación con dron 4k para sesión', 1000.0, 1),
        ('Edición de video cinemático de sesión musicalizado', 1000.0, 2)
    ) AS servicio(nombre, costo, orden);

    -- ==============================================
    -- SECCIÓN 2: Cobertura del Día del Evento
    -- ==============================================
    INSERT INTO project_servicio_secciones (id, nombre, descripcion, orden, "createdAt", "updatedAt")
    VALUES (
        v_seccion2_id,
        'Cobertura del Día del Evento',
        'El personal, equipo y tiempo dedicados a capturar cada momento del evento',
        1,
        NOW(),
        NOW()
    );

    -- Categoría: Fotografía de evento
    WITH cat4 AS (
        INSERT INTO project_servicio_categorias (id, nombre, orden, "createdAt", "updatedAt")
        VALUES (gen_random_uuid()::TEXT, 'Fotografía de evento', 0, NOW(), NOW())
        RETURNING id
    )
    INSERT INTO project_seccion_categorias (id, "seccionId", "categoriaId")
    SELECT gen_random_uuid()::TEXT, v_seccion2_id, id FROM cat4;

    WITH cat_id AS (
        SELECT sc."categoriaId" as id 
        FROM project_seccion_categorias sc 
        JOIN project_servicio_categorias c ON c.id = sc."categoriaId"
        WHERE sc."seccionId" = v_seccion2_id AND c.nombre = 'Fotografía de evento'
    )
    INSERT INTO project_servicios (id, "studioId", "servicioCategoriaId", nombre, costo, gasto, tipo_utilidad, orden, status, "createdAt", "updatedAt")
    SELECT 
        gen_random_uuid()::TEXT,
        v_studio_id,
        cat_id.id,
        servicio.nombre,
        servicio.costo,
        0,
        'servicio',
        servicio.orden,
        'active',
        NOW(),
        NOW()
    FROM cat_id,
    (VALUES
        ('Fotógrafo A por hora (Cobertura general)', 300.0, 0),
        ('Asistente de iluminación A por hora', 100.0, 1),
        ('Fotógrafo B por hora (Fotografía de detalle)', 200.0, 2),
        ('Revelado ligero de todas las fotografías del evento', 2500.0, 3)
    ) AS servicio(nombre, costo, orden);

    RAISE NOTICE '✅ Seed completado: 2 secciones, múltiples categorías y servicios creados';
    RAISE NOTICE 'ℹ️  NOTA: Solo se insertaron algunos servicios de ejemplo';
    RAISE NOTICE 'ℹ️  utilidad y precio_publico se calculan al vuelo (no se almacenan)';
END $$;
