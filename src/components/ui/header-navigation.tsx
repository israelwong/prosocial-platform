'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { LucideIcon, UserPlus, Plus, Settings, BarChart3, Calendar, Users, Building2, Target, TrendingUp, CreditCard, FileText, Percent, Clock } from 'lucide-react';

export interface HeaderNavigationProps {
    title: string;
    description: string;
    actionButton?: {
        label: string;
        href?: string; // ✅ Opcional para links
        onClick?: () => void; // ✅ Opcional para botones
        icon: LucideIcon | string; // ✅ Acepta componente o nombre
    };
    className?: string;
}

// ✅ Helper para obtener icono por nombre
const getIcon = (icon: LucideIcon | string): LucideIcon => {
    if (typeof icon === 'string') {
        const iconMap: Record<string, LucideIcon> = {
            'UserPlus': UserPlus,
            'Plus': Plus,
            'Settings': Settings,
            'BarChart3': BarChart3,
            'Calendar': Calendar,
            'Users': Users,
            'Building2': Building2,
            'Target': Target,
            'TrendingUp': TrendingUp,
            'CreditCard': CreditCard,
            'FileText': FileText,
            'Percent': Percent,
            'Clock': Clock,
        };
        return iconMap[icon] || Plus; // Fallback a Plus si no se encuentra
    }
    return icon;
};

export function HeaderNavigation({
    title,
    description,
    actionButton,
    className
}: HeaderNavigationProps) {
    return (
        <div className={cn("bg-zinc-900 border border-zinc-800 rounded-lg p-6", className)}>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">{title}</h1>
                    <p className="text-zinc-400 mt-1">{description}</p>
                </div>
                {actionButton && (
                    actionButton.href ? (
                        <Link
                            href={actionButton.href}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {React.createElement(getIcon(actionButton.icon), { className: "h-4 w-4 mr-2" })}
                            {actionButton.label}
                        </Link>
                    ) : (
                        <button
                            onClick={actionButton.onClick}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            {React.createElement(getIcon(actionButton.icon), { className: "h-4 w-4 mr-2" })}
                            {actionButton.label}
                        </button>
                    )
                )}
            </div>
        </div>
    );
}
