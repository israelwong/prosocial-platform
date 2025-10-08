'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ZenCard, ZenCardContent, ZenCardHeader, ZenCardTitle } from '@/components/ui/zen';
import { ZenButton } from '@/components/ui/zen';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { RedSocialStatsZen } from './components/RedSocialStatsZen';
import { RedSocialListZenDnd } from './components/RedSocialListZenDnd';
import { RedSocialModalZen } from './components/RedSocialModalZen';
import { Plataforma, RedSocial } from './types';
import {
    obtenerRedesSocialesStudio,
    crearRedSocial,
    actualizarRedSocial,
    eliminarRedSocial,
    toggleRedSocialEstado,
    reordenarRedesSociales
} from '@/lib/actions/studio/config/redes-sociales.actions';
import { obtenerPlataformasRedesSociales } from '@/lib/actions/shared/plataformas.actions';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';

/**
 * RedesSocialesPageZen - Página refactorizada usando ZEN Design System
 * 
 * Mejoras sobre la versión original:
 * - ✅ ZenCard unificados en lugar de Card de Shadcn
 * - ✅ Consistencia visual con tema ZEN
 * - ✅ Componentes refactorizados con ZEN
 * - ✅ Espaciado consistente con design tokens
 * - ✅ Mejor organización de componentes
 */
export default function RedesSocialesPageZen() {
    const params = useParams();
    const slug = params.slug as string;

    const [redes, setRedes] = useState<RedSocial[]>([]);
    const [plataformas, setPlataformas] = useState<Plataforma[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);

    // Estados del modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingRed, setEditingRed] = useState<RedSocial | null>(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Cargar datos al montar el componente
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

            if (!slug || slug === 'undefined') {
                throw new Error('Slug no disponible');
            }

            // Cargar datos usando Server Actions
            const [redesData, plataformasData] = await Promise.all([
                obtenerRedesSocialesStudio(slug),
                obtenerPlataformasRedesSociales()
            ]);

            setRedes(redesData);
            setPlataformas(plataformasData);
        } catch (err) {
            console.error('❌ Error loading redes sociales data:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los datos de redes sociales';

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

    const handleOpenModal = (red?: RedSocial) => {
        setEditingRed(red || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRed(null);
    };

    const handleSaveRed = async (data: { plataformaId: string; url: string; activo?: boolean }) => {
        setModalLoading(true);
        try {
            console.log('🔍 Debug - editingRed:', editingRed);
            console.log('🔍 Debug - data:', data);

            if (editingRed) {
                console.log('📝 Actualizando red social existente:', editingRed.id);
                // Actualizar red social existente
                const redActualizada = await actualizarRedSocial(editingRed.id, {
                    id: editingRed.id,
                    ...data,
                });

                setRedes(prev => prev.map(r =>
                    r.id === editingRed.id ? redActualizada : r
                ));

                toast.success('Red social actualizada exitosamente');
            } else {
                console.log('➕ Creando nueva red social');
                // Crear nueva red social
                try {
                    const nuevaRed = await crearRedSocial(slug, { ...data, activo: true });
                    setRedes(prev => [...prev, nuevaRed]);
                    toast.success('Red social agregada exitosamente');
                } catch (createError) {
                    // Si falla por cuenta duplicada, buscar la red existente y abrir en modo edición
                    if (createError instanceof Error && createError.message.includes('cuenta activa')) {
                        const redExistente = redes.find(r => r.plataformaId === data.plataformaId && r.activo);
                        if (redExistente) {
                            toast.info('Ya tienes una cuenta de esta plataforma. Abriendo para editar...');
                            handleCloseModal();
                            // Abrir modal en modo edición con la red existente
                            setTimeout(() => {
                                handleOpenModal(redExistente);
                            }, 100);
                            return;
                        }
                    }
                    throw createError;
                }
            }

            handleCloseModal();
        } catch (err) {
            console.error('Error saving red social:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al guardar red social';
            toast.error(errorMessage);
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteRed = async (id: string) => {
        try {
            await eliminarRedSocial(id);
            setRedes(prev => prev.filter(r => r.id !== id));
            toast.success('Red social eliminada exitosamente');
        } catch (err) {
            console.error('Error deleting red social:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar red social';
            toast.error(errorMessage);
        }
    };

    const handleToggleActive = async (id: string, activo: boolean) => {
        try {
            // Actualizar optimísticamente
            setRedes(prev => prev.map(r =>
                r.id === id ? { ...r, activo } : r
            ));

            // Llamar Server Action
            const redActualizada = await toggleRedSocialEstado(id, { id, activo });

            // Actualizar con datos confirmados
            setRedes(prev => prev.map(r =>
                r.id === id ? redActualizada : r
            ));

            toast.success(`Red social ${activo ? 'activada' : 'desactivada'} exitosamente`);
        } catch (err) {
            console.error('Error toggling red social:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado de la red social';
            toast.error(errorMessage);

            // Revertir cambio optimístico
            setRedes(prev => prev.map(r =>
                r.id === id ? { ...r, activo: !activo } : r
            ));
        }
    };

    const handleReorderRedes = async (redesReordenadas: RedSocial[]) => {
        try {
            const redesConOrden = redesReordenadas.map((red, index) => ({
                id: red.id,
                order: index
            }));

            await reordenarRedesSociales(slug, redesConOrden);

            // Actualizar el estado local con el nuevo orden
            setRedes(redesReordenadas);
        } catch (err) {
            console.error('Error reordering redes sociales:', err);
            throw err;
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
                            <Loader2 className="h-4 w-4 mr-2" />
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

                {/* Lista de Redes Sociales Skeleton */}
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
                            <div className="h-12 bg-zinc-700 rounded"></div>
                            <div className="h-12 bg-zinc-700 rounded"></div>
                            <div className="h-12 bg-zinc-700 rounded"></div>
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
                title="Redes Sociales"
                description="Gestiona las redes sociales de tu estudio"
            />

            {/* Estadísticas */}
            <RedSocialStatsZen
                redes={redes}
                plataformas={plataformas}
                loading={loading}
            />

            {/* Lista de redes sociales */}
            <RedSocialListZenDnd
                redes={redes}
                plataformas={plataformas}
                onAddRed={() => handleOpenModal()}
                onEditRed={handleOpenModal}
                onDeleteRed={handleDeleteRed}
                onToggleActive={handleToggleActive}
                onReorderRedes={handleReorderRedes}
                loading={loading}
            />

            {/* Modal para crear/editar redes sociales */}
            <RedSocialModalZen
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRed}
                editingRed={editingRed}
                plataformas={plataformas}
                loading={modalLoading}
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
                                <li>• Enlaces en el footer</li>
                                <li>• Botones de redes sociales</li>
                                <li>• Sección de contacto</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Portales y Comunicación</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Perfil público del estudio</li>
                                <li>• Documentos y propuestas</li>
                                <li>• Integración con CRM</li>
                            </ul>
                        </div>
                    </div>
                </ZenCardContent>
            </ZenCard>
        </div>
    );
}
