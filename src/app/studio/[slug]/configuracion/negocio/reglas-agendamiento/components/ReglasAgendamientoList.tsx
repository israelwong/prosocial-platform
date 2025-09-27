'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    ZenCard,
    ZenButton
} from '@/components/ui/zen';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import { Plus, Calendar } from 'lucide-react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { toast } from 'sonner';
import {
    obtenerReglasAgendamiento,
    eliminarReglaAgendamiento
} from '@/lib/actions/studio/config/reglas-agendamiento.actions';
import { ReglaAgendamientoData } from '../types';
import { ReglaAgendamientoItem } from './ReglaAgendamientoItem';
import { ReglaAgendamientoForm } from './ReglaAgendamientoForm';

interface ReglasAgendamientoListProps {
    studioSlug: string;
}

export function ReglasAgendamientoList({ studioSlug }: ReglasAgendamientoListProps) {
    const [reglas, setReglas] = useState<ReglaAgendamientoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingRegla, setEditingRegla] = useState<ReglaAgendamientoData | null>(null);
    const [isUpdatingOrder] = useState(false);

    // Configurar sensores para drag & drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Cargar reglas de agendamiento
    const cargarReglas = useCallback(async () => {
        try {
            setLoading(true);
            const result = await obtenerReglasAgendamiento(studioSlug);

            if (result.success && result.data) {
                setReglas(result.data);
            } else {
                toast.error(result.error || 'Error al cargar reglas de agendamiento');
            }
        } catch (error) {
            console.error('Error al cargar reglas:', error);
            toast.error('Error al cargar reglas de agendamiento');
        } finally {
            setLoading(false);
        }
    }, [studioSlug]);

    useEffect(() => {
        cargarReglas();
    }, [cargarReglas]);

    // Manejar eliminación
    const handleEliminar = async (reglaId: string) => {
        try {
            const result = await eliminarReglaAgendamiento(studioSlug, reglaId);
            if (result.success) {
                toast.success('Regla de agendamiento eliminada exitosamente');
                cargarReglas();
            } else {
                toast.error(result.error || 'Error al eliminar regla');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            toast.error('Error al eliminar regla de agendamiento');
        }
    };

    // Manejar edición
    const handleEditar = (regla: ReglaAgendamientoData) => {
        setEditingRegla(regla);
        setShowForm(true);
    };

    // Manejar creación
    const handleCrear = () => {
        setEditingRegla(null);
        setShowForm(true);
    };

    // Manejar cierre del formulario
    const handleCerrarForm = () => {
        setShowForm(false);
        setEditingRegla(null);
    };

    // Manejar éxito del formulario
    const handleFormSuccess = (reglaActualizada: ReglaAgendamientoData) => {
        if (editingRegla) {
            // Actualizar regla existente
            setReglas(prev =>
                prev.map(regla =>
                    regla.id === reglaActualizada.id ? reglaActualizada : regla
                )
            );
        } else {
            // Agregar nueva regla
            setReglas(prev => [...prev, reglaActualizada]);
        }
    };

    // Manejar drag & drop
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id && !isUpdatingOrder) {
            const oldIndex = reglas.findIndex((item) => item.id === active.id);
            const newIndex = reglas.findIndex((item) => item.id === over?.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newReglas = arrayMove(reglas, oldIndex, newIndex);
                // TODO: Implementar actualización de orden
                setReglas(newReglas);
                toast.success('Orden actualizado exitosamente');
            }
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Header Navigation Skeleton */}
                <ZenCard variant="default" padding="lg">
                    <div className="animate-pulse">
                        <div className="h-8 bg-zinc-700 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                    </div>
                </ZenCard>

                {/* Lista de Reglas Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <ZenCard key={i} variant="default" padding="lg">
                            <div className="animate-pulse">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="h-6 bg-zinc-700 rounded w-1/4"></div>
                                    <div className="h-8 bg-zinc-700 rounded w-24"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-4 bg-zinc-700 rounded w-3/4"></div>
                                    <div className="h-4 bg-zinc-700 rounded w-1/2"></div>
                                    <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                                </div>
                            </div>
                        </ZenCard>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <HeaderNavigation
                title="Reglas de Agendamiento"
                description="Define las reglas y tipos de servicios que se pueden agendar en tu negocio"
                actionButton={{
                    label: 'Nueva Regla',
                    onClick: handleCrear,
                    icon: 'Plus'
                }}
            />

            {/* Lista de Reglas */}
            {reglas.length === 0 ? (
                <ZenCard variant="default" padding="lg">
                    <div className="text-center py-8">
                        <Calendar className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                        <h3 className="text-lg font-medium text-zinc-300 mb-2">
                            No hay reglas de agendamiento configuradas
                        </h3>
                        <p className="text-zinc-500 mb-4">
                            Define las reglas para los tipos de servicios que se pueden agendar
                        </p>
                        <ZenButton onClick={handleCrear} variant="primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Crear Primera Regla
                        </ZenButton>
                    </div>
                </ZenCard>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={reglas.map(regla => regla.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {reglas.map((regla) => (
                                <ReglaAgendamientoItem
                                    key={regla.id}
                                    regla={regla}
                                    onEditar={handleEditar}
                                    onEliminar={handleEliminar}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Formulario Modal */}
            {showForm && (
                <ReglaAgendamientoForm
                    studioSlug={studioSlug}
                    regla={editingRegla}
                    onClose={handleCerrarForm}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
}
