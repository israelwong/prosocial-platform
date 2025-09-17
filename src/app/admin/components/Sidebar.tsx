'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Users,
    UserCheck,
    Building2,
    CreditCard,
    BarChart3,
    Settings,
    Columns3,
    ChevronDown,
    ChevronRight,
    Target,
    Megaphone,
    Play,
    History,
    Wrench
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    {
        name: 'Marketing',
        icon: Target,
        children: [
            { name: 'Campañas Activas', href: '/admin/campanas/activas', icon: Play },
            { name: 'Historial', href: '/admin/campanas/historial', icon: History },
        ]
    },
    {
        name: 'Configuración',
        icon: Settings,
        children: [
            { name: 'Planes', href: '/admin/plans', icon: CreditCard },
            { name: 'Servicios', href: '/admin/services', icon: Wrench },
            { name: 'Agentes', href: '/admin/agents', icon: Users },
            { name: 'Pipeline', href: '/admin/pipeline', icon: Columns3 },
            { name: 'Canales', href: '/admin/canales', icon: Target },
        ]
    },
];

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    expandedMenus: string[];
    onToggleMenu: (menuName: string) => void;
}

export function Sidebar({ isOpen, onClose, expandedMenus, onToggleMenu }: SidebarProps) {
    const pathname = usePathname();

    const isMenuExpanded = (menuName: string) => expandedMenus.includes(menuName);

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
                <nav className="mt-6 px-3">
                    <div className="space-y-1">
                        {navigation.map((item) => {
                            // Si tiene children, es un menú expandible
                            if (item.children) {
                                const isExpanded = isMenuExpanded(item.name);
                                const hasActiveChild = item.children.some(child => isActiveLink(child.href));

                                return (
                                    <div key={item.name}>
                                        <button
                                            onClick={() => onToggleMenu(item.name)}
                                            className={cn(
                                                "group flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200",
                                                hasActiveChild
                                                    ? "bg-blue-600 text-white"
                                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                            )}
                                        >
                                            <div className="flex items-center">
                                                <item.icon
                                                    className={cn(
                                                        "mr-3 h-5 w-5 flex-shrink-0",
                                                        hasActiveChild ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                                    )}
                                                />
                                                {item.name}
                                            </div>
                                            {isExpanded ? (
                                                <ChevronDown className="h-4 w-4" />
                                            ) : (
                                                <ChevronRight className="h-4 w-4" />
                                            )}
                                        </button>

                                        {isExpanded && (
                                            <div className="ml-6 mt-1 space-y-1">
                                                {item.children.map((child) => {
                                                    const isChildActive = isActiveLink(child.href);
                                                    return (
                                                        <Link
                                                            key={child.name}
                                                            href={child.href}
                                                            className={cn(
                                                                "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                                                                isChildActive
                                                                    ? "bg-blue-600 text-white"
                                                                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                                                            )}
                                                        >
                                                            <child.icon
                                                                className={cn(
                                                                    "mr-3 h-4 w-4 flex-shrink-0",
                                                                    isChildActive ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                                                                )}
                                                            />
                                                            {child.name}
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                );
                            }

                            // Si no tiene children, es un enlace normal
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
                </nav>

            </div>
        </>
    );
}
