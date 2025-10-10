'use client';

import React from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { Clock, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { Horario } from '@/lib/actions/schemas/horarios-schemas';

interface HorariosStatsZenProps {
    horarios: Horario[];
    loading?: boolean;
}

export function HorariosStatsZen({ horarios, loading = false }: HorariosStatsZenProps) {
    if (loading) {
        return (
            <ZenCard variant="default" padding="lg">
                <ZenCardHeader>
                    <ZenCardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Estadísticas de Horarios
                    </ZenCardTitle>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
                                <div className="h-8 bg-zinc-700 rounded w-1/2"></div>
                            </div>
                        ))}
                    </div>
                </ZenCardContent>
            </ZenCard>
        );
    }

    const totalHorarios = horarios.length;
    const horariosActivos = horarios.filter(h => h.is_active).length;
    const horariosInactivos = totalHorarios - horariosActivos;
    const diasConHorarios = new Set(horarios.filter(h => h.is_active).map(h => h.day_of_week)).size;

    return (
        <ZenCard variant="default" padding="lg">
            <ZenCardHeader>
                <ZenCardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Estadísticas de Horarios
                </ZenCardTitle>
            </ZenCardHeader>
            <ZenCardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total de horarios */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm">Total de horarios</span>
                        </div>
                        <div className="text-2xl font-bold text-white">
                            {totalHorarios}
                        </div>
                    </div>

                    {/* Horarios activos */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <span className="text-sm">Horarios activos</span>
                        </div>
                        <div className="text-2xl font-bold text-green-500">
                            {horariosActivos}
                        </div>
                    </div>

                    {/* Días con horarios */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400">
                            <Clock className="h-4 w-4 text-blue-500" />
                            <span className="text-sm">Días con horarios</span>
                        </div>
                        <div className="text-2xl font-bold text-blue-500">
                            {diasConHorarios}
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                {horariosInactivos > 0 && (
                    <div className="mt-4 p-3 bg-zinc-800/50 rounded-lg border border-zinc-700">
                        <div className="flex items-center gap-2 text-amber-400">
                            <XCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">
                                {horariosInactivos} horario{horariosInactivos !== 1 ? 's' : ''} inactivo{horariosInactivos !== 1 ? 's' : ''}
                            </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-1">
                            Los horarios inactivos no se mostrarán en tu página pública
                        </p>
                    </div>
                )}
            </ZenCardContent>
        </ZenCard>
    );
}