'use client';

import React, { useState } from 'react';
import { ZenButton } from '@/components/ui/zen';
import { ZenBadge } from '@/components/ui/zen';
import { Trash2, Edit, Phone, CheckCircle, XCircle } from 'lucide-react';
import { ZenConfirmModal } from '@/components/ui/zen/overlays/ZenConfirmModal';
import { Telefono, TIPOS_TELEFONO } from '../types';
import { toast } from 'sonner';

interface ContactoItemZenProps {
    telefono: Telefono;
    onDelete: (id: string) => void;
    onEdit: (telefono: Telefono) => void;
    onToggleActive: (id: string, is_active: boolean) => void; // Actualizado: activo → is_active
}

export function ContactoItemZen({ telefono, onDelete, onEdit, onToggleActive }: ContactoItemZenProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const getTipoInfo = (tipo: string) => {
        return TIPOS_TELEFONO.find(t => t.value === tipo) || TIPOS_TELEFONO[0];
    };

    const handleToggleTelefono = async () => {
        try {
            await onToggleActive(telefono.id, !telefono.is_active); // Actualizado: activo → is_active
            toast.success(`Teléfono ${!telefono.is_active ? 'activado' : 'desactivado'} exitosamente`); // Actualizado: activo → is_active
        } catch {
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
        } catch {
            toast.error('Error al eliminar teléfono');
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    const tipoInfo = getTipoInfo(telefono.type); // Actualizado: tipo → type

    return (
        <>
            <div className={`p-4 bg-zinc-900/30 rounded-lg border transition-all duration-200 hover:bg-zinc-900/50 ${telefono.is_active // Actualizado: activo → is_active
                ? 'border-zinc-700 hover:border-zinc-600'
                : 'border-zinc-800 opacity-60 hover:opacity-80'
                }`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-3">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${telefono.is_active ? 'bg-green-900/20' : 'bg-zinc-800' // Actualizado: activo → is_active
                                }`}>
                                <Phone className={`h-5 w-5 ${telefono.is_active ? 'text-green-400' : 'text-zinc-500' // Actualizado: activo → is_active
                                    }`} />
                            </div>
                            <div>
                                <p className="text-white font-medium text-lg">{telefono.number}</p> {/* Actualizado: numero → number */}
                                <div className="flex items-center gap-2 mt-1">
                                    <ZenBadge
                                        variant="secondary"
                                        size="sm"
                                        className="text-xs"
                                    >
                                        {tipoInfo.label}
                                    </ZenBadge>
                                    <div className="flex items-center gap-1">
                                        {telefono.is_active ? ( // Actualizado: activo → is_active
                                            <CheckCircle className="h-3 w-3 text-green-400" />
                                        ) : (
                                            <XCircle className="h-3 w-3 text-red-400" />
                                        )}
                                        <span className={`text-xs ${telefono.is_active ? 'text-green-400' : 'text-red-400' // Actualizado: activo → is_active
                                            }`}>
                                            {telefono.is_active ? 'Activo' : 'Inactivo'} {/* Actualizado: activo → is_active */}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-2">
                        <ZenButton
                            variant="outline"
                            size="sm"
                            onClick={handleToggleTelefono}
                            className={`h-9 px-4 text-xs transition-colors ${telefono.is_active // Actualizado: activo → is_active
                                ? 'border-green-600 text-green-400 hover:bg-green-900/20 hover:border-green-500'
                                : 'border-zinc-600 text-zinc-400 hover:bg-zinc-700 hover:border-zinc-500'
                                }`}
                        >
                            {telefono.is_active ? 'Desactivar' : 'Activar'} {/* Actualizado: activo → is_active */}
                        </ZenButton>

                        <ZenButton
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(telefono)}
                            className="h-9 w-9 p-0 border-blue-600 text-blue-400 hover:bg-blue-900/20 hover:border-blue-500 transition-colors"
                            title="Editar teléfono"
                        >
                            <Edit className="h-4 w-4" />
                        </ZenButton>

                        <ZenButton
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteClick}
                            className="h-9 w-9 p-0 border-red-600 text-red-400 hover:bg-red-900/20 hover:border-red-500 transition-colors"
                            title="Eliminar teléfono"
                        >
                            <Trash2 className="h-4 w-4" />
                        </ZenButton>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            <ZenConfirmModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Eliminar teléfono"
                description={`¿Estás seguro de que quieres eliminar el teléfono ${telefono.number}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
                loading={deleting}
            />
        </>
    );
}
