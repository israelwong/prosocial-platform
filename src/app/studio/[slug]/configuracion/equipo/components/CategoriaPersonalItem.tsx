'use client';

import { useState } from 'react';
import { Edit, Trash2, Users, GripVertical } from 'lucide-react';
import {
    ZenButton,
    ZenCard,
    ZenCardContent,
    ZenBadge
} from '@/components/ui/zen';
import type { CategoriaPersonalData } from '@/lib/actions/schemas/personal-schemas';

interface CategoriaPersonalItemProps {
    categoria: CategoriaPersonalData;
    onEdit: (categoria: CategoriaPersonalData) => void;
    onDelete: (categoriaId: string) => void;
}

export function CategoriaPersonalItem({
    categoria,
    onEdit,
    onDelete
}: CategoriaPersonalItemProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoria.nombre}"?`)) {
            setIsDeleting(true);
            try {
                await onDelete(categoria.id);
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

    return (
        <ZenCard className="hover:bg-zinc-800/50 transition-colors">
            <ZenCardContent className="p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        {/* Drag handle */}
                        <div className="cursor-grab text-zinc-500 hover:text-zinc-300">
                            <GripVertical className="h-4 w-4" />
                        </div>

                        {/* Información principal */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium text-white truncate">
                                    {categoria.nombre}
                                </h4>
                                {categoria.esDefault && (
                                    <ZenBadge variant="outline" className="text-xs">
                                        Sistema
                                    </ZenBadge>
                                )}
                            </div>

                            {categoria.descripcion && (
                                <p className="text-sm text-zinc-400 line-clamp-2">
                                    {categoria.descripcion}
                                </p>
                            )}

                            <div className="flex items-center gap-3 mt-2">
                                <ZenBadge
                                    variant="default"
                                    className={`text-xs ${getTipoColor(categoria.tipo)}`}
                                >
                                    {getTipoLabel(categoria.tipo)}
                                </ZenBadge>

                                <div className="flex items-center gap-1 text-xs text-zinc-500">
                                    <Users className="h-3 w-3" />
                                    <span>{categoria._count.personal} personal</span>
                                </div>

                                {categoria.color && (
                                    <div
                                        className="w-3 h-3 rounded-full border border-zinc-600"
                                        style={{ backgroundColor: categoria.color }}
                                        title={`Color: ${categoria.color}`}
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-1 ml-4">
                        <ZenButton
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(categoria)}
                            className="h-8 w-8 p-0"
                        >
                            <Edit className="h-3 w-3" />
                        </ZenButton>

                        {!categoria.esDefault && (
                            <ZenButton
                                variant="ghost"
                                size="sm"
                                onClick={handleDelete}
                                disabled={isDeleting || categoria._count.personal > 0}
                                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-red-900/20"
                                title={
                                    categoria._count.personal > 0
                                        ? 'No se puede eliminar: tiene personal asignado'
                                        : 'Eliminar categoría'
                                }
                            >
                                <Trash2 className="h-3 w-3" />
                            </ZenButton>
                        )}
                    </div>
                </div>
            </ZenCardContent>
        </ZenCard>
    );
}
