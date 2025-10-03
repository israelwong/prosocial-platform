'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    ZenCard,
    ZenCardContent,
    ZenCardHeader,
    ZenCardTitle,
    ZenCardDescription,
    ZenButton
} from '@/components/ui/zen';

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
    initialCondiciones: CondicionComercialData[];
    onCondicionesChange: (condiciones: CondicionComercialData[]) => void;
}

export function CondicionesComercialesList({
    studioSlug,
    initialCondiciones,
    onCondicionesChange
}: CondicionesComercialesListProps) {
    const [condiciones, setCondiciones] = useState<CondicionComercialData[]>(initialCondiciones);
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

    // Sincronizar condiciones locales con las del padre
    useEffect(() => {
        setCondiciones(initialCondiciones);
    }, [initialCondiciones]);

    // Función para actualizar condiciones tanto local como en el padre
    const updateCondiciones = useCallback((newCondiciones: CondicionComercialData[]) => {
        setCondiciones(newCondiciones);
        onCondicionesChange(newCondiciones);
    }, [onCondicionesChange]);

    // Función para recargar datos desde el servidor
    const recargarCondiciones = useCallback(async () => {
        try {
            const result = await obtenerCondicionesComerciales(studioSlug);
            if (result.success && result.data) {
                updateCondiciones(result.data);
            }
        } catch (error) {
            console.error('Error recargando condiciones:', error);
        }
    }, [studioSlug, updateCondiciones]);

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
            updateCondiciones(nuevasCondiciones);

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
                recargarCondiciones();
            }
        } catch (error) {
            console.error('Error al actualizar orden:', error);
            toast.error('Error al actualizar orden');
            // Revertir en caso de error
            recargarCondiciones();
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
                recargarCondiciones();
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
            const nuevasCondiciones = condiciones.map(cond =>
                cond.id === condicionActualizada.id ? condicionActualizada : cond
            );
            updateCondiciones(nuevasCondiciones);
        } else {
            // Agregar nueva condición
            const nuevasCondiciones = [...condiciones, condicionActualizada];
            updateCondiciones(nuevasCondiciones);
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


    return (
        <div className="space-y-6">
            {/* Card principal con header y botón */}
            <ZenCard variant="default" padding="none">
                <ZenCardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <ZenCardTitle>Condiciones Comerciales</ZenCardTitle>
                            <ZenCardDescription>
                                Define los términos y condiciones comerciales para tu negocio
                            </ZenCardDescription>
                        </div>
                        <ZenButton
                            onClick={handleCrear}
                            variant="primary"
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Plus className="mr-2 h-4 w-4" />
                            Nueva Condición
                        </ZenButton>
                    </div>
                </ZenCardHeader>

                <ZenCardContent>
                    {/* Lista de Condiciones */}
                    {condiciones.length === 0 ? (
                        <div className="text-center py-8">
                            <Percent className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                            <h3 className="text-lg font-medium text-zinc-300 mb-2">
                                No hay condiciones comerciales configuradas
                            </h3>
                            <p className="text-zinc-500 mb-4">
                                Comienza creando tu primera condición comercial
                            </p>
                            <ZenButton onClick={handleCrear} variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Primera Condición
                            </ZenButton>
                        </div>
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
                                    {condiciones.map((condicion) => (
                                        <CondicionComercialItem
                                            key={condicion.id}
                                            condicion={condicion}
                                            onEditar={handleEditar}
                                            onEliminar={handleEliminar}
                                        />
                                    ))}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </ZenCardContent>
            </ZenCard>

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