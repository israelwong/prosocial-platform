'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/shadcn/input';
import { Button } from '@/components/ui/shadcn/button';
import { Badge } from '@/components/ui/shadcn/badge';
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
    status?: 'completed' | 'pending' | 'error';
}

interface ConfiguracionSidebarProps {
    studioSlug: string;
    className?: string;
}

export function ConfiguracionSidebar({ studioSlug, className }: ConfiguracionSidebarProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
    const pathname = usePathname();

    // Filtrar secciones e items basado en la búsqueda
    const filteredSections = useMemo(() => {
        const configSections: ConfigSection[] = [
            {
                id: 'estudio',
                title: 'Configuración del Estudio',
                description: 'Todo sobre la identidad y presentación de tu marca',
                icon: Building2,
                items: [
                    {
                        id: 'identidad',
                        name: 'Identidad de Marca',
                        description: 'Define tu logo y nombre',
                        href: `/${studioSlug}/configuracion/estudio/identidad`,
                        icon: Building2,
                    },
                    {
                        id: 'contacto',
                        name: 'Información de Contacto',
                        description: 'Correos, teléfonos y dirección',
                        href: `/${studioSlug}/configuracion/estudio/contacto`,
                        icon: User,
                    },
                    {
                        id: 'redes-sociales',
                        name: 'Redes Sociales',
                        description: 'Conecta tus perfiles',
                        href: `/${studioSlug}/configuracion/estudio/redes-sociales`,
                        icon: Zap,
                    },
                    {
                        id: 'horarios',
                        name: 'Horarios de Atención',
                        description: 'Define tus horas de trabajo',
                        href: `/${studioSlug}/configuracion/estudio/horarios`,
                        icon: Clock,
                    },
                ],
            },
            {
                id: 'negocio',
                title: 'Reglas de Negocio y Finanzas',
                description: 'Cómo ganas dinero y gestionas los pagos',
                icon: DollarSign,
                items: [
                    {
                        id: 'precios-utilidad',
                        name: 'Precios y Utilidad',
                        description: 'Establece márgenes y rentabilidad',
                        href: `/${studioSlug}/configuracion/negocio/precios-y-utilidad`,
                        icon: DollarSign,
                    },
                    {
                        id: 'condiciones-comerciales',
                        name: 'Condiciones Comerciales',
                        description: 'Define políticas de pago',
                        href: `/${studioSlug}/configuracion/negocio/condiciones-comerciales`,
                        icon: FileText,
                    },
                    {
                        id: 'metodos-pago',
                        name: 'Métodos de Pago',
                        description: 'Configura cómo te pagan',
                        href: `/${studioSlug}/configuracion/negocio/metodos-de-pago`,
                        icon: CreditCard,
                    },
                    {
                        id: 'cuentas-bancarias',
                        name: 'Cuentas Bancarias',
                        description: 'Añade tus cuentas de banco',
                        href: `/${studioSlug}/configuracion/negocio/cuentas-bancarias`,
                        icon: Banknote,
                    },
                ],
            },
            {
                id: 'catalogo',
                title: 'Catálogo y Paquetes',
                description: 'Lo que vendes',
                icon: Package,
                items: [
                    {
                        id: 'servicios',
                        name: 'Servicios',
                        description: 'Gestiona tus servicios individuales',
                        href: `/${studioSlug}/configuracion/catalogo/servicios`,
                        icon: Package,
                    },
                    {
                        id: 'paquetes',
                        name: 'Paquetes',
                        description: 'Crea ofertas combinadas',
                        href: `/${studioSlug}/configuracion/catalogo/paquetes`,
                        icon: Gift,
                    },
                    {
                        id: 'especialidades',
                        name: 'Especialidades',
                        description: 'Organiza por tipo de evento',
                        href: `/${studioSlug}/configuracion/catalogo/especialidades`,
                        icon: Star,
                    },
                ],
            },
            {
                id: 'equipo',
                title: 'Gestión de Equipo',
                description: 'Las personas que trabajan contigo',
                icon: Users2,
                items: [
                    {
                        id: 'empleados',
                        name: 'Personal interno',
                        description: 'Gestiona empleados',
                        href: `/${studioSlug}/configuracion/equipo/empleados`,
                        icon: Users2,
                    },
                    {
                        id: 'proveedores',
                        name: 'Proveedores externos',
                        description: 'Gestiona proveedores',
                        href: `/${studioSlug}/configuracion/equipo/proveedores`,
                        icon: Users2,
                    },
                    {
                        id: 'perfiles',
                        name: 'Perfiles Profesionales',
                        description: 'Nombres de perfiles',
                        href: `/${studioSlug}/configuracion/equipo/perfiles`,
                        icon: Tag,
                    },
                ],
            },
            {
                id: 'cuenta',
                title: 'Cuenta y Suscripción',
                description: 'Todo sobre tu cuenta personal en ZENPro',
                icon: Shield,
                items: [
                    {
                        id: 'perfil',
                        name: 'Perfil',
                        description: 'Tu información personal',
                        href: `/${studioSlug}/configuracion/cuenta/perfil`,
                        icon: User,
                    },
                    {
                        id: 'suscripcion',
                        name: 'Suscripción',
                        description: 'Gestiona tu plan de ZENPro',
                        href: `/${studioSlug}/configuracion/cuenta/suscripcion`,
                        icon: CreditCard,
                    },
                    {
                        id: 'notificaciones',
                        name: 'Notificaciones',
                        description: 'Elige cómo recibir notificaciones',
                        href: `/${studioSlug}/configuracion/cuenta/notificaciones`,
                        icon: Bell,
                    },
                    {
                        id: 'seguridad',
                        name: 'Seguridad',
                        description: 'Autenticación y sesiones',
                        href: `/${studioSlug}/configuracion/cuenta/seguridad`,
                        icon: Lock,
                    },
                ],
            },
            {
                id: 'lagales',
                title: 'Legales',
                description: 'Gestiona tus legales',
                icon: FileText,
                items: [
                    {
                        id: 'contrato-servicio',
                        name: 'Contrato de Servicio',
                        description: 'Gestiona tu contrato de servicio',
                        href: `/${studioSlug}/configuracion/legales/contrato-servicio`,
                        icon: FileText,
                    },
                    {
                        id: 'politicas-generales',
                        name: 'Políticas Generales',
                        description: 'Gestiona tu política general',
                        href: `/${studioSlug}/configuracion/legales/politicas-generales`,
                        icon: FileText,
                    },
                    {
                        id: 'politicas-cancelacion',
                        name: 'Políticas de Cancelación',
                        description: 'Gestiona tu política de cancelación',
                        href: `/${studioSlug}/configuracion/legales/politicas-cancelacion`,
                        icon: FileText,
                    },
                    {
                        id: 'garantias',
                        name: 'Garantías',
                        description: 'Gestiona tu garantía',
                        href: `/${studioSlug}/configuracion/legales/garantias`,
                        icon: FileText,
                    }
                ],
            },
            {
                id: 'control-agendamiento',
                title: 'Control de Agenda',
                description: 'Gestiona tu control de agenda',
                icon: Calendar,
                items: [
                    {
                        id: 'control-agenda',
                        name: 'Control de Agendamiento',
                        description: 'Gestiona tu control de agendamiento',
                        href: `/${studioSlug}/configuracion/control-agenda`,
                        icon: Calendar,
                    }
                ],
            },
        ];

        if (!searchQuery.trim()) return configSections;

        const query = searchQuery.toLowerCase();
        return configSections
            .map(section => ({
                ...section,
                items: section.items.filter(item =>
                    item.name.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query)
                )
            }))
            .filter(section => section.items.length > 0);
    }, [searchQuery, studioSlug]);

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionId)) {
                // Si la sección está abierta, la cerramos
                newSet.delete(sectionId);
            } else {
                // Si la sección está cerrada, la abrimos y cerramos todas las demás
                newSet.clear();
                newSet.add(sectionId);
            }
            return newSet;
        });
    };

    const isActiveLink = (href: string) => {
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <div className={cn('flex flex-col h-full bg-zinc-950 border-r border-zinc-900 w-80', className)}>
            {/* Header */}
            <div className="p-4 border-b border-zinc-900">
                <h2 className="text-lg font-semibold text-white mb-1">Configuración</h2>
                <p className="text-sm text-zinc-400 mb-3">Gestiona tu estudio en un solo lugar</p>

                {/* Buscador */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                        type="text"
                        placeholder="Buscar configuración..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 bg-zinc-900/50 border-zinc-800 text-white placeholder-zinc-400 focus:border-blue-500"
                    />
                    {searchQuery && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSearchQuery('')}
                            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-zinc-800"
                        >
                            <X className="h-3 w-3 text-zinc-400" />
                        </Button>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto p-4 space-y-4">
                {filteredSections.map((section, index) => {
                    const SectionIcon = section.icon;
                    const isExpanded = expandedSections.has(section.id);

                    return (
                        <div key={section.id} className="space-y-1">
                            {/* División visual entre grupos */}
                            {index > 0 && (
                                <div className="border-t border-zinc-900 my-4"></div>
                            )}
                            {/* Section Header */}
                            <Button
                                variant="ghost"
                                onClick={() => toggleSection(section.id)}
                                className="w-full justify-start p-3 h-auto text-left hover:bg-zinc-800"
                            >
                                <div className="flex items-center w-full">
                                    <SectionIcon className="h-5 w-5 text-blue-400 mr-3 flex-shrink-0" />
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium text-white text-sm">{section.title}</div>
                                        <div className="text-xs text-zinc-400 truncate">{section.description}</div>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                                    ) : (
                                        <ChevronRight className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                                    )}
                                </div>
                            </Button>

                            {/* Section Items */}
                            {isExpanded && (
                                <div className="ml-8 space-y-1">
                                    {section.items.map((item) => {
                                        const ItemIcon = item.icon;
                                        const isActive = isActiveLink(item.href);

                                        return (
                                            <Link
                                                key={item.id}
                                                href={item.href}
                                                className={cn(
                                                    'flex items-start gap-3 p-3 rounded-lg text-sm transition-colors group',
                                                    isActive
                                                        ? 'bg-blue-600 text-white'
                                                        : 'text-zinc-300 hover:text-white hover:bg-zinc-800'
                                                )}
                                            >
                                                <ItemIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium">{item.name}</div>
                                                    <div className="text-xs text-zinc-400 group-hover:text-zinc-300">
                                                        {item.description}
                                                    </div>
                                                </div>
                                                {item.status && (
                                                    <Badge
                                                        variant="outline"
                                                        className={cn(
                                                            'text-xs',
                                                            item.status === 'completed'
                                                                ? 'border-green-500 text-green-400'
                                                                : item.status === 'pending'
                                                                    ? 'border-yellow-500 text-yellow-400'
                                                                    : 'border-red-500 text-red-400'
                                                        )}
                                                    >
                                                        {item.status === 'completed' ? '✓' : item.status === 'pending' ? '⏳' : '⚠'}
                                                    </Badge>
                                                )}
                                            </Link>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800">
                <div className="text-xs text-zinc-500 text-center">
                    ZENPro v1.0
                </div>
            </div>
        </div>
    );
}
