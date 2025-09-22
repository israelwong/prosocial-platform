'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HorariosItem } from './HorariosItem';
import { Horario } from '../types';
import { DIAS_SEMANA } from '../types';

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
    // Crear un mapa de horarios por día para acceso rápido
    const horariosPorDia = new Map(
        horarios.map(horario => [horario.dia_semana, horario])
    );

    // Crear horarios para todos los días de la semana
    const todosLosDias = DIAS_SEMANA.map(dia => {
        const horarioExistente = horariosPorDia.get(dia.value);
        return horarioExistente || {
            id: `temp-${dia.value}`,
            projectId: '',
            dia_semana: dia.value,
            hora_inicio: '09:00',
            hora_fin: '18:00',
            activo: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
    });

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
                ) : (
                    todosLosDias.map((horario) => (
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
