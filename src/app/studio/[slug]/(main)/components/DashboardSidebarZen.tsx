'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ZenSidebar,
    ZenSidebarContent,
    ZenSidebarHeader,
    ZenSidebarFooter,
    ZenSidebarMenu,
    ZenSidebarMenuItem,
    ZenSidebarMenuButton,
    ZenSidebarTrigger,
    ZenSidebarOverlay
} from '@/components/ui/zen';
import { StudioHeaderModal } from '@/app/studio/[slug]/configuracion/components/StudioHeaderModal';

// Re-exportar componentes para uso en layout
export { ZenSidebarTrigger, ZenSidebarOverlay };
import {
    Kanban,
    Calendar,
    Users,
    FileText,
    BarChart3,
    Settings,
    TrendingUp,
    UserCheck,
    Clock,
    CreditCard,
    Target
} from 'lucide-react';

interface DashboardSection {
    id: string;
    title: string;
    description: string;
    items: DashboardItem[];
}

interface DashboardItem {
    id: string;
    name: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    completed?: boolean;
    badge?: string;
}

interface DashboardSidebarZenProps {
    className?: string;
    studioSlug?: string;
}

// Función para generar secciones del dashboard
const getDashboardSections = (studioSlug: string): DashboardSection[] => [
    {
        id: 'principal',
        title: 'Principal',
        description: 'Herramientas principales del día a día',
        items: [
            {
                id: 'dashboard',
                name: 'Dashboard',
                description: 'Vista general del negocio',
                href: `/${studioSlug}/dashboard`,
                icon: BarChart3,
                completed: true
            },
            {
                id: 'kanban',
                name: 'Kanban',
                description: 'Gestión de leads y proyectos',
                href: `/${studioSlug}/kanban`,
                icon: Kanban,
                completed: false
            },
            {
                id: 'agenda',
                name: 'Agenda',
                description: 'Citas y eventos',
                href: `/${studioSlug}/agenda`,
                icon: Calendar,
                completed: false
            }
        ]
    },
    {
        id: 'crm',
        title: 'CRM',
        description: 'Gestión de clientes y leads',
        items: [
            {
                id: 'contactos',
                name: 'Contactos',
                description: 'Base de datos de clientes',
                href: `/${studioSlug}/contactos`,
                icon: Users,
                completed: false
            },
            {
                id: 'leads',
                name: 'Leads',
                description: 'Prospectos y oportunidades',
                href: `/${studioSlug}/leads`,
                icon: UserCheck,
                completed: false
            },
            {
                id: 'cotizaciones',
                name: 'Cotizaciones',
                description: 'Propuestas y presupuestos',
                href: `/${studioSlug}/cotizaciones`,
                icon: FileText,
                completed: false
            }
        ]
    },
    {
        id: 'ventas',
        title: 'Ventas',
        description: 'Proceso de ventas y facturación',
        items: [
            {
                id: 'proyectos',
                name: 'Proyectos',
                description: 'Sesiones y trabajos',
                href: `/${studioSlug}/proyectos`,
                icon: Target,
                completed: false
            },
            {
                id: 'finanzas',
                name: 'Finanzas',
                description: 'Facturación y pagos',
                href: `/${studioSlug}/finanzas`,
                icon: CreditCard,
                completed: false
            },
            {
                id: 'reportes',
                name: 'Reportes',
                description: 'Análisis y métricas',
                href: `/${studioSlug}/reportes`,
                icon: TrendingUp,
                completed: false
            }
        ]
    },
    {
        id: 'productividad',
        title: 'Productividad',
        description: 'Herramientas de eficiencia',
        items: [
            {
                id: 'tareas',
                name: 'Tareas',
                description: 'Lista de tareas pendientes',
                href: `/${studioSlug}/tareas`,
                icon: Clock,
                completed: false
            },
            {
                id: 'plantillas',
                name: 'Plantillas',
                description: 'Templates y formularios',
                href: `/${studioSlug}/plantillas`,
                icon: FileText,
                completed: false
            }
        ]
    }
];

// Componente del Sidebar
function DashboardSidebarContent({ className, studioSlug }: DashboardSidebarZenProps) {
    const pathname = usePathname();


    // Obtener secciones del dashboard
    const dashboardSections = getDashboardSections(studioSlug || 'demo');

    const isActive = (href: string) => {
        return pathname === href;
    };

    return (
        <ZenSidebar className={className}>
            <ZenSidebarHeader>
                {/* Menú modal del estudio */}
                <StudioHeaderModal />
            </ZenSidebarHeader>

            <ZenSidebarContent>
                <ZenSidebarMenu>
                    {dashboardSections.map((section, sectionIndex) => (
                        <React.Fragment key={section.id}>
                            {/* Separador con título de sección */}
                            {sectionIndex > 0 && (
                                <div className="px-3 py-2">
                                    <div className="h-px bg-zinc-800"></div>
                                </div>
                            )}

                            {/* Título de la sección */}
                            <div className="px-3 py-2">
                                <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                                    {section.title}
                                </div>
                            </div>

                            {/* Items de la sección */}
                            {section.items.map((item) => (
                                <ZenSidebarMenuItem key={item.id}>
                                    <ZenSidebarMenuButton asChild isActive={isActive(item.href)}>
                                        <Link href={item.href} className="flex items-center gap-3">
                                            <item.icon className="w-4 h-4" />
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="truncate">{item.name}</span>
                                                    {item.completed && (
                                                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                                                    )}
                                                </div>
                                                <p className="text-xs text-zinc-400 truncate">
                                                    {item.description}
                                                </p>
                                            </div>
                                        </Link>
                                    </ZenSidebarMenuButton>
                                </ZenSidebarMenuItem>
                            ))}
                        </React.Fragment>
                    ))}
                </ZenSidebarMenu>
            </ZenSidebarContent>

            <ZenSidebarFooter>
                <ZenSidebarMenu>
                    <ZenSidebarMenuItem>
                        <ZenSidebarMenuButton asChild>
                            <Link href={studioSlug ? `/studio/${studioSlug}/configuracion` : "/studio/demo/configuracion"} className="flex items-center gap-3">
                                <Settings className="w-4 h-4" />
                                <span>Configuración</span>
                            </Link>
                        </ZenSidebarMenuButton>
                    </ZenSidebarMenuItem>
                </ZenSidebarMenu>
            </ZenSidebarFooter>
        </ZenSidebar>
    );
}

// Componente principal (sin provider, se maneja en el layout)
export function DashboardSidebarZen({ className, studioSlug }: DashboardSidebarZenProps) {
    return (
        <DashboardSidebarContent className={className} studioSlug={studioSlug} />
    );
}

// Hook para usar el sidebar
export function useDashboardSidebar() {
    // Implementar lógica específica si es necesario
    return {
        // Funciones de utilidad para el sidebar
    };
}
