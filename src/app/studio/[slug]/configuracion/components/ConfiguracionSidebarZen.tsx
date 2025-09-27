'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  ZenInput, 
  ZenButton, 
  ZenBadge,
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
  ZenSidebarProvider,
  ZenSidebarTrigger,
  ZenSidebarOverlay
} from '@/components/ui/zen';
import {
    Search,
    X,
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
    Shield,
    Bell,
    Lock,
    Plug,
    SlidersHorizontal,
    ChevronDown,
    ChevronRight,
    BarChart3,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

// Datos de configuración
const configSections: ConfigSection[] = [
    {
        id: 'estudio',
        title: 'Estudio',
        description: 'Configuración básica del estudio',
        icon: Building2,
        items: [
            {
                id: 'identidad',
                name: 'Identidad',
                description: 'Logo, nombre y palabras clave',
                href: '/studio/[slug]/configuracion/estudio/identidad',
                icon: Star,
                completed: true
            },
            {
                id: 'contacto',
                name: 'Contacto',
                description: 'Información de contacto',
                href: '/studio/[slug]/configuracion/estudio/contacto',
                icon: User,
                completed: true
            },
            {
                id: 'horarios',
                name: 'Horarios',
                description: 'Horarios de atención',
                href: '/studio/[slug]/configuracion/estudio/horarios',
                icon: Clock,
                completed: false
            },
            {
                id: 'redes-sociales',
                name: 'Redes Sociales',
                description: 'Perfiles en redes sociales',
                href: '/studio/[slug]/configuracion/estudio/redes-sociales',
                icon: Zap,
                completed: false
            }
        ]
    },
    {
        id: 'negocio',
        title: 'Negocio',
        description: 'Configuración comercial',
        icon: DollarSign,
        items: [
            {
                id: 'precios-y-utilidad',
                name: 'Precios y Utilidad',
                description: 'Configuración de precios',
                href: '/studio/[slug]/configuracion/negocio/precios-y-utilidad',
                icon: Tag,
                completed: true
            },
            {
                id: 'condiciones-comerciales',
                name: 'Condiciones Comerciales',
                description: 'Términos y condiciones',
                href: '/studio/[slug]/configuracion/negocio/condiciones-comerciales',
                icon: FileText,
                completed: false
            },
            {
                id: 'cuentas-bancarias',
                name: 'Cuentas Bancarias',
                description: 'Información bancaria',
                href: '/studio/[slug]/configuracion/negocio/cuentas-bancarias',
                icon: CreditCard,
                completed: false
            },
            {
                id: 'metodos-de-pago',
                name: 'Métodos de Pago',
                description: 'Formas de pago aceptadas',
                href: '/studio/[slug]/configuracion/negocio/metodos-de-pago',
                icon: Banknote,
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
                id: 'empleados',
                name: 'Empleados',
                description: 'Gestión de empleados',
                href: '/studio/[slug]/configuracion/equipo/empleados',
                icon: User,
                completed: false
            },
            {
                id: 'perfiles',
                name: 'Perfiles Profesionales',
                description: 'Perfiles de fotógrafos',
                href: '/studio/[slug]/configuracion/equipo/perfiles',
                icon: Star,
                completed: false
            },
            {
                id: 'proveedores',
                name: 'Proveedores',
                description: 'Gestión de proveedores',
                href: '/studio/[slug]/configuracion/equipo/proveedores',
                icon: Package,
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
                href: '/studio/[slug]/configuracion/catalogo/servicios',
                icon: Zap,
                completed: false
            },
            {
                id: 'paquetes',
                name: 'Paquetes',
                description: 'Paquetes de servicios',
                href: '/studio/[slug]/configuracion/catalogo/paquetes',
                icon: Gift,
                completed: false
            },
            {
                id: 'tipos-evento',
                name: 'Tipos de Evento',
                description: 'Categorías de eventos',
                href: '/studio/[slug]/configuracion/catalogo/tipos-evento',
                icon: Calendar,
                completed: false
            },
            {
                id: 'especialidades',
                name: 'Especialidades',
                description: 'Áreas de especialización',
                href: '/studio/[slug]/configuracion/catalogo/especialidades',
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
                href: '/studio/[slug]/configuracion/cuenta/perfil',
                icon: User,
                completed: false
            },
            {
                id: 'notificaciones',
                name: 'Notificaciones',
                description: 'Preferencias de notificación',
                href: '/studio/[slug]/configuracion/cuenta/notificaciones',
                icon: Bell,
                completed: false
            },
            {
                id: 'seguridad',
                name: 'Seguridad',
                description: 'Configuración de seguridad',
                href: '/studio/[slug]/configuracion/cuenta/seguridad',
                icon: Lock,
                completed: false
            },
            {
                id: 'suscripcion',
                name: 'Suscripción',
                description: 'Plan y facturación',
                href: '/studio/[slug]/configuracion/cuenta/suscripcion',
                icon: CreditCard,
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
                href: '/studio/[slug]/configuracion/integraciones',
                icon: Plug,
                completed: false
            },
            {
                id: 'avanzado',
                name: 'Configuración Avanzada',
                description: 'Opciones avanzadas',
                href: '/studio/[slug]/configuracion/avanzado',
                icon: SlidersHorizontal,
                completed: false
            }
        ]
    }
];

// Componente del Sidebar
function ConfiguracionSidebarContent({ className }: ConfiguracionSidebarZenProps) {
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedSections, setExpandedSections] = useState<string[]>(['estudio', 'negocio']);

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
    }, [searchTerm]);

    // Calcular estadísticas
    const stats = useMemo(() => {
        const totalItems = configSections.reduce((acc, section) => acc + section.items.length, 0);
        const completedItems = configSections.reduce((acc, section) => 
            acc + section.items.filter(item => item.completed).length, 0
        );
        return { total: totalItems, completed: completedItems };
    }, []);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const isActive = (href: string) => {
        return pathname === href.replace('[slug]', 'demo'); // Ajustar según el slug real
    };

    return (
        <ZenSidebar className={className}>
            <ZenSidebarHeader>
                <div className="space-y-4">
                    {/* Header con estadísticas */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-zinc-200">Configuración</h2>
                            <p className="text-sm text-zinc-400">
                                {stats.completed}/{stats.total} completado
                            </p>
                        </div>
                        <ZenBadge variant="secondary">
                            {Math.round((stats.completed / stats.total) * 100)}%
                        </ZenBadge>
                    </div>

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
                                {expandedSections.includes(section.id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>
                        </ZenSidebarGroupLabel>
                        
                        {expandedSections.includes(section.id) && (
                            <ZenSidebarGroupContent>
                                <ZenSidebarMenu>
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
                                                    {item.badge && (
                                                        <ZenBadge variant="outline" className="text-xs">
                                                            {item.badge}
                                                        </ZenBadge>
                                                    )}
                                                </Link>
                                            </ZenSidebarMenuButton>
                                        </ZenSidebarMenuItem>
                                    ))}
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
                            <Link href="/studio/[slug]/configuracion" className="flex items-center gap-3">
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

// Componente principal con provider
export function ConfiguracionSidebarZen({ className }: ConfiguracionSidebarZenProps) {
    return (
        <ZenSidebarProvider>
            <ConfiguracionSidebarContent className={className} />
        </ZenSidebarProvider>
    );
}

// Hook para usar el sidebar
export function useConfiguracionSidebar() {
    // Implementar lógica específica si es necesario
    return {
        // Funciones de utilidad para el sidebar
    };
}
