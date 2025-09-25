'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HeaderNavigation } from '@/components/ui/header-navigation';
import { Plus, Percent } from 'lucide-react';
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
    obtenerCondicionesComerciales,
    eliminarCondicionComercial,
    actualizarOrdenCondicionesComerciales
} from '@/lib/actions/studio/config/condiciones-comerciales.actions';
import { CondicionComercialData } from '../types';
import { CondicionComercialForm } from './CondicionComercialForm';
import { CondicionComercialItem } from './CondicionComercialItem';

interface CondicionesComercialesListProps {
    studioSlug: string;
}

export function CondicionesComercialesList({ studioSlug }: CondicionesComercialesListProps) {
    const [condiciones, setCondiciones] = useState<CondicionComercialData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCondicion, setEditingCondicion] = useState<CondicionComercialData | null>(null);
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false); // 🔥 Flag para evitar toasts múltiples

    // Configurar sensores para drag & drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Cargar condiciones comerciales
    const cargarCondiciones = useCallback(async () => {
        try {
            setLoading(true);
            const result = await obtenerCondicionesComerciales(studioSlug);

            if (result.success && result.data) {
                setCondiciones(result.data);
            } else {
                toast.error('Error al cargar condiciones comerciales');
            }
        } catch (error) {
            console.error('Error al cargar condiciones:', error);
            toast.error('Error al cargar condiciones comerciales');
        } finally {
            setLoading(false);
        }
    }, [studioSlug]);

    useEffect(() => {
        cargarCondiciones();
    }, [studioSlug, cargarCondiciones]);

    // 🔥 Función unificada para actualizar orden (evita duplicación)
    const actualizarOrden = async (
        nuevasCondiciones: CondicionComercialData[],
        mostrarToast: boolean = true,
        operationType: 'drag' | 'button' = 'button'
    ) => {
        // Evitar múltiples actualizaciones simultáneas
        if (isUpdatingOrder) return;

        try {
            setIsUpdatingOrder(true);

            // Actualizar estado local inmediatamente para UX optimista
            setCondiciones(nuevasCondiciones);

            // Preparar orden para backend
            const nuevoOrden = nuevasCondiciones.map((cond, idx) => ({
                id: cond.id,
                orden: idx
            }));

            // Actualizar en backend
            const result = await actualizarOrdenCondicionesComerciales(studioSlug, nuevoOrden);

            if (result.success) {
                if (mostrarToast) {
                    toast.success(
                        operationType === 'drag'
                            ? 'Orden actualizado exitosamente'
                            : 'Posición actualizada'
                    );
                }
            } else {
                toast.error(result.error || 'Error al actualizar orden');
                // Revertir en caso de error
                cargarCondiciones();
            }
        } catch (error) {
            console.error('Error al actualizar orden:', error);
            toast.error('Error al actualizar orden');
            // Revertir en caso de error
            cargarCondiciones();
        } finally {
            setIsUpdatingOrder(false);
        }
    };

    // Manejar eliminación
    const handleEliminar = async (condicionId: string) => {
        try {
            const result = await eliminarCondicionComercial(studioSlug, condicionId);

            if (result.success) {
                toast.success('Condición comercial eliminada exitosamente');
                cargarCondiciones();
            } else {
                toast.error(result.error || 'Error al eliminar condición');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            toast.error('Error al eliminar condición comercial');
        }
    };

    // Manejar edición
    const handleEditar = (condicion: CondicionComercialData) => {
        setEditingCondicion(condicion);
        setShowForm(true);
    };

    // Manejar creación
    const handleCrear = () => {
        setEditingCondicion(null);
        setShowForm(true);
    };

    // Manejar cierre del formulario
    const handleCerrarForm = () => {
        setShowForm(false);
        setEditingCondicion(null);
    };

    // Manejar éxito del formulario (actualización local)
    const handleFormSuccess = (condicionActualizada: CondicionComercialData) => {
        if (editingCondicion) {
            // Actualizar condición existente
            setCondiciones(prev =>
                prev.map(cond =>
                    cond.id === condicionActualizada.id ? condicionActualizada : cond
                )
            );
        } else {
            // Agregar nueva condición
            setCondiciones(prev => [...prev, condicionActualizada]);
        }
    };

    // 🔥 Manejar movimiento hacia arriba (sin reload)
    const handleMoveUp = (index: number) => {
        if (index > 0 && !isUpdatingOrder) {
            const newCondiciones = [...condiciones];
            [newCondiciones[index], newCondiciones[index - 1]] = [newCondiciones[index - 1], newCondiciones[index]];

            actualizarOrden(newCondiciones, true, 'button');
        }
    };

    // 🔥 Manejar movimiento hacia abajo (sin reload)
    const handleMoveDown = (index: number) => {
        if (index < condiciones.length - 1 && !isUpdatingOrder) {
            const newCondiciones = [...condiciones];
            [newCondiciones[index], newCondiciones[index + 1]] = [newCondiciones[index + 1], newCondiciones[index]];

            actualizarOrden(newCondiciones, true, 'button');
        }
    };

    // 🔥 Manejar drag & drop con @dnd-kit (optimizado)
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id && !isUpdatingOrder) {
            const oldIndex = condiciones.findIndex((item) => item.id === active.id);
            const newIndex = condiciones.findIndex((item) => item.id === over?.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newCondiciones = arrayMove(condiciones, oldIndex, newIndex);
                actualizarOrden(newCondiciones, true, 'drag');
            }
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Header Navigation Skeleton */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
                    <div className="animate-pulse">
                        <div className="h-8 bg-zinc-700 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                    </div>
                </div>

                {/* Lista de Condiciones Skeleton */}
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-6">
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
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <HeaderNavigation
                title="Condiciones Comerciales"
                description="Define los términos y condiciones comerciales de tu negocio, incluyendo descuentos y anticipos"
                actionButton={{
                    label: 'Nueva Condición',
                    onClick: handleCrear,
                    icon: 'Plus'
                }}
            />

            {/* Lista de Condiciones */}
            {condiciones.length === 0 ? (
                <Card className="bg-zinc-900/50 border-zinc-800">
                    <CardContent className="p-6">
                        <div className="text-center py-8">
                            <Percent className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                            <h3 className="text-lg font-medium text-zinc-300 mb-2">
                                No hay condiciones comerciales configuradas
                            </h3>
                            <p className="text-zinc-500 mb-4">
                                Define los términos y condiciones comerciales para tu negocio
                            </p>
                            <Button onClick={handleCrear}>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Primera Condición
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={condiciones.map(cond => cond.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {condiciones.map((condicion, index) => (
                                <CondicionComercialItem
                                    key={condicion.id}
                                    condicion={condicion}
                                    index={index}
                                    onEditar={handleEditar}
                                    onEliminar={handleEliminar}
                                    onMoveUp={() => handleMoveUp(index)}
                                    onMoveDown={() => handleMoveDown(index)}
                                    disabled={isUpdatingOrder} // 🔥 Deshabilitar botones durante actualización
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {/* Formulario Modal */}
            {showForm && (
                <CondicionComercialForm
                    studioSlug={studioSlug}
                    condicion={editingCondicion}
                    onClose={handleCerrarForm}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
}