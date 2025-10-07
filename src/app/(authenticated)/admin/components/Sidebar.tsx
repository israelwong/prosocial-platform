'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    CreditCard,
    BarChart3,
    Columns3,
    Target,
    Play,
    Wrench,
    Users,
    Gift,
    Share2
} from 'lucide-react';

// Estructura de navegación simplificada
const navigationSections = [
    {
        title: 'Principal',
        items: [
            { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
            { name: 'Campañas', href: '/admin/campanas/activas', icon: Play },
        ]
    },
    {
        title: 'Configuración',
        items: [
            { name: 'Planes', href: '/admin/plans', icon: CreditCard },
            { name: 'Servicios', href: '/admin/services', icon: Wrench },
            { name: 'Agentes', href: '/admin/agents', icon: Users },
            { name: 'Pipeline', href: '/admin/pipeline', icon: Columns3 },
            { name: 'Redes Sociales', href: '/admin/redes-sociales', icon: Share2 },
            { name: 'Canales', href: '/admin/canales', icon: Target },
            { name: 'Descuentos', href: '/admin/descuentos', icon: Gift },
        ]
    },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const pathname = usePathname();

    const isActiveLink = (href: string) => {
        if (!pathname) return false;
        if (href === '/admin/dashboard') {
            return pathname === href;
        }
        return pathname.startsWith(href);
    };

    return (
        <>
            {/* Mobile sidebar overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r-2 border-zinc-900 transform transition-transform duration-300 ease-in-out lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <nav className="mt-6 px-3 space-y-6">
                    {navigationSections.map((section) => (
                        <div key={section.title} className="space-y-2">
                            {/* Título de la sección */}
                            <h3 className="px-3 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                                {section.title}
                            </h3>

                            {/* Items de la sección */}
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = isActiveLink(item.href);
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                                isActive
                                                    ? "bg-blue-600 text-white"
                                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                            )}
                                        >
                                            <item.icon
                                                className={cn(
                                                    "mr-3 h-5 w-5 flex-shrink-0",
                                                    isActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                                )}
                                            />
                                            {item.name}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>

            </div>
        </>
    );
}
