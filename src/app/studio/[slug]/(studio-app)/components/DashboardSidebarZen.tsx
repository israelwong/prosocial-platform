import React from 'react';
import Link from 'next/link';
import {
    Kanban, Calendar, Users, Settings, BarChart3, Bot, LayoutTemplate, Sparkles
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { getActiveModules } from '@/lib/modules';
import {
    ZenSidebar, ZenSidebarContent, ZenSidebarHeader, ZenSidebarFooter, ZenSidebarMenu,
    ZenSidebarMenuItem, ZenSidebarMenuButton
} from '@/components/ui/zen';
import { StudioHeaderModal } from '../configuracion/components/StudioHeaderModal';
import { ActiveLink } from './ActiveLink'; // Componente cliente para manejar el estado activo

// Definición de la apariencia de cada módulo
const moduleConfig = {
    manager: { icon: Kanban, title: 'ZEN Manager', href: '/manager' },
    pages: { icon: LayoutTemplate, title: 'ZEN Pages', href: '/pages' },
    marketing: { icon: Sparkles, title: 'ZEN Marketing', href: '/marketing' },
    magic: { icon: Bot, title: 'ZEN Magic', href: '/magic' },
    // ... otros módulos pueden ser añadidos aquí
};

interface DashboardSidebarZenProps {
    className?: string;
    studioSlug: string;
}

export async function DashboardSidebarZen({ className, studioSlug }: DashboardSidebarZenProps) {
    const studio = await prisma.studios.findUnique({
        where: { slug: studioSlug },
        select: { id: true }
    });

    if (!studio) {
        // Manejar el caso donde el studio no se encuentra
        return <ZenSidebar className={className}>Studio no encontrado</ZenSidebar>;
    }

    const activeModules = await getActiveModules(studio.id);

    const mainNavItems = [
        { href: `/${studioSlug}/dashboard`, icon: BarChart3, label: 'Dashboard' },
    ];

    return (
        <ZenSidebar className={className}>
            <ZenSidebarHeader>
                <StudioHeaderModal />
            </ZenSidebarHeader>

            <ZenSidebarContent>
                <ZenSidebarMenu>
                    {/* Sección Principal Siempre Visible */}
                    <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Principal</div>
                    {mainNavItems.map(item => (
                        <ZenSidebarMenuItem key={item.href}>
                            <ActiveLink href={item.href}>
                                <item.icon className="w-4 h-4" />
                                <span>{item.label}</span>
                            </ActiveLink>
                        </ZenSidebarMenuItem>
                    ))}

                    {/* Separador */}
                    <div className="px-3 py-2"><div className="h-px bg-zinc-800"></div></div>

                    {/* Módulos Activos */}
                    <div className="px-3 py-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Módulos</div>
                    {activeModules.map(module => {
                        const config = moduleConfig[module.slug as keyof typeof moduleConfig];
                        if (!config) return null;
                        const href = `/${studioSlug}${config.href}`;

                        return (
                            <ZenSidebarMenuItem key={module.id}>
                                <ActiveLink href={href}>
                                    <config.icon className="w-4 h-4" />
                                    <span>{config.title}</span>
                                </ActiveLink>
                            </ZenSidebarMenuItem>
                        );
                    })}
                </ZenSidebarMenu>

                {/* Navegación Fija */}
                <ZenSidebarMenu>
                    <ZenSidebarMenuItem>
                        <ActiveLink href={`/${studioSlug}/configuracion`}>
                            <Settings className="w-4 h-4" />
                            <span>Configuración</span>
                        </ActiveLink>
                    </ZenSidebarMenuItem>
                </ZenSidebarMenu>
            </ZenSidebarContent>

            <ZenSidebarFooter>
                {/* The ZenSidebarFooter was removed as per the edit hint, so this block is now empty */}
            </ZenSidebarFooter>
        </ZenSidebar>
    );
}
