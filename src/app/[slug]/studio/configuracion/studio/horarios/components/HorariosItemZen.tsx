'use client';

import React, { useState } from 'react';
import { ZenInput } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { ZenBadge } from '@/components/ui/zen';
import { Switch } from '@/components/ui/shadcn/switch';
import { Clock, Save } from 'lucide-react';
import { Horario, DIAS_SEMANA_OPTIONS } from '@/lib/actions/schemas/horarios-schemas';

interface HorariosItemZenProps {
    horario: Horario;
    onToggleActive: (id: string, is_active: boolean) => void; // Actualizado: activo → is_active
    onUpdateHorario: (id: string, data: { day_of_week: string; start_time: string; end_time: string }) => void; // Actualizado: dia_semana → day_of_week, hora_inicio → start_time, hora_fin → end_time
    onAddHorario: (data: { day_of_week: string; start_time: string; end_time: string; is_active: boolean }) => void; // Actualizado: dia_semana → day_of_week, hora_inicio → start_time, hora_fin → end_time, activo → is_active
}

export function HorariosItemZen({
    horario,
    onToggleActive,
    onUpdateHorario,
    onAddHorario
}: HorariosItemZenProps) {
    const [localHorario, setLocalHorario] = useState({
        start_time: horario.start_time, // Actualizado: hora_inicio → start_time
        end_time: horario.end_time // Actualizado: hora_fin → end_time
    });
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const getDiaLabel = (dia: string) => {
        return DIAS_SEMANA_OPTIONS.find(d => d.value === dia)?.label || dia; // Actualizado: DIAS_SEMANA → DIAS_SEMANA_OPTIONS
    };

    const isNewHorario = horario.id.startsWith('temp-');

    const handleToggleHorario = async () => {
        if (!isNewHorario) {
            await onToggleActive(horario.id, !horario.is_active); // Actualizado: activo → is_active
        }
    };

    const validateTime = (startTime: string, endTime: string) => { // Actualizado: horaInicio → startTime, horaFin → endTime
        if (!startTime || !endTime) return true;
        return startTime < endTime;
    };

    const isTimeValid = validateTime(localHorario.start_time, localHorario.end_time); // Actualizado: hora_inicio → start_time, hora_fin → end_time

    const handleSave = async () => {
        if (!isTimeValid) return;

        setSaving(true);
        try {
            if (isNewHorario) {
                await onAddHorario({
                    day_of_week: horario.day_of_week, // Actualizado: dia_semana → day_of_week
                    start_time: localHorario.start_time, // Actualizado: hora_inicio → start_time
                    end_time: localHorario.end_time, // Actualizado: hora_fin → end_time
                    is_active: true // Actualizado: activo → is_active
                });
            } else {
                await onUpdateHorario(horario.id, {
                    day_of_week: horario.day_of_week, // Actualizado: dia_semana → day_of_week
                    start_time: localHorario.start_time, // Actualizado: hora_inicio → start_time
                    end_time: localHorario.end_time // Actualizado: hora_fin → end_time
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
            start_time: horario.start_time, // Actualizado: hora_inicio → start_time
            end_time: horario.end_time // Actualizado: hora_fin → end_time
        });
        setIsEditing(false);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    return (
        <div className={`p-4 bg-zinc-900/30 rounded-lg border transition-all duration-200 hover:bg-zinc-900/50 ${horario.is_active // Actualizado: activo → is_active
            ? 'border-zinc-700 hover:border-zinc-600'
            : 'border-zinc-800 opacity-60 hover:opacity-80'
            } ${isNewHorario ? 'border-dashed border-blue-600/50 bg-blue-900/10' : ''}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Día de la semana */}
                    <div className="w-24">
                        <p className="text-white font-medium text-lg">{getDiaLabel(horario.day_of_week)}</p> {/* Actualizado: dia_semana → day_of_week */}
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
                                    value={localHorario.start_time} // Actualizado: hora_inicio → start_time
                                    onChange={(e) => setLocalHorario(prev => ({ ...prev, start_time: e.target.value }))} // Actualizado: hora_inicio → start_time
                                    className={`w-32 ${!isTimeValid ? 'border-red-500' : ''}`}
                                />
                                <span className="text-zinc-400">-</span>
                                <ZenInput
                                    type="time"
                                    label=""
                                    value={localHorario.end_time} // Actualizado: hora_fin → end_time
                                    onChange={(e) => setLocalHorario(prev => ({ ...prev, end_time: e.target.value }))} // Actualizado: hora_fin → end_time
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
                                    {horario.start_time} - {horario.end_time} {/* Actualizado: hora_inicio → start_time, hora_fin → end_time */}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-3">
                    {/* Estado - indicador sutil */}
                    <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${horario.is_active ? 'bg-green-400' : 'bg-zinc-500'}`} /> {/* Actualizado: activo → is_active */}
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
                                            checked={horario.is_active} // Actualizado: activo → is_active
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
