'use client';

import React from 'react';
import { Grid3X3, Store, Info } from 'lucide-react';
import { ProfileTab } from '@/types/public-profile';

interface ProfileNavTabsProps {
    activeTab: ProfileTab;
    onTabChange: (tab: ProfileTab) => void;
}

/**
 * ProfileNavTabs - Tab navigation for profile content
 * Client component with state management
 * Uses ZEN styling consistent with design system
 */
export function ProfileNavTabs({ activeTab, onTabChange }: ProfileNavTabsProps) {
    const tabs = [
        {
            id: ProfileTab.POSTS,
            label: 'Publicaciones',
            icon: Grid3X3,
        },
        {
            id: ProfileTab.SHOP,
            label: 'Tienda',
            icon: Store,
        },
        {
            id: ProfileTab.INFO,
            label: 'Información',
            icon: Info,
        },
    ];

    return (
        <div className="border-b border-zinc-800">
            <nav className="flex">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium
                transition-colors duration-200
                ${isActive
                                    ? 'text-purple-400 border-b-2 border-purple-400 bg-purple-400/5'
                                    : 'text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/50'
                                }
              `}
                        >
                            <Icon className="h-4 w-4" />
                            <span className="hidden sm:inline">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
