'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/shadcn/button';
import { Trash2, Edit } from 'lucide-react';
import { ConfirmModal } from '@/app/studio/[slug]/components/ConfirmModal';
import { Telefono, TIPOS_TELEFONO } from '../types';
import { toast } from 'sonner';

interface ContactoItemProps {
    telefono: Telefono;
    onDelete: (id: string) => void;
    onEdit: (telefono: Telefono) => void;
    onToggleActive: (id: string, activo: boolean) => void;
}

export function ContactoItem({ telefono, onDelete, onEdit, onToggleActive }: ContactoItemProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const getTipoInfo = (tipo: string) => {
        return TIPOS_TELEFONO.find(t => t.value === tipo) || TIPOS_TELEFONO[0];
    };

    const handleToggleTelefono = async () => {
        try {
            await onToggleActive(telefono.id, !telefono.activo);
            toast.success(`Teléfono ${!telefono.activo ? 'activado' : 'desactivado'} exitosamente`);
        } catch (error) {
            toast.error('Error al cambiar estado del teléfono');
        }
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            await onDelete(telefono.id);
            setShowDeleteModal(false);
            toast.success('Teléfono eliminado exitosamente');
        } catch (error) {
            toast.error('Error al eliminar teléfono');
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const tipoInfo = getTipoInfo(telefono.tipo);

    return (
        <>
            <div className={`p-3 bg-zinc-900/50 rounded-lg border transition-colors ${telefono.activo ? 'border-zinc-700' : 'border-zinc-800 opacity-60'}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${tipoInfo.color}`}></div>
                        <div>
                            <p className="text-white font-medium">{telefono.numero}</p>
                            <p className="text-zinc-400 text-sm">{tipoInfo.label}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleToggleTelefono}
                            className={`h-8 px-3 text-xs ${telefono.activo ? 'border-green-600 text-green-400 hover:bg-green-900/20' : 'border-zinc-600 text-zinc-400 hover:bg-zinc-700'}`}
                        >
                            {telefono.activo ? 'Activo' : 'Inactivo'}
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(telefono)}
                            className="h-8 w-8 p-0 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                            title="Editar teléfono"
                        >
                            <Edit className="h-3 w-3" />
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteClick}
                            className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-900/20"
                            title="Eliminar teléfono"
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Eliminar teléfono"
                description={`¿Estás seguro de que quieres eliminar el teléfono ${telefono.numero}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
                loading={deleting}
            />
        </>
    );
}
