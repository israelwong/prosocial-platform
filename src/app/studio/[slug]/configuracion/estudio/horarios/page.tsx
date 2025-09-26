'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { RefreshCw, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { HorariosStatsZen } from './components/HorariosStatsZen';
import { HorariosListZen } from './components/HorariosListZen';
import { Horario } from './types';
import {
    obtenerHorariosStudio,
    toggleHorarioEstado,
    actualizarHorario,
    crearHorario,
    inicializarHorariosPorDefecto
} from '@/lib/actions/studio/config/horarios.actions';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';

/**
 * HorariosPageZen - Página refactorizada usando ZEN Design System
 * 
 * Mejoras sobre la versión original:
 * - ✅ ZenCard unificados en lugar de Card de Shadcn
 * - ✅ Consistencia visual con tema ZEN
 * - ✅ Componentes refactorizados con ZEN
 * - ✅ Espaciado consistente con design tokens
 * - ✅ Mejor organización de componentes
 */
export default function HorariosPageZen() {
    const params = useParams();
    const slug = params.slug as string;

    const [horarios, setHorarios] = useState<Horario[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

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
            console.error('❌ Error loading horarios data:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los datos de horarios';

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

    const handleToggleHorario = async (id: string, activo: boolean) => {
        try {
            // Actualizar optimísticamente
            setHorarios(prev => prev.map(h =>
                h.id === id ? { ...h, activo } : h
            ));

            // Llamar Server Action
            await toggleHorarioEstado(id, { id, activo });

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

    const handleUpdateHorario = async (id: string, data: { dia_semana: string; hora_inicio: string; hora_fin: string }) => {
        try {
            // Actualizar optimísticamente
            setHorarios(prev => prev.map(h =>
                h.id === id ? { ...h, ...data } : h
            ));

            // Llamar Server Action
            await actualizarHorario(id, { id, ...data });

            toast.success('Horario actualizado exitosamente');
        } catch (err) {
            console.error('Error updating horario:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar horario';
            toast.error(errorMessage);

            // Revertir cambio optimístico
            loadData();
        }
    };

    const handleAddHorario = async (data: { dia_semana: string; hora_inicio: string; hora_fin: string }) => {
        try {
            // Crear nuevo horario
            const nuevoHorario = await crearHorario(slug, data);
            setHorarios(prev => [...prev, nuevoHorario]);
            toast.success('Horario agregado exitosamente');
        } catch (err) {
            console.error('Error creating horario:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al crear horario';
            toast.error(errorMessage);
        }
    };

    if (error && !loading) {
        return (
            <div className="p-6">
                <ZenCard variant="default" padding="lg">
                    <div className="text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <ZenButton
                            onClick={() => loadData(false)}
                            variant="outline"
                            disabled={retryCount >= 3}
                        >
                            <RefreshCw className="h-4 w-4 mr-2" />
                            {retryCount >= 3 ? 'Máximo de reintentos alcanzado' : 'Reintentar'}
                        </ZenButton>
                    </div>
                </ZenCard>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
                {/* Header Navigation Skeleton */}
                <ZenCard variant="default" padding="lg">
                    <div className="animate-pulse">
                        <div className="h-8 bg-zinc-700 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                    </div>
                </ZenCard>

                {/* Estadísticas Skeleton */}
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map((i) => (
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

                {/* Lista de Horarios Skeleton */}
                <ZenCard variant="default" padding="lg">
                    <div className="animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="h-6 bg-zinc-700 rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                            </div>
                            <div className="h-10 bg-zinc-700 rounded w-32"></div>
                        </div>

                        <div className="space-y-3">
                            <div className="h-16 bg-zinc-700 rounded"></div>
                            <div className="h-16 bg-zinc-700 rounded"></div>
                            <div className="h-16 bg-zinc-700 rounded"></div>
                        </div>
                    </div>
                </ZenCard>

                {/* Información de uso Skeleton */}
                <ZenCard variant="default" padding="lg">
                    <div className="animate-pulse">
                        <div className="h-6 bg-zinc-700 rounded w-1/3 mb-4"></div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <div className="h-5 bg-zinc-700 rounded w-1/4"></div>
                                <div className="space-y-1">
                                    <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                                    <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-5 bg-zinc-700 rounded w-1/4"></div>
                                <div className="space-y-1">
                                    <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                                    <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ZenCard>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
            <HeaderNavigation
                title="Horarios de Atención"
                description="Configura los horarios de atención de tu estudio"
            />

            {/* Estadísticas */}
            <HorariosStatsZen
                horarios={horarios}
                loading={loading}
            />

            {/* Lista de horarios */}
            <HorariosListZen
                horarios={horarios}
                onToggleHorario={handleToggleHorario}
                onUpdateHorario={handleUpdateHorario}
                onAddHorario={handleAddHorario}
                loading={loading}
            />

            {/* Información de uso */}
            <ZenCard variant="default" padding="lg">
                <ZenCardHeader>
                    <ZenCardTitle>¿Dónde se usa esta información?</ZenCardTitle>
                </ZenCardHeader>
                <ZenCardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Landing Page</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Sección de horarios de atención</li>
                                <li>• Información de contacto</li>
                                <li>• Footer con horarios</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Portales y Comunicación</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Perfil público del estudio</li>
                                <li>• Formularios de contacto</li>
                                <li>• Integración con CRM</li>
                            </ul>
                        </div>
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
