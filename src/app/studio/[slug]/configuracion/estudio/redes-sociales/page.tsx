'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/shadcn/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/shadcn/card';
import { Globe, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { RedSocialStats } from './components/RedSocialStats';
import { RedSocialList } from './components/RedSocialList';
import { RedSocialModal } from './components/RedSocialModal';
import { Plataforma, RedSocial } from './types';
import {
    obtenerRedesSocialesStudio,
    crearRedSocial,
    actualizarRedSocial,
    eliminarRedSocial,
    toggleRedSocialEstado
} from '@/lib/actions/studio/config/redes-sociales.actions';
import { obtenerPlataformasRedesSociales } from '@/lib/actions/shared/plataformas.actions';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';

export default function RedesSocialesPage() {
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

            // Cargar plataformas disponibles y redes sociales en paralelo usando Server Actions
            const [plataformasData, redesData] = await Promise.all([
                obtenerPlataformasRedesSociales(),
                obtenerRedesSocialesStudio(slug)
            ]);

            setPlataformas(plataformasData);
            setRedes(redesData);
        } catch (err) {
            console.error('Error al cargar datos:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los datos';

            // Si es un error de conexión y no hemos reintentado mucho, intentar de nuevo
            if (retryCount < 3 && (errorMessage.includes('conexión') || errorMessage.includes('database') || errorMessage.includes('server'))) {
                setRetryCount(prev => prev + 1);
                setTimeout(() => {
                    loadData(true);
                }, 2000 * retryCount); // Reintento con delay incremental
                return;
            }

            setError(errorMessage);
        } finally {
            if (!isRetry) {
                setLoading(false);
            }
        }
    };

    const validateUrl = (url: string): boolean => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    // Funciones del modal
    const handleOpenModal = (red?: RedSocial) => {
        setEditingRed(red || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingRed(null);
    };

    const handleSaveRedSocial = async (data: { plataformaId: string; url: string; activo: boolean }) => {
        setModalLoading(true);

        try {
            if (editingRed) {
                // Actualizar red social existente usando Server Action
                const redActualizada = await actualizarRedSocial(editingRed.id, {
                    id: editingRed.id,
                    url: data.url,
                    activo: data.activo,
                });

                setRedes(prev => prev.map(r => r.id === editingRed.id ? redActualizada : r));
                toast.success('Red social actualizada exitosamente');
            } else {
                // Crear nueva red social usando Server Action
                const nuevaRedSocial = await crearRedSocial(slug, {
                    plataformaId: data.plataformaId,
                    url: data.url,
                    activo: data.activo,
                });

                setRedes(prev => [...prev, nuevaRedSocial]);
                toast.success('Red social agregada exitosamente');
            }
        } catch (err) {
            console.error('Error saving red social:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            toast.error(errorMessage);
            throw err; // Re-throw para que el modal maneje el error
        } finally {
            setModalLoading(false);
        }
    };

    const handleDeleteRed = async (id: string) => {
        try {
            // Eliminar red social usando Server Action
            await eliminarRedSocial(id);

            setRedes(prev => prev.filter(r => r.id !== id));
            toast.success('Red social eliminada exitosamente');

        } catch (err) {
            console.error('Error al eliminar red social:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar la red social';
            toast.error(errorMessage);
        }
    };

    const handleToggleActive = async (id: string, activo: boolean) => {
        try {
            // Toggle estado usando Server Action
            const redActualizada = await toggleRedSocialEstado(id, {
                id,
                activo,
            });

            setRedes(prev => prev.map(r => r.id === id ? redActualizada : r));
            toast.success(`Red social ${activo ? 'activada' : 'desactivada'} exitosamente`);

        } catch (err) {
            console.error('Error al actualizar estado:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el estado de la red social';
            toast.error(errorMessage);
        }
    };


    // Mostrar loading
    if (loading) {
        return (
            <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">
                {/* Header Navigation Skeleton */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-zinc-700 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                    </div>
                </div>

                {/* Estadísticas Skeleton */}
                <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                        <div className="animate-pulse">
                            <div className="flex items-center space-x-2">
                                <div className="h-5 w-5 bg-zinc-700 rounded"></div>
                                <div>
                                    <div className="h-6 bg-zinc-700 rounded w-8 mb-1"></div>
                                    <div className="h-4 bg-zinc-700 rounded w-20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                        <div className="animate-pulse">
                            <div className="flex items-center space-x-2">
                                <div className="h-5 w-5 bg-zinc-700 rounded"></div>
                                <div>
                                    <div className="h-6 bg-zinc-700 rounded w-8 mb-1"></div>
                                    <div className="h-4 bg-zinc-700 rounded w-20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4">
                        <div className="animate-pulse">
                            <div className="flex items-center space-x-2">
                                <div className="h-5 w-5 bg-zinc-700 rounded"></div>
                                <div>
                                    <div className="h-6 bg-zinc-700 rounded w-8 mb-1"></div>
                                    <div className="h-4 bg-zinc-700 rounded w-20"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Lista de Redes Sociales Skeleton */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <div className="animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="h-6 bg-zinc-700 rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                            </div>
                            <div className="h-10 bg-zinc-700 rounded w-36"></div>
                        </div>

                        {/* Redes sociales skeleton */}
                        <div className="space-y-3">
                            <div className="h-12 bg-zinc-700 rounded"></div>
                            <div className="h-12 bg-zinc-700 rounded"></div>
                            <div className="h-12 bg-zinc-700 rounded"></div>
                        </div>
                    </div>
                </div>

                {/* Información de uso Skeleton */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
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
                </div>
            </div>
        );
    }

    // Mostrar error
    if (error && !loading) {
        return (
            <div className="p-6">
                <Card className="bg-zinc-800 border-zinc-700">
                    <CardContent className="p-6 text-center">
                        <p className="text-red-400 mb-4">{error}</p>
                        <Button
                            onClick={() => loadData(false)}
                            variant="outline"
                            disabled={retryCount >= 3}
                        >
                            <Globe className="h-4 w-4 mr-2" />
                            {retryCount >= 3 ? 'Máximo de reintentos alcanzado' : 'Reintentar'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">

            <HeaderNavigation
                title="Redes Sociales"
                description="Gestiona tus redes sociales y sitios web"
            />

            {/* Estadísticas */}
            <RedSocialStats redes={redes} />

            {/* Lista de redes sociales */}
            <RedSocialList
                redes={redes}
                plataformas={plataformas}
                onEditRed={handleOpenModal}
                onDeleteRed={handleDeleteRed}
                onToggleActive={handleToggleActive}
                onAddRedSocial={() => handleOpenModal()}
                validateUrl={validateUrl}
            />

            {/* Información de uso */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">¿Dónde se usan estas redes sociales?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Landing Page</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Footer con enlaces a redes sociales</li>
                                <li>• Botones de compartir en redes</li>
                                <li>• Sección de contacto</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Portales y Comunicación</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Emails con enlaces a redes</li>
                                <li>• Documentos y propuestas</li>
                                <li>• Integración con redes sociales</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Modal para crear/editar red social */}
            <RedSocialModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveRedSocial}
                plataformas={plataformas}
                redSocial={editingRed}
                loading={modalLoading}
            />
        </div>
    );
}
