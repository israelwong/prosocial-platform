-- Script para agregar un lead al proyecto demo-studio
-- Verificar que el proyecto existe
SELECT 
    id, 
    name, 
    slug, 
    email 
FROM projects 
WHERE slug = 'demo-studio';

-- Verificar si ya existe un lead asociado
SELECT 
    id, 
    name, 
    email, 
    studioId 
FROM platform_leads 
WHERE studioId = (SELECT id FROM projects WHERE slug = 'demo-studio');

-- Insertar el lead si no existe
INSERT INTO platform_leads (
    id,
    name,
    email,
    phone,
    "studioName",
    "studioSlug",
    "studioId",
    "lastContactDate",
    "interestedPlan",
    "monthlyBudget",
    "probableStartDate",
    "agentId",
    score,
    priority,
    "conversionDate",
    "createdAt",
    "updatedAt"
) VALUES (
    'demo-studio-lead-' || extract(epoch from now())::text,
    'Juan Carlos Pérez',
    'juan.perez@demo-studio.com',
    '+52 55 1234 5678',
    'Demo Studio Pro',
    'demo-studio',
    (SELECT id FROM projects WHERE slug = 'demo-studio'),
    NOW(),
    'Professional',
    50000,
    NOW() + INTERVAL '30 days',
    NULL,
    85,
    'high',
    NOW(),
    NOW(),
    NOW()
);

-- Verificar que el lead se creó correctamente
SELECT 
    pl.id,
    pl.name,
    pl.email,
    pl.phone,
    pl."studioName",
    pl."studioSlug",
    pl."studioId",
    p.name as "projectName",
    p.slug as "projectSlug"
FROM platform_leads pl
JOIN projects p ON pl."studioId" = p.id
WHERE p.slug = 'demo-studio';
