'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HorariosItem } from './HorariosItem';
import { Horario } from '../types';

interface HorariosListProps {
    horarios: Horario[];
    onToggleActive: (id: string, activo: boolean) => void;
    onUpdateHorario: (id: string, field: string, value: string) => void;
    loading?: boolean;
}

export function HorariosList({
    horarios,
    onToggleActive,
    onUpdateHorario,
    loading
}: HorariosListProps) {
    return (
        <Card className="bg-zinc-800 border-zinc-700">
            <CardHeader>
                <CardTitle className="text-white">Horarios por Día de la Semana</CardTitle>
                <CardDescription className="text-zinc-400">
                    Configura los horarios de atención para cada día
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {loading ? (
                    <div className="space-y-3">
                        {[...Array(7)].map((_, i) => (
                            <div key={i} className="animate-pulse">
                                <div className="h-16 bg-zinc-700 rounded-lg"></div>
                            </div>
                        ))}
                    </div>
                ) : horarios.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-zinc-400">No hay horarios configurados</p>
                        <p className="text-zinc-500 text-sm mt-2">
                            Los horarios se configuran automáticamente para todos los días de la semana
                        </p>
                    </div>
                ) : (
                    horarios.map((horario) => (
                        <HorariosItem
                            key={horario.id}
                            horario={horario}
                            onToggleActive={onToggleActive}
                            onUpdateHorario={onUpdateHorario}
                        />
                    ))
                )}
            </CardContent>
        </Card>
    );
}
