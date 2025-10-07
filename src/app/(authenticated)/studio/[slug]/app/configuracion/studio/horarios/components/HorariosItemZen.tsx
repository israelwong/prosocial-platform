'use client';

import React, { useState } from 'react';
import { ZenInput } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { ZenBadge } from '@/components/ui/zen';
import { Switch } from '@/components/ui/shadcn/switch';
import { Clock, Save } from 'lucide-react';
import { Horario, DIAS_SEMANA } from '../types';
import { DiaSemana } from '@/lib/actions/schemas/horarios-schemas';

interface HorariosItemZenProps {
    horario: Horario;
    onToggleActive: (id: string, activo: boolean) => void;
    onUpdateHorario: (id: string, data: { dia_semana: DiaSemana; hora_inicio: string; hora_fin: string }) => void;
    onAddHorario: (data: { dia_semana: DiaSemana; hora_inicio: string; hora_fin: string; activo: boolean }) => void;
}

export function HorariosItemZen({
    horario,
    onToggleActive,
    onUpdateHorario,
    onAddHorario
}: HorariosItemZenProps) {
    const [localHorario, setLocalHorario] = useState({
        hora_inicio: horario.hora_inicio,
        hora_fin: horario.hora_fin
    });
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const getDiaLabel = (dia: string) => {
        return DIAS_SEMANA.find(d => d.value === dia)?.label || dia;
    };

    const isNewHorario = horario.id.startsWith('temp-');

    const handleToggleHorario = async () => {
        if (!isNewHorario) {
            await onToggleActive(horario.id, !horario.activo);
        }
    };

    const validateTime = (horaInicio: string, horaFin: string) => {
        if (!horaInicio || !horaFin) return true;
        return horaInicio < horaFin;
    };

    const isTimeValid = validateTime(localHorario.hora_inicio, localHorario.hora_fin);

    const handleSave = async () => {
        if (!isTimeValid) return;

        setSaving(true);
        try {
            if (isNewHorario) {
                await onAddHorario({
                    dia_semana: horario.dia_semana as DiaSemana,
                    hora_inicio: localHorario.hora_inicio,
                    hora_fin: localHorario.hora_fin,
                    activo: true
                });
            } else {
                await onUpdateHorario(horario.id, {
                    dia_semana: horario.dia_semana as DiaSemana,
                    hora_inicio: localHorario.hora_inicio,
                    hora_fin: localHorario.hora_fin
                });
            }
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving horario:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setLocalHorario({
            hora_inicio: horario.hora_inicio,
            hora_fin: horario.hora_fin
        });
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div className={`p-4 bg-zinc-900/30 rounded-lg border transition-all duration-200 hover:bg-zinc-900/50 ${horario.activo
            ? 'border-zinc-700 hover:border-zinc-600'
            : 'border-zinc-800 opacity-60 hover:opacity-80'
            } ${isNewHorario ? 'border-dashed border-blue-600/50 bg-blue-900/10' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Día de la semana */}
                    <div className="w-24">
                        <p className="text-white font-medium text-lg">{getDiaLabel(horario.dia_semana)}</p>
                        {isNewHorario && (
                            <ZenBadge variant="secondary" size="sm" className="text-xs">
                                Nuevo
                            </ZenBadge>
                        )}
                    </div>

                    {/* Horarios */}
                    <div className="flex items-center space-x-3">
                        {isEditing || isNewHorario ? (
                            <div className="flex items-center space-x-2">
                                <ZenInput
                                    type="time"
                                    label=""
                                    value={localHorario.hora_inicio}
                                    onChange={(e) => setLocalHorario(prev => ({ ...prev, hora_inicio: e.target.value }))}
                                    className={`w-32 ${!isTimeValid ? 'border-red-500' : ''}`}
                                />
                                <span className="text-zinc-400">-</span>
                                <ZenInput
                                    type="time"
                                    label=""
                                    value={localHorario.hora_fin}
                                    onChange={(e) => setLocalHorario(prev => ({ ...prev, hora_fin: e.target.value }))}
                                    className={`w-32 ${!isTimeValid ? 'border-red-500' : ''}`}
                                />
                                {!isTimeValid && (
                                    <span className="text-red-400 text-xs">
                                        Hora fin debe ser mayor
                                    </span>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Clock className="h-4 w-4 text-zinc-400" />
                                <span className="text-zinc-300 font-medium">
                                    {horario.hora_inicio} - {horario.hora_fin}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Estado - indicador sutil */}
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${horario.activo ? 'bg-green-400' : 'bg-zinc-500'}`} />
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center space-x-2">
                        {isEditing || isNewHorario ? (
                            <>
                                <ZenButton
                                    onClick={handleSave}
                                    variant="primary"
                                    size="sm"
                                    loading={saving}
                                    disabled={!isTimeValid || saving}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    <Save className="h-4 w-4 mr-1" />
                                    Guardar
                                </ZenButton>
                                <ZenButton
                                    onClick={handleCancel}
                                    variant="outline"
                                    size="sm"
                                    disabled={saving}
                                    className="hover:bg-zinc-700"
                                >
                                    Cancelar
                                </ZenButton>
                            </>
                        ) : (
                            <>
                                <ZenButton
                                    onClick={handleEdit}
                                    variant="outline"
                                    size="sm"
                                    className="border-zinc-600 text-zinc-400 hover:bg-zinc-700 hover:border-zinc-500 hover:text-zinc-300 transition-colors"
                                >
                                    Editar
                                </ZenButton>
                                {!isNewHorario && (
                                    <div className="flex items-center space-x-2">
                                        <Switch
                                            checked={horario.activo}
                                            onCheckedChange={handleToggleHorario}
                                            className="data-[state=checked]:bg-blue-600"
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
