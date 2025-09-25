'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { ContactoStats } from './components/ContactoStats';
import { ContactoList } from './components/ContactoList';
import { ContactoModal } from './components/ContactoModal';
import { Telefono, TelefonoCreate, ContactoData } from './types';
import {
    obtenerContactoStudio,
    crearTelefono,
    actualizarTelefono,
    eliminarTelefono,
    toggleTelefonoEstado,
    actualizarContactoData
} from '@/lib/actions/studio/config/contacto.actions';
import { HeaderNavigation } from '@/components/ui/header-navigation';

export default function ContactoPage() {
    const params = useParams();
    const slug = params.slug as string;


    const [telefonos, setTelefonos] = useState<Telefono[]>([]);
    const [contactoData, setContactoData] = useState<ContactoData>({
        direccion: '',
        website: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [retryCount, setRetryCount] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTelefono, setEditingTelefono] = useState<Telefono | null>(null);

    // Los datos se cargan desde la base de datos, no hay datos hardcodeados

    useEffect(() => {
        if (slug && slug !== 'undefined') {
            loadData();
        }
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
            const data = await obtenerContactoStudio(slug);

            // Convertir tipos de string a tipos específicos
            const telefonosConTipos = (data.telefonos || []).map(telefono => ({
                id: telefono.id,
                projectId: telefono.projectId,
                numero: telefono.numero,
                tipo: telefono.tipo as 'principal' | 'whatsapp' | 'emergencia' | 'oficina',
                activo: telefono.activo,
                createdAt: telefono.createdAt,
                updatedAt: telefono.updatedAt
            }));

            setTelefonos(telefonosConTipos);
            setContactoData(data.contactoData || { direccion: '', website: '' });
        } catch (err) {
            console.error('❌ Error loading contacto data:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido al cargar los datos de contacto';

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

    const handleOpenModal = (telefono?: Telefono) => {
        setEditingTelefono(telefono || null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingTelefono(null);
    };

    const handleSaveTelefono = async (data: TelefonoCreate, editingTelefono?: Telefono) => {
        try {
            if (editingTelefono) {
                // Actualizar teléfono existente usando Server Actions
                const telefonoActualizado = await actualizarTelefono(editingTelefono.id, {
                    id: editingTelefono.id,
                    ...data,
                });

                setTelefonos(prev => prev.map(t =>
                    t.id === editingTelefono.id ? {
                        ...telefonoActualizado,
                        tipo: telefonoActualizado.tipo as 'principal' | 'whatsapp' | 'emergencia' | 'oficina'
                    } : t
                ));

                toast.success('Teléfono actualizado exitosamente');
            } else {
                // Crear nuevo teléfono usando Server Actions
                const nuevoTelefono = await crearTelefono(slug, {
                    ...data,
                    activo: data.activo ?? true,
                });
                setTelefonos(prev => [...prev, {
                    ...nuevoTelefono,
                    tipo: nuevoTelefono.tipo as 'principal' | 'whatsapp' | 'emergencia' | 'oficina'
                }]);
                toast.success('Teléfono agregado exitosamente');
            }

            handleCloseModal();
        } catch (err) {
            console.error('Error saving telefono:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al guardar teléfono';
            toast.error(errorMessage);
        } finally {
            // Modal loading handled internally
        }
    };

    const handleDeleteTelefono = async (id: string) => {
        try {
            // Eliminar teléfono usando Server Actions
            await eliminarTelefono(id);
            setTelefonos(prev => prev.filter(t => t.id !== id));
            toast.success('Teléfono eliminado exitosamente');
        } catch (err) {
            console.error('Error deleting telefono:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar teléfono';
            toast.error(errorMessage);
        }
    };

    const handleToggleActive = async (id: string, activo: boolean) => {
        try {
            // Actualizar optimísticamente
            setTelefonos(prev => prev.map(t =>
                t.id === id ? { ...t, activo } : t
            ));

            // Llamar Server Action
            const telefonoActualizado = await toggleTelefonoEstado(id, { id, activo });

            // Actualizar con datos confirmados
            setTelefonos(prev => prev.map(t =>
                t.id === id ? {
                    ...telefonoActualizado,
                    tipo: telefonoActualizado.tipo as 'principal' | 'whatsapp' | 'emergencia' | 'oficina'
                } : t
            ));

            toast.success(`Teléfono ${activo ? 'activado' : 'desactivado'} exitosamente`);
        } catch (err) {
            console.error('Error toggling telefono:', err);
            const errorMessage = err instanceof Error ? err.message : 'Error al cambiar estado del teléfono';
            toast.error(errorMessage);

            // Revertir cambio optimístico
            setTelefonos(prev => prev.map(t =>
                t.id === id ? { ...t, activo: !activo } : t
            ));
        }
    };

    const handleUpdateContactoData = async (field: keyof ContactoData, value: string) => {
        try {
            setContactoData(prev => ({ ...prev, [field]: value }));
        } catch (err) {
            console.error('Error updating contacto data:', err);
            toast.error('Error al actualizar información');
        }
    };

    const handleSaveContactoData = async (field: keyof ContactoData, value: string) => {
        try {
            // Actualizar datos de contacto usando Server Actions
            const dataActualizada = await actualizarContactoData(slug, { field, value });

            // Actualizar el estado local con los datos confirmados
            setContactoData(prev => ({ ...prev, ...dataActualizada }));
        } catch (err) {
            console.error('Error saving contacto data:', err);
            throw err; // Re-lanzar para que el componente hijo maneje el toast
        }
    };

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
                            <RefreshCw className="h-4 w-4 mr-2" />
                            {retryCount >= 3 ? 'Máximo de reintentos alcanzado' : 'Reintentar'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

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

                {/* Lista de Contacto Skeleton */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <div className="animate-pulse">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="h-6 bg-zinc-700 rounded w-1/3 mb-2"></div>
                                <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                            </div>
                            <div className="h-10 bg-zinc-700 rounded w-32"></div>
                        </div>

                        {/* Datos de contacto skeleton */}
                        <div className="space-y-4 mb-6">
                            <div className="h-16 bg-zinc-700 rounded"></div>
                            <div className="h-16 bg-zinc-700 rounded"></div>
                        </div>

                        {/* Teléfonos skeleton */}
                        <div className="space-y-3">
                            <div className="h-4 bg-zinc-700 rounded w-1/4 mb-4"></div>
                            <div className="space-y-2">
                                <div className="h-12 bg-zinc-700 rounded"></div>
                                <div className="h-12 bg-zinc-700 rounded"></div>
                                <div className="h-12 bg-zinc-700 rounded"></div>
                            </div>
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

    return (
        <div className="p-6 space-y-6 max-w-screen-lg mx-auto mb-16">

            <HeaderNavigation
                title="Contacto"
                description="Gestiona los datos de contacto de tu estudio"
            />

            {/* Estadísticas */}
            <ContactoStats
                telefonos={telefonos}
                contactoData={contactoData}
                loading={loading}
            />

            {/* Lista de contacto */}
            <ContactoList
                telefonos={telefonos}
                contactoData={contactoData}
                onAddTelefono={() => handleOpenModal()}
                onEditTelefono={handleOpenModal}
                onDeleteTelefono={handleDeleteTelefono}
                onToggleActive={handleToggleActive}
                onUpdateContactoData={handleUpdateContactoData}
                onSaveContactoData={handleSaveContactoData}
                loading={loading}
            />

            {/* Modal para crear/editar teléfonos */}
            <ContactoModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveTelefono}
                editingTelefono={editingTelefono}
            />

            {/* Información de uso */}
            <Card className="bg-zinc-900/50 border-zinc-800">
                <CardHeader>
                    <CardTitle className="text-white">¿Dónde se usa esta información?</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Landing Page</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Footer con información de contacto</li>
                                <li>• Formularios de contacto</li>
                                <li>• Botones de WhatsApp</li>
                            </ul>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-white font-medium">Portales y Comunicación</h4>
                            <ul className="text-sm text-zinc-400 space-y-1">
                                <li>• Cotizaciones y propuestas</li>
                                <li>• Emails y notificaciones</li>
                                <li>• Documentos oficiales</li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
