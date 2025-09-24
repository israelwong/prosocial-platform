'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Star, Building2, CreditCard, User } from 'lucide-react';
import { ConfirmModal } from '@/app/studio/[slug]/components/ConfirmModal';
import { CuentaBancaria } from '../types';

interface CuentaBancariaItemProps {
    cuenta: CuentaBancaria;
    onEdit: (cuenta: CuentaBancaria) => void;
    onDelete: (id: string) => void;
    onToggleActive: (id: string, activo: boolean) => void;
}

export function CuentaBancariaItem({ cuenta, onEdit, onDelete, onToggleActive }: CuentaBancariaItemProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        setDeleting(true);
        try {
            await onDelete(cuenta.id);
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
        onToggleActive(cuenta.id, !cuenta.activo);
    };

    const formatNumeroCuenta = (numero: string) => {
        // Mostrar solo los últimos 4 dígitos por seguridad para CLABE
        return `****${numero.slice(-4)}`;
    };

    return (
        <>
            <div className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                <div className="flex items-center space-x-4">
                    {/* Icono del banco */}
                    <div className="flex-shrink-0">
                        <Building2 className="h-8 w-8 text-blue-400" />
                    </div>

                    {/* Información de la cuenta */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-white text-sm font-medium truncate">
                                {cuenta.banco}
                            </h3>
                            {cuenta.esPrincipal && (
                                <Badge variant="outline" className="border-yellow-500 text-yellow-400 text-xs">
                                    <Star className="h-3 w-3 mr-1" />
                                    Principal
                                </Badge>
                            )}
                            <Badge 
                                variant="outline" 
                                className={`text-xs ${
                                    cuenta.activo 
                                        ? 'border-green-500 text-green-400' 
                                        : 'border-red-500 text-red-400'
                                }`}
                            >
                                {cuenta.activo ? 'Activa' : 'Inactiva'}
                            </Badge>
                        </div>
                        
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-zinc-400 text-xs">
                                <CreditCard className="h-3 w-3" />
                                <span>{formatNumeroCuenta(cuenta.numeroCuenta)}</span>
                            </div>
                            
                            <div className="flex items-center space-x-2 text-zinc-400 text-xs">
                                <User className="h-3 w-3" />
                                <span>{cuenta.titular}</span>
                            </div>
                        </div>
                    </div>

                    {/* Controles de acción */}
                    <div className="flex items-center space-x-3">
                        {/* Switch para activar/desactivar */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={cuenta.activo}
                                onCheckedChange={handleToggleActive}
                                className="data-[state=checked]:bg-green-600"
                            />
                            <span className="text-xs text-zinc-400">
                                {cuenta.activo ? 'Activa' : 'Inactiva'}
                            </span>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex items-center space-x-1">
                            {/* Botón de editar */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onEdit(cuenta)}
                                className="h-8 w-8 p-0 border-blue-600 text-blue-400 hover:bg-blue-900/20"
                                title="Editar cuenta bancaria"
                            >
                                <Edit className="h-3 w-3" />
                            </Button>

                            {/* Botón de eliminar */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleDeleteClick}
                                className="h-8 w-8 p-0 border-red-600 text-red-400 hover:bg-red-900/20"
                                title="Eliminar cuenta bancaria"
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
                title="Eliminar cuenta bancaria"
                description={`¿Estás seguro de que quieres eliminar la cuenta de ${cuenta.banco}? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="destructive"
                loading={deleting}
            />
        </>
    );
}
