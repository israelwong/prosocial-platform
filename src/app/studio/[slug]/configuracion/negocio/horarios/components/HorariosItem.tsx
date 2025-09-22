'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Horario, DIAS_SEMANA } from '../types';

interface HorariosItemProps {
    horario: Horario;
    onToggleActive: (id: string, activo: boolean) => void;
    onUpdateHorario: (id: string, field: string, value: string) => void;
}

export function HorariosItem({
    horario,
    onToggleActive,
    onUpdateHorario
}: HorariosItemProps) {
    const getDiaLabel = (dia: string) => {
        return DIAS_SEMANA.find(d => d.value === dia)?.label || dia;
    };

    const handleToggleHorario = async () => {
        await onToggleActive(horario.id, !horario.activo);
    };

    const validateTime = (horaInicio: string, horaFin: string) => {
        if (!horaInicio || !horaFin) return true;
        return horaInicio < horaFin;
    };

    const isTimeValid = validateTime(horario.hora_inicio, horario.hora_fin);

    return (
        <div className={`p-4 bg-zinc-800 rounded-lg border transition-colors ${horario.activo ? 'border-zinc-700' : 'border-zinc-800 opacity-60'
            }`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="w-24">
                        <p className="text-white font-medium">{getDiaLabel(horario.dia_semana)}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Input
                            type="time"
                            value={horario.hora_inicio}
                            onChange={(e) => onUpdateHorario(horario.id, 'hora_inicio', e.target.value)}
                            className={`bg-zinc-700 border-zinc-600 text-white w-32 ${!isTimeValid ? 'border-red-500' : ''
                                }`}
                            disabled={!horario.activo}
                        />
                        <span className="text-zinc-400">-</span>
                        <Input
                            type="time"
                            value={horario.hora_fin}
                            onChange={(e) => onUpdateHorario(horario.id, 'hora_fin', e.target.value)}
                            className={`bg-zinc-700 border-zinc-600 text-white w-32 ${!isTimeValid ? 'border-red-500' : ''
                                }`}
                            disabled={!horario.activo}
                        />
                        {!isTimeValid && (
                            <span className="text-red-400 text-xs">
                                Hora fin debe ser mayor
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={horario.activo}
                            onCheckedChange={handleToggleHorario}
                        />
                        <span className={`text-sm ${horario.activo ? 'text-green-400' : 'text-zinc-400'}`}>
                            {horario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
