'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CreditCard, GripVertical, Percent, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import {
    obtenerMetodosPago,
    eliminarMetodoPago,
    actualizarOrdenMetodosPago
} from '@/lib/actions/studio/config/metodos-pago.actions';
import { MetodoPagoData } from '../types';
import { MetodoPagoForm } from './MetodoPagoForm';
import { MetodoPagoItem } from './MetodoPagoItem';

interface MetodosPagoListProps {
    studioSlug: string;
}

export function MetodosPagoList({ studioSlug }: MetodosPagoListProps) {
    const [metodos, setMetodos] = useState<MetodoPagoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingMetodo, setEditingMetodo] = useState<MetodoPagoData | null>(null);

    // Cargar métodos de pago
    const cargarMetodos = async () => {
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
    };

    useEffect(() => {
        cargarMetodos();
    }, [studioSlug]);

    // Escuchar evento del botón del header
    useEffect(() => {
        const handleOpenForm = () => {
            handleCrear();
        };

        window.addEventListener('openMetodoForm', handleOpenForm);
        return () => window.removeEventListener('openMetodoForm', handleOpenForm);
    }, []);

    // Manejar eliminación
    const handleEliminar = async (metodoId: string) => {
        try {
            const result = await eliminarMetodoPago(studioSlug, metodoId);

            if (result.success) {
                toast.success('Método de pago eliminado exitosamente');
                cargarMetodos();
            } else {
                toast.error(result.error || 'Error al eliminar método');
            }
        } catch (error) {
            console.error('Error al eliminar:', error);
            toast.error('Error al eliminar método de pago');
        }
    };

    // Manejar edición
    const handleEditar = (metodo: MetodoPagoData) => {
        setEditingMetodo(metodo);
        setShowForm(true);
    };

    // Manejar creación
    const handleCrear = () => {
        setEditingMetodo(null);
        setShowForm(true);
    };

    // Manejar cierre del formulario
    const handleCerrarForm = () => {
        setShowForm(false);
        setEditingMetodo(null);
    };

    // Manejar éxito del formulario (actualización local)
    const handleFormSuccess = (metodoActualizado: MetodoPagoData) => {
        if (editingMetodo) {
            // Actualizar método existente
            setMetodos(prev =>
                prev.map(metodo =>
                    metodo.id === metodoActualizado.id ? metodoActualizado : metodo
                )
            );
        } else {
            // Agregar nuevo método
            setMetodos(prev => [...prev, metodoActualizado]);
        }
    };

    // Manejar actualización de orden
    const handleActualizarOrden = async (nuevoOrden: { id: string; orden: number }[]) => {
        try {
            const result = await actualizarOrdenMetodosPago(studioSlug, nuevoOrden);

            if (result.success) {
                toast.success('Orden actualizado exitosamente');
                cargarMetodos();
            } else {
                toast.error(result.error || 'Error al actualizar orden');
            }
        } catch (error) {
            console.error('Error al actualizar orden:', error);
            toast.error('Error al actualizar orden');
        }
    };

    if (loading) {
        return (
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <span className="ml-2 text-zinc-400">Cargando métodos de pago...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">

            {/* Lista de Métodos */}
            {metodos.length === 0 ? (
                <Card>
                    <CardContent className="p-6">
                        <div className="text-center py-8">
                            <CreditCard className="mx-auto h-12 w-12 text-zinc-400 mb-4" />
                            <h3 className="text-lg font-medium text-zinc-300 mb-2">
                                No hay métodos de pago configurados
                            </h3>
                            <p className="text-zinc-500 mb-4">
                                Configura los métodos de pago disponibles para tu negocio
                            </p>
                            <Button onClick={handleCrear}>
                                <Plus className="mr-2 h-4 w-4" />
                                Crear Primer Método
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {metodos.map((metodo, index) => (
                        <MetodoPagoItem
                            key={metodo.id}
                            metodo={metodo}
                            index={index}
                            onEditar={handleEditar}
                            onEliminar={handleEliminar}
                            onActualizarOrden={handleActualizarOrden}
                        />
                    ))}
                </div>
            )}

            {/* Formulario Modal */}
            {showForm && (
                <MetodoPagoForm
                    studioSlug={studioSlug}
                    metodo={editingMetodo}
                    onClose={handleCerrarForm}
                    onSuccess={handleFormSuccess}
                />
            )}
        </div>
    );
}
