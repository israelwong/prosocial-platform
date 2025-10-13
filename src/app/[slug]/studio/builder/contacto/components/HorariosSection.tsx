'use client';

import React, { useState, useEffect } from 'react';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { Clock } from 'lucide-react';
import { Horario } from '../types';
import { obtenerHorariosStudio, toggleHorarioEstado, actualizarHorario, inicializarHorariosPorDefecto } from '@/lib/actions/studio/config/contacto';
import { toast } from 'sonner';

interface HorariosSectionProps {
    studioSlug: string;
    onLocalUpdate: (data: Partial<{ horarios: Horario[] }>) => void;
}

export function HorariosSection({ studioSlug, onLocalUpdate }: HorariosSectionProps) {
    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [loadingHorarios, setLoadingHorarios] = useState(false);

    // Cargar horarios desde el servidor
    useEffect(() => {
        const loadHorarios = async () => {
            setLoadingHorarios(true);
            try {
                const result = await obtenerHorariosStudio(studioSlug);

                // Si no hay horarios, inicializar con valores por defecto
                if (Array.isArray(result) && result.length === 0) {
                    await inicializarHorariosPorDefecto(studioSlug);
                    const horariosInicializados = await obtenerHorariosStudio(studioSlug);
                    const horariosConvertidos: Horario[] = horariosInicializados.map((h: Record<string, unknown>): Horario => ({
                        id: h.id as string,
                        dia: h.day_of_week as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
                        apertura: h.start_time as string,
                        cierre: h.end_time as string,
                        cerrado: !(h.is_active as boolean),
                        order: h.order as number || 0
                    }));
                    setHorarios(horariosConvertidos);
                    onLocalUpdate({ horarios: horariosConvertidos });
                } else if (Array.isArray(result)) {
                    const horariosConvertidos: Horario[] = result.map((h: Record<string, unknown>): Horario => ({
                        id: h.id as string,
                        dia: h.day_of_week as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
                        apertura: h.start_time as string,
                        cierre: h.end_time as string,
                        cerrado: !(h.is_active as boolean),
                        order: h.order as number || 0
                    }));
                    setHorarios(horariosConvertidos);
                    onLocalUpdate({ horarios: horariosConvertidos });
                }
            } catch (error) {
                console.error('Error loading horarios:', error);
                toast.error('Error al cargar horarios');
            } finally {
                setLoadingHorarios(false);
            }
        };

        if (studioSlug) {
            loadHorarios();
        }
    }, [studioSlug]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleHorarioUpdate = async (id: string, field: 'start_time' | 'end_time', value: string) => {
        const horario = horarios.find(h => h.id === id);
        if (!horario) return;

        try {
            // Actualizar optimísticamente
            const updated = horarios.map(h =>
                h.id === id
                    ? {
                        ...h,
                        apertura: field === 'start_time' ? value : h.apertura,
                        cierre: field === 'end_time' ? value : h.cierre
                    }
                    : h
            );
            setHorarios(updated);
            onLocalUpdate({ horarios: updated });

            // Llamar Server Action
            await actualizarHorario(id, {
                id,
                studio_slug: studioSlug,
                day_of_week: horario.dia,
                start_time: field === 'start_time' ? value : horario.apertura,
                end_time: field === 'end_time' ? value : horario.cierre,
                is_active: !horario.cerrado,
                order: horario.order || 0
            });

            toast.success('Horario actualizado exitosamente');
        } catch (error) {
            console.error('Error updating horario:', error);
            toast.error('Error al actualizar horario');

            // Revertir cambio optimístico - recargar desde el servidor
            try {
                const result = await obtenerHorariosStudio(studioSlug);
                if (Array.isArray(result)) {
                    const horariosConvertidos: Horario[] = result.map((h: Record<string, unknown>): Horario => ({
                        id: h.id as string,
                        dia: h.day_of_week as 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday',
                        apertura: h.start_time as string,
                        cierre: h.end_time as string,
                        cerrado: !(h.is_active as boolean),
                        order: h.order as number || 0
                    }));
                    setHorarios(horariosConvertidos);
                    onLocalUpdate({ horarios: horariosConvertidos });
                }
            } catch (reloadError) {
                console.error('Error reloading horarios:', reloadError);
            }
        }
    };

    const handleHorarioToggle = async (id: string, cerrado: boolean) => {
        try {
            const horario = horarios.find(h => h.id === id);
            if (!horario) return;

            // Actualizar optimísticamente
            const updated = horarios.map(h =>
                h.id === id ? { ...h, cerrado } : h
            );
            setHorarios(updated);
            onLocalUpdate({ horarios: updated });

            // Llamar Server Action
            await toggleHorarioEstado(id, {
                id,
                studio_slug: studioSlug,
                is_active: !cerrado
            });

            toast.success(`Horario ${cerrado ? 'desactivado' : 'activado'} exitosamente`);
        } catch (error) {
            console.error('Error toggling horario:', error);
            toast.error('Error al cambiar estado del horario');

            // Revertir cambio optimístico
            const reverted = horarios.map(h =>
                h.id === id ? { ...h, cerrado: !cerrado } : h
            );
            setHorarios(reverted);
            onLocalUpdate({ horarios: reverted });
        }
    };


    const diasSemana = [
        { key: 'monday', label: 'Lunes' },
        { key: 'tuesday', label: 'Martes' },
        { key: 'wednesday', label: 'Miércoles' },
        { key: 'thursday', label: 'Jueves' },
        { key: 'friday', label: 'Viernes' },
        { key: 'saturday', label: 'Sábado' },
        { key: 'sunday', label: 'Domingo' }
    ];


    return (
        <ZenCard variant="default" padding="none">
            <ZenCardHeader className="border-b border-zinc-800">
                <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-orange-400" />
                    <ZenCardTitle>Horarios de Atención</ZenCardTitle>
                </div>
            </ZenCardHeader>
            <ZenCardContent className="p-6">
                {loadingHorarios ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="h-6 w-6 animate-spin border-2 border-orange-500 border-t-transparent rounded-full"></div>
                        <span className="ml-2 text-zinc-400">Cargando horarios...</span>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {diasSemana.map((dia) => {
                            const horario = horarios.find(h => h.dia === dia.key);
                            return (
                                <div key={dia.key} className="flex items-center justify-between py-2 border-b border-zinc-800 last:border-b-0">
                                    <div className="flex items-center gap-3">
                                        <span className="text-zinc-300 font-medium w-20">{dia.label}</span>
                                        {horario ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="time"
                                                    value={horario.apertura}
                                                    onChange={(e) => handleHorarioUpdate(horario.id!, 'start_time', e.target.value)}
                                                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300"
                                                    disabled={horario.cerrado}
                                                />
                                                <span className="text-zinc-500">-</span>
                                                <input
                                                    type="time"
                                                    value={horario.cierre}
                                                    onChange={(e) => handleHorarioUpdate(horario.id!, 'end_time', e.target.value)}
                                                    className="bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-sm text-zinc-300"
                                                    disabled={horario.cerrado}
                                                />
                                            </div>
                                        ) : (
                                            <span className="text-zinc-500 text-sm">No configurado</span>
                                        )}
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={!horario?.cerrado}
                                            onChange={(e) => horario && handleHorarioToggle(horario.id!, !e.target.checked)}
                                            className="sr-only peer"
                                        />
                                        <div className="w-9 h-5 bg-zinc-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-600"></div>
                                    </label>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ZenCardContent>
        </ZenCard>
    );
}