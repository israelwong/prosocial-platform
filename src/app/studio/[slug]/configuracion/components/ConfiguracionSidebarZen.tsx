'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ZenInput,
    ZenSidebar,
    ZenSidebarContent,
    ZenSidebarHeader,
    ZenSidebarFooter,
    ZenSidebarGroup,
    ZenSidebarGroupLabel,
    ZenSidebarGroupContent,
    ZenSidebarMenu,
    ZenSidebarMenuItem,
    ZenSidebarMenuButton,
    ZenSidebarMenuSub,
    ZenSidebarMenuSubItem,
    ZenSidebarMenuSubButton,
    ZenSidebarTrigger,
    ZenSidebarOverlay
} from '@/components/ui/zen';
import { StudioHeaderModal } from './StudioHeaderModal';

// Re-exportar componentes para uso en layout
export { ZenSidebarTrigger, ZenSidebarOverlay };
import {
    Building2,
    User,
    Zap,
    Clock,
    DollarSign,
    FileText,
    CreditCard,
    Banknote,
    Package,
    Gift,
    Star,
    Users2,
    Tag,
    Bell,
    Lock,
    Plug,
    SlidersHorizontal,
    ChevronDown,
    ChevronRight,
    BarChart3,
    Calendar
} from 'lucide-react';

interface ConfigSection {
    id: string;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    items: ConfigItem[];
}

interface ConfigItem {
    id: string;
    name: string;
    description: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
    completed?: boolean;
    badge?: string;
}

interface ConfiguracionSidebarZenProps {
    className?: string;
    studioSlug?: string;
}

// Función para generar secciones de configuración
const getConfigSections = (studioSlug: string): ConfigSection[] => [
    {
        id: 'estudio',
        title: 'Estudio',
        description: 'Configuración básica del estudio',
        icon: Building2,
        items: [
            {
                id: 'identidad',
                name: 'Identidad de Marca',
                description: 'Define tu logo y nombre',
                href: `/${studioSlug}/configuracion/estudio/identidad`,
                icon: Star,
                completed: true
            },
            {
                id: 'contacto',
                name: 'Información de Contacto',
                description: 'Correos, teléfonos y dirección',
                href: `/${studioSlug}/configuracion/estudio/contacto`,
                icon: User,
                completed: true
            },
            {
                id: 'redes-sociales',
                name: 'Redes Sociales',
                description: 'Conecta tus perfiles',
                href: `/${studioSlug}/configuracion/estudio/redes-sociales`,
                icon: Zap,
                completed: false
            },
            {
                id: 'horarios',
                name: 'Horarios de Atención',
                description: 'Define tus horas de trabajo',
                href: `/${studioSlug}/configuracion/estudio/horarios`,
                icon: Clock,
                completed: false
            }
        ]
    },
    {
        id: 'negocio',
        title: 'Reglas de Negocio',
        description: 'Configuración comercial',
        icon: DollarSign,
        items: [
            {
                id: 'precios-y-utilidad',
                name: 'Precios y Utilidad',
                description: 'Configuración de precios',
                href: `/${studioSlug}/configuracion/negocio/precios-y-utilidad`,
                icon: Tag,
                completed: true
            },
            {
                id: 'condiciones-comerciales',
                name: 'Condiciones Comerciales',
                description: 'Términos y condiciones',
                href: `/${studioSlug}/configuracion/negocio/condiciones-comerciales`,
                icon: FileText,
                completed: false
            },
            {
                id: 'metodos-de-pago',
                name: 'Métodos de Pago',
                description: 'Formas de pago aceptadas',
                href: `/${studioSlug}/configuracion/negocio/metodos-de-pago`,
                icon: Banknote,
                completed: false
            },
            {
                id: 'cuentas-bancarias',
                name: 'Cuentas Bancarias',
                description: 'Información bancaria',
                href: `/${studioSlug}/configuracion/negocio/cuentas-bancarias`,
                icon: CreditCard,
                completed: false
            },
            {
                id: 'reglas-agendamiento',
                name: 'Reglas de Agendamiento',
                description: 'Tipos de servicios agendables',
                href: `/${studioSlug}/configuracion/negocio/reglas-agendamiento`,
                icon: Calendar,
                completed: false
            }
        ]
    },
    {
        id: 'equipo',
        title: 'Equipo',
        description: 'Gestión de personal',
        icon: Users2,
        items: [
            {
                id: 'personal',
                name: 'Personal',
                description: 'Gestión de personal y colaboradores',
                href: `/${studioSlug}/configuracion/equipo`,
                icon: Users2,
                completed: false
            }
        ]
    },
    {
        id: 'catalogo',
        title: 'Catálogo',
        description: 'Servicios y productos',
        icon: Package,
        items: [
            {
                id: 'servicios',
                name: 'Servicios',
                description: 'Gestión de servicios',
                href: `/${studioSlug}/configuracion/catalogo/servicios`,
                icon: Zap,
                completed: false
            },
            {
                id: 'paquetes',
                name: 'Paquetes',
                description: 'Paquetes de servicios',
                href: `/${studioSlug}/configuracion/catalogo/paquetes`,
                icon: Gift,
                completed: false
            },
            {
                id: 'especialidades',
                name: 'Especialidades',
                description: 'Áreas de especialización',
                href: `/${studioSlug}/configuracion/catalogo/especialidades`,
                icon: Star,
                completed: false
            }
        ]
    },
    {
        id: 'cuenta',
        title: 'Cuenta',
        description: 'Configuración personal',
        icon: User,
        items: [
            {
                id: 'perfil',
                name: 'Perfil',
                description: 'Información personal',
                href: `/${studioSlug}/configuracion/cuenta/perfil`,
                icon: User,
                completed: false
            },
            {
                id: 'suscripcion',
                name: 'Suscripción',
                description: 'Plan y facturación',
                href: `/${studioSlug}/configuracion/cuenta/suscripcion`,
                icon: CreditCard,
                completed: false
            },
            {
                id: 'notificaciones',
                name: 'Notificaciones',
                description: 'Preferencias de notificación',
                href: `/${studioSlug}/configuracion/cuenta/notificaciones`,
                icon: Bell,
                completed: false
            },
            {
                id: 'seguridad',
                name: 'Seguridad',
                description: 'Configuración de seguridad',
                href: `/${studioSlug}/configuracion/cuenta/seguridad`,
                icon: Lock,
                completed: false
            }
        ]
    },
    {
        id: 'avanzado',
        title: 'Avanzado',
        description: 'Configuraciones avanzadas',
        icon: SlidersHorizontal,
        items: [
            {
                id: 'integraciones',
                name: 'Integraciones',
                description: 'Conectar servicios externos',
                href: `/${studioSlug}/configuracion/integraciones`,
                icon: Plug,
                completed: false
            },
            {
                id: 'avanzado',
                name: 'Configuración Avanzada',
                description: 'Opciones avanzadas',
                href: `/${studioSlug}/configuracion/avanzado`,
                icon: SlidersHorizontal,
                completed: false
            }
        ]
    }
];

// Componente del Sidebar
function ConfiguracionSidebarContent({ className, studioSlug }: ConfiguracionSidebarZenProps) {
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSection, setExpandedSection] = useState<string>('estudio');

    // Obtener secciones de configuración
    const configSections = getConfigSections(studioSlug || 'demo');

    // Filtrar secciones basado en búsqueda
    const filteredSections = useMemo(() => {
        if (!searchTerm.trim()) return configSections;

        return configSections.map(section => ({
            ...section,
            items: section.items.filter(item =>
                item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        })).filter(section => section.items.length > 0);
    }, [searchTerm, configSections]);


    const toggleSection = (sectionId: string) => {
        setExpandedSection(prev => prev === sectionId ? '' : sectionId);
    };

    const isActive = (href: string) => {
        return pathname === href;
    };

    return (
        <ZenSidebar className={className}>
            <ZenSidebarHeader>
                <div className="space-y-4 mb-4">
                    {/* Menú modal del estudio */}
                    <StudioHeaderModal />

                    {/* Barra de búsqueda */}
                    <ZenInput
                        placeholder="Buscar configuración..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
            </ZenSidebarHeader>

            <ZenSidebarContent>
                {filteredSections.map((section) => (
                    <ZenSidebarGroup key={section.id}>
                        <ZenSidebarGroupLabel>
                            <button
                                onClick={() => toggleSection(section.id)}
                                className="flex items-center justify-between w-full text-left hover:text-zinc-200 transition-colors"
                            >
                                <div className="flex items-center gap-2">
                                    <section.icon className="w-4 h-4" />
                                    <span>{section.title}</span>
                                </div>
                                {expandedSection === section.id ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>
                        </ZenSidebarGroupLabel>

                        {expandedSection === section.id && (
                            <ZenSidebarGroupContent>
                                <ZenSidebarMenu>
                                    <ZenSidebarMenuItem>
                                        <ZenSidebarMenuSub>
                                            {section.items.map((item) => (
                                                <ZenSidebarMenuSubItem key={item.id}>
                                                    <ZenSidebarMenuSubButton asChild isActive={isActive(item.href)}>
                                                        <Link href={item.href} className="flex items-center gap-2">
                                                            <span className="truncate">{item.name}</span>
                                                            {item.completed && (
                                                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                                            )}
                                                        </Link>
                                                    </ZenSidebarMenuSubButton>
                                                </ZenSidebarMenuSubItem>
                                            ))}
                                        </ZenSidebarMenuSub>
                                    </ZenSidebarMenuItem>
                                </ZenSidebarMenu>
                            </ZenSidebarGroupContent>
                        )}
                    </ZenSidebarGroup>
                ))}
            </ZenSidebarContent>

            <ZenSidebarFooter>
                <ZenSidebarMenu>
                    <ZenSidebarMenuItem>
                        <ZenSidebarMenuButton asChild>
                            <Link href={studioSlug ? `/studio/${studioSlug}/configuracion` : "/studio/demo/configuracion"} className="flex items-center gap-3">
                                <BarChart3 className="w-4 h-4" />
                                <span>Dashboard</span>
                            </Link>
                        </ZenSidebarMenuButton>
                    </ZenSidebarMenuItem>
                </ZenSidebarMenu>
            </ZenSidebarFooter>
        </ZenSidebar>
    );
}

// Componente principal (sin provider, se maneja en el layout)
export function ConfiguracionSidebarZen({ className, studioSlug }: ConfiguracionSidebarZenProps) {
    return (
        <ConfiguracionSidebarContent className={className} studioSlug={studioSlug} />
    );
}

// Hook para usar el sidebar
export function useConfiguracionSidebar() {
    // Implementar lógica específica si es necesario
    return {
        // Funciones de utilidad para el sidebar
    };
}
