'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, GripVertical, Percent, DollarSign, CreditCard, Cash } from 'lucide-react';
import { MetodoPagoData } from '../types';

interface MetodoPagoItemProps {
    metodo: MetodoPagoData;
    index: number;
    onEditar: (metodo: MetodoPagoData) => void;
    onEliminar: (metodoId: string) => void;
    onActualizarOrden: (nuevoOrden: { id: string; orden: number }[]) => void;
}

export function MetodoPagoItem({
    metodo,
    index,
    onEditar,
    onEliminar,
    onActualizarOrden
}: MetodoPagoItemProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragStart = (e: React.DragEvent) => {
        setIsDragging(true);
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
    };

    const handleDragEnd = () => {
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        // Aquí implementarías la lógica de reordenamiento
        // Por ahora solo manejamos el estado visual
    };

    // Obtener icono según el tipo de método
    const getMethodIcon = () => {
        switch (metodo.tipo) {
            case 'stripe_automatico':
                return <CreditCard className="h-5 w-5" />;
            case 'msi':
                return <CreditCard className="h-5 w-5" />;
            case 'manual':
            default:
                return <Cash className="h-5 w-5" />;
        }
    };

    // Obtener color del badge según el tipo
    const getTypeBadgeColor = () => {
        switch (metodo.tipo) {
            case 'stripe_automatico':
                return 'bg-blue-600';
            case 'msi':
                return 'bg-purple-600';
            case 'manual':
            default:
                return 'bg-green-600';
        }
    };

    // Obtener texto del tipo
    const getTypeText = () => {
        switch (metodo.tipo) {
            case 'stripe_automatico':
                return 'Stripe';
            case 'msi':
                return 'MSI';
            case 'manual':
            default:
                return 'Manual';
        }
    };

    return (
        <Card
            className={`transition-all duration-200 hover:shadow-lg ${isDragging ? 'opacity-50 scale-95' : ''
                } ${metodo.status === 'inactive' ? 'opacity-60' : ''}`}
            draggable
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
        >
            <CardContent className="p-4">
                <div className="flex items-center justify-between">
                    {/* Información Principal */}
                    <div className="flex items-center space-x-4 flex-1">
                        {/* Handle de arrastre */}
                        <div className="cursor-move text-zinc-400 hover:text-zinc-300">
                            <GripVertical className="h-5 w-5" />
                        </div>

                        {/* Icono del método */}
                        <div className="text-zinc-400">
                            {getMethodIcon()}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                    {metodo.metodo_pago}
                                </h3>
                                <Badge
                                    variant={metodo.status === 'active' ? 'default' : 'secondary'}
                                    className={metodo.status === 'active' ? 'bg-green-600' : 'bg-zinc-600'}
                                >
                                    {metodo.status === 'active' ? 'Activo' : 'Inactivo'}
                                </Badge>
                                <Badge
                                    variant="outline"
                                    className={getTypeBadgeColor()}
                                >
                                    {getTypeText()}
                                </Badge>
                            </div>

                            {/* Detalles de comisiones */}
                            <div className="flex items-center space-x-6 text-sm">
                                {metodo.comision_porcentaje_base && (
                                    <div className="flex items-center space-x-1 text-blue-400">
                                        <Percent className="h-4 w-4" />
                                        <span>
                                            {metodo.comision_porcentaje_base}% comisión
                                        </span>
                                    </div>
                                )}

                                {metodo.comision_fija_monto && (
                                    <div className="flex items-center space-x-1 text-green-400">
                                        <DollarSign className="h-4 w-4" />
                                        <span>
                                            ${metodo.comision_fija_monto} fijo
                                        </span>
                                    </div>
                                )}

                                {!metodo.comision_porcentaje_base && !metodo.comision_fija_monto && (
                                    <div className="flex items-center space-x-1 text-zinc-500">
                                        <span>Sin comisiones</span>
                                    </div>
                                )}

                                {metodo.requiere_stripe && (
                                    <div className="flex items-center space-x-1 text-orange-400">
                                        <CreditCard className="h-4 w-4" />
                                        <span>Requiere Stripe</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditar(metodo)}
                            className="text-zinc-400 hover:text-white"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEliminar(metodo.id)}
                            className="text-zinc-400 hover:text-red-400"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
