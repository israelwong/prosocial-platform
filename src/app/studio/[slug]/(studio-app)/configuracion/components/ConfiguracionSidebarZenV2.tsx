
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
            id: 'comercial',
            title: 'Comercial',
            icon: 'ShoppingCart',
            moduleSlug: 'comercial',
            mixedItems: [
                // Items directos primero
                { id: 'crm', name: 'Etapas del CRM', href: '/comercial/crm', icon: 'Users' },
                { id: 'condiciones-comerciales', name: 'Condiciones Comerciales', href: '/comercial/condiciones-comerciales', icon: 'FileText' },
                { id: 'reglas-agendamiento', name: 'Reglas de Agendamiento', href: '/comercial/reglas-agendamiento', icon: 'Clock' },
                { id: 'tipos-evento', name: 'Tipos de Evento', href: '/comercial/tipos-evento', icon: 'Calendar' },
                { id: 'inteligencia-financiera', name: 'Inteligencia Financiera', href: '/comercial/inteligencia-financiera', icon: 'Coins' },
                // Subgrupos después
                {
                    id: 'catalogo',
                    title: 'Catálogo',
                    items: [
                        { id: 'catalogo-servicios', name: 'Servicios', href: '/comercial/catalogo/servicios', icon: 'Layers' },
                        { id: 'catalogo-paquetes', name: 'Paquetes', href: '/comercial/catalogo/paquetes', icon: 'Package' },
                    ]
                },
                {
                    id: 'metodos-pago',
                    title: 'Métodos de Pago',
                    items: [
                        { id: 'cuentas-negocio', name: 'Cuentas de Negocio', href: '/comercial/metodos-de-pago/cuentas-de-negocio', icon: 'Building' },
                        { id: 'stripe', name: 'Stripe', href: '/comercial/metodos-de-pago/stripe', icon: 'CreditCard' },
                    ]
                },
            ],
        },
        {
            id: 'manager',
            title: 'Manager',
            icon: 'Briefcase',
            moduleSlug: 'manager',
            items: [
                { id: 'personal', name: 'Personal', href: '/manager/personal', icon: 'Users2' },
                { id: 'pipeline', name: 'Pipeline', href: '/manager/pipeline', icon: 'Workflow' },
            ],
        },
        {
            id: 'pages',
            title: 'Pages',
            icon: 'Globe',
            moduleSlug: 'pages',
            items: [
                { id: 'identidad', name: 'Identidad', href: '/pages/identidad', icon: 'Star' },
                { id: 'contacto', name: 'Contacto', href: '/pages/contacto', icon: 'Phone' },
                { id: 'redes-sociales', name: 'Redes Sociales', href: '/pages/redes-sociales', icon: 'Zap' },
                { id: 'horarios', name: 'Horarios', href: '/pages/horarios', icon: 'Clock' },
                { id: 'portafolio', name: 'Portafolio', href: '/pages/portafolio', icon: 'Image' },
                { id: 'promociones', name: 'Promociones', href: '/pages/promociones', icon: 'Gift' },
                { id: 'seo-sem', name: 'SEO / SEM', href: '/pages/seo-sem', icon: 'Search' },
                { id: 'faq', name: 'FAQ', href: '/pages/faq', icon: 'HelpCircle' },
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
