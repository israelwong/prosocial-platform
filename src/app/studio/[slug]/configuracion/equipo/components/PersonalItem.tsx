'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, User, Mail, Phone, Tag } from 'lucide-react';
import { ConfirmModal } from '@/app/studio/[slug]/components/ConfirmModal';
import type { Personal } from '../types';

interface PersonalItemProps {
    personal: Personal;
    onEdit: (personal: Personal) => void;
    onDelete: (id: string, name: string) => void;
    onToggleActive: (id: string, isActive: boolean) => void;
    loading?: boolean;
}

export function PersonalItem({ 
    personal, 
    onEdit, 
    onDelete, 
    onToggleActive, 
    loading = false 
}: PersonalItemProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            await onDelete(personal.id, personal.fullName || 'este miembro');
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

    const handleToggleActive = () => {
        onToggleActive(personal.id, !personal.isActive);
    };

    const getStatusColor = (isActive: boolean) => {
        return isActive ? 'text-green-400' : 'text-red-400';
    };

    const getStatusText = (isActive: boolean) => {
        return isActive ? 'Activo' : 'Inactivo';
    };

    return (
        <>
            <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700 hover:border-zinc-600 transition-colors">
                <div className="flex items-center justify-between">
                    {/* Información principal */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                            <User className="h-5 w-5 text-zinc-400 flex-shrink-0" />
                            <div className="min-w-0 flex-1">
                                <h3 className="text-white font-semibold truncate">
                                    {personal.fullName || 'Sin nombre'}
                                </h3>
                                <p className="text-sm text-zinc-400">
                                    {personal.type === 'EMPLEADO' ? 'Empleado' : 'Proveedor'}
                                </p>
                            </div>
                        </div>

                        {/* Contacto */}
                        <div className="space-y-1 mb-3">
                            <div className="flex items-center space-x-2 text-sm text-zinc-400">
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{personal.email}</span>
                            </div>
                            {personal.phone && (
                                <div className="flex items-center space-x-2 text-sm text-zinc-400">
                                    <Phone className="h-4 w-4 flex-shrink-0" />
                                    <span>{personal.phone}</span>
                                </div>
                            )}
                        </div>

                        {/* Perfiles profesionales */}
                        <div className="mb-3">
                            <div className="flex items-center space-x-2 mb-2">
                                <Tag className="h-4 w-4 text-zinc-400" />
                                <span className="text-sm text-zinc-400">Perfiles:</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                                {personal.professional_profiles && personal.professional_profiles.length > 0 ? (
                                    personal.professional_profiles.map((profile) => (
                                        <Badge
                                            key={profile.id}
                                            variant="outline"
                                            className="text-xs border-zinc-600 text-zinc-300"
                                        >
                                            {profile.profile?.name || 'Sin perfil'}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-xs text-zinc-500 italic">Sin perfiles asignados</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Controles */}
                    <div className="flex items-center space-x-3 ml-4">
                        {/* Switch de estado */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={personal.isActive}
                                onCheckedChange={handleToggleActive}
                                disabled={loading}
                                className="data-[state=checked]:bg-green-600"
                            />
                            <span className={`text-xs ${getStatusColor(personal.isActive)}`}>
                                {getStatusText(personal.isActive)}
                            </span>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(personal)}
                                disabled={loading}
                                className="h-8 w-8 p-0 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                                title="Editar"
                            >
                                <Edit className="h-3 w-3" />
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDeleteClick}
                                disabled={loading}
                                className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-900/20"
                                title="Eliminar"
                            >
                                <Trash2 className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación de eliminación */}
            <ConfirmModal
                isOpen={showDeleteModal}
                onClose={handleDeleteCancel}
                onConfirm={handleDeleteConfirm}
                title="Eliminar miembro del personal"
                description={`¿Estás seguro de que quieres eliminar a ${personal.fullName || 'este miembro'}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
                loading={deleting}
            />
        </>
    );
}
