'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    Kanban,
    Calendar,
    Users,
    DollarSign
} from 'lucide-react';

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

interface SimpleSidebarProps {
    className?: string;
}

export function SimpleSidebar({ className }: SimpleSidebarProps) {
    const pathname = usePathname();
    const params = useParams();
    const slug = params.slug as string;

    // Menú simplificado
    const navigationItems: NavigationItem[] = [
        { name: 'Dashboard', href: `/studio/${slug}/dashboard`, icon: LayoutDashboard },
        { name: 'Kanban', href: `/studio/${slug}/kanban`, icon: Kanban },
        { name: 'Agenda', href: `/studio/${slug}/agenda`, icon: Calendar },
        { name: 'Contactos', href: `/studio/${slug}/contactos`, icon: Users },
        { name: 'Finanzas', href: `/studio/${slug}/finanzas`, icon: DollarSign }
    ];

    const isActiveLink = (href: string) => {
        if (!pathname) return false;
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <div className={cn('flex flex-col h-[calc(100vh-4rem)] bg-zinc-950 border-r border-zinc-900 w-64', className)}>
            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = isActiveLink(item.href);

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                                isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-800">
                <p className="text-xs text-zinc-500">
                    ZENPro v1.0
                </p>
            </div>
        </div>
    );
}
