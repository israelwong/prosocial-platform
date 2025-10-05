import React from 'react';
import Link from 'next/link';
import { ZenCard } from '@/components/ui/zen';
import {
    Calendar,
    Zap,
    Gift,
    Users2,
    Clock,
    CreditCard,
    Tag,
    ArrowRight
} from 'lucide-react';

const managerSections = [
    {
        id: 'tipos-evento',
        name: 'Tipos de Evento',
        description: 'Configura las categorías de eventos que ofreces',
        icon: Calendar,
        href: 'tipos-evento',
        status: 'active'
    },
    {
        id: 'servicios',
        name: 'Catálogo de Servicios',
        description: 'Gestiona los servicios que ofreces a tus clientes',
        icon: Zap,
        href: 'servicios',
        status: 'active'
    },
    {
        id: 'paquetes',
        name: 'Paquetes',
        description: 'Crea paquetes combinando tus servicios',
        icon: Gift,
        href: 'paquetes',
        status: 'active'
    },
    {
        id: 'personal',
        name: 'Personal y Equipo',
        description: 'Administra tu equipo y colaboradores',
        icon: Users2,
        href: 'personal',
        status: 'active'
    },
    {
        id: 'reglas-agendamiento',
        name: 'Reglas de Agendamiento',
        description: 'Define horarios y disponibilidad para eventos',
        icon: Clock,
        href: 'reglas-agendamiento',
        status: 'active'
    },
    {
        id: 'cuentas-bancarias',
        name: 'Cuentas Bancarias',
        description: 'Configura tus cuentas para recibir pagos',
        icon: CreditCard,
        href: 'cuentas-bancarias',
        status: 'active'
    },
    {
        id: 'precios-utilidad',
        name: 'Precios y Utilidad',
        description: 'Define márgenes y estrategia de precios',
        icon: Tag,
        href: 'precios-utilidad',
        status: 'active'
    }
];

export default async function ManagerConfigPage({
    params
}: {
    params: { slug: string }
}) {
    const { slug } = await params;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">
                    Configuración de ZEN Manager
                </h1>
                <p className="text-zinc-400">
                    Configura los aspectos operacionales de tu estudio para gestionar eventos y proyectos
                </p>
            </div>

            {/* Secciones de configuración */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {managerSections.map((section) => {
                    const Icon = section.icon;

                    return (
                        <Link
                            key={section.id}
                            href={`/${slug}/configuracion/manager/${section.href}`}
                        >
                            <ZenCard className="group hover:bg-zinc-800/50 transition-colors cursor-pointer h-full">
                                <div className="flex items-start gap-4">
                                    {/* Icono */}
                                    <div className="
                                        flex-shrink-0 w-12 h-12 rounded-lg 
                                        bg-purple-500/20 text-purple-400
                                        flex items-center justify-center
                                        group-hover:bg-purple-500/30 transition-colors
                                    ">
                                        <Icon className="w-6 h-6" />
                                    </div>

                                    {/* Contenido */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors">
                                                {section.name}
                                            </h3>
                                            <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-purple-400 group-hover:translate-x-1 transition-all" />
                                        </div>
                                        <p className="text-sm text-zinc-400">
                                            {section.description}
                                        </p>
                                    </div>
                                </div>
                            </ZenCard>
                        </Link>
                    );
                })}
            </div>

            {/* Info adicional */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                <p className="text-sm text-zinc-400">
                    💡 <span className="text-white font-medium">Tip:</span> Completa estas configuraciones antes de empezar a gestionar eventos.
                    Esto te permitirá aprovechar al máximo las funcionalidades de ZEN Manager.
                </p>
            </div>
        </div>
    );
}

