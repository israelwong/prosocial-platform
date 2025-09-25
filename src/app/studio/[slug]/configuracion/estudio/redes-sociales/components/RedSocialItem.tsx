'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2 } from 'lucide-react';
import { RedSocialIcon } from '@/components/ui/icons/RedSocialIcon';
import { ConfirmModal } from '@/app/studio/[slug]/components/ConfirmModal';
import { Plataforma, RedSocial } from '../types';

interface RedSocialItemProps {
    red: RedSocial;
    plataformaInfo: Plataforma | null;
    onEditRed: (red: RedSocial) => void;
    onDeleteRed: (id: string) => void;
    onToggleActive: (id: string, activo: boolean) => void;
    validateUrl: (url: string) => boolean;
}

export function RedSocialItem({
    red,
    plataformaInfo,
    onEditRed,
    onDeleteRed,
    onToggleActive,
    validateUrl
}: RedSocialItemProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleToggleRed = async () => {
        await onToggleActive(red.id, !red.activo);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            await onDeleteRed(red.id);
            setShowDeleteModal(false);
        } catch (error) {
            // El error ya se maneja en la función padre
        } finally {
            setDeleting(false);
        }
    };

    const handleDeleteCancel = () => {
        setShowDeleteModal(false);
    };

    return (
        <>
            <div className={`p-3 bg-zinc-900/50 rounded-lg border transition-colors ${red.activo ? 'border-zinc-800' : 'border-zinc-800 opacity-60'}`}>
                <div className="flex items-center space-x-3">
                    {/* Ícono de la plataforma */}
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: plataformaInfo?.color || '#6B7280' }}
                    >
                        <RedSocialIcon
                            icono={plataformaInfo?.icon || 'default'}
                            className="h-4 w-4 text-white"
                        />
                    </div>

                    {/* URL */}
                    <div className="flex-1 min-w-0">
                        <p className="text-white text-sm truncate">
                            {red.url || 'Sin URL configurada'}
                        </p>
                        {red.url && !validateUrl(red.url) && (
                            <p className="text-xs text-red-400">
                                URL inválida
                            </p>
                        )}
                    </div>

                    {/* Botones de acción */}
                    <div className="flex items-center space-x-1">
                        {/* Botón de visitar */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(red.url, '_blank')}
                            disabled={!red.activo || !red.url || !validateUrl(red.url)}
                            className="h-8 px-2 border-zinc-600 text-zinc-300 hover:bg-zinc-700 text-xs"
                            title="Visitar enlace"
                        >
                            Visitar
                        </Button>

                        {/* Botón de editar */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditRed(red)}
                            className="h-8 w-8 p-0 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                            title="Editar red social"
                        >
                            <Edit className="h-3 w-3" />
                        </Button>

                        {/* Botón de eliminar */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteClick}
                            className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-900/20"
                            title="Eliminar red social"
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
                title="Eliminar red social"
                description={`¿Estás seguro de que quieres eliminar ${plataformaInfo?.name || 'esta red social'}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
                loading={deleting}
            />
        </>
    );
}
