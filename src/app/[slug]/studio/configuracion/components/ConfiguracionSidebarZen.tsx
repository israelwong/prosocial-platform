
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
            id: 'operacion',
            title: 'Operación',
            icon: 'Cog',
            moduleSlug: 'operacion',
            items: [
                { id: 'personal', name: 'Personal', href: '/operacion/personal', icon: 'Users2' },
                { id: 'pipeline', name: 'Pipeline', href: '/operacion/pipeline', icon: 'Workflow' },
                { id: 'tipos-evento', name: 'Tipos de Evento', href: '/operacion/tipos', icon: 'Calendar' },
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
                { id: 'inteligencia-financiera', name: 'Inteligencia Financiera', href: '/ventas/inteligencia', icon: 'Coins' },
                { id: 'condiciones-comerciales', name: 'Condiciones Comerciales', href: '/ventas/condiciones', icon: 'FileText' },
                { id: 'reglas-agendamiento', name: 'Reglas de Agendamiento', href: '/ventas/reglas', icon: 'Clock' },
                { id: 'crm', name: 'Ciclo de venta', href: '/ventas/crm', icon: 'Users' },
                { id: 'gantt', name: 'Modelo Gantt', href: '/ventas/gantt', icon: 'FileText' },
                { id: 'garantias', name: 'Garantías de venta', href: '/ventas/garantias', icon: 'Shield' },
                { id: 'contrato', name: 'Modelo de Contrato', href: '/ventas/contrato', icon: 'FileText' },
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
            id: 'ingresos',
            title: 'Ingresos compartidos',
            icon: 'Coins',
            moduleSlug: 'ingresos',
            items: [
                { id: 'invitaciones', name: 'Invitaciones digitales', href: '/ingresos/invitaciones', icon: 'Coins' },
                { id: 'cloud', name: 'Almacenamiento en la nube', href: '/ingresos/cloud', icon: 'Coins' },
            ],
        }
    ],
    platform: [],
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
