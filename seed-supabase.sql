-- Seed script para Supabase SQL Editor
-- ProSocial Platform - Demo Studio Data
-- Ejecutar directamente en Supabase Dashboard > SQL Editor

-- 1. Crear plan básico
INSERT INTO platform_plans (
    id, name, description, slug, price_monthly, price_yearly, 
    features, limits, stripe_price_id, stripe_product_id, 
    popular, active, orden, "createdAt", "updatedAt"
) VALUES (
    'plan-basic-demo',
    'Plan Básico',
    'Perfecto para estudios pequeños que están comenzando',
    'basic',
    29.99,
    299.99,
    '{"eventos_mensuales": 10, "clientes_maximos": 50, "storage_gb": 5, "soporte": "email"}',
    '{"eventos_simultaneos": 3, "usuarios_equipo": 2}',
    'price_demo_basic',
    'prod_demo_basic',
    false,
    true,
    1,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    "updatedAt" = NOW();

-- 2. Crear redes sociales
INSERT INTO platform_social_networks (
    id, name, slug, description, color, icon, 
    "baseUrl", "order", "isActive", "createdAt", "updatedAt"
) VALUES 
    ('instagram', 'Instagram', 'instagram', 'Plataforma para compartir fotos y videos', '#E4405F', 'instagram', 'https://instagram.com/', 1, true, NOW(), NOW()),
    ('facebook', 'Facebook', 'facebook', 'Red social para conectar con amigos y familia', '#1877F2', 'facebook', 'https://facebook.com/', 2, true, NOW(), NOW()),
    ('youtube', 'YouTube', 'youtube', 'Plataforma de videos y contenido multimedia', '#FF0000', 'youtube', 'https://youtube.com/', 3, true, NOW(), NOW()),
    ('tiktok', 'TikTok', 'tiktok', 'Plataforma de videos cortos y entretenimiento', '#000000', 'tiktok', 'https://tiktok.com/', 4, true, NOW(), NOW()),
    ('linkedin', 'LinkedIn', 'linkedin', 'Red social profesional y de networking', '#0A66C2', 'linkedin', 'https://linkedin.com/in/', 5, true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    "updatedAt" = NOW();

-- 3. Crear canales de adquisición
INSERT INTO platform_acquisition_channels (
    id, name, description, color, icon, 
    "isActive", "isVisible", "order", "createdAt", "updatedAt"
) VALUES 
    ('canal-referidos', 'Referidos', 'Clientes referidos por otros clientes', '#10B981', 'users', true, true, 1, NOW(), NOW()),
    ('canal-redes-sociales', 'Redes Sociales', 'Leads provenientes de redes sociales', '#3B82F6', 'share-2', true, true, 2, NOW(), NOW()),
    ('canal-google-ads', 'Google Ads', 'Publicidad en Google Ads', '#F59E0B', 'search', true, true, 3, NOW(), NOW()),
    ('canal-web-organico', 'Web Orgánico', 'Tráfico orgánico del sitio web', '#8B5CF6', 'globe', true, true, 4, NOW(), NOW()),
    ('canal-eventos', 'Eventos', 'Ferias, bodas, eventos presenciales', '#EF4444', 'calendar', true, true, 5, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    "updatedAt" = NOW();

-- 4. Crear plataformas de publicidad
INSERT INTO platform_advertising_platforms (
    id, name, description, type, color, icon,
    "isActive", "order", "createdAt", "updatedAt"
) VALUES 
    ('google-ads', 'Google Ads', 'Plataforma de publicidad de Google', 'search', '#4285F4', 'search', true, 1, NOW(), NOW()),
    ('facebook-ads', 'Facebook Ads', 'Plataforma de publicidad de Meta (Facebook/Instagram)', 'social', '#1877F2', 'facebook', true, 2, NOW(), NOW()),
    ('instagram-ads', 'Instagram Ads', 'Publicidad en Instagram', 'social', '#E4405F', 'instagram', true, 3, NOW(), NOW()),
    ('youtube-ads', 'YouTube Ads', 'Publicidad en YouTube', 'video', '#FF0000', 'youtube', true, 4, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    "updatedAt" = NOW();

-- 5. Crear tipo de pipeline
INSERT INTO platform_pipeline_types (
    id, nombre, descripcion, color, activo, orden, "createdAt", "updatedAt"
) VALUES (
    'pipeline-comercial',
    'Pipeline Comercial',
    'Pipeline para gestión de leads comerciales y ventas',
    '#3B82F6',
    true,
    1,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    "updatedAt" = NOW();

-- 6. Crear etapas del pipeline
INSERT INTO platform_pipeline_stages (
    id, nombre, descripcion, color, orden, "isActive", 
    pipeline_type_id, "createdAt", "updatedAt"
) VALUES 
    ('stage-comercial-nuevos', 'Nuevos Leads', 'Leads recién capturados que necesitan contacto inicial', '#3B82F6', 1, true, 'pipeline-comercial', NOW(), NOW()),
    ('stage-comercial-contactados', 'Contactados', 'Leads que han sido contactados por primera vez', '#8B5CF6', 2, true, 'pipeline-comercial', NOW(), NOW()),
    ('stage-comercial-interesados', 'Interesados', 'Leads que mostraron interés en los servicios', '#EAB308', 3, true, 'pipeline-comercial', NOW(), NOW()),
    ('stage-comercial-cotizacion', 'En Cotización', 'Leads que están en proceso de cotización', '#F59E0B', 4, true, 'pipeline-comercial', NOW(), NOW()),
    ('stage-comercial-negociacion', 'En Negociación', 'Leads en proceso de negociación de términos', '#EF4444', 5, true, 'pipeline-comercial', NOW(), NOW()),
    ('stage-comercial-convertidos', 'Convertidos', 'Leads que se convirtieron en clientes', '#10B981', 6, true, 'pipeline-comercial', NOW(), NOW()),
    ('stage-comercial-perdidos', 'Perdidos', 'Leads que no se pudieron convertir', '#6B7280', 7, true, 'pipeline-comercial', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    "updatedAt" = NOW();

-- 7. Crear categorías de servicios
INSERT INTO service_categories (
    id, name, description, icon, posicion, active, "createdAt", "updatedAt"
) VALUES 
    ('cat-comercial-ventas', 'Comercial y Ventas', 'Herramientas para gestión comercial y ventas', 'DollarSign', 1, true, NOW(), NOW()),
    ('cat-portal-cotizacion', 'Portal de Cotización', 'Sistema de cotizaciones y presentaciones', 'FileText', 2, true, NOW(), NOW()),
    ('cat-gestion-finanzas', 'Gestión y Finanzas', 'Herramientas de gestión empresarial y financiera', 'BarChart3', 3, true, NOW(), NOW()),
    ('cat-personalizacion-equipo', 'Personalización y Equipo', 'Herramientas de personalización y gestión de equipo', 'Users', 4, true, NOW(), NOW()),
    ('cat-integraciones', 'Integraciones', 'Integraciones con servicios externos', 'Server', 5, true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    "updatedAt" = NOW();

-- 8. Crear servicios básicos
INSERT INTO platform_services (
    id, name, slug, description, "categoryId", active, posicion, "createdAt", "updatedAt"
) VALUES 
    ('srv-portafolio-landing', 'Portafolio (Landing Page)', 'portafolio-landing-page', 'Landing page personalizada para mostrar el portafolio del estudio', 'cat-comercial-ventas', true, 1, NOW(), NOW()),
    ('srv-crm-gestion-contactos', 'CRM y Gestión de Contactos', 'crm-gestion-contactos', 'Sistema de gestión de relaciones con clientes y contactos', 'cat-comercial-ventas', true, 2, NOW(), NOW()),
    ('srv-pipeline-kanban-estandar', 'Pipeline (Kanban) Estándar', 'pipeline-kanban-estandar', 'Pipeline de ventas con Kanban estándar', 'cat-comercial-ventas', true, 3, NOW(), NOW()),
    ('srv-presentacion-cotizaciones', 'Presentación de Cotizaciones', 'presentacion-cotizaciones', 'Sistema para crear y presentar cotizaciones profesionales', 'cat-portal-cotizacion', true, 1, NOW(), NOW()),
    ('srv-gestion-eventos', 'Gestión de Eventos', 'gestion-eventos', 'Sistema completo de gestión de eventos fotográficos', 'cat-gestion-finanzas', true, 1, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    "updatedAt" = NOW();

-- 9. Crear proyecto demo-studio
INSERT INTO projects (
    id, name, slug, email, address, descripcion, 
    "subscriptionStatus", "planId", active, "createdAt", "updatedAt"
) VALUES (
    'demo-studio-project',
    'Demo Studio',
    'demo-studio',
    'contacto@demo-studio.com',
    '123 Demo Street, Demo City',
    'Estudio de fotografía demo para pruebas y desarrollo',
    'TRIAL',
    'plan-basic-demo',
    true,
    NOW(),
    NOW()
) ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    "updatedAt" = NOW();

-- 10. Crear usuarios del estudio
INSERT INTO project_users (
    id, username, email, "fullName", phone, type, role, 
    status, "isActive", "projectId", "createdAt", "updatedAt"
) VALUES 
    ('demo-photographer', 'fotografo_demo', 'fotografo@demo-studio.com', 'Juan Pérez', '+1234567891', 'EMPLEADO', 'photographer', 'active', true, 'demo-studio-project', NOW(), NOW()),
    ('demo-editor', 'editor_demo', 'editor@demo-studio.com', 'María García', '+1234567892', 'EMPLEADO', 'editor', 'active', true, 'demo-studio-project', NOW(), NOW()),
    ('demo-provider', 'proveedor_demo', 'proveedor@demo-studio.com', 'Carlos Rodríguez', '+1234567893', 'PROVEEDOR', 'provider', 'active', true, 'demo-studio-project', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    "fullName" = EXCLUDED."fullName",
    "updatedAt" = NOW();

-- 11. Crear perfiles profesionales
INSERT INTO project_user_professional_profiles (
    id, "userId", profile, description, "isActive", "createdAt", "updatedAt"
) VALUES 
    ('profile-photographer', 'demo-photographer', 'FOTOGRAFO', 'Perfil profesional de Juan Pérez', true, NOW(), NOW()),
    ('profile-editor', 'demo-editor', 'EDITOR', 'Perfil profesional de María García', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    description = EXCLUDED.description,
    "updatedAt" = NOW();

-- 12. Crear leads de ejemplo
INSERT INTO platform_leads (
    id, name, email, phone, "studioName", "lastContactDate", 
    "interestedPlan", "monthlyBudget", priority, "stageId", 
    "acquisitionChannelId", "firstInteractionDate", "originalSource", 
    "interactionCount", "leadType", "createdAt", "updatedAt"
) VALUES 
    ('lead-demo-1', 'Ana Martínez', 'ana.martinez@email.com', '+1234567894', 'Boda Ana & Carlos', NOW(), 'pro', 2000.00, 'high', 'stage-comercial-interesados', 'canal-referidos', NOW(), 'Referido por cliente anterior', 3, 'prospect', NOW(), NOW()),
    ('lead-demo-2', 'Roberto Silva', 'roberto.silva@email.com', '+1234567895', 'Sesión Familiar Silva', NOW(), 'basic', 500.00, 'medium', 'stage-comercial-contactados', 'canal-redes-sociales', NOW(), 'Instagram', 1, 'prospect', NOW(), NOW()),
    ('lead-demo-3', 'Carmen López', 'carmen.lopez@email.com', '+1234567896', 'Quinceañera Carmen', NOW(), 'basic', 800.00, 'medium', 'stage-comercial-nuevos', 'canal-eventos', NOW(), 'Feria de bodas', 1, 'prospect', NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    "updatedAt" = NOW();

-- 13. Crear redes sociales del proyecto
INSERT INTO project_redes_sociales (
    id, "projectId", "plataformaId", url, activo, "createdAt", "updatedAt"
) VALUES 
    ('demo-instagram', 'demo-studio-project', 'instagram', 'https://instagram.com/demo-studio', true, NOW(), NOW()),
    ('demo-facebook', 'demo-studio-project', 'facebook', 'https://facebook.com/demo-studio', true, NOW(), NOW()),
    ('demo-tiktok', 'demo-studio-project', 'tiktok', 'https://tiktok.com/@demo-studio', true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    url = EXCLUDED.url,
    "updatedAt" = NOW();

-- 14. Crear una campaña de ejemplo
INSERT INTO platform_campaigns (
    id, name, description, "totalBudget", "startDate", "endDate", 
    "isActive", status, "leadsGenerated", "leadsSubscribed", 
    "actualSpend", "projectId", "createdAt", "updatedAt"
) VALUES (
    'campaign-demo-1',
    'Campaña Bodas 2024',
    'Campaña de marketing para captar clientes de bodas',
    5000.00,
    '2024-01-01'::timestamp,
    '2024-12-31'::timestamp,
    true,
    'active',
    15,
    3,
    2500.00,
    'demo-studio-project',
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    "updatedAt" = NOW();

-- 15. Crear plataforma de campaña
INSERT INTO platform_campaign_platforms (
    id, "campañaId", "platformId", budget, "actualSpend", 
    leads, conversions, "createdAt", "updatedAt"
) VALUES (
    'campaign-platform-demo-1',
    'campaign-demo-1',
    'facebook-ads',
    3000.00,
    1500.00,
    10,
    2,
    NOW(),
    NOW()
) ON CONFLICT (id) DO UPDATE SET
    budget = EXCLUDED.budget,
    "updatedAt" = NOW();

-- Mostrar resumen de datos insertados
SELECT 
    'Seed completado exitosamente!' as mensaje,
    (SELECT COUNT(*) FROM platform_plans) as planes,
    (SELECT COUNT(*) FROM platform_social_networks) as redes_sociales,
    (SELECT COUNT(*) FROM platform_acquisition_channels) as canales_adquisicion,
    (SELECT COUNT(*) FROM platform_pipeline_stages) as pipeline_stages,
    (SELECT COUNT(*) FROM projects WHERE slug = 'demo-studio') as proyectos_demo,
    (SELECT COUNT(*) FROM project_users WHERE "projectId" = 'demo-studio-project') as usuarios_demo,
    (SELECT COUNT(*) FROM platform_leads) as leads_demo,
    (SELECT COUNT(*) FROM project_redes_sociales WHERE "projectId" = 'demo-studio-project') as redes_proyecto;
