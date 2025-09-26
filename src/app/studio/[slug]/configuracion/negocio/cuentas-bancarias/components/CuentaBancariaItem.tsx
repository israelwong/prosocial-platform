'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, GripVertical, Building2, User, Hash } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { CuentaBancariaData } from '../types';

interface CuentaBancariaItemProps {
    cuenta: CuentaBancariaData;
    onEditar: (cuenta: CuentaBancariaData) => void;
    onEliminar: (cuentaId: string) => void;
}

export function CuentaBancariaItem({
    cuenta,
    onEditar,
    onEliminar
}: CuentaBancariaItemProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: cuenta.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        onEliminar(cuenta.id);
        setShowDeleteDialog(false);
    };

    return (
        <>
            <Card
                ref={setNodeRef}
                style={style}
                className={`bg-zinc-900/50 border-zinc-800 transition-all duration-200 hover:shadow-lg ${isDragging ? 'opacity-50 scale-95' : ''
                    } ${!cuenta.activo ? 'opacity-60' : ''}`}
            >
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        {/* Información Principal */}
                        <div className="flex items-center space-x-4 flex-1">
                            {/* Handle de arrastre */}
                            <div
                                className="cursor-move text-zinc-400 hover:text-zinc-300"
                                {...attributes}
                                {...listeners}
                            >
                                <GripVertical className="h-5 w-5" />
                            </div>

                            {/* Contenido */}
                            <div className="flex-1">
                                <div className="flex items-center space-x-3 mb-2">
                                    <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
                                        <Building2 className="h-5 w-5 text-blue-400" />
                                        <span>{cuenta.banco}</span>
                                    </h3>

                                    {/* Badges */}
                                    <div className="flex items-center space-x-2">
                                        <Badge
                                            variant={cuenta.activo ? 'default' : 'secondary'}
                                            className={cuenta.activo ? 'bg-green-600' : 'bg-zinc-600'}
                                        >
                                            {cuenta.activo ? 'Activa' : 'Inactiva'}
                                        </Badge>
                                    </div>
                                </div>

                                {/* Detalles de la cuenta */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    {/* Número de Cuenta */}
                                    <div className="flex items-center space-x-2 text-zinc-300">
                                        <Hash className="h-4 w-4 text-green-400" />
                                        <span className="font-mono">{cuenta.numeroCuenta}</span>
                                    </div>

                                    {/* Titular */}
                                    <div className="flex items-center space-x-2 text-zinc-300">
                                        <User className="h-4 w-4 text-orange-400" />
                                        <span>{cuenta.titular}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Acciones */}
                        <div className="flex items-center space-x-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onEditar(cuenta)}
                                className="text-zinc-400 hover:text-white"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleDeleteClick}
                                className="text-zinc-400 hover:text-red-400"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Modal de confirmación de eliminación */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar cuenta bancaria?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la cuenta bancaria de <strong>{cuenta.banco}</strong> con CLABE <strong>{cuenta.numeroCuenta}</strong>.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleConfirmDelete}
                            className="bg-red-600 hover:bg-red-700"
                        >
                            Eliminar
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}