'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { HeaderNavigation } from '@/components/ui/header-navigation';

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
            <div className="p-6 flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-zinc-400">Cargando redes sociales...</p>
                </div>
            </div>
        );
    }

    // Mostrar error
    if (error) {
        return (
            <div className="p-6">
                <Card className="bg-red-900/20 border-red-500">
                    <CardContent className="p-6">
                        <div className="text-center">
                            <p className="text-red-400 mb-2">{error}</p>
                            {retryCount > 0 && (
                                <p className="text-zinc-500 text-sm mb-4">
                                    Reintentos: {retryCount}/3
                                </p>
                            )}
                            <Button onClick={() => loadData(false)} variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                                <Globe className="h-4 w-4 mr-2" />
                                Reintentar
                            </Button>
                        </div>
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
            <Card className="bg-zinc-800 border-zinc-700">
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
