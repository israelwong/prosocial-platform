'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Plus, Settings, Palette, Smile } from 'lucide-react';
import {
    ZenButton,
    ZenCard,
    ZenCardContent,
    ZenCardHeader,
    ZenCardTitle,
    ZenCardDescription,
    ZenBadge,
} from '@/components/ui/zen';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import { TiposEventoList } from './components/TiposEventoList';
import { TipoEventoForm } from './components/TipoEventoForm';
import { obtenerTiposEvento } from '@/lib/actions/studio/negocio/tipos-evento.actions';
import type { TipoEventoData } from '@/lib/actions/schemas/tipos-evento-schemas';

export default function TiposEventoPage() {
    const params = useParams();
    const slug = params.slug as string;

    const [loading, setLoading] = useState(true);
    const [tiposEvento, setTiposEvento] = useState<TipoEventoData[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTipo, setEditingTipo] = useState<TipoEventoData | null>(null);

    // Cargar datos iniciales
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setLoading(true);
                const result = await obtenerTiposEvento(slug);

                if (result.success && result.data) {
                    setTiposEvento(result.data);
                } else {
                    toast.error(result.error || 'Error al cargar tipos de evento');
                }
            } catch (error) {
                console.error('Error cargando datos:', error);
                toast.error('Error al cargar los tipos de evento');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            cargarDatos();
        }
    }, [slug]);

    const handleCreateTipo = () => {
        setEditingTipo(null);
        setIsFormOpen(true);
    };

    const handleEditTipo = (tipo: TipoEventoData) => {
        setEditingTipo(tipo);
        setIsFormOpen(true);
    };

    const handleFormSuccess = (nuevoTipo: TipoEventoData) => {
        if (editingTipo) {
            // Actualizar tipo existente
            setTiposEvento(prev =>
                prev.map(tipo => tipo.id === nuevoTipo.id ? nuevoTipo : tipo)
            );
            toast.success('Tipo de evento actualizado correctamente');
        } else {
            // Agregar nuevo tipo
            setTiposEvento(prev => [...prev, nuevoTipo]);
            toast.success('Tipo de evento creado correctamente');
        }
        setIsFormOpen(false);
        setEditingTipo(null);
    };

    const handleFormClose = () => {
        setIsFormOpen(false);
        setEditingTipo(null);
    };

    const handleTiposChange = (nuevosTipos: TipoEventoData[]) => {
        setTiposEvento(nuevosTipos);
    };

    if (loading) {
        return (
            <div className="p-6 space-y-6 max-w-screen-xl mx-auto mb-16">
                <HeaderNavigation
                    title="Tipos de Evento"
                    description="Gestiona las categorías de eventos para organizar tus paquetes"
                />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <ZenCard key={i} className="bg-zinc-900 border-zinc-800">
                            <ZenCardContent className="p-6">
                                <div className="animate-pulse">
                                    <div className="h-4 bg-zinc-700 rounded w-3/4 mb-2"></div>
                                    <div className="h-3 bg-zinc-700 rounded w-1/2 mb-4"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-6 w-6 bg-zinc-700 rounded"></div>
                                        <div className="h-4 bg-zinc-700 rounded w-1/4"></div>
                                    </div>
                                </div>
                            </ZenCardContent>
                        </ZenCard>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6 max-w-screen-xl mx-auto mb-16">
            <HeaderNavigation
                title="Tipos de Evento"
                description="Gestiona las categorías de eventos para organizar tus paquetes"
            />

            {/* Header con estadísticas */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <ZenBadge variant="secondary">
                            {tiposEvento.length} tipo{tiposEvento.length !== 1 ? 's' : ''}
                        </ZenBadge>
                        <ZenBadge variant="outline">
                            {tiposEvento.filter(t => t.status === 'active').length} activo{tiposEvento.filter(t => t.status === 'active').length !== 1 ? 's' : ''}
                        </ZenBadge>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <ZenButton
                        variant="outline"
                        className="flex items-center gap-2"
                        onClick={handleCreateTipo}
                    >
                        <Plus className="h-4 w-4" />
                        Crear Tipo de Evento
                    </ZenButton>
                </div>
            </div>

            {/* Lista de tipos de evento */}
            {tiposEvento.length === 0 ? (
                <ZenCard className="bg-zinc-900 border-zinc-800">
                    <ZenCardContent className="p-12 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="p-4 bg-zinc-800 rounded-full">
                                <Settings className="h-8 w-8 text-zinc-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-white mb-2">
                                    No hay tipos de evento configurados
                                </h3>
                                <p className="text-zinc-400 mb-6 max-w-md">
                                    Crea tipos de evento como &quot;Bodas&quot;, &quot;XV Años&quot;, &quot;Bautizos&quot; para organizar tus paquetes por categorías.
                                </p>
                                <ZenButton onClick={handleCreateTipo} className="flex items-center gap-2">
                                    <Plus className="h-4 w-4" />
                                    Crear Primer Tipo de Evento
                                </ZenButton>
                            </div>
                        </div>
                    </ZenCardContent>
                </ZenCard>
            ) : (
                <TiposEventoList
                    tiposEvento={tiposEvento}
                    onEdit={handleEditTipo}
                    onTiposChange={handleTiposChange}
                    studioSlug={slug}
                />
            )}

            {/* Modal de formulario */}
            {isFormOpen && (
                <TipoEventoForm
                    isOpen={isFormOpen}
                    onClose={handleFormClose}
                    onSuccess={handleFormSuccess}
                    studioSlug={slug}
                    tipoEvento={editingTipo}
                />
            )}
        </div>
    );
}
