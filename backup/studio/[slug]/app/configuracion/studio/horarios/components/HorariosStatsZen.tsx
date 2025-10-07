'use client';

import React from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Horario } from '../types';

interface HorariosStatsZenProps {
    horarios: Horario[];
    loading?: boolean;
}

export function HorariosStatsZen({ horarios, loading }: HorariosStatsZenProps) {
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

    const horariosActivos = horarios.filter(h => h.activo).length;
    const horariosInactivos = horarios.filter(h => !h.activo).length;
    const totalHorarios = horarios.length;
    const porcentajeActivos = totalHorarios > 0 ? Math.round((horariosActivos / totalHorarios) * 100) : 0;

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Días Activos */}
            <ZenCard variant="default" padding="md" className="hover:bg-zinc-800/30 transition-colors duration-200">
                <ZenCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <ZenCardTitle className="text-sm font-medium text-zinc-300">
                        Días Activos
                    </ZenCardTitle>
                    <div className="p-2 bg-green-900/20 rounded-full">
                        <CheckCircle className="h-4 w-4 text-green-400" />
                    </div>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-green-400">{horariosActivos}</div>
                        <div className="text-sm text-zinc-500">
                            {porcentajeActivos}% del total
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                        Horarios de atención activos
                    </div>
                </ZenCardContent>
            </ZenCard>

            {/* Días Inactivos */}
            <ZenCard variant="default" padding="md" className="hover:bg-zinc-800/30 transition-colors duration-200">
                <ZenCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <ZenCardTitle className="text-sm font-medium text-zinc-300">
                        Días Inactivos
                    </ZenCardTitle>
                    <div className="p-2 bg-red-900/20 rounded-full">
                        <XCircle className="h-4 w-4 text-red-400" />
                    </div>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-red-400">{horariosInactivos}</div>
                        <div className="text-sm text-zinc-500">
                            {100 - porcentajeActivos}% del total
                        </div>
                    </div>
                    {horariosInactivos > 0 && (
                        <div className="mt-2 text-xs text-zinc-500">
                            No aparecen en tu perfil público
                        </div>
                    )}
                </ZenCardContent>
            </ZenCard>

            {/* Total Días */}
            <ZenCard variant="default" padding="md" className="hover:bg-zinc-800/30 transition-colors duration-200">
                <ZenCardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <ZenCardTitle className="text-sm font-medium text-zinc-300">
                        Total Días
                    </ZenCardTitle>
                    <div className="p-2 bg-blue-900/20 rounded-full">
                        <Calendar className="h-4 w-4 text-blue-400" />
                    </div>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-white">{totalHorarios}</div>
                        <div className="text-sm text-zinc-500">
                            de 7 días
                        </div>
                    </div>
                    <div className="mt-2 text-xs text-zinc-500">
                        Horarios configurados
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
