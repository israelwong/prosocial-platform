-- 🌱 Seed de Base de Datos con Nueva Arquitectura Supabase Auth
-- Ejecutar con: source .env.local && psql $DATABASE_URL -f scripts/sql/seed-database.sql

-- 1. Limpiar datos existentes (opcional)
-- DELETE FROM project_redes_sociales WHERE "projectId" IN (SELECT id FROM projects WHERE slug = 'demo-studio');
-- DELETE FROM project_users WHERE "projectId" IN (SELECT id FROM projects WHERE slug = 'demo-studio');
-- DELETE FROM platform_leads WHERE "studioId" IN (SELECT id FROM projects WHERE slug = 'demo-studio');
-- DELETE FROM projects WHERE slug = 'demo-studio';
-- DELETE FROM platform_user_profiles WHERE email IN ('admin@prosocial.mx', 'agente@prosocial.mx', 'owner@demo-studio.com');

-- 2. Insertar usuarios de plataforma
INSERT INTO platform_user_profiles (id, "supabaseUserId", email, role, "fullName", "isActive", "createdAt", "updatedAt")
VALUES 
    ('admin-user-id', 'admin-supabase-id', 'admin@prosocial.mx', 'SUPER_ADMIN', 'Super Administrador', true, NOW(), NOW()),
    ('agente-user-id', 'agente-supabase-id', 'agente@prosocial.mx', 'AGENTE', 'Agente Comercial', true, NOW(), NOW()),
    ('suscriptor-user-id', 'suscriptor-supabase-id', 'owner@demo-studio.com', 'SUSCRIPTOR', 'Propietario Demo Studio', true, NOW(), NOW())
ON CONFLICT (email) DO UPDATE SET
    "supabaseUserId" = EXCLUDED."supabaseUserId",
    role = EXCLUDED.role,
    "fullName" = EXCLUDED."fullName",
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

-- 3. Insertar proyecto demo-studio
INSERT INTO projects (id, name, slug, email, address, descripcion, "subscriptionStatus", "planId", active, "platformUserId", "createdAt", "updatedAt")
VALUES (
    'demo-studio-project',
    'Demo Studio',
    'demo-studio',
    'contacto@demo-studio.com',
    '123 Demo Street, Demo City',
    'Estudio de fotografía demo para pruebas y desarrollo',
    'TRIAL',
    'basic',
    true,
    'suscriptor-user-id',
    NOW(),
    NOW()
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    address = EXCLUDED.address,
    descripcion = EXCLUDED.descripcion,
    "subscriptionStatus" = EXCLUDED."subscriptionStatus",
    "planId" = EXCLUDED."planId",
    active = EXCLUDED.active,
    "platformUserId" = EXCLUDED."platformUserId",
    "updatedAt" = NOW();

-- 4. Insertar personal del estudio
INSERT INTO project_users (id, "projectId", "fullName", phone, type, role, status, "isActive", "createdAt", "updatedAt")
VALUES 
    ('demo-photographer', 'demo-studio-project', 'Juan Pérez', '+1234567891', 'EMPLEADO', 'photographer', 'active', true, NOW(), NOW()),
    ('demo-editor', 'demo-studio-project', 'María García', '+1234567892', 'EMPLEADO', 'editor', 'active', true, NOW(), NOW()),
    ('demo-provider', 'demo-studio-project', 'Carlos Rodríguez', '+1234567893', 'PROVEEDOR', 'provider', 'active', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    "fullName" = EXCLUDED."fullName",
    phone = EXCLUDED.phone,
    type = EXCLUDED.type,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

-- 5. Insertar perfiles profesionales
INSERT INTO project_user_professional_profiles (id, "userId", profile, description, "isActive", "createdAt", "updatedAt")
VALUES 
    ('profile-photographer', 'demo-photographer', 'FOTOGRAFO', 'Perfil profesional de Juan Pérez', true, NOW(), NOW()),
    ('profile-editor', 'demo-editor', 'EDITOR', 'Perfil profesional de María García', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    profile = EXCLUDED.profile,
    description = EXCLUDED.description,
    "isActive" = EXCLUDED."isActive",
    "updatedAt" = NOW();

-- 6. Insertar leads de ejemplo
INSERT INTO platform_leads (id, name, email, phone, "studioName", "studioSlug", "lastContactDate", "interestedPlan", "monthlyBudget", "probableStartDate", priority, "stageId", "acquisitionChannelId", "firstInteractionDate", "originalSource", "interactionCount", "leadType", "createdAt", "updatedAt")
VALUES 
    ('lead-demo-1', 'Ana Martínez', 'ana.martinez@email.com', '+1234567894', 'Boda Ana & Carlos', NULL, NOW(), 'pro', 2000.00, NOW() + INTERVAL '30 days', 'high', 'stage-comercial-interesados', 'canal-referidos', NOW(), 'Referido por cliente anterior', 3, 'prospect', NOW(), NOW()),
    ('lead-demo-2', 'Roberto Silva', 'roberto.silva@email.com', '+1234567895', 'Sesión Familiar Silva', NULL, NOW(), 'basic', 500.00, NOW() + INTERVAL '15 days', 'medium', 'stage-comercial-contactados', 'canal-redes-sociales', NOW(), 'Instagram', 1, 'prospect', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    phone = EXCLUDED.phone,
    "studioName" = EXCLUDED."studioName",
    "lastContactDate" = EXCLUDED."lastContactDate",
    "interestedPlan" = EXCLUDED."interestedPlan",
    "monthlyBudget" = EXCLUDED."monthlyBudget",
    "probableStartDate" = EXCLUDED."probableStartDate",
    priority = EXCLUDED.priority,
    "stageId" = EXCLUDED."stageId",
    "acquisitionChannelId" = EXCLUDED."acquisitionChannelId",
    "firstInteractionDate" = EXCLUDED."firstInteractionDate",
    "originalSource" = EXCLUDED."originalSource",
    "interactionCount" = EXCLUDED."interactionCount",
    "leadType" = EXCLUDED."leadType",
    "updatedAt" = NOW();

-- 7. Insertar redes sociales del demo studio
INSERT INTO project_redes_sociales (id, "projectId", "plataformaId", url, activo, "createdAt", "updatedAt")
VALUES 
    ('social-instagram', 'demo-studio-project', 'instagram', 'https://instagram.com/demo-studio', true, NOW(), NOW()),
    ('social-facebook', 'demo-studio-project', 'facebook', 'https://facebook.com/demo-studio', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    url = EXCLUDED.url,
    activo = EXCLUDED.activo,
    "updatedAt" = NOW();

-- 8. Verificar datos insertados
SELECT 'Usuarios de plataforma:' as tipo, count(*) as cantidad FROM platform_user_profiles
UNION ALL
SELECT 'Proyectos:', count(*) FROM projects WHERE slug = 'demo-studio'
UNION ALL
SELECT 'Personal del proyecto:', count(*) FROM project_users WHERE "projectId" = 'demo-studio-project'
UNION ALL
SELECT 'Leads de ejemplo:', count(*) FROM platform_leads WHERE "studioName" LIKE '%Demo%' OR "studioName" LIKE '%Ana%' OR "studioName" LIKE '%Roberto%'
UNION ALL
SELECT 'Redes sociales:', count(*) FROM project_redes_sociales WHERE "projectId" = 'demo-studio-project';

-- 9. Mostrar datos del demo-studio
SELECT 
    p.id as proyecto_id,
    p.name as proyecto_nombre,
    p.slug as proyecto_slug,
    p.email as proyecto_email,
    pu."fullName" as propietario_nombre,
    pu.email as propietario_email,
    pu.role as propietario_rol
FROM projects p
LEFT JOIN platform_user_profiles pu ON p."platformUserId" = pu.id
WHERE p.slug = 'demo-studio';
