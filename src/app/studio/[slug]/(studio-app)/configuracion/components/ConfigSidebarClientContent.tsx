'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ZenInput, ZenSidebar, ZenSidebarContent, ZenSidebarHeader, ZenSidebarFooter,
    ZenSidebarGroup, ZenSidebarGroupLabel, ZenSidebarGroupContent, ZenSidebarMenu,
    ZenSidebarMenuItem, ZenSidebarMenuSub, ZenSidebarMenuSubItem, ZenSidebarMenuSubButton
} from '@/components/ui/zen';
import { StudioHeaderModal } from './StudioHeaderModal';
import {
    Building2, User, Zap, Clock, CreditCard, Bell, Lock, Package, Calendar, Layers, SlidersHorizontal, Plug, Star,
    ChevronDown, ChevronRight, BarChart3, LayoutTemplate, Sparkles, Bot, Globe, Palette, Puzzle, Workflow, Mail, Coins, Wand2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { NavigationConfig } from './ConfiguracionSidebarZenV2';

// Mapa de iconos (actualizado con todos los iconos)
const iconMap: { [key: string]: LucideIcon } = {
    Building2, User, Zap, Clock, CreditCard, Bell, Lock, Package, Calendar, Layers, SlidersHorizontal, Plug, Star,
    LayoutTemplate, Sparkles, Bot, Globe, Palette, Puzzle, Workflow, Mail, Coins, Wand2
};

interface ConfigSidebarClientContentProps {
    navigationConfig: NavigationConfig;
    studioSlug: string;
}

export function ConfigSidebarClientContent({ navigationConfig, studioSlug }: ConfigSidebarClientContentProps) {
    const pathname = usePathname();
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedGroup, setExpandedGroup] = useState<string | null>('estudio'); // Solo un string, inicializado

    const allNavGroups = useMemo(() => [
        ...navigationConfig.global,
        ...navigationConfig.modules,
        ...navigationConfig.platform,
    ], [navigationConfig]);

    const filteredNavGroups = useMemo(() => {
        if (!searchTerm.trim()) {
            return allNavGroups;
        }
        const lowercasedFilter = searchTerm.toLowerCase();
        return allNavGroups.map(group => ({
            ...group,
            items: group.items.filter(item => item.name.toLowerCase().includes(lowercasedFilter))
        })).filter(group => group.items.length > 0);
    }, [searchTerm, allNavGroups]);

    const toggleGroup = (groupId: string) => {
        setExpandedGroup(prev => (prev === groupId ? null : groupId)); // Si es el mismo, ciérralo; si no, ábrelo
    };

    const isActive = (href: string) => {
        return pathname === `/${studioSlug}/configuracion${href}`;
    };

    return (
        <ZenSidebar>
            <ZenSidebarHeader>
                <div className="space-y-4 mb-4">
                    <StudioHeaderModal />
                    <ZenInput
                        placeholder="Buscar configuración..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
            </ZenSidebarHeader>
            <ZenSidebarContent>
                {filteredNavGroups.map((group) => {
                    const GroupIcon = iconMap[group.icon];
                    const isExpanded = expandedGroup === group.id; // Comprobar si este grupo está expandido
                    return (
                        <ZenSidebarGroup key={group.id}>
                            <ZenSidebarGroupLabel>
                                <button
                                    onClick={() => toggleGroup(group.id)}
                                    className="flex items-center justify-between w-full text-left hover:text-zinc-200 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {GroupIcon && <GroupIcon className="w-4 h-4" />}
                                        <span>{group.title}</span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4" />
                                    )}
                                </button>
                            </ZenSidebarGroupLabel>
                            {isExpanded && (
                                <ZenSidebarGroupContent>
                                    <ZenSidebarMenu>
                                        <ZenSidebarMenuItem>
                                            <ZenSidebarMenuSub>
                                                {group.items.map((item) => (
                                                    <ZenSidebarMenuSubItem key={item.id}>
                                                        <ZenSidebarMenuSubButton asChild isActive={isActive(item.href)}>
                                                            <Link href={`/${studioSlug}/configuracion${item.href}`}>
                                                                <span className="truncate">{item.name}</span>
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
                    );
                })}
            </ZenSidebarContent>
            <ZenSidebarFooter>
                <ZenSidebarMenu>
                    <ZenSidebarMenuItem>
                        <Link href={`/studio/${studioSlug}/dashboard`} className="flex items-center gap-3 text-zinc-400 hover:text-white">
                            <BarChart3 className="w-4 h-4" />
                            <span>Volver al Dashboard</span>
                        </Link>
                    </ZenSidebarMenuItem>
                </ZenSidebarMenu>
            </ZenSidebarFooter>
        </ZenSidebar>
    );
}
