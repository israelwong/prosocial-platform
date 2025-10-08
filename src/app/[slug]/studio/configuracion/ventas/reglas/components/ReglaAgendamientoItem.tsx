'use client';

import React, { useState } from 'react';
import {
    ZenCard,
    ZenCardContent,
    ZenButton,
    ZenBadge
} from '@/components/ui/zen';
import { Edit, Trash2, GripVertical, Calendar, Clock, Users, MapPin, User, Repeat } from 'lucide-react';
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
} from '@/components/ui/shadcn/alert-dialog';
import { ReglaAgendamientoData } from '../types';

interface ReglaAgendamientoItemProps {
    regla: ReglaAgendamientoData;
    onEditar: (regla: ReglaAgendamientoData) => void;
    onEliminar: (reglaId: string) => void;
}

export function ReglaAgendamientoItem({
    regla,
    onEditar,
    onEliminar
}: ReglaAgendamientoItemProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: regla.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const handleDeleteClick = () => {
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = () => {
        onEliminar(regla.id);
        setShowDeleteDialog(false);
    };

    // Obtener icono según la recurrencia
    const getRecurrenciaIcon = () => {
        switch (regla.recurrencia) {
            case 'por_dia':
                return <Calendar className="h-5 w-5 text-blue-400" />;
            case 'por_hora':
                return <Clock className="h-5 w-5 text-green-400" />;
            default:
                return <Calendar className="h-5 w-5 text-zinc-400" />;
        }
    };

    // Obtener texto de la recurrencia
    const getRecurrenciaText = () => {
        switch (regla.recurrencia) {
            case 'por_dia':
                return 'Por Día';
            case 'por_hora':
                return 'Por Hora';
            default:
                return 'No definido';
        }
    };

    // Formatear duración en horas
    const formatDuracion = (minutos?: number) => {
        if (!minutos) return 'No definido';
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        if (mins === 0) return `${horas}h`;
        return `${horas}h ${mins}m`;
    };

    return (
        <>
            <ZenCard
                ref={setNodeRef}
                style={style}
                variant="default"
                padding="lg"
                className={`transition-all duration-200 hover:shadow-lg ${isDragging ? 'opacity-50 scale-95' : ''
                    } ${regla.status === 'inactive' ? 'opacity-60' : ''}`}
            >
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

                        {/* Icono de la recurrencia */}
                        <div className="text-zinc-400">
                            {getRecurrenciaIcon()}
                        </div>

                        {/* Contenido */}
                        <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-white">
                                    {regla.nombre}
                                </h3>
                                <ZenBadge
                                    variant={regla.status === 'active' ? 'success' : 'secondary'}
                                >
                                    {regla.status === 'active' ? 'Activa' : 'Inactiva'}
                                </ZenBadge>
                                <ZenBadge variant="default">
                                    {getRecurrenciaText()}
                                </ZenBadge>
                            </div>

                            {regla.descripcion && (
                                <p className="text-sm text-zinc-400 mb-3">
                                    {regla.descripcion}
                                </p>
                            )}

                            {/* Detalles de la regla */}
                            <div className="flex items-center space-x-6 text-sm">
                                {/* Capacidad Operativa */}
                                <div className="flex items-center space-x-1 text-green-400">
                                    <Users className="h-4 w-4" />
                                    <span>
                                        Capacidad: {regla.capacidadOperativa} eventos simultáneos
                                    </span>
                                </div>

                                {/* Recurrencia */}
                                <div className="flex items-center space-x-1 text-blue-400">
                                    {getRecurrenciaIcon()}
                                    <span>
                                        {getRecurrenciaText()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2">
                        <ZenButton
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditar(regla)}
                            className="text-zinc-400 hover:text-white"
                        >
                            <Edit className="h-4 w-4" />
                        </ZenButton>
                        <ZenButton
                            variant="ghost"
                            size="sm"
                            onClick={handleDeleteClick}
                            className="text-zinc-400 hover:text-red-400"
                        >
                            <Trash2 className="h-4 w-4" />
                        </ZenButton>
                    </div>
                </div>
            </ZenCard>

            {/* Modal de confirmación de eliminación */}
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar regla de agendamiento?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente la regla <strong>{regla.nombre}</strong>.
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
