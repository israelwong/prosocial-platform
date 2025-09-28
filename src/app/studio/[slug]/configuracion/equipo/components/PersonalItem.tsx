'use client';

import { useState } from 'react';
import { Edit, Trash2, Mail, Phone, User, DollarSign } from 'lucide-react';
import {
    ZenButton,
    ZenCard,
    ZenCardContent,
    ZenBadge
} from '@/components/ui/zen';
import type { PersonalData } from '@/lib/actions/schemas/personal-schemas';

interface PersonalItemProps {
    personal: PersonalData;
    onEdit: (personal: PersonalData) => void;
    onDelete: (personalId: string) => void;
}

export function PersonalItem({
    personal,
    onEdit,
    onDelete
}: PersonalItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar a "${personal.nombre}"?`)) {
            setIsDeleting(true);
            try {
                await onDelete(personal.id);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const getTipoColor = (tipo: string) => {
        switch (tipo) {
            case 'OPERATIVO':
                return 'bg-blue-600/20 text-blue-400 border-blue-600/30';
            case 'ADMINISTRATIVO':
                return 'bg-yellow-600/20 text-yellow-400 border-yellow-600/30';
            case 'PROVEEDOR':
                return 'bg-purple-600/20 text-purple-400 border-purple-600/30';
            default:
                return 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30';
        }
    };

    const getTipoLabel = (tipo: string) => {
        switch (tipo) {
            case 'OPERATIVO':
                return 'Operativo';
            case 'ADMINISTRATIVO':
                return 'Administrativo';
            case 'PROVEEDOR':
                return 'Proveedor';
            default:
                return tipo;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'activo':
                return 'bg-green-600/20 text-green-400 border-green-600/30';
            case 'inactivo':
                return 'bg-red-600/20 text-red-400 border-red-600/30';
            default:
                return 'bg-zinc-600/20 text-zinc-400 border-zinc-600/30';
        }
    };

    return (
        <ZenCard className="hover:bg-zinc-800/50 transition-colors">
            <ZenCardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        {/* Avatar/Icono */}
                        <div className="flex-shrink-0">
                            {personal.platformUser?.avatarUrl ? (
                                <img
                                    src={personal.platformUser.avatarUrl}
                                    alt={personal.nombre}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                                    <User className="h-5 w-5 text-zinc-400" />
                                </div>
                            )}
                        </div>

                        {/* Información principal */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-white truncate">
                                    {personal.nombre}
                                </h4>
                                <ZenBadge
                                    variant="default"
                                    className={`text-xs ${getStatusColor(personal.status)}`}
                                >
                                    {personal.status}
                                </ZenBadge>
                            </div>

                            <div className="flex items-center gap-2 mb-2">
                                <ZenBadge
                                    variant="default"
                                    className={`text-xs ${getTipoColor(personal.tipo)}`}
                                >
                                    {getTipoLabel(personal.tipo)}
                                </ZenBadge>

                                <span className="text-sm text-zinc-400">
                                    {personal.categoria.nombre}
                                </span>
                            </div>

                            {/* Información de contacto */}
                            <div className="flex items-center gap-4 text-sm text-zinc-400">
                                {personal.email && (
                                    <div className="flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        <span className="truncate">{personal.email}</span>
                                    </div>
                                )}

                                {personal.telefono && (
                                    <div className="flex items-center gap-1">
                                        <Phone className="h-3 w-3" />
                                        <span>{personal.telefono}</span>
                                    </div>
                                )}
                            </div>

                            {/* Honorarios */}
                            {(personal.honorarios_fijos || personal.honorarios_variables) && (
                                <div className="flex items-center gap-4 mt-2 text-sm text-zinc-400">
                                    {personal.honorarios_fijos && (
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            <span>Fijo: ${personal.honorarios_fijos.toLocaleString()}</span>
                                        </div>
                                    )}

                                    {personal.honorarios_variables && (
                                        <div className="flex items-center gap-1">
                                            <DollarSign className="h-3 w-3" />
                                            <span>Variable: ${personal.honorarios_variables.toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Notas */}
                            {personal.notas && (
                                <p className="text-sm text-zinc-500 mt-2 line-clamp-2">
                                    {personal.notas}
                                </p>
                            )}

                            {/* Integración con autenticación */}
                            {personal.platformUser && (
                                <div className="mt-2">
                                    <ZenBadge variant="outline" className="text-xs">
                                        Usuario registrado: {personal.platformUser.fullName || personal.platformUser.email}
                                    </ZenBadge>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 ml-4">
                        <ZenButton
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(personal)}
                            className="h-8 w-8 p-0"
                        >
                            <Edit className="h-3 w-3" />
                        </ZenButton>

                        <ZenButton
                            variant="ghost"
                            size="sm"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                        >
                            <Trash2 className="h-3 w-3" />
                        </ZenButton>
                    </div>
                </div>
            </ZenCardContent>
        </ZenCard>
    );
}