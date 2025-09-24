'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { HorariosStats } from './components/HorariosStats';
import { HorariosList } from './components/HorariosList';
import { Horario } from './types';
import {
    obtenerHorariosStudio,
    toggleHorarioEstado,
    actualizarHorario,
    crearHorario,
    obtenerEstadisticasHorarios,
    inicializarHorariosPorDefecto
} from '@/lib/actions/studio/config/horarios.actions';

export default function HorariosPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    // Datos iniciales de horarios (ya no se usan, se cargan desde la base de datos)
    // const initialHorarios: Horario[] = [];

    useEffect(() => {
        loadData();
    }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

    const loadData = async (isRetry = false) => {
        try {
            if (!isRetry) {
                setLoading(true);
                setError(null);
                setRetryCount(0);
            }

            // Cargar horarios usando Server Actions
            const horariosData = await obtenerHorariosStudio(slug);

            // Si no hay horarios, inicializar con valores por defecto
            if (horariosData.length === 0) {
                await inicializarHorariosPorDefecto(slug);
                const horariosInicializados = await obtenerHorariosStudio(slug);
                setHorarios(horariosInicializados);
            } else {
                setHorarios(horariosData);
            }
        } catch (err) {
            console.error('Error al cargar horarios:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los horarios';

            // Si es un error de conexión y no hemos reintentado mucho, intentar de nuevo
            if (retryCount < 3 && (errorMessage.includes('conexión') || errorMessage.includes('database') || errorMessage.includes('server'))) {
                setRetryCount(prev => prev + 1);
                setTimeout(() => {
                    loadData(true);
                }, 2000 * retryCount); // Reintento con delay incremental
                return;
            }

            setError(errorMessage);
            if (!isRetry) {
                toast.error(errorMessage);
            }
        } finally {
            if (!isRetry) {
                setLoading(false);
            }
        }
    };


    const handleToggleActive = async (id: string, activo: boolean) => {
        try {
            // Actualizar optimísticamente
            setHorarios(prev => prev.map(h =>
                h.id === id ? { ...h, activo } : h
            ));

            // Si es un horario temporal, crear uno nuevo
            if (id.startsWith('temp-')) {
                const horario = horarios.find(h => h.id === id);
                if (horario) {
                    const nuevoHorario = await crearHorario(slug, {
                        dia_semana: horario.dia_semana as "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo",
                        hora_inicio: horario.hora_inicio,
                        hora_fin: horario.hora_fin,
                        activo: activo,
                    });

                    // Reemplazar el horario temporal con el real
                    setHorarios(prev => prev.map(h =>
                        h.id === id ? { ...nuevoHorario } : h
                    ));
                }
            } else {
                // Llamar Server Action para horarios existentes
                await toggleHorarioEstado(id, { id, activo });
            }

            toast.success(`Horario ${activo ? 'activado' : 'desactivado'} exitosamente`);
        } catch (err) {
            console.error('Error toggling horario:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado del horario';
            toast.error(errorMessage);

            // Revertir cambio optimístico
            setHorarios(prev => prev.map(h =>
                h.id === id ? { ...h, activo: !activo } : h
            ));
        }
    };

    const handleUpdateHorario = async (id: string, field: string, value: string) => {
        try {
            // Actualizar optimísticamente
            setHorarios(prev => prev.map(h =>
                h.id === id ? { ...h, [field]: value } : h
            ));

            // Si es un horario temporal, crear uno nuevo
            if (id.startsWith('temp-')) {
                const horario = horarios.find(h => h.id === id);
                if (horario) {
                    const nuevoHorario = await crearHorario(slug, {
                        dia_semana: horario.dia_semana as "lunes" | "martes" | "miercoles" | "jueves" | "viernes" | "sabado" | "domingo",
                        hora_inicio: horario.hora_inicio,
                        hora_fin: horario.hora_fin,
                        activo: horario.activo,
                    });

                    // Reemplazar el horario temporal con el real
                    setHorarios(prev => prev.map(h =>
                        h.id === id ? { ...nuevoHorario } : h
                    ));
                }
            } else {
                // Llamar Server Action para horarios existentes
                await actualizarHorario(id, { id, [field]: value });
            }

            toast.success('Horario actualizado exitosamente');
        } catch (err) {
            console.error('Error updating horario:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar horario';
            toast.error(errorMessage);

            // Recargar datos para revertir cambios
            loadData();
        }
    };


    if (error && !loading) {
        return (
            <div className="p-6">
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-6 text-center">
                        <div className="space-y-4">
                            <div className="text-red-400">
                                <RefreshCw className="h-12 w-12 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold mb-2">Error al cargar horarios</h3>
                                <p className="text-zinc-400">{error}</p>
                            </div>
                            <Button
                                onClick={() => loadData(true)}
                                variant="outline"
                                className="border-zinc-600 text-zinc-300 hover:bg-zinc-700"
                                disabled={retryCount >= 3}
                            >
                                <RefreshCw className="h-4 w-4 mr-2" />
                                {retryCount >= 3 ? 'Máximo de reintentos alcanzado' : 'Reintentar'}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Estadísticas */}
            <HorariosStats horarios={horarios} loading={loading} />

            {/* Lista de horarios */}
            <HorariosList
                horarios={horarios}
                onToggleActive={handleToggleActive}
                onUpdateHorario={handleUpdateHorario}
                loading={loading}
            />

            {/* Información de uso */}
            <Card className="bg-zinc-800 border-zinc-700">
                <CardHeader>
                    <CardTitle className="text-white">¿Dónde se usan estos horarios?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Landing Page</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Sección de horarios de atención</li>
                                <li>• Footer con información de contacto</li>
                                <li>• Formularios de contacto</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Portales y Comunicación</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Calendario de disponibilidad</li>
                                <li>• Programación de citas</li>
                                <li>• Notificaciones automáticas</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}