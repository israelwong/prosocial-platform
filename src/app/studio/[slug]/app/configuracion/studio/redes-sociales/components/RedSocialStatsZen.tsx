'use client';

import React from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { Share2, CheckCircle, XCircle, Globe } from 'lucide-react';
import { RedSocial, Plataforma } from '../types';

interface RedSocialStatsZenProps {
    redes: RedSocial[];
    plataformas: Plataforma[];
    loading?: boolean;
}

export function RedSocialStatsZen({ redes, plataformas, loading }: RedSocialStatsZenProps) {
    const redesActivas = redes.filter(r => r.activo).length;
    const redesInactivas = redes.filter(r => !r.activo).length;
    const totalRedes = redes.length;
    const plataformasDisponibles = plataformas.filter(p => p.isActive).length;

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <ZenCard key={i} variant="default" padding="md">
                        <div className="animate-pulse">
                            <div className="flex items-center justify-between mb-3">
                                <div className="h-4 w-24 bg-zinc-700 rounded" />
                                <div className="h-4 w-4 bg-zinc-700 rounded" />
                            </div>
                            <div className="h-8 w-16 bg-zinc-700 rounded mb-2" />
                            <div className="h-3 w-20 bg-zinc-700 rounded" />
                        </div>
                    </ZenCard>
                ))}
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Total Redes */}
            <ZenCard variant="default" padding="md" className="hover:bg-zinc-800/30 transition-colors duration-200">
                <ZenCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <ZenCardTitle className="text-sm font-medium text-zinc-300">
                        Total Redes
                    </ZenCardTitle>
                    <div className="p-2 bg-blue-900/20 rounded-full">
                        <Share2 className="h-4 w-4 text-blue-400" />
                    </div>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-white">{totalRedes}</div>
                        <div className="text-sm text-zinc-500">
                            de {plataformasDisponibles} plataformas
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                        Redes sociales configuradas
                    </div>
                </ZenCardContent>
            </ZenCard>

            {/* Redes Activas */}
            <ZenCard variant="default" padding="md" className="hover:bg-zinc-800/30 transition-colors duration-200">
                <ZenCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <ZenCardTitle className="text-sm font-medium text-zinc-300">
                        Activas
                    </ZenCardTitle>
                    <div className="p-2 bg-green-900/20 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-green-400">{redesActivas}</div>
                        <div className="text-sm text-zinc-500">
                            {totalRedes > 0 ? Math.round((redesActivas / totalRedes) * 100) : 0}%
                        </div>
                    </div>
                    {redesInactivas > 0 && (
                        <div className="mt-2 text-xs text-zinc-500">
                            {redesInactivas} inactiva{redesInactivas !== 1 ? 's' : ''}
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>

            {/* Redes Inactivas */}
            <ZenCard variant="default" padding="md" className="hover:bg-zinc-800/30 transition-colors duration-200">
                <ZenCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <ZenCardTitle className="text-sm font-medium text-zinc-300">
                        Inactivas
                    </ZenCardTitle>
                    <div className="p-2 bg-red-900/20 rounded-full">
                        <XCircle className="h-4 w-4 text-red-400" />
                    </div>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-red-400">{redesInactivas}</div>
                        <div className="text-sm text-zinc-500">
                            {totalRedes > 0 ? Math.round((redesInactivas / totalRedes) * 100) : 0}%
                        </div>
                    </div>
                    {redesInactivas > 0 && (
                        <div className="mt-2 text-xs text-zinc-500">
                            No aparecen en tu perfil público
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
