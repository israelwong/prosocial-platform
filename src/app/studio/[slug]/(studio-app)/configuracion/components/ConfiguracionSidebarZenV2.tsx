
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
            id: 'estudio',
            title: 'Estudio',
            icon: 'Building2',
            items: [
                { id: 'identidad', name: 'Identidad de Marca', href: '/global/estudio/identidad', icon: 'Star' },
                { id: 'contacto', name: 'Información de Contacto', href: '/global/estudio/contacto', icon: 'User' },
                { id: 'redes-sociales', name: 'Redes Sociales', href: '/global/estudio/redes-sociales', icon: 'Zap' },
                { id: 'horarios', name: 'Horarios de Atención', href: '/global/estudio/horarios', icon: 'Clock' },
            ],
        },
        {
            id: 'cuenta',
            title: 'Cuenta',
            icon: 'User',
            items: [
                { id: 'perfil', name: 'Perfil', href: '/global/cuenta/perfil', icon: 'User' },
                { id: 'suscripcion', name: 'Suscripción', href: '/global/cuenta/suscripcion', icon: 'CreditCard' },
                { id: 'notificaciones', name: 'Notificaciones', href: '/global/cuenta/notificaciones', icon: 'Bell' },
                { id: 'seguridad', name: 'Seguridad', href: '/global/cuenta/seguridad', icon: 'Lock' },
            ],
        },
    ],
    modules: [
        {
            id: 'manager',
            title: 'ZEN Manager',
            icon: 'Package',
            moduleSlug: 'manager',
            subgroups: [ // Usamos subgrupos en lugar de items
                {
                    id: 'oferta-comercial',
                    title: 'Oferta Comercial',
                    items: [
                        { id: 'tipos-evento', name: 'Tipos de Evento', href: '/modules/manager/tipos-evento', icon: 'Calendar' },
                        { id: 'catalogo-servicios', name: 'Catálogo de Servicios', href: '/modules/manager/catalogo-servicios', icon: 'Layers' },
                        { id: 'paquetes', name: 'Paquetes', href: '/modules/manager/catalogo-servicios/paquetes', icon: 'Package' },
                    ]
                },
                {
                    id: 'precios-rentabilidad',
                    title: 'Precios y Rentabilidad',
                    items: [
                        { id: 'precios-utilidad', name: 'Precios y Utilidad', href: '/modules/manager/precios-utilidad', icon: 'Coins' },
                    ]
                },
                {
                    id: 'gestion-recursos',
                    title: 'Gestión de Recursos',
                    items: [
                        { id: 'personal', name: 'Personal', href: '/modules/manager/personal', icon: 'User' },
                        { id: 'reglas-agendamiento', name: 'Reglas de Agendamiento', href: '/modules/manager/reglas-agendamiento', icon: 'Workflow' },
                        { id: 'cuentas-bancarias', name: 'Cuentas Bancarias', href: '/modules/manager/cuentas-bancarias', icon: 'CreditCard' },
                    ]
                }
            ]
        },
        {
            id: 'pages',
            title: 'ZEN Pages',
            icon: 'LayoutTemplate',
            moduleSlug: 'pages',
            items: [
                { id: 'dominios', name: 'Dominios', href: '/modules/pages/dominios', icon: 'Globe' },
                { id: 'apariencia', name: 'Apariencia Global', href: '/modules/pages/apariencia', icon: 'Palette' },
                { id: 'integraciones-mkt', name: 'Integraciones Marketing', href: '/modules/pages/integraciones-mkt', icon: 'Puzzle' },
            ],
        },
        {
            id: 'marketing',
            title: 'ZEN Marketing',
            icon: 'Sparkles',
            moduleSlug: 'marketing',
            items: [
                { id: 'pipelines', name: 'Pipelines CRM', href: '/modules/marketing/pipelines', icon: 'Workflow' },
                { id: 'emails', name: 'Plantillas de Email', href: '/modules/marketing/emails', icon: 'Mail' },
                { id: 'automations', name: 'Automatizaciones', href: '/modules/marketing/automations', icon: 'Zap' },
            ],
        },
        {
            id: 'magic',
            title: 'ZEN Magic',
            icon: 'Bot',
            moduleSlug: 'magic',
            items: [
                { id: 'creditos', name: 'Créditos IA', href: '/modules/magic/creditos', icon: 'Coins' },
                { id: 'retoque', name: 'Configuración Retoque', href: '/modules/magic/retoque', icon: 'Wand2' },
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
                { id: 'avanzado', name: 'Avanzado', href: '/platform/avanzado', icon: 'SlidersHorizontal' },
            ],
        },
    ],
};

interface ConfiguracionSidebarZenV2Props {
    className?: string;
    studioSlug: string;
}

// Componente principal (Server Component) - ASEGURAR QUE SEA ASYNC
export async function ConfiguracionSidebarZenV2({ className, studioSlug }: ConfiguracionSidebarZenV2Props) {
    // ---- LÓGICA DE FILTRADO DESACTIVADA TEMPORALMENTE PARA DESARROLLO ----
    // const studio = await prisma.studios.findUnique({
    //     where: { slug: studioSlug },
    //     select: { id: true },
    // });

    // if (!studio) {
    //     return <div>Studio no encontrado</div>;
    // }

    // const activeModules = await getActiveModules(studio.id);
    // const activeModuleSlugs = activeModules.map(m => m.slug);

    // const filteredModuleNav = NAVIGATION_CONFIG.modules.filter(group =>
    //     activeModuleSlugs.includes(group.moduleSlug || '')
    // );
    // --------------------------------------------------------------------

    // Construir la navegación final (usando TODOS los módulos)
    const finalNav = {
        global: NAVIGATION_CONFIG.global,
        modules: NAVIGATION_CONFIG.modules, // Se usan todos los módulos
        platform: NAVIGATION_CONFIG.platform,
    };

    return (
        <ConfigSidebarClientContent navigationConfig={finalNav} studioSlug={studioSlug} />
    );
}
