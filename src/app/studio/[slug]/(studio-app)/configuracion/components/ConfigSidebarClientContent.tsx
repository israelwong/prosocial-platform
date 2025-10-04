'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ZenInput, ZenSidebar, ZenSidebarContent, ZenSidebarHeader, ZenSidebarFooter,
    ZenSidebarGroup, ZenSidebarGroupLabel, ZenSidebarGroupContent, ZenSidebarMenu,
    ZenSidebarMenuItem, ZenSidebarMenuSub, ZenSidebarMenuSubItem, ZenSidebarMenuSubButton, ZenSidebarMenuButton
} from '@/components/ui/zen';
import { StudioHeaderModal } from './StudioHeaderModal';
import {
    Building2, User, Zap, Clock, CreditCard, Bell, Lock, Package, Calendar, Layers, SlidersHorizontal, Plug, Star,
    ChevronDown, ChevronRight, BarChart3, LayoutTemplate, Sparkles, Bot, Globe, Palette, Puzzle, Workflow, Mail, Coins, Wand2
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { NavigationConfig } from './ConfiguracionSidebarZenV2';
import { cn } from '@/lib/utils';

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
    const [expandedGroup, setExpandedGroup] = useState<string | null>('manager');
    const [expandedSubgroups, setExpandedSubgroups] = useState<string[]>(['oferta-comercial', 'precios-rentabilidad']);

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

        return allNavGroups
            .map(group => {
                // Si el grupo tiene subgrupos (como ZEN Manager)
                if (group.subgroups) {
                    const filteredSubgroups = group.subgroups
                        .map(subgroup => ({
                            ...subgroup,
                            items: subgroup.items.filter(item =>
                                item.name.toLowerCase().includes(lowercasedFilter)
                            ),
                        }))
                        .filter(subgroup => subgroup.items.length > 0);

                    return { ...group, subgroups: filteredSubgroups, items: [] }; // items vacio para evitar errores
                }

                // Si el grupo tiene items directos (como Global, Platform)
                if (group.items) {
                    const filteredItems = group.items.filter(item =>
                        item.name.toLowerCase().includes(lowercasedFilter)
                    );
                    return { ...group, items: filteredItems };
                }

                return { ...group, items: [], subgroups: [] };
            })
            .filter(
                group =>
                    (group.items && group.items.length > 0) ||
                    (group.subgroups && group.subgroups.length > 0)
            );
    }, [searchTerm, allNavGroups]);

    const toggleGroup = (groupId: string) => {
        setExpandedGroup(prev => (prev === groupId ? null : groupId));
    };

    const toggleSubgroup = (subgroupId: string) => {
        setExpandedSubgroups(prev =>
            prev.includes(subgroupId)
                ? prev.filter(id => id !== subgroupId)
                : [...prev, subgroupId]
        );
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
                    const isExpanded = expandedGroup === group.id;
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
                                <ZenSidebarGroupContent className={cn(
                                    group.subgroups && 'pl-2 ml-2 border-l border-zinc-800 space-y-1'
                                )}>
                                    <ZenSidebarMenu>
                                        {group.subgroups ? (
                                            group.subgroups.map((subgroup) => {
                                                const isSubgroupExpanded = expandedSubgroups.includes(subgroup.id);
                                                return (
                                                    <ZenSidebarMenuItem key={subgroup.id}>
                                                        <ZenSidebarMenuButton onClick={() => toggleSubgroup(subgroup.id)} className="justify-between text-zinc-400 hover:text-zinc-100">
                                                            <span>{subgroup.title}</span>
                                                            <ChevronDown className={`w-4 h-4 transition-transform ${isSubgroupExpanded ? 'rotate-180' : ''}`} />
                                                        </ZenSidebarMenuButton>
                                                        {isSubgroupExpanded && (
                                                            <ZenSidebarMenuSub className="space-y-1 py-2">
                                                                {subgroup.items.map((item) => (
                                                                    <ZenSidebarMenuItem key={item.id}>
                                                                        <ZenSidebarMenuButton asChild isActive={isActive(item.href)}>
                                                                            <Link href={`/${studioSlug}/configuracion${item.href}`}>
                                                                                <span className="truncate">{item.name}</span>
                                                                            </Link>
                                                                        </ZenSidebarMenuButton>
                                                                    </ZenSidebarMenuItem>
                                                                ))}
                                                            </ZenSidebarMenuSub>
                                                        )}
                                                    </ZenSidebarMenuItem>
                                                );
                                            })
                                        ) : (
                                            <ZenSidebarMenuItem>
                                                <ZenSidebarMenuSub className="ml-2 pl-2 border-l border-zinc-800 space-y-1 py-2">
                                                    {group.items?.map((item) => (
                                                        <ZenSidebarMenuItem key={item.id}>
                                                            <ZenSidebarMenuButton asChild isActive={isActive(item.href)}>
                                                                <Link href={`/${studioSlug}/configuracion${item.href}`}>
                                                                    <span className="truncate">{item.name}</span>
                                                                </Link>
                                                            </ZenSidebarMenuButton>
                                                        </ZenSidebarMenuItem>
                                                    ))}
                                                </ZenSidebarMenuSub>
                                            </ZenSidebarMenuItem>
                                        )}
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
