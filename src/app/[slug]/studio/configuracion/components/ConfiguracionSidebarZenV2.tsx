
import React from 'react';
import { ConfigSidebarClientContent } from './ConfigSidebarClientContent';

// Interfaces de tipos (icon es ahora string)
export interface NavItem {
    id: string;
    name: string;
    href: string;
    icon: string;
}

export interface NavItemGroup {
    id: string;
    title: string;
    items: NavItem[];
}

export interface NavGroup {
    id: string;
    title: string;
    icon: string;
    items?: NavItem[]; // Para grupos simples
    subgroups?: NavItemGroup[]; // Para grupos complejos como Manager
    mixedItems?: (NavItem | NavItemGroup)[]; // Para orden mixto
    moduleSlug?: string;
}

export interface NavigationConfig {
    global: NavGroup[];
    modules: NavGroup[];
    platform: NavGroup[];
}

// Nueva estructura de navegación centralizada (iconos como strings)
const NAVIGATION_CONFIG: NavigationConfig = {
    global: [
        {
            id: 'cuenta',
            title: 'Cuenta',
            icon: 'UserCircle',
            items: [
                { id: 'perfil', name: 'Perfil', href: '/cuenta/perfil', icon: 'User' },
                { id: 'seguridad', name: 'Seguridad', href: '/cuenta/seguridad', icon: 'Lock' },
                { id: 'suscripcion', name: 'Suscripción', href: '/cuenta/suscripcion', icon: 'CreditCard' },
            ],
        },
    ],
    modules: [
        {
            id: 'studio',
            title: 'Studio',
            icon: 'Camera',
            moduleSlug: 'studio',
            items: [
                { id: 'identidad', name: 'Identidad', href: '/studio/identidad', icon: 'Star' },
                { id: 'contacto', name: 'Contacto', href: '/studio/contacto', icon: 'Phone' },
                { id: 'horarios', name: 'Horarios', href: '/studio/horarios', icon: 'Clock' },
                { id: 'redes-sociales', name: 'Redes Sociales', href: '/studio/redes-sociales', icon: 'Zap' },
            ],
        },
        {
            id: 'operacion',
            title: 'Operación',
            icon: 'Cog',
            moduleSlug: 'operacion',
            items: [
                { id: 'personal', name: 'Personal', href: '/operacion/personal', icon: 'Users2' },
                { id: 'pipeline', name: 'Pipeline', href: '/operacion/pipeline', icon: 'Workflow' },
                { id: 'tipos-evento', name: 'Tipos de Evento', href: '/operacion/tipos-evento', icon: 'Calendar' },
            ],
        },
        {
            id: 'catalogo',
            title: 'Catálogo',
            icon: 'Package',
            moduleSlug: 'catalogo',
            items: [
                { id: 'servicios', name: 'Servicios', href: '/catalogo/servicios', icon: 'Layers' },
                { id: 'paquetes', name: 'Paquetes', href: '/catalogo/paquetes', icon: 'Package' },
            ],
        },
        {
            id: 'ventas',
            title: 'Ventas',
            icon: 'ShoppingCart',
            moduleSlug: 'ventas',
            items: [
                { id: 'crm', name: 'Etapas del CRM', href: '/ventas/crm', icon: 'Users' },
                { id: 'condiciones-comerciales', name: 'Condiciones Comerciales', href: '/ventas/condiciones-comerciales', icon: 'FileText' },
                { id: 'reglas-agendamiento', name: 'Reglas de Agendamiento', href: '/ventas/reglas-agendamiento', icon: 'Clock' },
                { id: 'inteligencia-financiera', name: 'Inteligencia Financiera', href: '/ventas/inteligencia-financiera', icon: 'Coins' },
            ],
        },
        {
            id: 'pagos',
            title: 'Pagos',
            icon: 'CreditCard',
            moduleSlug: 'pagos',
            items: [
                { id: 'metodos', name: 'Métodos de Pago', href: '/pagos/metodos', icon: 'CreditCard' },
                { id: 'cuentas-bancarias', name: 'Cuentas Bancarias', href: '/pagos/cuentas-bancarias', icon: 'Building' },
                { id: 'stripe', name: 'Stripe', href: '/pagos/stripe', icon: 'CreditCard' },
            ],
        },
        {
            id: 'pagina',
            title: 'Página Web',
            icon: 'Globe',
            moduleSlug: 'pagina',
            items: [
                { id: 'portafolio', name: 'Portafolio', href: '/pagina/portafolio', icon: 'Image' },
                { id: 'seo', name: 'SEO', href: '/pagina/seo', icon: 'Search' },
                { id: 'editor', name: 'Editor', href: '/pagina/editor', icon: 'Edit' },
                { id: 'lead-forms', name: 'Lead Forms', href: '/pagina/lead-forms', icon: 'FormInput' },
                { id: 'faq', name: 'FAQ', href: '/pagina/faq', icon: 'HelpCircle' },
                { id: 'promociones', name: 'Promociones', href: '/pagina/promociones', icon: 'Gift' },
            ],
        },
        {
            id: 'integraciones',
            title: 'Integraciones',
            icon: 'Plug',
            moduleSlug: 'integraciones',
            items: [
                { id: 'apis', name: 'APIs', href: '/integraciones/apis', icon: 'Code' },
                { id: 'webhooks', name: 'Webhooks', href: '/integraciones/webhooks', icon: 'Webhook' },
                { id: 'conectores', name: 'Conectores', href: '/integraciones/conectores', icon: 'LinkIcon' },
            ],
        },
        {
            id: 'analytics',
            title: 'Analytics',
            icon: 'BarChart3',
            moduleSlug: 'analytics',
            items: [
                { id: 'metricas', name: 'Métricas', href: '/analytics/metricas', icon: 'TrendingUp' },
                { id: 'reportes', name: 'Reportes', href: '/analytics/reportes', icon: 'FileText' },
                { id: 'dashboard', name: 'Dashboard', href: '/analytics/dashboard', icon: 'LayoutDashboard' },
            ],
        },
        {
            id: 'sistema',
            title: 'Sistema',
            icon: 'Server',
            moduleSlug: 'sistema',
            items: [
                { id: 'permisos', name: 'Permisos', href: '/sistema/permisos', icon: 'Shield' },
                { id: 'backups', name: 'Backups', href: '/sistema/backups', icon: 'Database' },
                { id: 'logs', name: 'Logs', href: '/sistema/logs', icon: 'FileText' },
            ],
        },
    ],
    platform: [
        {
            id: 'platform',
            title: 'Plataforma',
            icon: 'SlidersHorizontal',
            items: [
                { id: 'modulos', name: 'Módulos Activos', href: '/platform/modulos', icon: 'Layers' },
                { id: 'integraciones', name: 'Integraciones', href: '/platform/integraciones', icon: 'Plug' },
                { id: 'notificaciones', name: 'Notificaciones', href: '/platform/notificaciones', icon: 'Bell' },
            ],
        },
    ],
};

interface ConfiguracionSidebarZenV2Props {
    studioSlug: string;
}

// Componente principal (Server Component) - ASEGURAR QUE SEA ASYNC
export async function ConfiguracionSidebarZenV2({ studioSlug }: ConfiguracionSidebarZenV2Props) {
    console.log('🔍 ConfiguracionSidebarZenV2 - studioSlug recibido:', studioSlug);

    // Importar dependencias necesarias
    const { prisma } = await import('@/lib/prisma');
    const { getActiveModules } = await import('@/lib/modules');

    let studio = null;
    let allStudios: { id: string; studio_name: string; slug: string }[] = [];

    try {
        // Primero verificar si hay studios en la base de datos
        allStudios = await prisma.studios.findMany({
            select: { id: true, studio_name: true, slug: true }
        });
        console.log('🔍 ConfiguracionSidebarZenV2 - todos los studios:', allStudios);

        // Buscar el studio específico
        studio = await prisma.studios.findUnique({
            where: { slug: studioSlug },
            select: { id: true, studio_name: true, slug: true }
        });

        console.log('🔍 ConfiguracionSidebarZenV2 - studio encontrado:', studio);

        // Fallback si no encuentra el studio específico
        if (!studio && allStudios.length > 0) {
            console.log('⚠️ ConfiguracionSidebarZenV2 - USANDO PRIMER STUDIO DISPONIBLE COMO FALLBACK');
            studio = allStudios[0];
        }

    } catch (error) {
        console.error('❌ ConfiguracionSidebarZenV2 - Error en consulta a BD:', error);
        return <div className="p-4 text-red-400">Error de conexión a base de datos</div>;
    }

    if (!studio) {
        console.error('❌ ConfiguracionSidebarZenV2 - Studio no encontrado para slug:', studioSlug);
        return <div className="p-4 text-red-400">Studio no encontrado</div>;
    }

    // Obtener módulos activos
    const activeModules = await getActiveModules(studio.id);
    const activeModuleSlugs = activeModules.map(m => m.slug);
    
    console.log('🔍 ConfiguracionSidebarZenV2 - módulos activos:', activeModuleSlugs);
    console.log('🔍 ConfiguracionSidebarZenV2 - todos los módulos disponibles:', NAVIGATION_CONFIG.modules.map(m => m.moduleSlug));

    // TEMPORAL: Mostrar todos los módulos durante desarrollo
    // TODO: Activar filtrado cuando los módulos estén configurados en BD
    const filteredModuleNav = NAVIGATION_CONFIG.modules; // Mostrar todos los módulos
    
    // Filtrar módulos activos (comentado temporalmente)
    // const filteredModuleNav = NAVIGATION_CONFIG.modules.filter(group =>
    //     activeModuleSlugs.includes(group.moduleSlug || '')
    // );

    // Construir la navegación final
    const finalNav = {
        global: NAVIGATION_CONFIG.global,
        modules: filteredModuleNav,
        platform: NAVIGATION_CONFIG.platform,
    };

    return (
        <ConfigSidebarClientContent navigationConfig={finalNav} studioData={studio} />
    );
}
