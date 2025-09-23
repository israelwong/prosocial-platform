'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, GripVertical, Percent, Clock, AlertTriangle } from 'lucide-react';
import { CondicionComercialData } from '../types';

interface CondicionComercialItemProps {
    condicion: CondicionComercialData;
    index: number;
    onEditar: (condicion: CondicionComercialData) => void;
    onEliminar: (condicionId: string) => void;
    onActualizarOrden: (nuevoOrden: { id: string; orden: number }[]) => void;
}

export function CondicionComercialItem({
    condicion,
    index,
    onEditar,
    onEliminar,
    onActualizarOrden
}: CondicionComercialItemProps) {
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

    return (
        <Card
            className={`transition-all duration-200 hover:shadow-lg ${isDragging ? 'opacity-50 scale-95' : ''
                } ${condicion.status === 'inactive' ? 'opacity-60' : ''}`}
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

                        {/* Contenido */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                    {condicion.nombre}
                                </h3>
                                <Badge
                                    variant={condicion.status === 'active' ? 'default' : 'secondary'}
                                    className={condicion.status === 'active' ? 'bg-green-600' : 'bg-zinc-600'}
                                >
                                    {condicion.status === 'active' ? 'Activa' : 'Inactiva'}
                                </Badge>
                            </div>

                            {condicion.descripcion && (
                                <p className="text-zinc-400 text-sm mb-3">
                                    {condicion.descripcion}
                                </p>
                            )}

                            {/* Detalles de la condición */}
                            <div className="flex items-center space-x-6 text-sm">
                                {condicion.porcentaje_descuento && (
                                    <div className="flex items-center space-x-1 text-green-400">
                                        <Percent className="h-4 w-4" />
                                        <span>
                                            {condicion.porcentaje_descuento}% descuento
                                        </span>
                                    </div>
                                )}

                                {condicion.porcentaje_anticipo && (
                                    <div className="flex items-center space-x-1 text-blue-400">
                                        <Clock className="h-4 w-4" />
                                        <span>
                                            {condicion.porcentaje_anticipo}% anticipo
                                        </span>
                                    </div>
                                )}

                                {!condicion.porcentaje_descuento && !condicion.porcentaje_anticipo && (
                                    <div className="flex items-center space-x-1 text-zinc-500">
                                        <AlertTriangle className="h-4 w-4" />
                                        <span>Sin descuentos ni anticipos</span>
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
                            onClick={() => onEditar(condicion)}
                            className="text-zinc-400 hover:text-white"
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEliminar(condicion.id)}
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
