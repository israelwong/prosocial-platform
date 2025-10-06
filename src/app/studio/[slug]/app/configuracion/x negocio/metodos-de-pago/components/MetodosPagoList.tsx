'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
    ZenCard,
    ZenCardContent,
    ZenButton
} from '@/components/ui/zen';
import { HeaderNavigation } from '@/components/ui/shadcn/header-navigation';
import { Plus, CreditCard } from 'lucide-react';
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
    obtenerMetodosPago,
    eliminarMetodoPago,
    actualizarOrdenMetodosPago,
    actualizarMetodoPago
} from '@/lib/actions/studio/config/metodos-pago.actions';
import { MetodoPagoData } from '../types';
import { MetodoPagoToggle } from './MetodoPagoToggle';

interface MetodosPagoListProps {
    studioSlug: string;
}

export function MetodosPagoList({ studioSlug }: MetodosPagoListProps) {
    const [metodos, setMetodos] = useState<MetodoPagoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false); // 🔥 Flag para evitar toasts múltiples
    const [isToggling, setIsToggling] = useState(false); // Flag para evitar toggles múltiples

    // Configurar sensores para drag & drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Cargar métodos de pago
    const cargarMetodos = useCallback(async () => {
        try {
            setLoading(true);
            const result = await obtenerMetodosPago(studioSlug);

            if (result.success && result.data) {
                setMetodos(result.data);
            } else {
                toast.error('Error al cargar métodos de pago');
            }
        } catch (error) {
            console.error('Error al cargar métodos:', error);
            toast.error('Error al cargar métodos de pago');
        } finally {
            setLoading(false);
        }
    }, [studioSlug]);

    useEffect(() => {
        cargarMetodos();
    }, [studioSlug, cargarMetodos]);

    // 🔥 Función unificada para actualizar orden (evita duplicación)
    const actualizarOrden = async (
        nuevosMetodos: MetodoPagoData[],
        mostrarToast: boolean = true,
        operationType: 'drag' | 'button' = 'button'
    ) => {
        // Evitar múltiples actualizaciones simultáneas
        if (isUpdatingOrder) return;

        try {
            setIsUpdatingOrder(true);

            // Actualizar estado local inmediatamente para UX optimista
            setMetodos(nuevosMetodos);

            // Preparar orden para backend
            const nuevoOrden = nuevosMetodos.map((metodo, idx) => ({
                id: metodo.id,
                orden: idx
            }));

            // Actualizar en backend
            const result = await actualizarOrdenMetodosPago(studioSlug, nuevoOrden);

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
                cargarMetodos();
            }
        } catch (error) {
            console.error('Error al actualizar orden:', error);
            toast.error('Error al actualizar orden');
            // Revertir en caso de error
            cargarMetodos();
        } finally {
            setIsUpdatingOrder(false);
        }
    };

    // Manejar toggle de método de pago
    const handleToggle = async (metodoId: string, isActive: boolean) => {
        if (isToggling) return;

        try {
            setIsToggling(true);

            // Actualizar estado local inmediatamente
            setMetodos(prev =>
                prev.map(metodo =>
                    metodo.id === metodoId
                        ? { ...metodo, status: isActive ? 'active' : 'inactive' }
                        : metodo
                )
            );

            // Actualizar en backend
            const result = await actualizarMetodoPago(studioSlug, metodoId, {
                metodo_pago: metodos.find(m => m.id === metodoId)?.metodo_pago || '',
                comision_porcentaje_base: '',
                comision_fija_monto: '',
                payment_method: 'cash',
                status: isActive ? 'active' : 'inactive',
                orden: 0,
            });

            if (result.success) {
                toast.success(
                    isActive
                        ? 'Método de pago activado'
                        : 'Método de pago desactivado'
                );
            } else {
                // Revertir en caso de error
                setMetodos(prev =>
                    prev.map(metodo =>
                        metodo.id === metodoId
                            ? { ...metodo, status: isActive ? 'inactive' : 'active' }
                            : metodo
                    )
                );
                toast.error(result.error || 'Error al actualizar método');
            }
        } catch (error) {
            console.error('Error al actualizar método:', error);
            // Revertir en caso de error
            setMetodos(prev =>
                prev.map(metodo =>
                    metodo.id === metodoId
                        ? { ...metodo, status: isActive ? 'inactive' : 'active' }
                        : metodo
                )
            );
            toast.error('Error al actualizar método de pago');
        } finally {
            setIsToggling(false);
        }
    };

    // 🔥 Manejar movimiento hacia arriba (sin reload)
    const handleMoveUp = (index: number) => {
        if (index > 0 && !isUpdatingOrder) {
            const newMetodos = [...metodos];
            [newMetodos[index], newMetodos[index - 1]] = [newMetodos[index - 1], newMetodos[index]];

            actualizarOrden(newMetodos, true, 'button');
        }
    };

    // 🔥 Manejar movimiento hacia abajo (sin reload)
    const handleMoveDown = (index: number) => {
        if (index < metodos.length - 1 && !isUpdatingOrder) {
            const newMetodos = [...metodos];
            [newMetodos[index], newMetodos[index + 1]] = [newMetodos[index + 1], newMetodos[index]];

            actualizarOrden(newMetodos, true, 'button');
        }
    };

    // 🔥 Manejar drag & drop con @dnd-kit (optimizado)
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id && !isUpdatingOrder) {
            const oldIndex = metodos.findIndex((item) => item.id === active.id);
            const newIndex = metodos.findIndex((item) => item.id === over?.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newMetodos = arrayMove(metodos, oldIndex, newIndex);
                actualizarOrden(newMetodos, true, 'drag');
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

                {/* Lista de Métodos Skeleton */}
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
                title="Métodos de Pago"
                description="Activa o desactiva los métodos de pago disponibles para tu negocio. Los métodos predefinidos están listos para usar."
            />

            {/* Lista de Métodos */}
            {metodos.length === 0 ? (
                <ZenCard variant="default" padding="lg">
                    <div className="text-center py-8">
                        <CreditCard className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                        <h3 className="text-lg font-medium text-zinc-300 mb-2">
                            Cargando métodos de pago...
                        </h3>
                        <p className="text-zinc-500">
                            Los métodos predefinidos se están cargando
                        </p>
                    </div>
                </ZenCard>
            ) : (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext
                        items={metodos.map(metodo => metodo.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {metodos.map((metodo, index) => (
                                <MetodoPagoToggle
                                    key={metodo.id}
                                    metodo={metodo}
                                    onToggle={handleToggle}
                                    disabled={isToggling || isUpdatingOrder}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

        </div>
    );
}
