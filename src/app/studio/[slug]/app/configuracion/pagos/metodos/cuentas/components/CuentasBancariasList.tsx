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
    obtenerCuentasBancarias,
    eliminarCuentaBancaria,
    actualizarOrdenCuentasBancarias
} from '@/lib/actions/studio/config/cuentas-bancarias/cuentas-bancarias.actions';
import { CuentaBancariaData } from '../types';
import { CuentaBancariaForm } from './CuentaBancariaForm';
import { CuentaBancariaItem } from './CuentaBancariaItem';

interface CuentasBancariasListProps {
    studioSlug: string;
}

export function CuentasBancariasList({ studioSlug }: CuentasBancariasListProps) {
    const [cuentas, setCuentas] = useState<CuentaBancariaData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingCuenta, setEditingCuenta] = useState<CuentaBancariaData | null>(null);
    const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);

    // Configurar sensores para drag & drop
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    // Cargar cuentas bancarias
    const cargarCuentas = useCallback(async () => {
        try {
            setLoading(true);
            const result = await obtenerCuentasBancarias(studioSlug);

            if (result.success && result.data) {
                setCuentas(result.data);
            } else {
                toast.error('Error al cargar cuentas bancarias');
            }
        } catch (error) {
            console.error('Error al cargar cuentas:', error);
            toast.error('Error al cargar cuentas bancarias');
        } finally {
            setLoading(false);
        }
    }, [studioSlug]);

    useEffect(() => {
        cargarCuentas();
    }, [studioSlug, cargarCuentas]);

    // Función unificada para actualizar orden
    const actualizarOrden = async (
        nuevasCuentas: CuentaBancariaData[],
        mostrarToast: boolean = true,
        operationType: 'drag' | 'button' = 'button'
    ) => {
        if (isUpdatingOrder) return;

        try {
            setIsUpdatingOrder(true);
            setCuentas(nuevasCuentas);

            const nuevoOrden = nuevasCuentas.map((cuenta, idx) => ({
                id: cuenta.id,
                orden: idx
            }));

            const result = await actualizarOrdenCuentasBancarias(studioSlug, nuevoOrden);

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
                cargarCuentas();
            }
        } catch (error) {
            console.error('Error al actualizar orden:', error);
            toast.error('Error al actualizar orden');
            cargarCuentas();
        } finally {
            setIsUpdatingOrder(false);
        }
    };

    // Manejar eliminación
    const handleEliminar = async (cuentaId: string) => {
        try {
            // Actualización optimista: eliminar inmediatamente de la UI
            const cuentaOriginal = cuentas.find(c => c.id === cuentaId);
            setCuentas(prev => prev.filter(cuenta => cuenta.id !== cuentaId));

            const result = await eliminarCuentaBancaria(studioSlug, cuentaId);

            if (result.success) {
                toast.success('Cuenta bancaria eliminada exitosamente');
            } else {
                // Revertir cambio si falla
                if (cuentaOriginal) {
                    setCuentas(prev => [...prev, cuentaOriginal]);
                }
                toast.error(result.error || 'Error al eliminar cuenta');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            // Revertir cambio si falla
            cargarCuentas();
            toast.error('Error al eliminar cuenta bancaria');
        }
    };

    // Manejar edición
    const handleEditar = (cuenta: CuentaBancariaData) => {
        setEditingCuenta(cuenta);
        setShowForm(true);
    };

    // Manejar creación
    const handleCrear = () => {
        setEditingCuenta(null);
        setShowForm(true);
    };

    // Manejar cierre del formulario
    const handleCerrarForm = () => {
        setShowForm(false);
        setEditingCuenta(null);
    };

    // Manejar éxito del formulario
    const handleFormSuccess = (cuentaActualizada: CuentaBancariaData) => {
        if (editingCuenta) {
            setCuentas(prev =>
                prev.map(cuenta =>
                    cuenta.id === cuentaActualizada.id ? cuentaActualizada : cuenta
                )
            );
        } else {
            setCuentas(prev => [...prev, cuentaActualizada]);
        }
    };


    // Manejar drag & drop
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id && !isUpdatingOrder) {
            const oldIndex = cuentas.findIndex((item) => item.id === active.id);
            const newIndex = cuentas.findIndex((item) => item.id === over?.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                const newCuentas = arrayMove(cuentas, oldIndex, newIndex);
                actualizarOrden(newCuentas, true, 'drag');
            }
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <ZenCard variant="default" padding="lg">
                    <div className="animate-pulse">
                        <div className="h-8 bg-zinc-700 rounded w-1/3 mb-2"></div>
                        <div className="h-4 bg-zinc-700 rounded w-2/3"></div>
                    </div>
                </ZenCard>

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
                title="Cuentas Bancarias"
                description="Gestiona las cuentas bancarias de tu negocio para recibir pagos y transferencias"
                actionButton={{
                    label: 'Nueva Cuenta',
                    onClick: handleCrear,
                    icon: 'Plus'
                }}
            />

            {cuentas.length === 0 ? (
                <ZenCard variant="default" padding="lg">
                    <div className="text-center py-8">
                        <CreditCard className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                        <h3 className="text-lg font-medium text-zinc-300 mb-2">
                            No hay cuentas bancarias configuradas
                        </h3>
                        <p className="text-zinc-500 mb-4">
                            Agrega las cuentas bancarias donde recibirás los pagos de tus clientes
                        </p>
                        <ZenButton onClick={handleCrear} variant="primary">
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar Primera Cuenta
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
                        items={cuentas.map(cuenta => cuenta.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <div className="space-y-4">
                            {cuentas.map((cuenta) => (
                                <CuentaBancariaItem
                                    key={cuenta.id}
                                    cuenta={cuenta}
                                    onEditar={handleEditar}
                                    onEliminar={handleEliminar}
                                />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
            )}

            {showForm && (
                <CuentaBancariaForm
                    studioSlug={studioSlug}
                    cuenta={editingCuenta}
                    onClose={handleCerrarForm}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
}
