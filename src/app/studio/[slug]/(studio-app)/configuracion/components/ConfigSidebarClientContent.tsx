'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    ZenInput, ZenSidebar, ZenSidebarContent, ZenSidebarHeader, ZenSidebarFooter,
    ZenSidebarGroup, ZenSidebarGroupLabel, ZenSidebarGroupContent, ZenSidebarMenu,
    ZenSidebarMenuItem, ZenSidebarMenuSub, ZenSidebarMenuButton
} from '@/components/ui/zen';
import { StudioHeaderModal } from './StudioHeaderModal';
import {
    Building2, User, Zap, Clock, CreditCard, Bell, Lock, Package, Calendar, Layers, SlidersHorizontal, Plug, Star,
    ChevronDown, ChevronRight, BarChart3, LayoutTemplate, Sparkles, Bot, Globe, Palette, Puzzle, Workflow, Mail, Coins, Wand2, LogOut
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { NavigationConfig, NavItem, NavItemGroup } from './ConfiguracionSidebarZenV2';

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
    const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
    const [expandedSubgroups, setExpandedSubgroups] = useState<string[]>([]);

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
            <ZenSidebarContent className="px-4">
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
                                <ZenSidebarGroupContent className="space-y-1">
                                    <ZenSidebarMenu>
                                        {/* Renderizado mixto (si existe) */}
                                        {group.mixedItems && group.mixedItems.length > 0 ? (
                                            <div className="space-y-0">
                                                {group.mixedItems.map((item) => {
                                                    // Verificar si es un item directo o un subgrupo
                                                    const isSubgroup = 'items' in item;

                                                    if (isSubgroup) {
                                                        // Es un subgrupo
                                                        const subgroup = item as NavItemGroup;
                                                        const isSubgroupExpanded = expandedSubgroups.includes(subgroup.id);
                                                        return (
                                                            <div key={subgroup.id} className="pl-2 ml-2 border-l border-zinc-800">
                                                                <ZenSidebarMenuItem>
                                                                    <ZenSidebarMenuButton onClick={() => toggleSubgroup(subgroup.id)} className="justify-between text-zinc-400 hover:text-zinc-100">
                                                                        <span>{subgroup.title}</span>
                                                                        <ChevronDown className={`w-4 h-4 transition-transform ${isSubgroupExpanded ? 'rotate-180' : ''}`} />
                                                                    </ZenSidebarMenuButton>
                                                                    {isSubgroupExpanded && (
                                                                        <ZenSidebarMenuSub className="space-y-1 py-2 ml-3">
                                                                            {subgroup.items.map((subItem: NavItem) => (
                                                                                <ZenSidebarMenuItem key={subItem.id}>
                                                                                    <ZenSidebarMenuButton asChild isActive={isActive(subItem.href)}>
                                                                                        <Link href={`/${studioSlug}/configuracion${subItem.href}`}>
                                                                                            <span className="truncate">{subItem.name}</span>
                                                                                        </Link>
                                                                                    </ZenSidebarMenuButton>
                                                                                </ZenSidebarMenuItem>
                                                                            ))}
                                                                        </ZenSidebarMenuSub>
                                                                    )}
                                                                </ZenSidebarMenuItem>
                                                            </div>
                                                        );
                                                    } else {
                                                        // Es un item directo
                                                        const directItem = item as NavItem;
                                                        return (
                                                            <div key={directItem.id} className="pl-2 ml-2 border-l border-zinc-800">
                                                                <ZenSidebarMenuItem>
                                                                    <ZenSidebarMenuButton asChild isActive={isActive(directItem.href)}>
                                                                        <Link href={`/${studioSlug}/configuracion${directItem.href}`}>
                                                                            <span className="truncate">{directItem.name}</span>
                                                                        </Link>
                                                                    </ZenSidebarMenuButton>
                                                                </ZenSidebarMenuItem>
                                                            </div>
                                                        );
                                                    }
                                                })}
                                            </div>
                                        ) : (
                                            <>
                                                {/* Fallback: Items directos (si existen) */}
                                                {group.items && group.items.length > 0 && (
                                                    <div className="space-y-1 pl-2 ml-2 border-l border-zinc-800">
                                                        {group.items.map((item) => (
                                                            <ZenSidebarMenuItem key={item.id}>
                                                                <ZenSidebarMenuButton asChild isActive={isActive(item.href)}>
                                                                    <Link href={`/${studioSlug}/configuracion${item.href}`}>
                                                                        <span className="truncate">{item.name}</span>
                                                                    </Link>
                                                                </ZenSidebarMenuButton>
                                                            </ZenSidebarMenuItem>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Fallback: Subgrupos (si existen) */}
                                                {group.subgroups && group.subgroups.length > 0 && (
                                                    <div className="pl-2 ml-2 border-l border-zinc-800">
                                                        {group.subgroups.map((subgroup) => {
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
                                                        })}
                                                    </div>
                                                )}
                                            </>
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
                        <ZenSidebarMenuButton className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                            <LogOut className="w-4 h-4" />
                            <span>Cerrar Sesión</span>
                        </ZenSidebarMenuButton>
                    </ZenSidebarMenuItem>
                </ZenSidebarMenu>
            </ZenSidebarFooter>
        </ZenSidebar>
    );
}
