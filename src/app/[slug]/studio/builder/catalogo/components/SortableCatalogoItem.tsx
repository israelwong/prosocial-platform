'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ZenButton, ZenBadge } from '@/components/ui/zen';
import { Edit, Trash2, GripVertical, Package, Wrench, DollarSign } from 'lucide-react';
import { CatalogoItem } from '../types';

interface SortableCatalogoItemProps {
    item: CatalogoItem;
    onEdit: (item: CatalogoItem) => void;
    onDelete: (itemId: string) => void;
}

export function SortableCatalogoItem({ item, onEdit, onDelete }: SortableCatalogoItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: item.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg border ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-zinc-700'
                }`}
        >
            <div
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing"
            >
                <GripVertical className="h-4 w-4 text-zinc-500" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2">
                    {item.type === 'PRODUCTO' ? (
                        <Package className="h-4 w-4 text-blue-400" />
                    ) : (
                        <Wrench className="h-4 w-4 text-green-400" />
                    )}
                    <span className="font-medium text-zinc-200 truncate">{item.name}</span>
                    <ZenBadge
                        variant={item.type === 'PRODUCTO' ? 'default' : 'secondary'}
                        className="text-xs"
                    >
                        {item.type}
                    </ZenBadge>
                    {!item.is_active && (
                        <ZenBadge variant="outline" className="text-xs text-zinc-500">
                            Inactivo
                        </ZenBadge>
                    )}
                </div>

                {item.description && (
                    <p className="text-sm text-zinc-400 mb-2 line-clamp-2">{item.description}</p>
                )}

                <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-yellow-400">
                        <DollarSign className="h-3 w-3" />
                        <span className="font-medium">{formatPrice(item.cost)}</span>
                    </div>
                    {item.image_url && (
                        <span className="text-zinc-500">📷 Con imagen</span>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-1">
                <ZenButton
                    onClick={() => onEdit(item)}
                    variant="outline"
                    size="sm"
                    className="p-2"
                >
                    <Edit className="h-3 w-3" />
                </ZenButton>
                <ZenButton
                    onClick={() => onDelete(item.id)}
                    variant="outline"
                    size="sm"
                    className="p-2 text-red-400 hover:text-red-300"
                >
                    <Trash2 className="h-3 w-3" />
                </ZenButton>
            </div>
        </div>
    );
}
