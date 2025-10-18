'use client';

import React from 'react';
import { Bell, Sparkles, ExternalLink, HardDrive } from 'lucide-react';
import { BreadcrumbHeader } from './BreadcrumbHeader';
import { ZenButton } from '@/components/ui/zen';
import { useZenMagicChat } from './ZenMagic';
import { UserAvatar } from '@/components/auth/user-avatar';

interface AppHeaderProps {
    studioSlug: string;
}

export function AppHeader({ studioSlug }: AppHeaderProps) {
    const { isOpen, toggleChat } = useZenMagicChat();

    // TODO: Implementación futura - Indicador minimalista de almacenamiento
    // Agregar aquí un pequeño badge/tooltip con el % de almacenamiento usado
    // - Obtener datos de: studio_storage_usage table
    // - Mostrar: pequeño ícono HardDrive con tooltip
    // - Colores: verde (<70%), amarillo (70-90%), rojo (>90%)
    // - Actualizar: cada 30s o al cambiar de sección
    // - Ejemplo: <HardDrive className="w-4 h-4 text-green-400" title="45% almacenamiento" />

    // Datos hardcodeados para visualización (0B / 100GB)
    const storageUsedBytes = 0;
    const storageQuotaBytes = 100 * 1024 * 1024 * 1024; // 100GB
    const storagePercentage = (storageUsedBytes / storageQuotaBytes) * 100;

    const getStorageColor = () => {
        if (storagePercentage > 90) return 'text-red-400';
        if (storagePercentage > 70) return 'text-yellow-400';
        return 'text-green-400';
    };

    const formatBytes = (bytes: number): string => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    };

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-zinc-900/50 px-6 backdrop-blur-sm">
            <div className="flex items-center">
                <BreadcrumbHeader studioSlug={studioSlug} />
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
                {/* Indicador minimalista de almacenamiento */}
                <div
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800 transition-colors cursor-help"
                    title={`${formatBytes(storageUsedBytes)} / ${formatBytes(storageQuotaBytes)} (${Math.round(storagePercentage * 10) / 10}%)`}
                >
                    <HardDrive className={`w-4 h-4 ${getStorageColor()}`} />
                    <span className="text-xs text-zinc-300 font-medium hidden sm:inline">
                        {formatBytes(storageUsedBytes)}
                    </span>
                </div>

                {/* Botones ocultos en mobile */}
                <ZenButton variant="ghost" size="icon" className="rounded-full hidden lg:flex">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notificaciones</span>
                </ZenButton>

                <ZenButton
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-zinc-400 hover:text-zinc-200 hidden lg:flex"
                    onClick={() => window.open(`/${studioSlug}`, '_blank')}
                    title="Ver página pública"
                >
                    <ExternalLink className="h-5 w-5" />
                    <span className="sr-only">Ver página pública</span>
                </ZenButton>

                <ZenButton
                    variant="ghost"
                    size="icon"
                    className={`rounded-full ${isOpen ? 'bg-zinc-800 text-zinc-200' : 'text-zinc-400 hover:text-zinc-200'} hidden lg:flex`}
                    onClick={toggleChat}
                >
                    <Sparkles className="h-5 w-5" />
                    <span className="sr-only">ZEN Magic</span>
                </ZenButton>

                {/* Avatar del usuario - siempre visible */}
                <UserAvatar studioSlug={studioSlug} />
            </div>
        </header>
    );
}
