'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, GripVertical, Percent, Clock } from 'lucide-react';
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

    // Cargar condiciones comerciales
    const cargarCondiciones = async () => {
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
    };

    useEffect(() => {
        cargarCondiciones();
    }, [studioSlug]);

    // Escuchar evento del botón del header
    useEffect(() => {
        const handleOpenForm = () => {
            handleCrear();
        };

        window.addEventListener('openCondicionForm', handleOpenForm);
        return () => window.removeEventListener('openCondicionForm', handleOpenForm);
    }, []);

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

    // Manejar actualización de orden
    const handleActualizarOrden = async (nuevoOrden: { id: string; orden: number }[]) => {
        try {
            const result = await actualizarOrdenCondicionesComerciales(studioSlug, nuevoOrden);

            if (result.success) {
                toast.success('Orden actualizado exitosamente');
                cargarCondiciones();
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
                        <span className="ml-2 text-zinc-400">Cargando condiciones comerciales...</span>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">

            {/* Lista de Condiciones */}
            {condiciones.length === 0 ? (
                <Card>
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
                <div className="space-y-4">
                    {condiciones.map((condicion, index) => (
                        <CondicionComercialItem
                            key={condicion.id}
                            condicion={condicion}
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
